"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"

export default function ShopPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams?.get("category")
  const searchQuery = searchParams?.get("search") || ""
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch products from API
  useEffect(() => {
    fetch('http://localhost:8001/products')
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

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam])

  // Filter by category and search query
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.categoryId === selectedCategory
    const matchesSearch = searchQuery === "" || p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Shop All Collections</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover premium clothing and accessories inspired by Connecticut heritage
          </p>
        </div>

        {/* All Products Header */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Button variant="default">
            All Products
          </Button>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No products found</p>
            {searchQuery && (
              <p className="text-sm text-muted-foreground mt-2">
                Try searching for something else
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-secondary/30 rounded-lg p-8 md:p-12 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Explore our curated collections or get in touch with our style consultants for personalized recommendations.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/collections">View Collections</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/about">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card py-12 mt-12">
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
