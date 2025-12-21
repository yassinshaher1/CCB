from fastapi import APIRouter, Depends, HTTPException
from database import get_ref
from utils import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

def require_admin(user: dict = Depends(get_current_user)):
    """Middleware to ensure user is admin"""
    if user.get("role") != "admin":
        raise HTTPException(403, "Admin access required")
    return user

@router.get("/")
def get_all_users(admin: dict = Depends(require_admin)):
    """Get all users (admin only)"""
    users_ref = get_ref("users")
    users_data = users_ref.get() or {}
    
    users_list = []
    for uid, data in users_data.items():
        if not isinstance(data, dict):
            continue
        users_list.append({
            "id": uid,
            "email": data.get("auth", {}).get("email", ""),
            "name": data.get("profile", {}).get("name", ""),
            "phone": data.get("profile", {}).get("phone", ""),
            "role": data.get("profile", {}).get("role", "user"),
            "status": data.get("profile", {}).get("status", "active"),
            "createdAt": data.get("auth", {}).get("createdAt", ""),
            "lastLoginAt": data.get("auth", {}).get("lastLoginAt", ""),
        })
    
    return users_list

@router.get("/admins")
def get_all_admins(admin: dict = Depends(require_admin)):
    """Get all admins (admin only)"""
    admins_ref = get_ref("admins")
    admins_data = admins_ref.get() or {}
    
    admins_list = []
    for aid, data in admins_data.items():
        if not isinstance(data, dict):
            continue
        admins_list.append({
            "id": aid,
            "email": data.get("auth", {}).get("email", ""),
            "name": data.get("profile", {}).get("name", ""),
            "role": "admin",
            "status": data.get("profile", {}).get("status", "active"),
            "createdAt": data.get("auth", {}).get("createdAt", ""),
            "lastLoginAt": data.get("auth", {}).get("lastLoginAt", ""),
        })
    
    return admins_list

@router.put("/{user_id}")
def update_user(user_id: str, name: str = None, phone: str = None, status: str = None, admin: dict = Depends(require_admin)):
    """Update user information (admin only)"""
    # Check users first
    user_ref = get_ref(f"users/{user_id}/profile")
    user = user_ref.get()
    
    if user:
        updates = {}
        if name is not None:
            updates["name"] = name
        if phone is not None:
            updates["phone"] = phone
        if status is not None:
            if status not in ["active", "suspended"]:
                raise HTTPException(400, "Status must be 'active' or 'suspended'")
            updates["status"] = status
        if updates:
            user_ref.update(updates)
        return {"message": "User updated", "updates": updates}
    
    # Check admins
    admin_ref = get_ref(f"admins/{user_id}/profile")
    admin_data = admin_ref.get()
    
    if admin_data:
        updates = {}
        if name is not None:
            updates["name"] = name
        if status is not None:
            if status not in ["active", "suspended"]:
                raise HTTPException(400, "Status must be 'active' or 'suspended'")
            updates["status"] = status
        if updates:
            admin_ref.update(updates)
        return {"message": "Admin updated", "updates": updates}
    
    raise HTTPException(404, "User not found")

@router.put("/{user_id}/status")
def update_user_status(user_id: str, status: str, admin: dict = Depends(require_admin)):
    """Update user status (active/suspended)"""
    if status not in ["active", "suspended"]:
        raise HTTPException(400, "Status must be 'active' or 'suspended'")
    
    # Check users first
    user_ref = get_ref(f"users/{user_id}/profile")
    user = user_ref.get()
    
    if user:
        user_ref.update({"status": status})
        return {"message": f"User status updated to {status}"}
    
    # Check admins
    admin_ref = get_ref(f"admins/{user_id}/profile")
    admin_data = admin_ref.get()
    
    if admin_data:
        admin_ref.update({"status": status})
        return {"message": f"Admin status updated to {status}"}
    
    raise HTTPException(404, "User not found")

@router.delete("/{user_id}")
def delete_user(user_id: str, admin: dict = Depends(require_admin)):
    """Delete a user (admin only)"""
    # Check users first
    user_ref = get_ref(f"users/{user_id}")
    user = user_ref.get()
    
    if user:
        user_ref.delete()
        return {"message": "User deleted successfully"}
    
    # Check admins
    admin_ref = get_ref(f"admins/{user_id}")
    admin_data = admin_ref.get()
    
    if admin_data:
        admin_ref.delete()
        return {"message": "Admin deleted successfully"}
    
    raise HTTPException(404, "User not found")
