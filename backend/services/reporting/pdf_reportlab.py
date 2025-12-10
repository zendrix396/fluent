import tempfile
from datetime import datetime
from typing import List, Tuple, Dict, Any

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.enums import TA_LEFT
from reportlab.lib import colors


def _chunk_join(items: List[str], max_len: int = 90) -> List[str]:
    lines: List[str] = []
    current = ""
    for it in items:
        piece = f"{it}, "
        if len(current) + len(piece) > max_len:
            if current:
                lines.append(current.rstrip(", "))
            current = piece
        else:
            current += piece
    if current:
        lines.append(current.rstrip(", "))
    return lines


def _compute_feature_importance(x_columns: List[str], coefficients: Any) -> Tuple[List[str], List[str]]:
    if not x_columns or not coefficients:
        return [], []
    if isinstance(coefficients[0], list):
        coeffs = coefficients[0]
    else:
        coeffs = coefficients
    pairs = sorted(zip(x_columns, [abs(float(c)) for c in coeffs]), key=lambda p: p[1], reverse=True)
    influential = [p[0] for p in pairs[:5]]
    min_impact = [p[0] for p in pairs[-3:]]
    return influential, min_impact


def generate_pdf_report(data: Dict[str, Any]) -> str:
    """Generate a concise PDF using ReportLab and return the file path."""
    filename = data.get("filename", "uploaded_file")
    data_points = data.get("data_points", 0)
    x_columns: List[str] = data.get("x_columns", [])
    y_columns: List[str] = data.get("y_columns", [])
    functions: List[str] = data.get("functions", [])
    accuracies: List[Any] = data.get("accuracies", [])
    coefficients = data.get("coefficients", [])

    influential, min_impact = _compute_feature_importance(x_columns, coefficients)

    # Prepare document
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    pdf_path = tmp.name
    tmp.close()

    doc = SimpleDocTemplate(pdf_path, pagesize=A4, leftMargin=36, rightMargin=36, topMargin=36, bottomMargin=36)
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        name="TitleBig",
        parent=styles["Title"],
        fontSize=20,
        spaceAfter=12,
        textColor=colors.HexColor("#111111"),
    )
    h3 = ParagraphStyle(name="H3", parent=styles["Heading3"], spaceBefore=12, spaceAfter=6)
    mono = ParagraphStyle(name="Mono", parent=styles["BodyText"], fontName="Courier", fontSize=9, leading=12)
    normal = styles["BodyText"]

    content = []

    content.append(Paragraph("Generated Functions Report", title_style))
    content.append(Paragraph(f"Fluent Analysis Engine — {datetime.now().strftime('%B %d, %Y')}", styles["Italic"]))
    content.append(Spacer(1, 12))

    # Executive Summary
    content.append(Paragraph("Executive Summary", styles["Heading2"]))
    content.append(Paragraph(
        "This report presents a concise overview of the dataset information and the generated mathematical"
        " functions with their corresponding accuracy, derived from the provided dataset.", normal))
    content.append(Spacer(1, 8))

    # Dataset info
    content.append(Paragraph("Dataset Information", styles["Heading2"]))
    content.append(Paragraph(f"<b>Source File:</b> <font face='Courier'>{filename}</font>", normal))
    content.append(Paragraph(f"<b>Data Points Analyzed:</b> {data_points}", normal))

    x_lines = _chunk_join(x_columns, 90)
    content.append(Paragraph(f"<b>Input Features ({len(x_columns)}):</b>", normal))
    for line in x_lines:
        content.append(Paragraph(f"<font face='Courier'>{line}</font>", mono))
    content.append(Paragraph(f"<b>Target Variables ({len(y_columns)}):</b> <font face='Courier'>{', '.join(y_columns)}</font>", normal))

    # Functions
    content.append(Spacer(1, 8))
    content.append(Paragraph("Generated Functions & Accuracy", styles["Heading2"]))

    for i, func in enumerate(functions):
        try:
            target = func.split("(x)")[0].strip()
            equation = func.split("=", 1)[1].strip()
        except Exception:
            target = "Function"
            equation = func
        acc = accuracies[i] if i < len(accuracies) else "N/A"

        content.append(Paragraph(f"Function for <font face='Courier'>{target}</font>", h3))

        # Wrap equation across multiple lines at ~110 chars
        parts = equation.split(" ")
        line = ""
        lines = []
        for p in parts:
            if len(line) + len(p) + 1 > 110:
                lines.append(line.strip())
                line = p
            else:
                line = f"{line} {p}" if line else p
        if line:
            lines.append(line)
        for ln in lines:
            content.append(Paragraph(f"<font face='Courier'>{ln}</font>", mono))
        content.append(Paragraph(f"<b>Accuracy (R-squared):</b> {acc}%", normal))
        content.append(Spacer(1, 6))

    # Key features
    content.append(Paragraph("Key Features", styles["Heading2"]))
    content.append(Paragraph(f"<b>Most Influential Features:</b> <font face='Courier'>{', '.join(influential)}</font>", normal))
    content.append(Paragraph(f"<b>Minimum Impact Features:</b> <font face='Courier'>{', '.join(min_impact)}</font>", normal))

    doc.build(content)
    return pdf_path
