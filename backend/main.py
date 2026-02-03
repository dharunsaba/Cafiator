import math
from fastapi import FastAPI, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

# Import local modules
from models import Base, Cafe, SessionLocal, engine
from overpass import fetch_cafes, fetch_cafes_near
from services import save_cafes
from schemas import CafeResponse, ReviewCreate, ReviewResponse, CafeCreate

# Create tables
Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI(title="Cafiator API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Helper Functions ---
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) \
        * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return 2 * R * math.asin(math.sqrt(a))

# --- API Endpoints ---

@app.get("/cafes/nearby", response_model=List[CafeResponse])
async def nearby_cafes(lat: float, lon: float, radius: float = 5, db: Session = Depends(get_db)):
    # 1. First check DB
    cafes = db.query(Cafe).filter(Cafe.name != "Unnamed Cafe").all()
    
    # Filter and calculate distance
    results = []
    for c in cafes:
        if c.lat and c.lon:
            dist = haversine(lat, lon, c.lat, c.lon)
            if dist <= radius:
                # Add distance to object for sorting (if Pydantic allowed it, but we can sort before returning)
                # We can't easily add attributes to SQLAlchemy objects that aren't columns without schema change
                # So we'll keep pairs
                results.append((dist, c))
    
    # 2. If valid results are few (< 3), Fetch from Overpass dynamically
    if len(results) < 3:
        print(f"Few results ({len(results)}) found locally. Fetching from Overpass near {lat}, {lon}...")
        try:
            # Radius in meters for Overpass (5km = 5000m)
            elements = await fetch_cafes_near(lat, lon, radius=int(radius*1000))
            save_cafes(elements, "Detected Location", db)
            
            # Re-query DB (inefficient but safe for keeping ORM objects managed)
            cafes = db.query(Cafe).filter(Cafe.name != "Unnamed Cafe").all()
            results = []
            for c in cafes:
                if c.lat and c.lon:
                    dist = haversine(lat, lon, c.lat, c.lon)
                    if dist <= radius:
                        results.append((dist, c))
                        
        except Exception as e:
            print(f"Error fetching nearby from Overpass: {e}")

    # 3. Sort by distance (Nearest first)
    results.sort(key=lambda x: x[0])
    
    # Return just the Cafe objects
    return [r[1] for r in results]

@app.get("/cafes/filter")
def filter_cafes(tag: str, db: Session = Depends(get_db)):
    # Simple partial match on tags string
    return db.query(Cafe).filter(Cafe.tags.contains(tag)).all()

@app.get("/cafes", response_model=List[CafeResponse])
async def get_cafes(
    city: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # 1. Base Query - Only Verified
    query = db.query(Cafe).filter(Cafe.name != "Unnamed Cafe").filter(Cafe.is_verified == 1)

    # 2. City Filter & Overpass Fetch Logic
    if city and city != "All Cities":
        cafes_in_city = query.filter(Cafe.city == city).all()
        
        # If no cafes in DB for this city, fetch from Overpass
        if not cafes_in_city:
            print(f"Fetching cafes for {city} from Overpass...")
            try:
                elements = await fetch_cafes(city)
                save_cafes(elements, city, db)
                # Re-query after saving
                cafes_in_city = db.query(Cafe).filter(Cafe.city == city).all()
            except Exception as e:
                print(f"Error fetching from Overpass: {e}")
                
        query = db.query(Cafe).filter(Cafe.city == city) # Ensure we continue filtering on the query object

    # 3. Tag Filter
    if tag and tag != "All Vibez":
        # Note: This checks if the tag string contains the requested tag. 
        # For robust logic, better to parse tags or use array column (Postgres).
        query = query.filter(Cafe.tags.contains(tag))

    # 4. Search Filter
    if search:
        search_lower = search.lower()
        query = query.filter(
            (Cafe.name.ilike(f"%{search_lower}%")) | 
            (Cafe.location.ilike(f"%{search_lower}%"))
        )
        
    results = query.all()
    
    # 5. Sorting: Prioritize "Popular Brand"
    # Python sort is stable; True (1) > False (0), so reverse=True puts franchises first
    results.sort(key=lambda c: "Popular Brand" in (c.tags or ""), reverse=True)

    return results

# --- Submission & Admin Endpoints ---

@app.post("/cafes", response_model=CafeResponse)
def submit_cafe(cafe: CafeCreate, db: Session = Depends(get_db)):
    # 0. Lat/Lon Logic: If 0, maybe Geocode? For now simpler MVP: just accept 0 or user provided
    new_cafe = Cafe(
        osm_id=f"manual_{cafe.name}", # Temporary ID
        name=cafe.name,
        city=cafe.city,
        lat=cafe.lat or 11.0, # Default to somewhere in TN if missing
        lon=cafe.lon or 77.0,
        tags=cafe.tags,
        description=cafe.description,
        image_url=cafe.image,
        phone=cafe.phone,
        email=cafe.email,
        website=cafe.website,
        is_verified=0 # Pending Approval
    )
    db.add(new_cafe)
    db.commit()
    db.refresh(new_cafe)
    return new_cafe

@app.get("/admin/pending", response_model=List[CafeResponse])
def get_pending_cafes(db: Session = Depends(get_db)):
    return db.query(Cafe).filter(Cafe.is_verified == 0).all()

@app.post("/admin/approve/{cafe_id}")
def approve_cafe(cafe_id: int, db: Session = Depends(get_db)):
    cafe = db.query(Cafe).filter(Cafe.id == cafe_id).first()
    if not cafe:
        raise HTTPException(status_code=404, detail="Cafe not found")
    cafe.is_verified = 1
    db.commit()
    return {"status": "approved", "cafe": cafe.name}

@app.post("/cafes/{cafe_id}/reviews", response_model=ReviewResponse)
def create_review(cafe_id: int, review: ReviewCreate, db: Session = Depends(get_db)):
    from models import User, Review
    
    # 1. Get or Create User (Simple Auth Logic)
    user = db.query(User).filter(User.email == review.user_email).first()
    if not user:
        user = User(
            email=review.user_email,
            name=review.user_name,
            picture=review.user_picture
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # 2. Add Review
    db_review = Review(
        cafe_id=cafe_id,
        user_id=user.id,
        rating=review.rating,
        comment=review.comment,
        image_url=review.image_url
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    # 3. Update Cafe Rating Logic can go here (future)
    
    return ReviewResponse(
        id=db_review.id,
        rating=db_review.rating,
        comment=db_review.comment,
        image_url=db_review.image_url,
        created_at=db_review.created_at,
        user_name=user.name,
        user_picture=user.picture
    )

@app.post("/admin/sync")
async def sync_data(db: Session = Depends(get_db)):
    print("--- Starting Manual Sync ---")
    
    # 1. Get Stale Cafes (e.g. older than 7 days)
    # For MVP demo, we sync ALL Verified imported cafes
    cafes = db.query(Cafe).filter(Cafe.is_verified == 1, Cafe.osm_id.like("excel_%")).all()
    
    updated_count = 0
    for cafe in cafes:
        try:
            # 2. Query Overpass nearby this location
            # We look for cafes within 50m to match
            elements = await fetch_cafes_near(cafe.lat, cafe.lon, radius=50)
            
            if elements:
                # 3. Update details
                match = elements[0] # Take first match
                tags = match.get("tags", {})
                
                # Update logic
                cafe.tags = ", ".join([k for k,v in tags.items()]) # Simple tag dump or specific
                if "opening_hours" in tags:
                    cafe.opening_hours = tags["opening_hours"]
                if "website" in tags:
                    cafe.website = tags["website"]
                
                cafe.last_updated_at = datetime.utcnow()
                updated_count += 1
                
        except Exception as e:
            print(f"Error syncing {cafe.name}: {e}")
            
    db.commit()
    return {"status": "success", "updated": updated_count}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)