from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from typing import Optional
import pandas as pd
import numpy as np
import json
import io
import base64
import uuid
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import PolynomialFeatures
import matplotlib.pyplot as plt

from ...schemas.analysis import ManualDataInput
from ...services.ml.sklearn_fluent import req_details
from ...core.state import models_store

router = APIRouter()


@router.post("/analyze-data")
async def analyze_data(
    file: UploadFile = File(...),
    x_column: Optional[str] = Form(None),
    y_column: Optional[str] = Form(None),
    x_columns: Optional[str] = Form(None),
    y_columns: Optional[str] = Form(None),
    poly_degree: Optional[int] = Form(1),
):
    try:
        contents = await file.read()
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.StringIO(contents.decode('utf-8')), low_memory=False)
        elif file.filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(io.BytesIO(contents))
        elif file.filename.endswith('.json'):
            data = json.loads(contents.decode('utf-8'))
            df = pd.DataFrame(data)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")

        if x_columns:
            try:
                x_cols = json.loads(x_columns)
            except Exception:
                raise HTTPException(status_code=400, detail="x_columns must be a JSON array of column names")
        else:
            x_cols = [x_column] if x_column else []

        if y_columns:
            try:
                y_cols = json.loads(y_columns)
            except Exception:
                raise HTTPException(status_code=400, detail="y_columns must be a JSON array of column names")
        else:
            y_cols = [y_column] if y_column else []

        if not x_cols or not y_cols:
            raise HTTPException(status_code=400, detail="Please select at least one X column and one Y column")

        for col in x_cols + y_cols:
            if col not in df.columns:
                raise HTTPException(status_code=400, detail=f"Column '{col}' not found in data")

        work = df[x_cols + y_cols].copy()
        placeholders = ['-', '—', '–', 'N/A', 'NA', 'na', 'NaN', '', 'null', 'None']
        for col in work.columns:
            try:
                work[col] = work[col].replace(placeholders, np.nan)
                work[col] = pd.to_numeric(work[col], errors='coerce')
            except Exception:
                work[col] = pd.to_numeric(pd.Series(dtype=float), errors='coerce')

        kept_x = [c for c in x_cols if work[c].notna().sum() > 0]
        ignored_x = [c for c in x_cols if c not in kept_x]
        if not kept_x:
            raise HTTPException(status_code=400, detail="No valid numeric X columns after sanitization. Please select different columns.")

        for yc in y_cols:
            if work[yc].notna().sum() == 0:
                raise HTTPException(status_code=400, detail=f"Target column '{yc}' has no valid numeric values after sanitization.")

        before_rows = len(work)
        work = work.dropna(subset=kept_x + y_cols)
        dropped_rows = before_rows - len(work)
        if len(work) < 2:
            raise HTTPException(status_code=400, detail="Not enough valid rows after sanitization to fit a model.")

        X_base = work[kept_x].to_numpy()
        Y = work[y_cols].to_numpy()
        if Y.ndim == 1:
            Y = Y.reshape(-1)

        try:
            deg_val = int(poly_degree) if poly_degree is not None else 1
        except Exception:
            deg_val = 1
        if deg_val > 2:
            deg_val = 2
        use_poly = deg_val > 1
        if use_poly:
            poly = PolynomialFeatures(degree=deg_val, include_bias=False)
            X = poly.fit_transform(X_base)
            raw_feature_names = poly.get_feature_names_out(kept_x).tolist()
            feature_names = [fn.replace(' ', '*') for fn in raw_feature_names]
        else:
            X = X_base
            feature_names = kept_x

        single_feature_single_target = (X_base.shape[1] == 1 and len(y_cols) == 1 and not use_poly)

        if single_feature_single_target:
            x_data = X_base[:, 0].tolist()
            y_data = Y.tolist() if hasattr(Y, 'tolist') else list(Y)
            details = req_details(x_data, y_data)
            if 'error' in details:
                raise HTTPException(status_code=400, detail=details['error'])

            fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6), facecolor='#0a0a0a')
            ax1.scatter(x_data, y_data, alpha=0.8, color='#3b82f6', s=50, label='Data')
            sorted_pairs = sorted(zip(x_data, y_data), key=lambda p: p[0])
            if len(sorted_pairs) >= 2:
                ax1.plot([p[0] for p in sorted_pairs], [p[1] for p in sorted_pairs], color='#60a5fa', alpha=0.6, linewidth=1)
            coeffs = details['coefficients']
            intercept = details['intercept']
            xs = np.linspace(min(x_data), max(x_data), 200)
            if details['is_polynomial']:
                ys = np.full_like(xs, intercept, dtype=float)
                for i, c in enumerate(coeffs):
                    ys = ys + c * (xs ** (i + 1))
            else:
                ys = intercept + coeffs[0] * xs if len(coeffs) > 0 else np.full_like(xs, intercept, dtype=float)
            ax1.plot(xs, ys, color='#f59e0b', linewidth=2, label='Model')
            ax1.set_xlabel(kept_x[0], color='white')
            ax1.set_ylabel(y_cols[0], color='white')
            ax1.set_title('Data & Model Fit', color='white')
            ax1.grid(True, alpha=0.3)

            ax2.hist(y_data, bins=20, alpha=0.7, color='#10b981', edgecolor='white')
            ax2.set_xlabel(y_cols[0], color='white')
            ax2.set_ylabel('Frequency', color='white')
            ax2.set_title('Target Variable Distribution', color='white')
            ax2.grid(True, alpha=0.3)

            for ax in [ax1, ax2]:
                ax.set_facecolor('#1a1a1a')
                ax.tick_params(colors='white')
                for spine in ax.spines.values():
                    spine.set_color('white')

            plt.tight_layout()
            img_buffer = io.BytesIO()
            plt.savefig(img_buffer, format='png', facecolor='#0a0a0a', dpi=150, bbox_inches='tight')
            img_buffer.seek(0)
            img_base64 = base64.b64encode(img_buffer.read()).decode()
            plt.close()

            return {
                "success": True,
                "functions": [details['function'].replace('f(x): ', '')],
                "accuracies": [round(float(details['accuracy']) * 100, 2)],
                "visualization": img_base64,
                "data_points": len(x_data),
                "x_columns": kept_x,
                "y_columns": y_cols,
                "sanitization": {"ignored_x_columns": ignored_x, "dropped_rows": int(dropped_rows)},
                "model": {
                    "coefficients": [details['coefficients']],
                    "intercepts": [details['intercept']],
                    "is_polynomial": details['is_polynomial'],
                    "degree": details['degree'],
                    "feature_names": kept_x,
                    "target_names": y_cols,
                    "multi_output": False,
                }
            }
        else:
            if len(work) > 200 and use_poly:
                X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=42)
                lr = LinearRegression()
                lr.fit(X_train, Y_train)
                Y_pred = lr.predict(X_test)
                accuracies = []
                coef = lr.coef_
                if coef.ndim == 1:
                    coef = coef.reshape(1, -1)
                intercepts = lr.intercept_.tolist() if hasattr(lr.intercept_, 'tolist') else [float(lr.intercept_)]
                if len(y_cols) == 1:
                    accuracies = [float(lr.score(X_test, Y_test))]
                else:
                    for t in range(len(y_cols)):
                        y_true = Y_test[:, t]
                        y_hat = Y_pred[:, t]
                        ss_res = float(np.sum((y_true - y_hat) ** 2))
                        ss_tot = float(np.sum((y_true - np.mean(y_true)) ** 2))
                        r2 = 1.0 - ss_res / ss_tot if ss_tot > 0 else 0.0
                        accuracies.append(r2)
                lr.fit(X, Y)
                Y_pred = lr.predict(X)
            else:
                lr = LinearRegression()
                lr.fit(X, Y)
                Y_pred = lr.predict(X)

            accuracies = []
            coef = lr.coef_
            if coef.ndim == 1:
                coef = coef.reshape(1, -1)
            intercepts = lr.intercept_.tolist() if hasattr(lr.intercept_, 'tolist') else [float(lr.intercept_)]

            if len(y_cols) == 1:
                accuracies = [float(lr.score(X, Y))]
            else:
                for t in range(len(y_cols)):
                    y_true = Y[:, t]
                    y_hat = Y_pred[:, t]
                    ss_res = float(np.sum((y_true - y_hat) ** 2))
                    ss_tot = float(np.sum((y_true - np.mean(y_true)) ** 2))
                    r2 = 1.0 - ss_res / ss_tot if ss_tot > 0 else 0.0
                    accuracies.append(r2)

            functions = []
            for t in range(len(y_cols)):
                terms = []
                for i, fname in enumerate(feature_names):
                    c = round(float(coef[t][i]), 4)
                    sign = '+' if c >= 0 and i > 0 else ''
                    terms.append(f"{sign}{c}*{fname}")
                b = round(float(intercepts[t]), 4)
                b_str = f"+ {abs(b)}" if b >= 0 else f"- {abs(b)}"
                functions.append(f"{y_cols[t]}(x) = {' '.join(terms)} {b_str}")

            target_visualizations = []
            first_img_base64 = None
            for t in range(len(y_cols)):
                fig, (ax_feat, ax_pp) = plt.subplots(1, 2, figsize=(15, 6), facecolor='#0a0a0a')
                coef_t = coef[t] if len(y_cols) > 1 else coef.flatten()
                importance = np.abs(coef_t)
                colors = ['#3b82f6' if c >= 0 else '#ef4444' for c in coef_t]
                _ = ax_feat.barh(feature_names, importance, color=colors, alpha=0.8)
                ax_feat.set_xlabel('Coefficient Magnitude', color='white')
                ax_feat.set_title(f"Feature Importance ({y_cols[t]})", color='white')
                ax_feat.tick_params(colors='white')
                ax_feat.set_facecolor('#1a1a1a')
                for spine in ax_feat.spines.values():
                    spine.set_color('white')
                ax_feat.grid(True, alpha=0.3, axis='x')

                y_true_t = Y[:, t] if len(y_cols) > 1 else (Y if Y.ndim == 1 else Y[:, 0])
                y_hat_t = Y_pred[:, t] if len(y_cols) > 1 else (Y_pred if Y_pred.ndim == 1 else Y_pred[:, 0])
                ax_pp.scatter(y_true_t, y_hat_t, color='#3b82f6', alpha=0.7, s=30, edgecolors='white', linewidth=0.5)
                min_v = float(min(np.min(y_true_t), np.min(y_hat_t)))
                max_v = float(max(np.max(y_true_t), np.max(y_hat_t)))
                margin = (max_v - min_v) * 0.05
                ax_pp.plot([min_v - margin, max_v + margin], [min_v - margin, max_v + margin], color='#f59e0b', linewidth=2, linestyle='--')
                r2_val_t = (accuracies[t] if accuracies else 0.0)
                ax_pp.text(0.05, 0.95, f'R² = {r2_val_t:.3f}', transform=ax_pp.transAxes, bbox=dict(boxstyle='round', facecolor='#1a1a1a', alpha=0.8), color='white', fontsize=12)
                ax_pp.set_xlabel(f'Actual {y_cols[t]}', color='white')
                ax_pp.set_ylabel(f'Predicted {y_cols[t]}', color='white')
                ax_pp.set_title('Prediction Accuracy', color='white')
                ax_pp.grid(True, alpha=0.3)
                ax_pp.set_facecolor('#1a1a1a')
                for spine in ax_pp.spines.values():
                    spine.set_color('white')
                ax_pp.tick_params(colors='white')
                ax_pp.set_aspect('equal', adjustable='box')
                plt.tight_layout()

                img_buffer = io.BytesIO()
                plt.savefig(img_buffer, format='png', facecolor='#0a0a0a', dpi=150, bbox_inches='tight')
                img_buffer.seek(0)
                img_base64 = base64.b64encode(img_buffer.read()).decode()
                plt.close()
                if first_img_base64 is None:
                    first_img_base64 = img_base64
                target_visualizations.append({"target": y_cols[t], "image": img_base64})

            model_id = str(uuid.uuid4())
            models_store[model_id] = {
                "linear": lr,
                "poly": poly if use_poly else None,
                "feature_names": feature_names,
                "base_feature_names": kept_x,
                "use_poly": use_poly,
                "targets": y_cols,
            }

            return {
                "success": True,
                "functions": functions,
                "accuracies": [round(a * 100, 2) for a in accuracies],
                "visualization": first_img_base64,
                "target_visualizations": target_visualizations,
                "data_points": int(X.shape[0]),
                "x_columns": kept_x,
                "y_columns": y_cols,
                "sanitization": {"ignored_x_columns": ignored_x, "dropped_rows": int(dropped_rows)},
                "model": {
                    "coefficients": coef.tolist(),
                    "intercepts": intercepts,
                    "is_polynomial": use_poly,
                    "degree": int(poly_degree) if use_poly else 1,
                    "feature_names": feature_names,
                    "target_names": y_cols,
                    "multi_output": len(y_cols) > 1,
                    "model_id": model_id,
                }
            }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing data: {str(e)}")


@router.post("/analyze-manual")
async def analyze_manual(data: ManualDataInput):
    try:
        x_data = []
        y_data = []
        for point in data.data_points:
            x_data.append(point.x)
            y_data.append(point.y)
        if len(x_data) < 2:
            raise HTTPException(status_code=400, detail="At least 2 data points required")

        details = req_details(x_data, y_data)
        if 'error' in details:
            raise HTTPException(status_code=400, detail=details['error'])

        fig, ax = plt.subplots(1, 1, figsize=(10, 6), facecolor='#0a0a0a')
        if isinstance(x_data[0], list):
            x_plot = [x[0] for x in x_data]
            ax.scatter(x_plot, y_data, alpha=0.8, color='#3b82f6', s=50, label='Data')
            sorted_pairs = sorted(zip(x_plot, y_data), key=lambda p: p[0])
            if len(sorted_pairs) >= 2:
                ax.plot([p[0] for p in sorted_pairs], [p[1] for p in sorted_pairs], color='#60a5fa', alpha=0.6, linewidth=1)
            coeffs = details['coefficients']
            intercept = details['intercept']
            xs = np.linspace(min(x_plot), max(x_plot), 200)
            if details['is_polynomial']:
                ys = np.full_like(xs, intercept, dtype=float)
                for i, c in enumerate(coeffs):
                    ys = ys + c * (xs ** (i + 1))
            else:
                if len(coeffs) > 0:
                    ys = intercept + coeffs[0] * xs
                else:
                    ys = np.full_like(xs, intercept, dtype=float)
            ax.plot(xs, ys, color='#f59e0b', linewidth=2, label='Model')
            ax.set_xlabel('X (First Dimension)', color='white')
        else:
            ax.scatter(x_data, y_data, alpha=0.8, color='#3b82f6', s=50, label='Data')
            sorted_pairs = sorted(zip(x_data, y_data), key=lambda p: p[0])
            if len(sorted_pairs) >= 2:
                ax.plot([p[0] for p in sorted_pairs], [p[1] for p in sorted_pairs], color='#60a5fa', alpha=0.6, linewidth=1)
            coeffs = details['coefficients']
            intercept = details['intercept']
            xs = np.linspace(min(x_data), max(x_data), 200)
            if details['is_polynomial']:
                ys = np.full_like(xs, intercept, dtype=float)
                for i, c in enumerate(coeffs):
                    ys = ys + c * (xs ** (i + 1))
            else:
                if len(coeffs) > 0:
                    ys = intercept + coeffs[0] * xs
                else:
                    ys = np.full_like(xs, intercept, dtype=float)
            ax.plot(xs, ys, color='#f59e0b', linewidth=2, label='Model')
            ax.set_xlabel('X', color='white')

        ax.set_ylabel('Y', color='white')
        ax.set_title('Manual Data Analysis & Model Fit', color='white')
        ax.set_facecolor('#1a1a1a')
        ax.tick_params(colors='white')
        ax.grid(True, alpha=0.3)

        for spine in ax.spines.values():
            spine.set_color('white')

        plt.tight_layout()
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png', facecolor='#0a0a0a', dpi=150, bbox_inches='tight')
        img_buffer.seek(0)
        img_base64 = base64.b64encode(img_buffer.read()).decode()
        plt.close()

        equation = details['function'].replace('f(x): ', '')
        accuracy = f"{round(details['accuracy'] * 100, 2)}%"

        return {
            "success": True,
            "function": equation,
            "accuracy": accuracy,
            "visualization": img_base64,
            "data_points": len(x_data),
            "model": {
                "coefficients": details['coefficients'],
                "intercept": details['intercept'],
                "is_polynomial": details['is_polynomial'],
                "degree": details['degree'],
                "feature_names": details['feature_names'],
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing manual data: {str(e)}")
