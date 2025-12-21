"use client"

import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { useStore } from "@/lib/store-context"
import type { Product } from "@/lib/store-context"

interface ProductCardProps {
  product: Product & {
    badge?: string
  }
  defaultSize?: string
  defaultColor?: string
}

export function ProductCard({ product, defaultSize = "M", defaultColor = "Navy" }: ProductCardProps) {
  const { addToCart, addToWishlist, isInWishlist } = useStore()
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const handleAddToCart = () => {
    addToCart(product, defaultSize, defaultColor)
    setIsAddingToCart(true)
    setTimeout(() => setIsAddingToCart(false), 1000)
  }

  const handleAddToWishlist = () => {
    addToWishlist(product)
  }

  const inWishlist = isInWishlist(product.id)

  return (
    <div className="group bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-all">
      <div className="relative aspect-[3/4] bg-muted overflow-hidden">
        {product.badge && (
          <div className="absolute top-3 left-3 z-10 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
            {product.badge}
          </div>
        )}
        <Image
          src={product.image || product.imageUrl || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant={inWishlist ? "default" : "secondary"}
            className="h-9 w-9 rounded-full"
            onClick={handleAddToWishlist}
          >
            <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 rounded-full"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
        {isAddingToCart && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Added to Cart!</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-2 text-balance">{product.name}</h3>
        <p className="text-lg font-bold text-primary">${product.price}</p>
        {product.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
        )}
      </div>
    </div>
  )
}
