from fastapi import APIRouter, Depends, HTTPException
from database import get_ref
from models import UpdateProfile
from utils import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("/me")
def get_my_profile(user: dict = Depends(get_current_user)):
    table = "users" if user["role"] == "user" else "admins"
    ref = get_ref(f"{table}/{user['sub']}/profile")
    
    profile = ref.get()
    if not profile:
        raise HTTPException(404, "Profile not found")
    return profile

@router.put("/me")
def update_my_profile(update: UpdateProfile, user: dict = Depends(get_current_user)):
    table = "users" if user["role"] == "user" else "admins"
    ref = get_ref(f"{table}/{user['sub']}/profile")
    
    if not ref.get():
        raise HTTPException(404, "Profile not found")

    data = update.dict(exclude_unset=True)
    if data:
        ref.update(data)
        
    return {"message": "Updated", "updates": data}
