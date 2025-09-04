from fastapi import APIRouter, HTTPException, Form
from fastapi.responses import FileResponse
from typing import Optional
import json
import os
import uuid
from datetime import datetime

from backend.core.state import pdf_jobs
from backend.services.reporting.pdf_reportlab import generate_pdf_report

router = APIRouter()


@router.post("/generate-pdf")
async def generate_pdf(
    data_points: int = Form(...),
    x_columns: str = Form(...),
    y_columns: str = Form(...),
    functions: str = Form(...),
    accuracies: str = Form(...),
    coefficients: str = Form(...),
    filename: str = Form(...),
    start_only: Optional[bool] = Form(False),
):
    try:
        report_data = {
            "data_points": data_points,
            "x_columns": json.loads(x_columns),
            "y_columns": json.loads(y_columns),
            "functions": json.loads(functions),
            "accuracies": json.loads(accuracies),
            "coefficients": json.loads(coefficients),
            "filename": filename,
        }
        final_file = generate_pdf_report(report_data)
        media_type, extension = ('application/pdf', 'pdf')
        job_id = str(uuid.uuid4())
        pdf_jobs[job_id] = final_file
        return {"success": True, "job_id": job_id, "filename": f"fluent_analysis.{extension}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating report: {str(e)}")


@router.get("/download-report/{job_id}")
async def download_report(job_id: str):
    file_path = pdf_jobs.get(job_id)
    if not file_path or not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Report not found or expired")

    media_type = 'application/pdf' if file_path.endswith('.pdf') else 'application/x-tex'
    extension = 'pdf' if file_path.endswith('.pdf') else 'tex'

    return FileResponse(
        file_path,
        media_type=media_type,
        filename=f"fluent_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{extension}"
    )
