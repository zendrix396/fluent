from fastapi import FastAPI
from .routers.root import router as root_router
from .routers.files import router as files_router
from .routers.analysis import router as analysis_router
from .routers.predict import router as predict_router
from .routers.reports import router as reports_router


def register_routers(app: FastAPI) -> None:
    app.include_router(root_router)
    app.include_router(files_router)
    app.include_router(analysis_router)
    app.include_router(predict_router)
    app.include_router(reports_router)
