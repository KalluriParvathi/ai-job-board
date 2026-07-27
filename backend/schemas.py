from pydantic import BaseModel, ConfigDict


# -----------------------------
# Job Schemas
# -----------------------------
class JobCreate(BaseModel):
    title: str
    company: str
    location: str
    description: str


class JobResponse(JobCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)


# -----------------------------
# User Schemas
# -----------------------------
class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    model_config = ConfigDict(from_attributes=True)
    
class ForgotPassword(BaseModel):
    email: str
    new_password: str