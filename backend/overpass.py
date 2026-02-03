import httpx
import os

OVERPASS_URL = os.getenv("OVERPASS_URL", "https://overpass-api.de/api/interpreter")

OVERPASS_QUERY = """
[out:json][timeout:25];
area[name="{city}"]->.searchArea;
(
  node["amenity"="cafe"](area.searchArea);
  way["amenity"="cafe"](area.searchArea);
);
out center tags;
"""

async def fetch_cafes(city: str):
    query = OVERPASS_QUERY.format(city=city)

    async with httpx.AsyncClient(timeout=30) as client:
        res = await client.post(OVERPASS_URL, data=query)
        res.raise_for_status()
        return res.json()["elements"]

async def fetch_cafes_near(lat: float, lon: float, radius: int = 2000):
    query = f"""
    [out:json][timeout:25];
    (
      node["amenity"="cafe"](around:{radius},{lat},{lon});
      way["amenity"="cafe"](around:{radius},{lat},{lon});
    );
    out center tags;
    """
    async with httpx.AsyncClient(timeout=30) as client:
        res = await client.post(OVERPASS_URL, data=query)
        res.raise_for_status()
        return res.json()["elements"]
