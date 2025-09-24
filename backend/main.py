from backend.core.app import create_app
from backend.api import register_routers
from mangum import Mangum

app = create_app()

register_routers(app)

handler = Mangum(app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
