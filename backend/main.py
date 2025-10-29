from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import os
from urllib.parse import urlparse

# Load environment variables
load_dotenv()
LUCIFER_URL = os.getenv("LUCIFER_URL")
USER_AGENT = os.getenv("USER_AGENT")

# Validate URL
if not LUCIFER_URL or not urlparse(LUCIFER_URL).scheme:
    raise ValueError(f"Invalid LUCIFER_URL in .env: {LUCIFER_URL}")

# Validate User-Agent
if not USER_AGENT:
    raise ValueError("USER_AGENT is missing in .env")

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =======================================
# 🔥 Scraper endpoint for luciferdonghua.in
# =======================================
@app.get("/lucifer")
def get_lucifer_home():
    try:
        headers = {"User-Agent": USER_AGENT}
        res = requests.get(LUCIFER_URL, headers=headers)
        res.raise_for_status()

        soup = BeautifulSoup(res.text, "html.parser")
        latest_section = soup.select_one("div.listupd.normal div.excstf")
        donghua_list = []
        
        if latest_section:
            for item in latest_section.select("article.bs"):
                link_tag = item.select_one("a.tip")
                if link_tag:
                    title = link_tag.get("title")
                    link = link_tag.get("href")
                    
                    img_tag = link_tag.select_one("img")
                    image = (
                        img_tag.get("data-srcset") or
                        img_tag.get("data-src") or 
                        img_tag.get("src")
                    )
                    
                    donghua_list.append({
                        "title": title,
                        "link": link,
                        "image": image
                    })

        return {"count": len(donghua_list), "data": donghua_list}

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Request error: {str(e)}")
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Scraper error: {str(err)}")

