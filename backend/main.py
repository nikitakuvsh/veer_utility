from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from .routers import items
from .database import Base, engine
import os

app = FastAPI()

# Миграции
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутера
app.include_router(items.router)

frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend"))
app.mount("/static", StaticFiles(directory=frontend_path), name="static")  # ✅ правильно

@app.get("/")
def serve_index():
    return FileResponse(os.path.join(frontend_path, "index.html"))

# Статические файлы
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# app.mount(
#     "/static",
#     StaticFiles(directory=os.path.join(BASE_DIR, "static")),
#     name="static"
# )

