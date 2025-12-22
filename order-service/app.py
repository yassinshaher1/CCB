from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

# Local firebase config (no longer depends on shared-assets)
from firebase_config import get_db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

db = get_db()

from typing import Optional, List, Any

class OrderRequest(BaseModel):
    userId: str
    cartItems: dict
    totalPrice: float
    # Additional fields for cross-device sync
    customerEmail: Optional[str] = None
    customerName: Optional[str] = None
    items: Optional[List[Any]] = None
    subtotal: Optional[float] = None
    shipping: Optional[float] = None
    tax: Optional[float] = None
    total: Optional[float] = None
    status: Optional[str] = "Pending"
    date: Optional[str] = None
    shippingAddress: Optional[str] = None
    orderNumber: Optional[int] = None

@app.post("/order")
def create_order(order: OrderRequest):
    order_data = {
        "userId": order.userId,
        "customerEmail": order.customerEmail or order.userId,
        "customerName": order.customerName or "Guest",
        "status": order.status or "Pending",   
        "totalPrice": order.totalPrice,
        "total": order.total or order.totalPrice,
        "subtotal": order.subtotal,
        "shipping": order.shipping,
        "tax": order.tax,
        "items": order.items or order.cartItems,
        "cartItems": order.cartItems,
        "shippingAddress": order.shippingAddress,
        "orderNumber": order.orderNumber or int(datetime.now().timestamp()),
        "date": order.date or datetime.now().strftime("%Y-%m-%d"),
        "createdAt": datetime.now().isoformat(),
        "updatedAt": datetime.now().isoformat(),
        "paymentId": ""
    }

    # Realtime Database: db.child("orders").push(data)
    # db is now a Reference object (root) because we returned db.reference()
    new_order_ref = db.child("orders").push(order_data)

    return {
        "message": "Order received! Processing payment...",
        "orderId": new_order_ref.key
    }


@app.get("/orders/{email}")
def get_orders_by_email(email: str):
    """Fetch all orders for a user by their email address."""
    try:
        # Get all orders from Firebase
        orders_ref = db.child("orders").get()
        
        if not orders_ref:
            return []
        
        user_orders = []
        for order_id, order_data in orders_ref.items():
            # Check if this order belongs to the user
            if order_data.get("userId") == email or order_data.get("customerEmail") == email:
                user_orders.append({
                    "id": order_id,
                    **order_data
                })
        
        # Sort by createdAt descending (newest first)
        user_orders.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
        
        return user_orders
    except Exception as e:
        return {"error": str(e), "orders": []}


@app.get("/orders")
def get_all_orders():
    """Fetch all orders (for admin)."""
    try:
        orders_ref = db.child("orders").get()
        
        if not orders_ref:
            return []
        
        all_orders = []
        for order_id, order_data in orders_ref.items():
            all_orders.append({
                "id": order_id,
                **order_data
            })
        
        # Sort by createdAt descending (newest first)
        all_orders.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
        
        return all_orders
    except Exception as e:
        return {"error": str(e), "orders": []}

