import json
import tempfile
from datetime import datetime
from weasyprint import HTML, CSS
import os

def get_feature_importance(x_columns, coefficients):
    """Calculate and sort feature importance based on coefficient magnitudes."""
    if not x_columns or not coefficients:
        return [], []

    # Handle multi-target by analyzing the first target's coefficients
    first_target_coeffs = coefficients[0] if isinstance(coefficients[0], list) else coefficients
    
    importances = sorted(
        zip(x_columns, [abs(c) for c in first_target_coeffs]),
        key=lambda item: item[1],
        reverse=True
    )
    
    influential = [item[0] for item in importances[:5]]
    minimum_impact = [item[0] for item in reversed(importances[-3:])]
    
    return influential, minimum_impact

def generate_html_report(data: dict) -> str:
    """Generate an HTML report from analysis data."""
    
    filename = data.get("filename", "N/A")
    data_points = data.get("data_points", "N/A")
    x_columns = data.get("x_columns", [])
    y_columns = data.get("y_columns", [])
    functions = data.get("functions", [])
    accuracies = data.get("accuracies", [])
    coefficients = data.get("coefficients", [])

    influential_features, min_impact_features = get_feature_importance(x_columns, coefficients)

    # Break long feature lists for better display
    x_features_display = []
    current_line = ""
    for feature in x_columns:
        if len(current_line + feature + ", ") > 80:
            if current_line:
                x_features_display.append(current_line.rstrip(", "))
            current_line = feature + ", "
        else:
            current_line += feature + ", "
    if current_line:
        x_features_display.append(current_line.rstrip(", "))

    x_features_html = "<br>".join(x_features_display)
    y_features_html = ", ".join(y_columns)

    # Generate functions section
    functions_html = ""
    for i, func in enumerate(functions):
        target_name = func.split('(x) =')[0].strip()
        equation = func.split('=')[1].strip()
        accuracy = accuracies[i] if i < len(accuracies) else "N/A"
        
        # Break long equations
        equation_parts = equation.split(' ')
        formatted_equation = ""
        line_len = 0
        for part in equation_parts:
            if line_len + len(part) > 100:
                formatted_equation += "<br>&nbsp;&nbsp;&nbsp;&nbsp;"
                line_len = 0
            formatted_equation += part + " "
            line_len += len(part)

        functions_html += f"""
        <div class="function-block">
            <h4>Function for {target_name}</h4>
            <div class="equation">
                <code>{target_name}(x) = {formatted_equation}</code>
            </div>
            <p><strong>Accuracy (R-squared):</strong> {accuracy}%</p>
        </div>
        """

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Generated Functions Report</title>
        <style>
            body {{
                font-family: 'Times New Roman', serif;
                margin: 40px;
                line-height: 1.6;
                color: #333;
            }}
            .header {{
                text-align: center;
                margin-bottom: 40px;
            }}
            .title {{
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }}
            .subtitle {{
                font-size: 14px;
                color: #666;
            }}
            .section {{
                margin: 30px 0;
            }}
            .section h3 {{
                color: #2c3e50;
                border-bottom: 2px solid #3498db;
                padding-bottom: 5px;
            }}
            .info-grid {{
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin: 20px 0;
            }}
            .info-item {{
                background: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                border-left: 4px solid #3498db;
            }}
            .function-block {{
                background: #f1f3f4;
                padding: 20px;
                margin: 15px 0;
                border-radius: 8px;
                border: 1px solid #ddd;
            }}
            .equation {{
                background: white;
                padding: 15px;
                margin: 10px 0;
                border-radius: 4px;
                font-family: 'Courier New', monospace;
                word-wrap: break-word;
                overflow-wrap: break-word;
            }}
            .features {{
                background: #e8f4fd;
                padding: 15px;
                border-radius: 5px;
                margin: 10px 0;
            }}
            code {{
                font-family: 'Courier New', monospace;
                font-size: 12px;
                line-height: 1.4;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <div class="title">Generated Functions Report</div>
            <div class="subtitle">Fluent Analysis Engine - {datetime.now().strftime("%B %d, %Y")}</div>
        </div>

        <div class="section">
            <h3>Executive Summary</h3>
            <p>This report presents a concise overview of the dataset information and the generated mathematical functions with their corresponding accuracy, derived from the provided dataset.</p>
        </div>

        <div class="section">
            <h3>Dataset Information</h3>
            <div class="info-grid">
                <div class="info-item">
                    <strong>Source File:</strong><br><code>{filename}</code>
                </div>
                <div class="info-item">
                    <strong>Data Points Analyzed:</strong><br>{data_points}
                </div>
            </div>
            <div class="info-item">
                <strong>Input Features ({len(x_columns)}):</strong><br>
                <code>{x_features_html}</code>
            </div>
            <div class="info-item">
                <strong>Target Variables ({len(y_columns)}):</strong><br>
                <code>{y_features_html}</code>
            </div>
        </div>

        <div class="section">
            <h3>Generated Functions & Accuracy</h3>
            {functions_html}
        </div>

        <div class="section">
            <h3>Key Features</h3>
            <div class="features">
                <p><strong>Most Influential Features:</strong> <code>{", ".join(influential_features)}</code></p>
                <p><strong>Minimum Impact Features:</strong> <code>{", ".join(min_impact_features)}</code></p>
            </div>
        </div>
    </body>
    </html>
    """
    return html_content

def generate_pdf_from_html(data: dict) -> str:
    """Generate a PDF file from HTML using WeasyPrint."""
    html_content = generate_html_report(data)
    
    with tempfile.NamedTemporaryFile(mode='w', suffix='.html', delete=False, encoding='utf-8') as f:
        f.write(html_content)
        html_file = f.name
    
    pdf_file = html_file.replace('.html', '.pdf')
    
    try:
        HTML(filename=html_file).write_pdf(pdf_file)
        os.unlink(html_file)  # Clean up HTML file
        return pdf_file
    except Exception as e:
        print(f"WeasyPrint PDF generation failed: {e}")
        return html_file  # Return HTML as fallback
