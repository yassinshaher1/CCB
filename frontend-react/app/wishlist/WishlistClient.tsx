"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, X, ShoppingCart } from "lucide-react"
import { Header } from "@/components/header"
import { useStore } from "@/lib/store-context"
import Image from "next/image"

export default function WishlistClient() {
  // Cast store to 'any' to avoid strict type errors for now
  const { wishlist, removeFromWishlist, addToCart } = useStore() as any
  const wishlistItems = wishlist || []

  const handleAddToCart = (item: any) => {
    addToCart(item) // Removed hardcoded size/color to match your simple setup
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-2">
                <Heart className="h-8 w-8 text-primary" />
                My Wishlist
              </h1>
              <p className="text-muted-foreground mt-1">{wishlistItems.length} items saved for later</p>
            </div>
            {wishlistItems.length > 0 && (
              <Button variant="outline" onClick={() => wishlistItems.forEach((item: any) => removeFromWishlist(item.id))}>
                Clear All
              </Button>
            )}
          </div>

          {/* Wishlist Grid */}
          {wishlistItems.length === 0 ? (
            <Card className="p-12">
              <div className="text-center space-y-3">
                <Heart className="h-16 w-16 mx-auto text-muted-foreground" />
                <h3 className="text-xl font-semibold">Your wishlist is empty</h3>
                <p className="text-muted-foreground">Start adding items you love to your wishlist</p>
                <Button asChild className="mt-4">
                  <Link href="/shop">Browse Collections</Link>
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item: any) => (
                <Card key={item.id} className="group overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-[3/4] bg-muted">
                      {/* --- FIX: Check for 'imageUrl' OR 'image' --- */}
                      <Image 
                        src={item.imageUrl || item.image || "/placeholder.svg"} 
                        alt={item.name} 
                        fill 
                        className="object-cover" 
                      />
                      
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-2xl font-bold">${item.price}</span>
                        </div>
                      </div>
                      <Button className="w-full" onClick={() => handleAddToCart(item)}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Summary Card */}
          {wishlistItems.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total value of wishlist items</p>
                    <p className="text-3xl font-bold">
                      ${wishlistItems.reduce((acc: number, item: any) => acc + (parseFloat(item.price) || 0), 0).toFixed(2)}
                    </p>
                  </div>
                  <Button size="lg" onClick={() => wishlistItems.forEach((item: any) => handleAddToCart(item))}>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add All to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}