from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session


from database import SessionLocal, engine
import models
from models import Job, User
from schemas import (
    JobCreate,
    JobResponse,
    UserCreate,
    UserLogin,
    UserResponse,
    ForgotPassword,
)
from security import (
    hash_password,
    verify_password,
    create_access_token,
)
from ai import generate_job_description

# Create Database Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Job Board API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-job-board-app.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------------
# Home
# -------------------------
@app.get("/")
def home():
    return {"message": "AI Job Board API is Running"}


# -------------------------
# Register User
# -------------------------
@app.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# -------------------------
# Login User
# -------------------------
@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(
        data={"sub": db_user.email}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@app.put("/forgot-password")
def forgot_password(
    data: ForgotPassword,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Email not found"
        )

    user.password = hash_password(data.new_password)

    db.commit()

    return {
        "message": "Password updated successfully"
    }
# -------------------------
# Get All Jobs
# -------------------------
@app.get("/jobs", response_model=list[JobResponse])
def get_jobs(db: Session = Depends(get_db)):
    return db.query(Job).all()


# -------------------------
# Add Job
# -------------------------
@app.post("/jobs", response_model=JobResponse)
def create_job(job: JobCreate, db: Session = Depends(get_db)):
    new_job = Job(
        title=job.title,
        company=job.company,
        location=job.location,
        description=job.description,
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job


# -------------------------
# Update Job
# -------------------------
@app.put("/jobs/{job_id}", response_model=JobResponse)
def update_job(job_id: int, job: JobCreate, db: Session = Depends(get_db)):
    existing_job = db.query(Job).filter(Job.id == job_id).first()

    if not existing_job:
        raise HTTPException(status_code=404, detail="Job not found")

    existing_job.title = job.title
    existing_job.company = job.company
    existing_job.location = job.location
    existing_job.description = job.description

    db.commit()
    db.refresh(existing_job)

    return existing_job


# -------------------------
# Delete Job
# -------------------------
@app.delete("/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    db.delete(job)
    db.commit()

    return {"message": "Job deleted successfully"}


# -------------------------
# AI Job Description
# -------------------------
@app.get("/generate/{title}")
def generate(title: str):
    description = generate_job_description(title)

    return {
        "description": description
    }