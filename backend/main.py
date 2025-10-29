from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import os
from urllib.parse import urlparse
import re

import time
CACHE = {"data": [], "timestamp": 0}
CACHE_TTL = 600

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
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/lucifer")
def get_lucifer_home():
    try:
        headers = {"User-Agent": USER_AGENT}

        # Use cache if it's still valid
        if time.time() - CACHE["timestamp"] < CACHE_TTL:
            return {"count": len(CACHE["data"]), "data": CACHE["data"]}

        donghua_list = []
        page = 1

        # Loop through pages until no more anime are found
        while True:
            url = f"{LUCIFER_URL}/page/{page}/" if page > 1 else LUCIFER_URL
            res = requests.get(url, headers=headers)
            if res.status_code != 200:
                break

            soup = BeautifulSoup(res.text, "html.parser")
            latest_section = soup.select_one("div.listupd.normal div.excstf")

            if not latest_section:
                break

            items = latest_section.select("article.bs")
            if not items:
                break

            for item in items:
                link_tag = item.select_one("a.tip")
                if link_tag:
                    full_title = link_tag.get("title")
                    link = link_tag.get("href")

                    # Extract episode number
                    ep_match = re.search(r'Episode (\d+)', full_title, re.IGNORECASE)
                    episode = ep_match.group(1) if ep_match else None

                    # Clean title
                    title = re.sub(r'\s*Episode \d+.*', '', full_title, flags=re.IGNORECASE)

                    img_tag = link_tag.select_one("img")
                    image = (
                        img_tag.get("data-srcset")
                        or img_tag.get("data-src")
                        or img_tag.get("src")
                    )

                    donghua_list.append({
                        "title": title.strip(),
                        "episode": episode,
                        "link": link,
                        "image": image
                    })

            page += 1  # move to next page
            time.sleep(0.3)  # small delay to avoid being blocked

        # Cache results
        CACHE["data"] = donghua_list
        CACHE["timestamp"] = time.time()

        return {"count": len(donghua_list), "data": donghua_list}

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Request error: {str(e)}")
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Scraper error: {str(err)}")
