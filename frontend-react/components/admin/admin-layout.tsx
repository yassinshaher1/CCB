"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, ShoppingCart, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <div className="min-h-screen flex bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/images/image.png" alt="CCB Logo" width={40} height={40} />
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold text-primary">CCB Admin</span>
              <span className="text-xs text-muted-foreground">Management Panel</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 ${isActive ? "bg-primary/10 text-primary" : ""}`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-border space-y-2">
          <Link href="/">
            <Button variant="outline" className="w-full justify-start gap-3 bg-transparent">
              <Home className="h-5 w-5" />
              Back to Store
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start gap-3 text-destructive" onClick={logout}>
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 max-w-7xl">{children}</div>
      </main>
    </div>
  )
}
