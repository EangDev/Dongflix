from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import os
from urllib.parse import urlparse
import re
import base64
import time

# ------------------- CACHES -------------------
CACHE = {"data": [], "timestamp": 0}
CACHE_TTL = 600

STREAM_CACHE = {}
STREAM_CACHE_TTL = 600

POPULAR_CACHE = {"data": [], "timestamp": 0}
POPULAR_TTL = 600

# ------------------- ENV VARIABLES -------------------
load_dotenv()
LUCIFER_URL = os.getenv("LUCIFER_URL")
USER_AGENT = os.getenv("USER_AGENT")

# Validate URL
if not LUCIFER_URL or not urlparse(LUCIFER_URL).scheme:
    raise ValueError(f"Invalid LUCIFER_URL in .env: {LUCIFER_URL}")

# Validate User-Agent
if not USER_AGENT:
    raise ValueError("USER_AGENT is missing in .env")

# ------------------- APP -------------------
app = FastAPI()

# ------------------- CORS -------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------- LATEST -------------------
@app.get("/lucifer")
def get_lucifer_home():
    try:
        headers = {"User-Agent": USER_AGENT}

        # Use cache if still valid
        if time.time() - CACHE["timestamp"] < CACHE_TTL:
            return {"count": len(CACHE["data"]), "data": CACHE["data"]}

        donghua_list = []
        page = 1

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
                if not link_tag:
                    continue

                full_title = link_tag.get("title", "").strip()
                link = link_tag.get("href", "").strip()

                # Extract episode number
                ep_match = re.search(r'Episode\s*(\d+)', full_title, re.IGNORECASE)
                episode = ep_match.group(1) if ep_match else None

                # Clean title (remove Episode numbers)
                title = re.sub(r'\s*Episode\s*\d+.*', '', full_title, flags=re.IGNORECASE).strip()

                # Get image
                img_tag = link_tag.select_one("img")
                image = (
                    img_tag.get("data-srcset")
                    or img_tag.get("data-src")
                    or img_tag.get("src")
                    or ""
                )

                # Append result
                donghua_list.append({
                    "title": title,
                    "episode": episode,
                    "link": link,
                    "image": image,
                })
                
            page += 1
            time.sleep(0.3)

        # Cache results
        CACHE["data"] = donghua_list
        CACHE["timestamp"] = time.time()

        return {"count": len(donghua_list), "data": donghua_list}

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Request error: {str(e)}")
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Scraper error: {str(err)}")

# ------------------- POPULAR -------------------
@app.get("/api/anime/popular")
def get_anime4i_popular():
    try:
        headers = {"User-Agent": USER_AGENT}

        # Use cache if still valid
        if time.time() - POPULAR_CACHE["timestamp"] < POPULAR_TTL:
            return {"count": len(POPULAR_CACHE["data"]), "results": POPULAR_CACHE["data"]}

        res = requests.get(LUCIFER_URL, headers=headers)
        if res.status_code != 200:
            raise HTTPException(status_code=404, detail="Failed to load Anime4i homepage")

        soup = BeautifulSoup(res.text, "html.parser")
        popular_section = soup.select_one("div.listupd.popularslider")
        if not popular_section:
            raise HTTPException(status_code=404, detail="Popular section not found")

        items = popular_section.select("article.bs")
        results = []

        for item in items:
            link_tag = item.select_one("a.tip")
            if not link_tag:
                continue

            title = link_tag.get("title", "").strip()
            link = link_tag.get("href", "#").strip()

            ep_match = re.search(r"Episode\s*(\d+)", title, re.IGNORECASE)
            episode = ep_match.group(1) if ep_match else None

            clean_title = re.sub(r"\s*Episode\s*\d+.*", "", title, flags=re.IGNORECASE).strip()

            img_tag = item.select_one("img")
            image = (
                img_tag.get("data-srcset")
                or img_tag.get("data-src")
                or img_tag.get("src")
                or ""
            )

            type_tag = item.select_one("div.typez")
            anime_type = type_tag.get_text(strip=True) if type_tag else "Unknown"

            results.append({
                "title": clean_title,
                "episode": episode,
                "type": anime_type,
                "link": link,
                "image": image
            })

        POPULAR_CACHE["data"] = results
        POPULAR_CACHE["timestamp"] = time.time()

        return {"count": len(results), "results": results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scraper error: {str(e)}")

# ------------------- STREAM -------------------
@app.get("/api/stream")
def get_stream(url: str):
    now = time.time()
    if url in STREAM_CACHE and now - STREAM_CACHE[url]["timestamp"] < STREAM_CACHE_TTL:
        return STREAM_CACHE[url]["data"]

    headers = {"User-Agent": USER_AGENT}
    try:
        res = requests.get(url, headers=headers)
        if res.status_code != 200:
            raise HTTPException(status_code=404, detail="Episode not found")

        soup = BeautifulSoup(res.text, "html.parser")

        servers = {}
        select = soup.select_one("select.mirror")
        if select:
            options = select.find_all("option")
            for opt in options:
                value = opt.get("value")
                server_name = opt.text.strip()
                if value:
                    try:
                        decoded = base64.b64decode(value).decode("utf-8")
                        iframe_soup = BeautifulSoup(decoded, "html.parser")
                        iframe = iframe_soup.find("iframe")
                        if iframe and iframe.get("src"):
                            servers[server_name] = iframe.get("src")
                    except Exception:
                        continue

        if not servers:
            iframe = soup.find("iframe")
            if iframe and iframe.get("src"):
                servers["default"] = iframe.get("src")

        if not servers:
            raise HTTPException(status_code=404, detail="No video servers found")

        result = {"servers": servers}
        STREAM_CACHE[url] = {"data": result, "timestamp": now}
        return result

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Request error: {str(e)}")

# ------------------- EPISODES -------------------
@app.get("/api/episodes")
def get_episodes(url: str):
    headers = {"User-Agent": USER_AGENT}
    res = requests.get(url, headers=headers)
    if res.status_code != 200:
        raise HTTPException(status_code=404, detail="Failed to load anime page")

    soup = BeautifulSoup(res.text, "html.parser")
    episode_items = soup.select("ul#episode_related li a, ul.episodelist li a")
    if not episode_items:
        episode_items = soup.select("div#episodes li a, div.episodelist a")

    episodes = []
    for ep in episode_items:
        ep_url = ep.get("href")
        text = ep.text.strip()
        ep_match = re.search(r'[Ee]pisode\s*(\d+)', text)
        if ep_match:
            ep_number = ep_match.group(1)
        else:
            numbers = re.findall(r'\d+', text)
            ep_number = numbers[-1] if numbers else text
        if ep_url:
            episodes.append({"number": ep_number, "url": ep_url})

    if not episodes:
        raise HTTPException(status_code=404, detail="No episodes found")

    episodes = sorted(episodes, key=lambda x: int(x["number"]) if x["number"].isdigit() else 9999)
    return {"count": len(episodes), "episodes": episodes}

# ------------------- DETAILS -------------------
@app.get("/api/details")
def get_details(url: str):
    headers = {"User-Agent": USER_AGENT}
    try:
        res = requests.get(url, headers=headers)
        if res.status_code != 200:
            raise HTTPException(status_code=404, detail="Failed to load anime page")

        soup = BeautifulSoup(res.text, "html.parser")
        
        # --- Get status (Completed/Ongoing) ---
        status = "Ongoing"
        status_tag = soup.select_one("div.status, span:contains('Status')")
        if status_tag:
            status_text = status_tag.get_text(strip=True)
            if any(x in status_text.lower() for x in ["complete", "finished"]):
                status = "Completed"
            elif any(x in status_text.lower() for x in ["ongoing", "airing"]):
                status = "Ongoing"
            else:
                status = status_text

        title_tag = soup.find("h1") or soup.find("h2") or soup.find("h3")
        raw_title = title_tag.get_text(strip=True) if title_tag else "Unknown Title"

        series = re.sub(r"(?:Season|S\d+|Ep\s*\d+|Episode\s*\d+|\[\w+\]|\(.*?\))",
                        "", raw_title, flags=re.IGNORECASE).strip()

        info_section = soup.select_one("div.info-content, div.infotable, div.spe, div.infodesc")
        details = {}
        if info_section:
            for item in info_section.find_all(["p", "span", "li"]):
                text = item.get_text(" ", strip=True)
                if ":" in text:
                    key, val = text.split(":", 1)
                    details[key.strip().capitalize()] = val.strip()

        alt_title = (details.get("Alternative title") or details.get("Other name") or
                     details.get("Synonyms") or details.get("Also known as") or
                     details.get("Chinese name") or "None")
        release = details.get("Release") or details.get("Released") or details.get("Aired") or "Unknown"
        studio = details.get("Studio") or "Unknown Studio"
        anime_type = details.get("Type") or "Unknown Type"
        episodes_count = details.get("Episodes") or "N/A"
        duration = details.get("Duration") or "Unknown Duration"

        genres = []
        genre_section = soup.select_one("div.genxed")
        if genre_section:
            genres = [a.get_text(strip=True) for a in genre_section.find_all("a", rel="tag")]
        else:
            genre_text = next((v for k, v in details.items() if "Genre" in k), "")
            if genre_text:
                genres = [g.strip() for g in re.split(r"[,/]", genre_text)]
        if not genres:
            genres = ["Unknown"]

        desc_tag = soup.find("div", class_=re.compile(r"desc|synopsis|summary", re.IGNORECASE))
        if desc_tag:
            description = " ".join(desc_tag.stripped_strings)
        else:
            meta_desc = soup.find("meta", {"name": "description"})
            description = meta_desc["content"] if meta_desc else "No description available."

        return {
            "title": raw_title,
            "series": series,
            "alternativeTitle": alt_title,
            "releaseDate": release,
            "studio": studio,
            "type": anime_type,
            "episodes": episodes_count,
            "duration": duration,
            "description": description,
            "genres": genres,
            "status": status
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract details: {str(e)}")

# ------------------- ALL -------------------
@app.get("/api/all")
def get_all():
    try:
        lucifer = requests.get("http://127.0.0.1:8000/lucifer").json().get("data", [])

        def normalize_lucifer(item):
            return {
                "title": item.get("title"),
                "link": item.get("link"),
                "image": item.get("image"),
                "episode": item.get("episode"),
                "source": "lucifer",
                "category": "latest",
                "status": item.get("status", "Ongoing")
            }

        all_items = [normalize_lucifer(i) for i in lucifer]
        return {"count": len(all_items), "results": all_items}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch combined data: {str(e)}")
