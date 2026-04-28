from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.domain import User
from app.models.schemas import LoginRequest, RegisterRequest
from app.core.security import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/register")
async def register(req: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    
    hashed_pwd = get_password_hash(req.password)
    
    new_user = User(
        username=req.username, 
        password=hashed_pwd,  
        name=req.name, 
        zone=req.zone
    )
    db.add(new_user)
    db.commit()
    return {"status": "success", "message": "Registered successfully!"}

@router.post("/login")
async def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == req.username).first()
    
    # Verify the plain text input against the database hash
    if not user or not verify_password(req.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    # Generate the JWT Token (embedding the username as the 'sub')
    access_token = create_access_token(data={"sub": user.username})
    
    return {
        "status": "success", 
        "token": access_token, 
        "username": user.username, 
        "zone": user.zone
    }