from pydantic import BaseModel
from typing import List, Optional

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    password: str
    name: str
    zone: str

class UserProfile(BaseModel):
    username: str
    name: str
    zone: str
    green_points: int
    rank: int
    streak: int
    kg_diverted: float
    co2_saved: float
    disposals: int
    class Config:
        from_attributes = True

class ClassificationResult(BaseModel):
    category: str
    confidence: float
    bin_id: str

class DisposalResponse(BaseModel):
    status: str
    message: str
    weight_kg: float
    points_awarded: int
    ai_classification: ClassificationResult