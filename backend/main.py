from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from api import Main

app = FastAPI()
main = Main()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root(page: Optional[int] = Query(1, description="Page number")):
    """
    Get home page
    params: page (optional) - int
    return: JSON
    """
    try:
        return main.get_home(page)
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))


@app.get("/search/{query}")
async def search(query: str):
    """
    Search donghua by query
    params: query - string (required)
    return: JSON
    """
    if not query:
        raise HTTPException(status_code=400, detail="missing query parameter")
    try:
        return main.search(query)
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))


@app.get("/info/{slug}")
async def get_info(slug: str):
    """
    Show detail of donghua
    params: slug name of donghua - string (required)
    return: JSON
    """
    try:
        return main.get_info(slug)
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))


@app.get("/genres")
async def list_genres():
    """
    Show list of genres
    return: JSON
    """
    try:
        return main.genres()
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))


@app.get("/genre/{slug}")
async def get_genre(slug: str, page: Optional[int] = Query(1, description="Page number")):
    """
    Show list of donghua by genre
    params: slug genre - string (required)
    query: page (optional) - int
    return: JSON
    """
    try:
        return main.genres(slug, page)
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))


@app.get("/episode/{slug}")
async def get_episode(slug: str):
    """
    Get detail of episode
    params: slug episode - string (required)
    return: JSON
    """
    try:
        data = main.get_episode(slug)
        if data:
            return data
        raise HTTPException(status_code=404, detail="not found")
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))


@app.get("/video-source/{slug}")
async def get_video(slug: str):
    """
    Show list of video source
    params: slug - string (required)
    return: JSON
    """
    try:
        data = main.get_video_source(slug)
        if data:
            return data
        raise HTTPException(status_code=404, detail="not found")
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))


@app.get("/anime")
async def anime(page: Optional[int] = Query(1, description="Page number")):
    """
    Show list of anime
    return: JSON
    """
    try:
        # Pass page directly as a keyword argument
        return main.anime(page=page)
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))

# Run with: uvicorn main:app --reload
