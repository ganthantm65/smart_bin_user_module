from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.domain import User
from app.core.security import get_current_user_token # 👈 1. Make sure this is imported!

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("/leaderboard")
async def get_leaderboard(
    zone: str, 
    db: Session = Depends(get_db),
    current_username: str = Depends(get_current_user_token) # 👈 2. THIS IS THE BOUNCER!
):
    print(f"🔒 Authenticated request from: {current_username}")
    
    top_users = db.query(User).filter(User.zone == zone).order_by(User.green_points.desc()).limit(10).all()
    results = [{"rank": i+1, "username": u.username, "name": u.name, "points": u.green_points} for i, u in enumerate(top_users)]
    return {"zone": zone, "leaderboard": results}

@router.get("/me")
async def get_my_profile(
    db: Session = Depends(get_db),
    current_username: str = Depends(get_current_user_token) 
):
    user = db.query(User).filter(User.username == current_username).first()
    return {
        "name": user.name,
        "zone": user.zone,
        "green_points": user.green_points,
        "streak": user.streak,
        "kg_diverted": user.kg_diverted,
        "co2_saved": user.co2_saved,
        "disposals": user.disposals
    }