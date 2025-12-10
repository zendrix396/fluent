from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import numpy as np
import json
import io

router = APIRouter()


@router.post("/upload-file")
async def upload_file(file: UploadFile = File(...)):
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
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload CSV, XLSX, or JSON files.")

        df = df.dropna(how='all').dropna(axis=1, how='all')
        coerced = df.apply(pd.to_numeric, errors='coerce') if not df.empty else df
        numeric_columns = []
        if not df.empty:
            for col in df.columns:
                series = coerced[col] if col in coerced.columns else pd.Series(dtype=float)
                if getattr(series, 'notna', lambda: pd.Series(dtype=bool))().any():
                    try:
                        if pd.api.types.is_numeric_dtype(series.dropna()):
                            numeric_columns.append(col)
                    except Exception:
                        pass

        preview_df = df.replace([np.inf, -np.inf], np.nan)
        head_records = json.loads(preview_df.head(50).to_json(orient='records')) if not preview_df.empty else []

        info = {
            "filename": file.filename,
            "shape": (int(df.shape[0]), int(df.shape[1])) if hasattr(df, 'shape') else (0, 0),
            "columns": [str(c) for c in df.columns.tolist()] if not df.empty else [],
            "dtypes": {str(k): str(v) for k, v in (df.dtypes.astype(str).to_dict() if not df.empty else {}).items()},
            "head": head_records,
            "numeric_columns": numeric_columns,
        }
        return {"success": True, "data": info}
    except HTTPException:
        raise
    except Exception as e:
        return {
            "success": False,
            "data": {
                "filename": getattr(file, 'filename', 'unknown'),
                "shape": (0, 0),
                "columns": [],
                "dtypes": {},
                "head": [],
                "numeric_columns": []
            },
            "warning": f"File loaded with issues and was sanitized. Details: {str(e)}"
        }
