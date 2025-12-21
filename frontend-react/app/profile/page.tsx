"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package, Settings, MapPin, CreditCard, Shield, LogOut, X, RotateCcw } from "lucide-react"
import { Header } from "@/components/header"

interface OrderItem {
  name: string
  quantity: number
  price: number
  size?: string
  color?: string
}

interface Order {
  id: string
  orderNumber: number
  customerEmail: string
  customerName: string
  total: number
  subtotal: number
  shipping: number
  tax: number
  status: string
  date: string
  shippingAddress: string
  items: OrderItem[]
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default function ProfilePage() {
  const { user, isAuthenticated, logout, updateUser } = useAuth()
  const { wishlist } = useStore()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "CT",
    zip: "",
  })
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  })
  const [shippingForm, setShippingForm] = useState({
    address: "",
    city: "",
    state: "CT",
    zip: "",
  })

  // Load orders from localStorage
  useEffect(() => {
    if (user) {
      const allOrders = JSON.parse(localStorage.getItem("ccb-admin-orders") || "[]")
      // Filter orders for current user
      const userOrders = allOrders.filter(
        (order: Order) => order.customerEmail === user.email
      )
      setOrders(userOrders)

      // Initialize edit form with user data
      setEditForm({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "CT",
        zip: user.zip || "",
      })

      // Initialize payment form
      setPaymentForm({
        cardNumber: user.cardNumber || "",
        cardExpiry: user.cardExpiry || "",
        cardCvc: user.cardCvc || "",
      })

      // Initialize shipping form
      setShippingForm({
        address: user.address || "",
        city: user.city || "",
        state: user.state || "CT",
        zip: user.zip || "",
      })
    }
  }, [user])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Show nothing while checking auth or redirecting
  if (!isAuthenticated || !user) {
    return null
  }

  // Exclude refunded orders from total spent
  const totalSpent = orders
    .filter(order => order.status !== "Refunded")
    .reduce((sum, order) => sum + order.total, 0)

  // Track refunded amount
  const totalRefunded = orders
    .filter(order => order.status === "Refunded")
    .reduce((sum, order) => sum + order.total, 0)

  const handleSaveProfile = async () => {
    const success = await updateUser(editForm)
    if (success) {
      alert("Profile updated successfully!")
      setIsEditProfileOpen(false)
    } else {
      alert("Failed to update profile. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                  <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    <Badge variant="secondary">
                      {user.isAdmin ? "Admin" : "Member"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Connecticut
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setIsEditProfileOpen(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Orders</CardDescription>
                <CardTitle className="text-3xl">{orders.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {orders.length > 0 ? "View your order history" : "Start shopping to see your orders"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Wishlist Items</CardDescription>
                <CardTitle className="text-3xl">{wishlist.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {wishlist.length > 0 ? "View your saved items" : "Save items you love"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Spent</CardDescription>
                <CardTitle className="text-3xl">${totalSpent.toFixed(2)}</CardTitle>
              </CardHeader>
              <CardContent>
                {totalRefunded > 0 ? (
                  <p className="text-xs text-emerald-600">
                    ${totalRefunded.toFixed(2)} refunded
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">All time</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="orders" className="space-y-4">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Your order history and tracking information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                      <Package className="h-12 w-12 mb-4" />
                      <p className="font-medium">No orders yet</p>
                      <p className="text-sm">When you place orders, they will appear here.</p>
                      <Button className="mt-4" onClick={() => router.push("/shop")}>
                        Start Shopping
                      </Button>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <Package className="h-10 w-10 text-muted-foreground" />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Order #{order.orderNumber}</p>
                            <Badge variant={order.status === "Delivered" ? "default" : "secondary"}>
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {order.date} • ${order.total.toFixed(2)}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                          View Details
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              {/* Payment Method Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <CardTitle>Payment Method</CardTitle>
                  </div>
                  <CardDescription>Save your card for faster checkout</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentForm.cardNumber}
                      onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardExpiry">Expiry Date</Label>
                      <Input
                        id="cardExpiry"
                        placeholder="MM / YY"
                        value={paymentForm.cardExpiry}
                        onChange={(e) => setPaymentForm({ ...paymentForm, cardExpiry: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardCvc">CVC</Label>
                      <Input
                        id="cardCvc"
                        placeholder="123"
                        value={paymentForm.cardCvc}
                        onChange={(e) => setPaymentForm({ ...paymentForm, cardCvc: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={async () => {
                      const success = await updateUser({
                        cardNumber: paymentForm.cardNumber,
                        cardExpiry: paymentForm.cardExpiry,
                        cardCvc: paymentForm.cardCvc,
                      })
                      if (success) {
                        alert("Payment method saved!")
                      } else {
                        alert("Failed to save payment method")
                      }
                    }}
                  >
                    Save Payment Method
                  </Button>
                </CardContent>
              </Card>

              {/* Shipping Address Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <CardTitle>Shipping Address</CardTitle>
                  </div>
                  <CardDescription>Save your address for faster checkout</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="shippingAddress">Street Address</Label>
                    <Input
                      id="shippingAddress"
                      placeholder="123 Main Street"
                      value={shippingForm.address}
                      onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shippingCity">City</Label>
                      <Input
                        id="shippingCity"
                        placeholder="Hartford"
                        value={shippingForm.city}
                        onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingState">State</Label>
                      <Input
                        id="shippingState"
                        placeholder="CT"
                        value={shippingForm.state}
                        onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingZip">ZIP Code</Label>
                      <Input
                        id="shippingZip"
                        placeholder="06101"
                        value={shippingForm.zip}
                        onChange={(e) => setShippingForm({ ...shippingForm, zip: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={async () => {
                      const success = await updateUser({
                        address: shippingForm.address,
                        city: shippingForm.city,
                        state: shippingForm.state,
                        zip: shippingForm.zip,
                      })
                      if (success) {
                        alert("Shipping address saved!")
                      } else {
                        alert("Failed to save shipping address")
                      }
                    }}
                  >
                    Save Shipping Address
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Keep your account secure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">Change Password</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Update your password regularly for better security
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">Two-Factor Authentication</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <LogOut className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">Sign Out All Devices</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Sign out from all devices except this one</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Order Details Dialog */}
      <Dialog open={selectedOrder !== null} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>
              Placed on {selectedOrder?.date}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={selectedOrder.status === "Delivered" ? "default" : "secondary"}>
                  {selectedOrder.status}
                </Badge>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.name} × {item.quantity}
                        {item.size && <span className="text-muted-foreground"> ({item.size})</span>}
                      </span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${(selectedOrder.subtotal || selectedOrder.total * 0.9).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{selectedOrder.shipping === 0 ? "Free" : `$${(selectedOrder.shipping || 0).toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${(selectedOrder.tax || selectedOrder.total * 0.0635).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {selectedOrder.shippingAddress && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-1">Shipping Address</h4>
                    <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress}</p>
                  </div>
                </>
              )}

              <Separator />

              {/* Refund Button */}
              {selectedOrder.status !== "Refunded" && selectedOrder.status !== "Refund Requested" ? (
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    // Update order status in localStorage
                    const allOrders = JSON.parse(localStorage.getItem("ccb-admin-orders") || "[]")
                    const updatedOrders = allOrders.map((order: Order) =>
                      order.id === selectedOrder.id
                        ? { ...order, status: "Refund Requested" }
                        : order
                    )
                    localStorage.setItem("ccb-admin-orders", JSON.stringify(updatedOrders))

                    // Update local state
                    setOrders(orders.map(order =>
                      order.id === selectedOrder.id
                        ? { ...order, status: "Refund Requested" }
                        : order
                    ))
                    setSelectedOrder({ ...selectedOrder, status: "Refund Requested" })

                    alert("Refund request submitted! Our team will review your request within 2-3 business days.")
                  }}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Request Refund
                </Button>
              ) : (
                <div className="text-center p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.status === "Refund Requested"
                      ? "⏳ Refund request is being processed"
                      : "✅ This order has been refunded"}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                value={user.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                placeholder="123 Main Street"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label htmlFor="edit-city">City</Label>
                <Input
                  id="edit-city"
                  value={editForm.city}
                  onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                  placeholder="Hartford"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-state">State</Label>
                <Input
                  id="edit-state"
                  value={editForm.state}
                  onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                  placeholder="CT"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-zip">ZIP</Label>
                <Input
                  id="edit-zip"
                  value={editForm.zip}
                  onChange={(e) => setEditForm({ ...editForm, zip: e.target.value })}
                  placeholder="06101"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setIsEditProfileOpen(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleSaveProfile}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
