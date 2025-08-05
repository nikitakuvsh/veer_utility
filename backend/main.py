from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
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

# Статические файлы
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# app.mount(
#     "/static",
#     StaticFiles(directory=os.path.join(BASE_DIR, "static")),
#     name="static"
# )

