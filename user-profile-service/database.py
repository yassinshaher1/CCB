import firebase_admin
from firebase_admin import credentials, db
import os

# 1. Setup Firebase
SERVICE_ACCOUNT_PATH = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
DATABASE_URL = "https://ccb-db-41f73-default-rtdb.firebaseio.com"

if not firebase_admin._apps:
    if os.path.exists(SERVICE_ACCOUNT_PATH):
        cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
        firebase_admin.initialize_app(cred, {"databaseURL": DATABASE_URL})
        print("Firebase connected.")
    else:
        print("WARNING: serviceAccountKey.json missing.")

def get_ref(path):
    """Get a database reference for a specific path."""
    return db.reference(path)
