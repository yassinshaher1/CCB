from pydantic import BaseModel
from typing import Optional

# Signup Models
class UserSignup(BaseModel):
    email: str
    password: str
    name: str
    phone: Optional[str] = ""

class AdminSignup(BaseModel):
    email: str
    password: str
    name: str

# Login
class LoginRequest(BaseModel):
    email: str
    password: str

# Profile
class UpdateProfile(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip: Optional[str] = None
