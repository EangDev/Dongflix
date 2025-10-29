from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
from dotenv import load_dotenv
import os

app = FastAPI()

load_dotenv()
USER_AGENT = os.getenv("USER_AGENT")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/animate")
def get_animate():
    url = "https://kisskh.co/api/DramaList/List?page=1&type=3&sub=0&country=1&status=0&order=1";
    headers = {"User-Agent": USER_AGENT}
    
    res = requests.get(url, headers=headers)
    
    try:
        data = res.json()
        return data
    except ValueError:
        return {"Error": "Failed To parse API"}