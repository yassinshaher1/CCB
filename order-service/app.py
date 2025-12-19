from fastapi import FastAPI
from pydantic import BaseModel
import json
from kafka import KafkaProducer # REQUIRED for Member 3 [cite: 103]
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, you'd put your frontend URL here
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. KAFKA SETUP [cite: 103]
# The 'bootstrap_servers' will be provided by your Lead on Day 3
# For local testing, 'localhost:9092' is used.
try:
    producer = KafkaProducer(
        bootstrap_servers=['localhost:9092'],
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )
except Exception as e:
    print(f"Kafka Connection Warning: {e}")
    producer = None

# 2. DATA MODEL [cite: 107]
class OrderRequest(BaseModel):
    userId: str
    cartItems: list

# 3. ORDER ROUTE 
@app.post("/order")
async def create_order(order: OrderRequest):
    # Logic: Receive user ID and Cart contents [cite: 107]
    # Do NOT process payment here [cite: 108]
    
    # 4. CREATE JSON OBJECT [cite: 109]
    order_event = {
        "order_id": 1, # You can implement a counter later
        "status": "pending", 
        "total": 100,
        "userId": order.userId,
        "items": order.cartItems
    }
    
    # 5. SEND TO KAFKA [cite: 110]
    if producer:
        producer.send('orders', order_event)
        print(f"Sent to Kafka: {order_event}")
    
    # 6. RETURN SPECIFIC MESSAGE [cite: 111]
    return {"message": "Order received! Processing..."}

# To run this: python -m uvicorn app:app --reload