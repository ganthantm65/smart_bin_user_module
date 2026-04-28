from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.core.database import engine, Base, SessionLocal
from app.models.domain import BinUnit
from app.routers import bins, auth, users

# Auto-generate DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Bin Tech API (Mock Mode)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(bins.router)
app.include_router(users.router)

@app.on_event("startup")
def populate_sample_bins():
    db: Session = SessionLocal()
    if db.query(BinUnit).count() == 0:
        print("🌱 Populating database with sample Smart Bins...")
        db.add_all([
            BinUnit(unit_id="U-101", location="Palayamkottai Junction", latitude=8.7176, longitude=77.7431),
            BinUnit(unit_id="U-102", location="Anna Nagar Park", latitude=8.7300, longitude=77.7100),
            BinUnit(unit_id="U-103", location="Town Hub", latitude=8.7250, longitude=77.7050)
        ])
        db.commit()
    db.close()

@app.get("/")
def root():
    return {"message": "Backend is online in Mock Mode."}