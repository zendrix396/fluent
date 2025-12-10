from fastapi import APIRouter, HTTPException
from typing import List
import numpy as np

from ...schemas.analysis import PredictionRequest
from ...core.state import models_store
from ...utils.features import expand_with_feature_names

router = APIRouter()


@router.post("/predict")
async def predict(request: PredictionRequest):
    try:
        if request.model_id and request.model_id in models_store:
            stored = models_store[request.model_id]
            lr = stored["linear"]
            poly = stored["poly"]
            base_features = stored["base_feature_names"]
            multi_output = (lr.coef_.ndim > 1)

            X_in: List[List[float]] = []
            for x_val in request.x_values:
                vals = x_val if isinstance(x_val, list) else [x_val]
                X_in.append([float(v) for v in vals])
            X_arr = np.array(X_in, dtype=float)
            if X_arr.shape[1] < len(base_features):
                pad = len(base_features) - X_arr.shape[1]
                X_arr = np.hstack([X_arr, np.zeros((X_arr.shape[0], pad))])
            if request.feature_names:
                req_base = [n for n in request.feature_names if ('^' not in n and '*' not in n)]
                if len(req_base) >= len(base_features):
                    col_idx = [req_base.index(bf) if bf in req_base else -1 for bf in base_features]
                    if all(i >= 0 for i in col_idx):
                        X_arr = X_arr[:, col_idx]
            if poly is not None:
                X_arr = poly.transform(X_arr)
            y_pred = lr.predict(X_arr)
            if not multi_output:
                y_pred = y_pred.reshape(-1).tolist()
            else:
                y_pred = y_pred.tolist()
            return {"success": True, "predictions": y_pred, "input_values": request.x_values}

        predictions = []
        if request.multi_output:
            for x_val in request.x_values:
                x_arr = x_val if isinstance(x_val, list) else [x_val]
                if isinstance(request.coefficients, list) and request.coefficients and isinstance(request.coefficients[0], list):
                    n_features = len(request.coefficients[0])
                    if request.feature_names and len(x_arr) < n_features:
                        x_arr = expand_with_feature_names(x_arr, request.feature_names)
                target_preds = []
                for t in range(len(request.coefficients)):
                    coefs_t = request.coefficients[t]
                    pred = float(request.intercept[t])
                    for i, c in enumerate(coefs_t):
                        if i < len(x_arr):
                            pred += float(c) * float(x_arr[i])
                    target_preds.append(pred)
                predictions.append(target_preds)
        else:
            for x_val in request.x_values:
                if isinstance(x_val, list):
                    x_arr = x_val
                    coeffs_1d = request.coefficients
                    if isinstance(coeffs_1d, list) and coeffs_1d and isinstance(coeffs_1d[0], list):
                        coeffs_1d = coeffs_1d[0]
                    n_features = len(coeffs_1d) if isinstance(coeffs_1d, list) else 0
                    if request.feature_names and len(x_arr) < n_features:
                        x_arr = expand_with_feature_names(x_arr, request.feature_names)
                    pred = float(request.intercept if not isinstance(request.intercept, list) else request.intercept[0])
                    for i, c in enumerate(coeffs_1d):
                        if i < len(x_arr):
                            pred += float(c) * float(x_arr[i])
                else:
                    if request.is_polynomial:
                        pred = float(request.intercept if not isinstance(request.intercept, list) else request.intercept[0])
                        coeffs_1d = request.coefficients
                        if isinstance(coeffs_1d, list) and coeffs_1d and isinstance(coeffs_1d[0], list):
                            coeffs_1d = coeffs_1d[0]
                        for i, c in enumerate(coeffs_1d):
                            pred += float(c) * (float(x_val) ** (i + 1))
                    else:
                        pred = float(request.intercept if not isinstance(request.intercept, list) else request.intercept[0])
                        coeffs_1d = request.coefficients
                        if isinstance(coeffs_1d, list) and coeffs_1d and isinstance(coeffs_1d[0], list):
                            coeffs_1d = coeffs_1d[0]
                        if isinstance(coeffs_1d, list) and len(coeffs_1d) > 0:
                            pred += float(coeffs_1d[0]) * float(x_val)
                predictions.append(pred)

        return {"success": True, "predictions": predictions, "input_values": request.x_values}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error making predictions: {str(e)}")
