from fastapi import APIRouter, HTTPException
from database import get_ref
from models import UserSignup, AdminSignup, LoginRequest
from utils import hash_password, verify_password, create_token
import uuid
import datetime

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup/user")
def signup_user(user: UserSignup):
    users_ref = get_ref("users")
    
    # Check if email exists
    all_users = users_ref.get() or {}
    for u in all_users.values():
        if u.get("auth", {}).get("email") == user.email:
            raise HTTPException(400, "Email already exists")

    user_id = str(uuid.uuid4())
    new_user = {
        "auth": {
            "email": user.email,
            "password": hash_password(user.password),
            "createdAt": str(datetime.datetime.now()),
            "lastLoginAt": ""
        },
        "profile": {
            "name": user.name,
            "phone": user.phone,
            "role": "user",
            "status": "active"
        }
    }
    users_ref.child(user_id).set(new_user)
    return {"message": "User registered", "user_id": user_id}

@router.post("/signup/admin")
def signup_admin(admin: AdminSignup):
    admins_ref = get_ref("admins")
    
    all_admins = admins_ref.get() or {}
    for a in all_admins.values():
        if a.get("auth", {}).get("email") == admin.email:
            raise HTTPException(400, "Email already exists")

    admin_id = str(uuid.uuid4())
    new_admin = {
        "auth": {
            "email": admin.email,
            "password": hash_password(admin.password),
            "createdAt": str(datetime.datetime.now()),
            "lastLoginAt": ""
        },
        "profile": {
            "name": admin.name,
            "role": "admin",
            "status": "active"
        }
    }
    admins_ref.child(admin_id).set(new_admin)
    return {"message": "Admin registered", "admin_id": admin_id}

@router.post("/login")
def login(creds: LoginRequest):
    # Check Users
    users = get_ref("users").get() or {}
    for uid, data in users.items():
        if data.get("auth", {}).get("email") == creds.email:
            if verify_password(creds.password, data["auth"]["password"]):
                token = create_token({"sub": uid, "role": "user"})
                return {"access_token": token, "token_type": "bearer", "role": "user"}
    
    # Check Admins
    admins = get_ref("admins").get() or {}
    for aid, data in admins.items():
        if data.get("auth", {}).get("email") == creds.email:
            if verify_password(creds.password, data["auth"]["password"]):
                token = create_token({"sub": aid, "role": "admin"})
                return {"access_token": token, "token_type": "bearer", "role": "admin"}

    raise HTTPException(400, "Invalid credentials")
