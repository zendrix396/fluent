# Fluent

Turn tabular data into equations with a simple web UI. Upload a file or enter rows, get the fitted function, visualization, and predictions.

## Requirements
- Python 3.8+
- Node.js 18+
- npm

## Run locally
1) Clone and enter the repo:
   ```bash
   git clone <repo>
   cd fluent
   ```
2) Windows: run the batch script (installs deps, starts backend & frontend):
   ```bash
   .\start-fluent.bat
   ```
3) Linux/macOS: make the script executable once, then run:
   ```bash
   chmod +x start-fluent.sh
   ./start-fluent.sh
   ```
4) Apps:
   - Backend: http://localhost:8000
   - Frontend: http://localhost:3000

Manual start (if you don’t want the scripts):
- Backend: `cd backend && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt && uvicorn main:app --reload --host 0.0.0.0 --port 8000`
- Frontend: `cd frontend && npm install && npm run dev`

## Usage
- Upload CSV/XLSX/JSON or enter rows manually.
- Pick X and Y columns, run analysis, view the equation and chart, download the report.