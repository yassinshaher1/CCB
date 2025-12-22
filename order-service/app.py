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

class OrderRequest(BaseModel):
    userId: str
    cartItems: dict
    totalPrice: float

@app.post("/order")
def create_order(order: OrderRequest):
    order_data = {
        "userId": order.userId,
        "status": "PENDING",   
        "totalPrice": order.totalPrice,
        "items": order.cartItems,
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
