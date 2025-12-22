import firebase_admin
from firebase_admin import credentials, db
import os

# Path to service account key (mounted via K8s secret)
SERVICE_ACCOUNT_PATH = os.environ.get(
    "GOOGLE_APPLICATION_CREDENTIALS", 
    "/app/serviceAccountKey.json"
)
DATABASE_URL = "https://ccb-db-41f73-default-rtdb.firebaseio.com"

if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(cred, {
        "databaseURL": DATABASE_URL
    })

def get_db():
    """Get Firebase Realtime Database root reference."""
    return db.reference()
