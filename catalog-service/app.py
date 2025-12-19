import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import firebase_admin
from firebase_admin import credentials, db

# --- CONFIGURATION ---
# We use the key file you provided
CRED_PATH = "serviceAccountKey.json"
# Based on your project ID 'ccb-db-41f73', this is the standard URL format.
# If this fails, check Firebase Console -> Realtime Database -> Data tab for the correct URL.
DATABASE_URL = "https://ccb-db-41f73-default-rtdb.firebaseio.com/"

# --- FIREBASE SETUP ---
if not firebase_admin._apps:
    cred = credentials.Certificate(CRED_PATH)
    firebase_admin.initialize_app(cred, {
        'databaseURL': DATABASE_URL
    })

app = FastAPI()

# --- MODELS ---
class Product(BaseModel):
    name: str
    price: float
    description: Optional[str] = None
    stock: int = 0
    categoryId: str = "general"

# --- ROUTES ---

@app.get("/products")
def get_products():
    """Fetch all products from Firebase"""
    ref = db.reference('products')
    data = ref.get()
    
    if not data:
        return []
    

    product_list = []
    for key, value in data.items():
        value['id'] = key # Add the Firebase ID to the object
        product_list.append(value)
        
    return product_list

@app.post("/products")
def add_product(product: Product):
    """Save a new product to Firebase"""
    ref = db.reference('products')
    
    new_product_ref = ref.push(product.dict())
    
    return {
        "message": "Product added successfully", 
        "id": new_product_ref.key,
        "product": product
    }