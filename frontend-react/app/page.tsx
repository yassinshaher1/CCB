import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { ArrowRight, ShoppingBag, Award, Truck } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-block mb-4">
              <Image src="/images/image.png" alt="CCB Seal" width={80} height={80} className="mx-auto" />
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-balance">
              Connecticut Clothing Brand
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 text-balance leading-relaxed">
              {"Premium fashion rooted in heritage. Established 1881."}
            </p>
            <div className="flex gap-4 justify-center pt-6">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/shop">
                  Shop Collection <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link href="/about">Our Story</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground text-lg">Discover timeless pieces for every occasion</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/shop?category=mens"
              className="group relative overflow-hidden rounded-lg bg-card border hover:shadow-lg transition-all"
            >
              <div className="aspect-[3/4] bg-muted relative">
                <Image
                  src="/elegant-mens-fashion-clothing.jpg"
                  alt="Men's Collection"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-serif text-2xl font-semibold mb-2">{"Men's Collection"}</h3>
                <p className="text-sm text-muted-foreground">Classic and contemporary styles</p>
              </div>
            </Link>
            <Link
              href="/shop?category=womens"
              className="group relative overflow-hidden rounded-lg bg-card border hover:shadow-lg transition-all"
            >
              <div className="aspect-[3/4] bg-muted relative">
                <Image
                  src="/elegant-womens-fashion-clothing.jpg"
                  alt="Women's Collection"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-serif text-2xl font-semibold mb-2">{"Women's Collection"}</h3>
                <p className="text-sm text-muted-foreground">Sophisticated and elegant designs</p>
              </div>
            </Link>
            <Link
              href="/shop?category=accessories"
              className="group relative overflow-hidden rounded-lg bg-card border hover:shadow-lg transition-all"
            >
              <div className="aspect-[3/4] bg-muted relative">
                <Image
                  src="/fashion-accessories-scarves-bags.jpg"
                  alt="Accessories"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-serif text-2xl font-semibold mb-2">Accessories</h3>
                <p className="text-sm text-muted-foreground">Complete your look</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-2">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Premium Quality</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Crafted with the finest materials for lasting elegance
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-2">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Free Shipping</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Complimentary delivery on all orders over $100
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-2">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Easy Returns</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                30-day hassle-free returns for your peace of mind
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-balance">Join the CCB Community</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Create an account to access exclusive collections, save your favorites, and enjoy personalized shopping
              experiences.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button size="lg" asChild>
                <Link href="/signup">Create Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image src="/images/image.png" alt="CCB Logo" width={32} height={32} />
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold text-primary">CCB</span>
                <span className="text-xs text-muted-foreground">Est. 1881</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 Connecticut Clothing Brand. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
