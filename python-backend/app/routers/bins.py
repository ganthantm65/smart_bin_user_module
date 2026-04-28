from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.domain import User, BinUnit
from app.services.ai_service import classify_image
from app.services.hardware import unlock_physical_bin, get_delta_weight
from app.core.security import get_current_user_token
import math

router = APIRouter(prefix="/api/bins", tags=["Bins"])

def calc_distance(lat1, lon1, lat2, lon2):
    R = 6371.0 
    d_lat, d_lon = math.radians(lat2 - lat1), math.radians(lon2 - lon1)
    a = math.sin(d_lat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lon/2)**2
    return R * (2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)))

@router.get("/nearby")
async def get_nearby(
    lat: float = Query(...), 
    lng: float = Query(...), 
    radius: float = Query(2.0), 
    db: Session = Depends(get_db),
    current_username: str = Depends(get_current_user_token)
):
    all_bins = db.query(BinUnit).all()
    results = [
        {
            "id": b.unit_id, 
            "location": b.location, 
            "latitude": b.latitude,   
            "longitude": b.longitude, 
            "distance_km": round(calc_distance(lat, lng, b.latitude, b.longitude), 2), 
            "status": b.status
        } 
        for b in all_bins if calc_distance(lat, lng, b.latitude, b.longitude) <= radius
    ]
    return {"results": sorted(results, key=lambda x: x["distance_km"])}

@router.post("/{unit_id}/dispose")
async def dispose_waste(
    unit_id: str, 
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_username: str = Depends(get_current_user_token)
):
    user = db.query(User).filter(User.username == current_username).first()
    if not user: 
        raise HTTPException(status_code=404, detail="User not found")

    image_data = await file.read()
    ai_result = await classify_image(image_data)
    
    await unlock_physical_bin(unit_id, ai_result["bin_id"])
    weight = await get_delta_weight(unit_id)

    points_map = {
        "Organic": 10, 
        "Recyclable": 15, 
        "Hazardous": 20, 
        "E-Waste": 50
    }
    
    base_pts = points_map.get(ai_result["category"], 10)
    streak_mult = 1.5 if user.streak >= 7 else (1.2 if user.streak >= 3 else 1.0)
    earned_pts = int((weight * base_pts) * streak_mult)

    user.green_points += earned_pts
    user.kg_diverted = round(user.kg_diverted + weight, 2)
    user.co2_saved = round(user.co2_saved + (weight * 0.38), 2)
    user.disposals += 1
    
    db.commit()

    return {
        "status": "success", 
        "message": "Waste processed by PowerNest AI", 
        "weight_kg": weight, 
        "points_awarded": earned_pts, 
        "ai_classification": ai_result
    }