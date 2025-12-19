"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  email: string
  name: string
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAdmin: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Admin credentials for demo
const ADMIN_EMAIL = "admin@ccb.com"
const ADMIN_PASSWORD = "admin123"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("ccb-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("ccb-user", JSON.stringify(user))
    } else {
      localStorage.removeItem("ccb-user")
    }
  }, [user])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Check if admin
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = {
        email: ADMIN_EMAIL,
        name: "Admin",
        isAdmin: true,
      }
      setUser(adminUser)
      return true
    }

    // Regular user login (simplified for demo)
    if (email && password) {
      const regularUser = {
        email,
        name: email.split("@")[0],
        isAdmin: false,
      }
      setUser(regularUser)
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("ccb-user")
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAdmin: user?.isAdmin ?? false,
        isAuthenticated: user !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
