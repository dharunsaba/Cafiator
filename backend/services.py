from models import Cafe
from sqlalchemy.orm import Session

# Keywords indicating a "small tea shop" or non-cafe
EXCLUDE_KEYWORDS = [
    "tea stall", "tea shop", "coolbar", "juice", "bakery", "mess", "canteen", 
    "bhavan", "tiffen", "hotel", "snack"
]

# Keywords indicating a premium/franchise cafe
FRANCHISE_KEYWORDS = [
    "starbucks", "cafe coffee day", "ccd", "barista", "costa coffee", 
    "the brew room", "writer's cafe", "krispy kreme", "dunkin", "gloria jeans",
    "chai kings", "tea villa", "star", "french", "english", "roastery"
]

def calculate_priority(name: str, tags: dict) -> int:
    name_lower = name.lower()
    score = 0
    
    # Franchise Boost
    if any(k in name_lower for k in FRANCHISE_KEYWORDS):
        score += 10
        
    # Ambiance Boost
    if tags.get("internet_access") == "yes":
        score += 2
    if tags.get("air_conditioning") == "yes":
        score += 2
    if tags.get("outdoor_seating") == "yes":
        score += 2
        
    return score

def save_cafes(elements, city, db: Session):
    for el in elements:
        tags = el.get("tags", {})
        name = tags.get("name", "Unnamed Cafe")
        lat = el.get("lat") or el.get("center", {}).get("lat")
        lon = el.get("lon") or el.get("center", {}).get("lon")

        if not lat or not lon:
            continue
            
        # 1. Filtering Logic: Remove "Tea Stalls" and Unnamed entries
        name = tags.get("name", "").strip()
        if not name or name == "Unnamed Cafe":
            continue
            
        name_lower = name.lower()
        if any(k in name_lower for k in EXCLUDE_KEYWORDS):
            # Skip unless it also looks like a proper cafe (e.g., has wifi)
            if tags.get("internet_access") != "yes":
                continue

        # 2. Extract Richer Details
        # Combine relevant tags into the "tags" string for the frontend
        display_tags = []
        if tags.get("internet_access") == "yes": display_tags.append("WiFi")
        if tags.get("outdoor_seating") == "yes": display_tags.append("Outdoor Seating")
        if tags.get("air_conditioning") == "yes": display_tags.append("AC")
        if "cuisine" in tags: display_tags.extend(tags["cuisine"].split(";"))
        
        # Add a "Franchise" tag if applicable
        priority_score = calculate_priority(name, tags)
        if priority_score >= 10:
            display_tags.append("Popular Brand")
            
        # 3. Save to DB
        cafe = Cafe(
            osm_id=f"{el['type']}_{el['id']}",
            name=name,
            city=city,
            lat=lat,
            lon=lon,
            opening_hours=tags.get("opening_hours"),
            # Store priority in rating temporarily or a new field? 
            # For now, let's just make sure we capture the data. 
            # Ideally we'd add a 'priority' column, but modifying DB schema is heavy.
            # We'll use the rating default to seed it lightly if 0? No, rating is for users.
            # We'll prepend "Franchise" to tags to sort easily?
            tags=",".join(list(set(display_tags))) 
        )
        
        # Hack: If it's a franchise, let's ensure it has a high INITIAL rating so it appears top? 
        # Or better, we sort in main.py. 
        # For now, let's just save.
        
        db.merge(cafe)

    db.commit()
