"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// --- UPDATED INTERFACES (Allow ID to be string or number to match backend) ---
export interface Product {
  id: number | string
  name: string
  price: number
  image: string
  category?: string
  description?: string
}

export interface CartItem extends Product {
  quantity: number
  size?: string   // Made optional for simple products
  color?: string  // Made optional for simple products
}

interface StoreContextType {
  cart: CartItem[]
  wishlist: Product[]
  addToCart: (product: Product, size?: string, color?: string) => void
  removeFromCart: (id: number | string) => void
  updateQuantity: (id: number | string, change: number) => void
  addToWishlist: (product: Product) => void
  removeFromWishlist: (id: number | string) => void
  clearCart: () => void
  isInWishlist: (id: number | string) => boolean
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<Product[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("ccb-cart")
    const savedWishlist = localStorage.getItem("ccb-wishlist")
    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
  }, [])

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("ccb-cart", JSON.stringify(cart))
  }, [cart])

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem("ccb-wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  // --- UPDATED ADD TO CART ---
  const addToCart = (product: Product, size: string = "Default", color: string = "Default") => {
    setCart((prev) => {
      // Check if exact item exists
      const existing = prev.find((item) => item.id === product.id)
      
      if (existing) {
        // If exists, just increase quantity
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      // If new, add to cart
      return [...prev, { ...product, quantity: 1, size, color }]
    })
  }

  // --- FIXED REMOVE FUNCTION (The logic you wanted) ---
  const removeFromCart = (id: number | string) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === id);

      // If quantity is more than 1, just decrease it
      if (existingItem && existingItem.quantity > 1) {
         return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }

      // If quantity is 1, remove it completely
      return prev.filter((item) => item.id !== id);
    })
  }

  const updateQuantity = (id: number | string, change: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item)),
    )
  }

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.find((item) => item.id === product.id)) return prev
      return [...prev, product]
    })
  }

  const removeFromWishlist = (id: number | string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCart([])
  }

  const isInWishlist = (id: number | string) => {
    return wishlist.some((item) => item.id === id)
  }

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        addToWishlist,
        removeFromWishlist,
        clearCart,
        isInWishlist,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error("useStore must be used within StoreProvider")
  return context
}