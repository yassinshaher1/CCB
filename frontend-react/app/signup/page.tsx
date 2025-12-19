import type { Metadata } from "next"
import Link from "next/link"
import { SignupForm } from "@/components/auth/signup-form"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Sign Up | CCB - Connecticut Clothing Brand",
  description: "Create your CCB account",
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero */}
      <div className="hidden lg:flex flex-1 bg-primary text-primary-foreground items-center justify-center p-12">
        <div className="max-w-md space-y-4 text-center">
          <h2 className="font-serif text-4xl font-bold text-balance">Join the CCB Community</h2>
          <p className="text-lg text-primary-foreground/90 text-balance">
            Discover premium fashion rooted in Connecticut heritage since 1881
          </p>
        </div>
      </div>

      {/* Right side - Form */}
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
            <h1 className="text-3xl font-bold tracking-tight pt-4">Create an account</h1>
            <p className="text-muted-foreground">Enter your details to get started</p>
          </div>

          <SignupForm />

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
