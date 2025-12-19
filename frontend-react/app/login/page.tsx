import type { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Sign In | CCB - Connecticut Clothing Brand",
  description: "Sign in to your CCB account",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-4">
            <Link href="/" className="inline-flex flex-col items-center gap-3">
              <Image src="/images/image.png" alt="CCB Logo" width={64} height={64} />
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold text-primary">CCB</span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Connecticut Clothing Brand
                </span>
              </div>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight pt-4">Welcome back</h1>
            <p className="text-muted-foreground">Enter your credentials to access your account</p>
          </div>

          <LoginForm />

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden lg:flex flex-1 bg-primary text-primary-foreground items-center justify-center p-12">
        <div className="max-w-md space-y-4 text-center">
          <h2 className="font-serif text-4xl font-bold text-balance">Continue Your Style Journey</h2>
          <p className="text-lg text-primary-foreground/90 text-balance">
            Access your wishlist, orders, and exclusive collections
          </p>
        </div>
      </div>
    </div>
  )
}
