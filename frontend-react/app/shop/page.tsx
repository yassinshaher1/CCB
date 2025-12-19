"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"

const products = [
  {
    id: 1,
    name: "Classic Navy Blazer",
    price: 299,
    category: "mens",
    image: "/navy-blazer.png",
    badge: "Bestseller",
  },
  {
    id: 2,
    name: "White Oxford Shirt",
    price: 89,
    category: "mens",
    image: "/white-oxford-shirt.png",
  },
  {
    id: 3,
    name: "Premium Khaki Chinos",
    price: 129,
    category: "mens",
    image: "/khaki-chinos.jpg",
  },
  {
    id: 4,
    name: "Cashmere Sweater",
    price: 249,
    category: "womens",
    image: "/navy-cashmere-sweater.jpg",
    badge: "New",
  },
  {
    id: 5,
    name: "Leather Belt",
    price: 79,
    category: "accessories",
    image: "/brown-leather-belt.png",
  },
  {
    id: 6,
    name: "Silk Scarf",
    price: 95,
    category: "accessories",
    image: "/silk-scarf-navy-white.png",
  },
  {
    id: 7,
    name: "Tailored Dress Pants",
    price: 159,
    category: "mens",
    image: "/navy-dress-pants.jpg",
  },
  {
    id: 8,
    name: "Elegant Midi Dress",
    price: 189,
    category: "womens",
    image: "/elegant-navy-midi-dress.jpg",
  },
  {
    id: 9,
    name: "Cotton Polo Shirt",
    price: 69,
    category: "mens",
    image: "/white-polo-shirt.png",
  },
  {
    id: 10,
    name: "Wool Coat",
    price: 399,
    category: "womens",
    image: "/navy-wool-coat.jpg",
    badge: "Premium",
  },
  {
    id: 11,
    name: "Leather Handbag",
    price: 299,
    category: "accessories",
    image: "/brown-leather-handbag.jpg",
  },
  {
    id: 12,
    name: "Designer Sunglasses",
    price: 149,
    category: "accessories",
    image: "/classic-sunglasses.png",
  },
]

export default function ShopPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams?.get("category")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam])

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((p) => p.category === selectedCategory)

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

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
          >
            All Products
          </Button>
          <Button
            variant={selectedCategory === "mens" ? "default" : "outline"}
            onClick={() => setSelectedCategory("mens")}
          >
            Men&apos;s
          </Button>
          <Button
            variant={selectedCategory === "womens" ? "default" : "outline"}
            onClick={() => setSelectedCategory("womens")}
          >
            Women&apos;s
          </Button>
          <Button
            variant={selectedCategory === "accessories" ? "default" : "outline"}
            onClick={() => setSelectedCategory("accessories")}
          >
            Accessories
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

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
