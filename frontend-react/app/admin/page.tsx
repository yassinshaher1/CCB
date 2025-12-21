"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, DollarSign, TrendingUp, TrendingDown } from "lucide-react"

export default function AdminDashboard() {
  const { isAdmin, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    // Wait for auth to finish loading before checking auth status
    if (isLoading) return

    if (!isAuthenticated || !isAdmin) {
      router.push("/login")
      return
    }

    const loadData = () => {
      const savedOrders = localStorage.getItem("ccb-admin-orders")
      const savedProducts = localStorage.getItem("ccb-admin-products")

      if (savedOrders) setOrders(JSON.parse(savedOrders))
      if (savedProducts) setProducts(JSON.parse(savedProducts))
    }

    loadData()

    // Poll for updates every 2 seconds
    const interval = setInterval(loadData, 2000)
    return () => clearInterval(interval)
  }, [isLoading, isAuthenticated, isAdmin, router])

  if (!isAdmin) return null

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
  const totalOrders = orders.length
  const totalProducts = products.length
  const lowStockCount = products.filter((p) => (p as any).stock < 10).length

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      change: "+20.1%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      change: "+12.5%",
      trend: "up",
      icon: ShoppingCart,
    },
    {
      title: "Total Products",
      value: totalProducts.toString(),
      change: `${lowStockCount} low stock`,
      trend: lowStockCount > 0 ? "down" : "up",
      icon: Package,
    },
  ]

  const recentOrders = orders.slice(0, 5)

  const lowStockProducts = products.filter((p) => (p as any).stock < 10).slice(0, 3)

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-serif text-balance">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back, monitor your store performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Orders and Low Stock */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No orders yet</p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.id} • {order.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.total.toFixed(2)}</p>
                        <p
                          className={`text-xs ${order.status === "Completed"
                              ? "text-green-500"
                              : order.status === "Processing"
                                ? "text-blue-500"
                                : order.status === "Shipped"
                                  ? "text-purple-500"
                                  : "text-orange-500"
                            }`}
                        >
                          {order.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Alert</CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">All products in stock</p>
              ) : (
                <div className="space-y-4">
                  {lowStockProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-orange-500">{product.stock} units</p>
                        <p className="text-xs text-muted-foreground">Low stock</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
