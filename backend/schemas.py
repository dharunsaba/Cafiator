from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime

class ReviewBase(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: str
    image_url: Optional[str] = None

class ReviewCreate(ReviewBase):
    user_email: str # For MVP auth simulation
    user_name: str
    user_picture: str

class ReviewResponse(ReviewBase):
    id: int
    created_at: datetime
    user_name: str
    user_picture: str

    class Config:
        from_attributes = True

class CafeResponse(BaseModel):
    id: int
    name: str = "Unnamed Cafe"
    city: str
    lat: float
    lon: float
    rating: float = 0.0
    tags: List[str] = []
    timings: Optional[str] = Field(None, alias="opening_hours")
    
    # Computed/Default fields for Frontend compatibility
    location: str = "View on Map"
    image: str = "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format"
    direction: str = "#"
    description: str = "A lovely cafe in Tamil Nadu."
    is_verified: int = 1
    
    reviews: List[ReviewResponse] = []

    class Config:
        from_attributes = True

    @validator("tags", pre=True)
    def parse_tags(cls, v):
        if isinstance(v, str):
            return [t.strip() for t in v.split(",") if t.strip()]
        return v or []

    @validator("direction", pre=True, always=True)
    def compute_direction(cls, v, values):
        # In Pydantic V2 values is sometimes a dict or validation info. 
        # Check simple dict access for MVP or field validator
        if isinstance(values, dict):
            lat = values.get("lat")
            lon = values.get("lon")
            if lat and lon:
                return f"https://www.google.com/maps/search/?api=1&query={lat},{lon}"
        return "#"

    @validator("location", pre=True, always=True)
    def compute_location(cls, v, values):
        if isinstance(values, dict):
             # If DB has location, use it. Else fallback to city.
             db_loc = values.get("location")
             if db_loc and db_loc != "View on Map":
                 return db_loc
             return values.get("city", "Tamil Nadu")
        return "View on Map"

class CafeCreate(BaseModel):
    name: str
    city: str
    location: str # description of where it is
    lat: float = 0.0 # optional for manual, maybe required
    lon: float = 0.0
    tags: str # comma separated
    description: str
    image: str = None
    
    # Contact (Optional)
    phone: str = None
    email: str = None
    website: str = None
