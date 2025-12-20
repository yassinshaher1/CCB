import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import firebase_admin
from firebase_admin import credentials, db

# --- CONFIGURATION ---
CRED_PATH = "serviceAccountKey.json"
DATABASE_URL = "https://ccb-db-41f73-default-rtdb.firebaseio.com/"

# --- FIREBASE SETUP ---
if not firebase_admin._apps:
    cred = credentials.Certificate(CRED_PATH)
    firebase_admin.initialize_app(cred, {
        'databaseURL': DATABASE_URL
    })

app = FastAPI()

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELS ---
class Product(BaseModel):
    name: str
    price: float
    description: Optional[str] = None
    stock: int = 0
    categoryId: str = "general"
    imageUrl: Optional[str] = ""  # <--- NEW FIELD

# --- ROUTES ---

@app.get("/products")
def get_products():
    """Fetch all products"""
    ref = db.reference('products')
    data = ref.get()
    
    if not data:
        return []
    
    product_list = []
    for key, value in data.items():
        value['id'] = key
        product_list.append(value)
        
    return product_list

@app.post("/products")
def add_product(product: Product):
    """Add a new product"""
    ref = db.reference('products')
    new_product_ref = ref.push(product.dict())
    return {"message": "Added", "id": new_product_ref.key}

# --- NEW: DELETE ENDPOINT ---
@app.delete("/products/{product_id}")
def delete_product(product_id: str):
    """Delete a product by ID"""
    ref = db.reference(f'products/{product_id}')
    if ref.get() is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    ref.delete()
    return {"message": "Product deleted successfully"}

# --- NEW: UPDATE ENDPOINT ---
@app.put("/products/{product_id}")
def update_product(product_id: str, product: Product):
    """Update a product by ID"""
    ref = db.reference(f'products/{product_id}')
    if ref.get() is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    ref.update(product.dict())
    return {"message": "Product updated successfully"}