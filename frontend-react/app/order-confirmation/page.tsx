"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Download, Printer } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  size: string
  color: string
  image: string
}

interface OrderDetails {
  orderNumber: number
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  date: string
}

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const router = useRouter()

  useEffect(() => {
    const orderData = sessionStorage.getItem("lastOrder")
    if (orderData) {
      setOrder(JSON.parse(orderData))
    } else {
      router.push("/")
    }
  }, [router])

  const handlePrint = () => {
    window.print()
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  const orderDate = new Date(order.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <Card className="p-8 mb-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="font-serif text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print Receipt
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </Card>

          {/* Order Details */}
          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl font-bold">Order Receipt</h2>
                <p className="text-sm text-muted-foreground">Order #{order.orderNumber}</p>
              </div>
              <Image src="/images/image.png" alt="CCB Logo" width={48} height={48} />
            </div>

            <div className="mb-6">
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium">{orderDate}</p>
            </div>

            <Separator className="my-6" />

            {/* Order Items */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-lg">Order Items</h3>
              {order.items.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.color} • Size {item.size} • Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            {/* Order Summary */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (CT 6.35%)</span>
                <span className="font-medium">${order.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Additional Info */}
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                A confirmation email has been sent to your email address with your order details and tracking
                information.
              </p>
              <p>
                Your order will be processed within 1-2 business days. You will receive a shipping notification once
                your items are on the way.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <Button asChild className="flex-1">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/profile">View Order History</Link>
              </Button>
            </div>
          </Card>

          {/* Thank You Message */}
          <Card className="p-6 mt-8 bg-secondary/30 text-center">
            <h3 className="font-serif text-xl font-bold mb-2">Thank You for Shopping with CCB</h3>
            <p className="text-muted-foreground">
              We appreciate your business and hope you enjoy your Connecticut Clothing Brand items.
            </p>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image src="/images/image.png" alt="CCB Logo" width={32} height={32} />
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold text-primary">CCB</span>
                <span className="text-xs text-muted-foreground">Est. 1881</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 Connecticut Clothing Brand. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
