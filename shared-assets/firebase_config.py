import firebase_admin
from firebase_admin import credentials, db
import os

SERVICE_ACCOUNT_PATH = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
DATABASE_URL = "https://ccb-db-41f73-default-rtdb.firebaseio.com"

if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(cred, {
        "databaseURL": DATABASE_URL
    })

def get_db():
    return db.reference()
