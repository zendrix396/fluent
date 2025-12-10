from typing import Dict, Any

# In-memory store for generated PDF files (job_id -> file_path)
pdf_jobs: Dict[str, str] = {}

# In-memory store for trained models (model_id -> components)
models_store: Dict[str, Dict[str, Any]] = {}
