"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ProductCard } from "@/components/product-card"
import { useState, useEffect } from "react"

export default function AccessoriesCollectionPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch products from API
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setProducts([])
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-block mb-2">
              <Image src="/images/image.png" alt="CCB Seal" width={60} height={60} className="mx-auto" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">Accessories Collection</h1>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              The finishing touches that define your style
            </p>
          </div>
        </div>
      </section>

      {/* Collection Description */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Our Accessories Collection features carefully curated pieces that complete any outfit. From premium
              leather goods to refined jewelry, each item is selected for its quality, functionality, and timeless
              appeal.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No products available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {products.filter(p => p.categoryId === "accessories").map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="font-serif text-3xl font-bold">Explore More Collections</h2>
            <p className="text-muted-foreground">Discover our other curated collections</p>
            <div className="flex gap-4 justify-center pt-4">
              <Button asChild>
                <Link href="/collections">All Collections</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/shop">Shop All</Link>
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
