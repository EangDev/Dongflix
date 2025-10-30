from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
from dotenv import load_dotenv
import os
import time

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
def get_animate(max_pages: int = 5):
    
    headers = {"User-Agent": USER_AGENT}
    all_results = []

    for page in range(1, max_pages + 1):
        url = f"https://kisskh.co/api/DramaList/List?page={page}&type=3&sub=0&country=1&status=0&order=1"
        res = requests.get(url, headers=headers)

        if res.status_code != 200:
            break

        try:
            data = res.json()
            results = data.get("data") or data.get("dramas") or data.get("list") or data
            if not results:
                break
            all_results.extend(results)
            time.sleep(0.3)  # prevent being rate-limited
        except ValueError:
            break

    return {"count": len(all_results), "results": all_results}
    
@app.get("/api/completed")
def get_completed_anim(max_pages: int = 20):
    
    headers = {"User-Agent": USER_AGENT}
    all_completed_results = []
    
    for page in range(1, max_pages + 1):
        url = f"https://kisskh.co/api/DramaList/List?page={page}&type=3&sub=0&country=1&status=2&order=1";
        res = requests.get(url, headers=headers)
        
        if res.status_code != 200:
            break
        
        try:
            data = res.json()
            completed_results = data.get("data") or data.get("dramas")
            if not completed_results:
                break
            all_completed_results.extend(completed_results)
            time.sleep(0.3)
        except ValueError:
            return {"Error": "Failed To parse API"}
        
    return {"count": len(all_completed_results), "results": all_completed_results}