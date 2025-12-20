import threading
import time
import sys
import os
from datetime import datetime

shared_assets_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'shared-assets')
sys.path.append(shared_assets_path)
from firebase_config import get_db

db = get_db()

def process_order(doc_id, order_data):

    print(f"\n[EVENT DETECTED] New Order Found: {doc_id}")
    print(f"   └── User: {order_data.get('userId')} | Amount: ${order_data.get('totalPrice')}")
    
    # 1. Simulate Processing Delay (e.g., talking to Bank API)
    print("   └── 💳 Contacting Payment Gateway...")
    time.sleep(3)
    
    db.collection('orders').document(doc_id).update({
        'status': 'PAID',
        'updatedAt': datetime.now().isoformat()
    })
    print(f"   └── ✅ SUCCESS: Order {doc_id} marked as PAID.")

def on_snapshot(col_snapshot, changes, read_time):

    for change in changes:
        if change.type.name == 'ADDED':
            data = change.document.to_dict()
            if data.get('status') == 'PENDING':
                thread = threading.Thread(target=process_order, args=(change.document.id, data))
                thread.start()

if __name__ == "__main__":
    print("------------------------------------------------")
    print("PAYMENT SERVICE (EVENT LISTENER) STARTED")
    print(" Watching 'orders' collection for events...")
    print("------------------------------------------------")
    
    order_ref = db.collection('orders')
    query_watch = order_ref.on_snapshot(on_snapshot)

    while True:
        time.sleep(1)
