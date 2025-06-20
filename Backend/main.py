from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from db.database import *
from db.models import *
from api.schemas import *
from api.routes import Router
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] for all origins (not recommended for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
   return {"Hello": "World"}

set_up()
app.include_router(Router, prefix="/api", tags=["api"])