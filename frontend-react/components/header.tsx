"use client"

import Link from "next/link"
import { ShoppingCart, Heart, User, Menu, Search, LogOut, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Image from "next/image"
import { useStore } from "@/lib/store-context"
import { useAuth } from "@/lib/auth-context"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout, isAdmin, isAuthenticated } = useAuth()
  
  // --- CONNECT TO STORE (Get Cart & Wishlist) ---
  const { cart, wishlist } = useStore() as any

  // Calculate Counts
  const cartItemsCount = cart.reduce((sum: number, item: any) => sum + item.quantity, 0)
  const wishlistCount = wishlist.length

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/image.png" alt="CCB Logo" width={40} height={40} className="h-10 w-10" />
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-primary">CCB</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Est. 1881</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/shop" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Shop
            </Link>
            <Link
              href="/collections"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Collections
            </Link>
            <Link href="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              About
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            {isAdmin && (
              <Link href="/admin">
                <Button variant="ghost" size="icon" title="Admin Dashboard">
                  <Shield className="h-5 w-5 text-accent" />
                </Button>
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link href="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={logout} title="Logout">
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* --- WISHLIST BUTTON (Updated with Badge) --- */}
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* --- CART BUTTON --- */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-[10px] font-medium text-accent-foreground flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/shop" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Shop
              </Link>
              <Link
                href="/collections"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Collections
              </Link>
              <Link href="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                About
              </Link>
              {isAdmin && (
                <Link href="/admin" className="text-sm font-medium text-accent hover:text-accent/80 transition-colors">
                  Admin Dashboard
                </Link>
              )}
              {isAuthenticated && (
                <button
                  onClick={logout}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors text-left"
                >
                  Logout
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}