import firebase_admin
from firebase_admin import credentials, db
import os

# 1. Setup Firebase - Check K8s mounted path first, then fall back to local
SERVICE_ACCOUNT_PATH = os.environ.get(
    "GOOGLE_APPLICATION_CREDENTIALS",
    "/app/serviceAccountKey.json"  # K8s mounted path
)
# Fall back to local file if mounted path doesn't exist
if not os.path.exists(SERVICE_ACCOUNT_PATH):
    SERVICE_ACCOUNT_PATH = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")

DATABASE_URL = "https://ccb-db-41f73-default-rtdb.firebaseio.com"

if not firebase_admin._apps:
    if os.path.exists(SERVICE_ACCOUNT_PATH):
        cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
        firebase_admin.initialize_app(cred, {"databaseURL": DATABASE_URL})
        print(f"Firebase connected using: {SERVICE_ACCOUNT_PATH}")
    else:
        raise RuntimeError(f"FATAL: serviceAccountKey.json not found at {SERVICE_ACCOUNT_PATH}")

def get_ref(path):
    """Get a database reference for a specific path."""
    return db.reference(path)
