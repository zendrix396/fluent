from backend.core.config import plt, sns  # plotting side-effects
from backend.core.app import create_app
from backend.api import register_routers

app = create_app()
register_routers(app)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

