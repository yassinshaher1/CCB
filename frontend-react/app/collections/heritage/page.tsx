import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ProductCard } from "@/components/product-card"

const heritageProducts = [
  {
    id: 1,
    name: "Heritage Navy Blazer",
    price: 399,
    image: "/classic-navy-blazer-vintage-style.jpg",
    description: "Timeless elegance with traditional tailoring",
  },
  {
    id: 2,
    name: "Classic Trench Coat",
    price: 449,
    image: "/beige-trench-coat-classic.jpg",
    description: "Inspired by 1940s Connecticut style",
  },
  {
    id: 3,
    name: "Vintage Wool Vest",
    price: 189,
    image: "/wool-vest-vintage-brown.jpg",
    description: "Heritage craftsmanship meets modern comfort",
  },
  {
    id: 4,
    name: "Traditional Oxford Shirt",
    price: 119,
    image: "/white-oxford-shirt-classic.jpg",
    description: "Premium cotton with button-down collar",
  },
  {
    id: 5,
    name: "Leather Brogues",
    price: 299,
    image: "/brown-leather-brogue-shoes.jpg",
    description: "Handcrafted leather with Goodyear welting",
  },
  {
    id: 6,
    name: "Heritage Tie Collection",
    price: 89,
    image: "/silk-tie-navy-pattern.jpg",
    description: "Pure silk with traditional patterns",
  },
]

export default function HeritageCollectionPage() {
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
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">Heritage Collection</h1>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              Classic pieces inspired by Connecticut&apos;s timeless style. Est. 1881
            </p>
          </div>
        </div>
      </section>

      {/* Collection Description */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Our Heritage Collection celebrates over 140 years of American craftsmanship. Each piece is designed to
              honor traditional tailoring techniques while incorporating modern comfort and durability. These are the
              clothes that define timeless elegance.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {heritageProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
