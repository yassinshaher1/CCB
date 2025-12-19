"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Product {
  id: number
  name: string
  price: number
  image: string
  category?: string
  description?: string
}

export interface CartItem extends Product {
  quantity: number
  size: string
  color: string
}

interface StoreContextType {
  cart: CartItem[]
  wishlist: Product[]
  addToCart: (product: Product, size: string, color: string) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, change: number) => void
  addToWishlist: (product: Product) => void
  removeFromWishlist: (id: number) => void
  clearCart: () => void
  isInWishlist: (id: number) => boolean
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

  const addToCart = (product: Product, size: string, color: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.size === size && item.color === color)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }
      return [...prev, { ...product, quantity: 1, size, color }]
    })
  }

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, change: number) => {
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

  const removeFromWishlist = (id: number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCart([])
  }

  const isInWishlist = (id: number) => {
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
