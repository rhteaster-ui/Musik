from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ytmusicapi import YTMusic
import time

app = FastAPI(title="R_hmt Music API", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

yt = YTMusic()
CACHE_TTL = 1800
home_cache: dict[str, object] = {}


def format_results(items: list[dict]) -> list[dict]:
    output = []
    for item in items:
        if "videoId" not in item:
            continue
        artists = item.get("artists") or [{"name": "Unknown Artist"}]
        thumbnails = item.get("thumbnails") or []
        output.append(
            {
                "videoId": item["videoId"],
                "title": item.get("title", "Unknown Title"),
                "artist": artists[0].get("name", "Unknown Artist"),
                "thumbnail": thumbnails[-1]["url"] if thumbnails else "",
            }
        )
    return output


@app.get("/api/health")
def health():
    return {"status": "ok", "app": "R_hmt Music API"}


@app.get("/api/search")
def search(query: str):
    try:
        results = yt.search(query, filter="songs", limit=18)
        return {"status": "success", "data": format_results(results)}
    except Exception as err:  # noqa: BLE001
        return {"status": "error", "message": str(err)}


@app.get("/api/home")
def home():
    now = time.time()
    if "data" in home_cache and now - float(home_cache.get("timestamp", 0)) < CACHE_TTL:
        return {"status": "success", "data": home_cache["data"], "cached": True}

    try:
        data = {
            "recent": format_results(yt.search("lagu indonesia hits terbaru", filter="songs", limit=6)),
            "anyar": format_results(yt.search("rilis terbaru indonesia pop", filter="songs", limit=8)),
            "gembira": format_results(yt.search("lagu ceria semangat", filter="songs", limit=8)),
            "charts": format_results(yt.search("top indonesia chart", filter="songs", limit=8)),
            "galau": format_results(yt.search("lagu galau indonesia", filter="songs", limit=8)),
            "tiktok": format_results(yt.search("lagu viral tiktok 2026", filter="songs", limit=8)),
        }
        home_cache["timestamp"] = now
        home_cache["data"] = data
        return {"status": "success", "data": data, "cached": False}
    except Exception as err:  # noqa: BLE001
        return {"status": "error", "message": str(err)}
