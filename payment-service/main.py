import time
import threading
from datetime import datetime

# Local firebase config (no longer depends on shared-assets)
from firebase_config import get_db

# Get Realtime Database root reference
db = get_db()


def process_payment(order_id, order_data):
    """
    Handles payment logic for a single order.
    Runs in a separate thread.
    """

    # Safety check (idempotency)
    if order_data.get("status") != "PENDING":
        return

    print(f"\n[EVENT] Processing payment for order: {order_id}")

    # Simulate payment gateway delay
    print(" Contacting payment gateway...")
    time.sleep(3)

    # 1 Create payment record
    payment_data = {
        "orderId": order_id,
        "method": "VISA",
        "status": "SUCCESS",
        "amount": order_data.get("totalPrice"),
        "currency": "USD",
        "createdAt": datetime.now().isoformat()
    }

    payment_ref = db.child("payments").push(payment_data)
    payment_id = payment_ref.key

    # 2 Update order
    db.child("orders").child(order_id).update({
        "status": "PAID",
        "paymentStatus": "SUCCESS",
        "paymentId": payment_id,
        "updatedAt": datetime.now().isoformat()
    })

    print(f" Order {order_id} marked as PAID")
    print(f" Payment record created: {payment_id}")


def order_listener(event):
    """
    Firebase Realtime Database listener.
    Fires when orders change.
    """

    # We only care about new orders
    if event.event_type != "put":
        return

    if not event.path or event.path == "/":
        return

    order_id = event.path.lstrip("/")
    order_data = event.data

    if not isinstance(order_data, dict):
        return

    if order_data.get("status") == "PENDING":
        thread = threading.Thread(
            target=process_payment,
            args=(order_id, order_data)
        )
        thread.start()


if __name__ == "__main__":
    print("------------------------------------------------")
    print(" PAYMENT SERVICE STARTED")
    print(" Listening for PENDING orders...")
    print("------------------------------------------------")

    orders_ref = db.child("orders")
    orders_ref.listen(order_listener)

    # Keep process alive
    while True:
        time.sleep(1)
