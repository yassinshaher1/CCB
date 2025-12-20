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
  login: (email: string, password: string) => Promise<User | null>
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

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const { api } = await import("./api");
      const data = await api.login({ email, password });

      const profile = await api.getProfile(data.access_token);

      const authUser = {
        email,
        name: profile.name,
        isAdmin: data.role === "admin",
      };

      setUser(authUser);
      localStorage.setItem("ccb-token", data.access_token);
      return authUser;
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("ccb-user")
    localStorage.removeItem("ccb-token")
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
