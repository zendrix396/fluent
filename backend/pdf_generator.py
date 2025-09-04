import json
import os
import subprocess
import tempfile
from datetime import datetime

def escape_latex(text: str) -> str:
    """Safely escape underscores and other special LaTeX characters in text."""
    if not isinstance(text, str):
        return str(text)
    return text.replace('_', '\\_').replace('%', '\\%').replace('$', '\\$').replace('&', '\\&')

def get_feature_importance(x_columns, coefficients, y_columns=None):
    """Calculate feature importance.

    Returns (overall_influential, overall_min_impact, per_target_breakdown)
    where per_target_breakdown is a list of dicts with keys 'target',
    'influential', and 'minimum_impact'.
    """
    if not x_columns or coefficients is None:
        return [], [], []

    # Normalize to 2D matrix [n_targets][n_features]
    coeff_matrix = coefficients
    if not isinstance(coeff_matrix[0], list):
        coeff_matrix = [coefficients]

    first_target_coeffs = coeff_matrix[0]

    importances = sorted(
        zip(x_columns, [abs(c) for c in first_target_coeffs]),
        key=lambda item: item[1],
        reverse=True
    )

    influential = [escape_latex(item[0]) for item in importances[:5]]
    minimum_impact = [escape_latex(item[0]) for item in reversed(importances[-3:])]

    per_target = []
    if y_columns and isinstance(y_columns, list):
        for idx, target in enumerate(y_columns):
            if idx >= len(coeff_matrix):
                break
            coeffs = coeff_matrix[idx]
            pairs = sorted(
                zip(x_columns, [abs(c) for c in coeffs]),
                key=lambda item: item[1],
                reverse=True
            )
            per_target.append({
                "target": escape_latex(str(target)),
                "influential": [escape_latex(p[0]) for p in pairs[:5]],
                "minimum_impact": [escape_latex(p[0]) for p in reversed(pairs[-3:])]
            })

    return influential, minimum_impact, per_target

def generate_analysis_pdf(data: dict) -> str:
    """Generates a LaTeX string from a template using the provided analysis data."""
    
    filename = escape_latex(data.get("filename", "N/A"))
    data_points = data.get("data_points", "N/A")
    x_columns = data.get("x_columns", [])
    y_columns = data.get("y_columns", [])
    functions = data.get("functions", [])
    accuracies = data.get("accuracies", [])
    coefficients = data.get("coefficients", [])

    influential_features, min_impact_features, per_target_features = get_feature_importance(
        x_columns, coefficients, y_columns
    )

    # Prepare sections of the LaTeX document with proper line wrapping
    # Break long feature lists into multiple lines
    x_features_str = escape_latex(", ".join(x_columns))
    if len(x_features_str) > 60:
        x_features_parts = []
        current_line = ""
        for feature in x_columns:
            escaped_feature = escape_latex(feature)
            if len(current_line + escaped_feature + ", ") > 60:
                if current_line:
                    x_features_parts.append(current_line.rstrip(", "))
                current_line = escaped_feature + ", "
            else:
                current_line += escaped_feature + ", "
        if current_line:
            x_features_parts.append(current_line.rstrip(", "))
        x_features_formatted = "\\\\".join([f"\\texttt{{{part}}}" for part in x_features_parts])
    else:
        x_features_formatted = f"\\texttt{{{x_features_str}}}"

    y_features_str = escape_latex(", ".join(y_columns))
    y_features_formatted = f"\\texttt{{{y_features_str}}}"

    dataset_info = f"""
\\subsection*{{Dataset Information}}
\\begin{{itemize}}
    \\item \\textbf{{Source File:}} \\texttt{{{filename}}}
    \\item \\textbf{{Data Points Analyzed:}} {data_points}
    \\item \\textbf{{Input Features ({len(x_columns)}):}} {x_features_formatted}
    \\item \\textbf{{Target Variables ({len(y_columns)}):}} {y_features_formatted}
\\end{{itemize}}
"""

    functions_section = "\\subsection*{Generated Functions \\& Accuracy}\n"
    for i, func in enumerate(functions):
        target_name_raw = func.split('(x) =')[0].strip()
        equation = func.split('=')[1].strip()
        accuracy = accuracies[i] if i < len(accuracies) else "N/A"
        
        # Escape for LaTeX
        target_name = escape_latex(target_name_raw)
        
        # Break long equations for better formatting
        equation_parts = equation.split(' ')
        formatted_equation = ""
        line_len = 0
        for part in equation_parts:
            part_escaped = escape_latex(part)
            if line_len + len(part_escaped) > 80: # Break line approx every 80 chars
                formatted_equation += "\\\\\n& \\qquad "
                line_len = 0
            formatted_equation += part_escaped + " "
            line_len += len(part_escaped)

        functions_section += f"""
\\subsubsection*{{Function for \\texttt{{{target_name}}}}}
\\begin{{align*}}
\\texttt{{{target_name}}}(x) &= {formatted_equation}
\\end{{align*}}
\\textbf{{Accuracy (R-squared):}} {accuracy}\\%

"""

    feature_section = f"""
\\subsection*{{Key Features}}
\\begin{{itemize}}
    \\item \\textbf{{Most Influential Features (overall):}} \\texttt{{{", ".join(influential_features)}}}
    \\item \\textbf{{Minimum Impact Features (overall):}} \\texttt{{{", ".join(min_impact_features)}}}
\\end{{itemize}}
"""
    if per_target_features:
        feature_section += "\n\\subsection*{Most Influential Features by Target}\n"
        for entry in per_target_features:
            feature_section += (
                f"\\paragraph{{{entry['target']}}} "
                f"\\textbf{{Top:}} \\texttt{{{', '.join(entry['influential'])}}}\\\\ "
                f"\\textbf{{Least:}} \\texttt{{{', '.join(entry['minimum_impact'])}}}\n"
            )

    # Assemble the final LaTeX document
    latex_content = f"""\\documentclass[a4paper, 11pt]{{article}}
\\usepackage{{amsmath}}
\\usepackage{{geometry}}
\\usepackage{{graphicx}}
\\usepackage{{times}}
\\usepackage{{breqn}}
\\usepackage{{array}}
\\geometry{{a4paper, margin=1in}}

\\title{{\\huge \\textbf{{Generated Functions Report}}}}
\\author{{Fluent Analysis Engine}}
\\date{{{datetime.now().strftime("%B %d, %Y")}}}

\\begin{{document}}
\\maketitle

\\section*{{Executive Summary}}
This report presents a concise overview of the dataset information and the generated mathematical functions with their corresponding accuracy, derived from the provided dataset.

{dataset_info}
{functions_section}
{feature_section}

\\end{{document}}
"""
    return latex_content