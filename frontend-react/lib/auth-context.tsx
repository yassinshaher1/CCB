"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  email: string
  name: string
  isAdmin: boolean
  phone?: string
  address?: string
  city?: string
  state?: string
  zip?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<User | null>
  logout: () => void
  updateUser: (updates: Partial<User>) => Promise<boolean>
  isAdmin: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Admin credentials for demo
const ADMIN_EMAIL = "admin@ccb.com"
const ADMIN_PASSWORD = "admin123"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()

  // Load user and token from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("ccb-user")
    const savedToken = localStorage.getItem("ccb-token")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    if (savedToken) {
      setToken(savedToken)
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

      const authUser: User = {
        email,
        name: profile.name,
        isAdmin: data.role === "admin",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        zip: profile.zip || "",
      };

      setUser(authUser);
      setToken(data.access_token);
      localStorage.setItem("ccb-token", data.access_token);
      return authUser;
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    }
  }

  const updateUser = async (updates: Partial<User>): Promise<boolean> => {
    try {
      const token = localStorage.getItem("ccb-token");
      if (!token) throw new Error("Not authenticated");

      const { api } = await import("./api");
      await api.updateProfile(token, {
        name: updates.name,
        phone: updates.phone,
        address: updates.address,
        city: updates.city,
        state: updates.state,
        zip: updates.zip,
      });

      // Update local user state
      setUser((prev) => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (error) {
      console.error("Update profile failed:", error);
      return false;
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("ccb-user")
    localStorage.removeItem("ccb-token")
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser,
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

