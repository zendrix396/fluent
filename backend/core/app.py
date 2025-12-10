from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

def create_app() -> FastAPI:
    app = FastAPI(title="Fluent API", description="Data Analysis and Function Generation API", version="1.0.0")

    # Allow all origins so the deployed frontend (Vercel) can reach the API
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "https://flluent.vercel.app"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return app
