import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { StoreProvider } from "@/lib/store-context"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "CCB - Connecticut Clothing Brand",
  description: "Premium fashion and clothing inspired by Connecticut heritage since 1881",
  generator: "v0.app",
  icons: {
    icon: "/images/image.png",
    apple: "/images/image.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <AuthProvider>
          <StoreProvider>{children}</StoreProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
