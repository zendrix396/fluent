#!/usr/bin/env python3
"""
Fluent Backend Startup Script
"""
import uvicorn
import sys
import os

# Ensure project root is on sys.path to import 'backend' package
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)
if PROJECT_ROOT not in sys.path:
    sys.path.append(PROJECT_ROOT)

if __name__ == "__main__":
    print("🚀 Starting Fluent Backend Server...")
    print("📊 API Documentation will be available at: http://localhost:8000/docs")
    print("🔧 Health check available at: http://localhost:8000/")
    print("⚡ Press CTRL+C to stop the server")
    print("-" * 60)
    
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
