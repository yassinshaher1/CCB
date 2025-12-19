import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ProductCard } from "@/components/product-card"

const formalProducts = [
  {
    id: 31,
    name: "Premium Tuxedo",
    price: 899,
    image: "/placeholder.svg?height=500&width=400",
    description: "Elegant Italian wool for special occasions",
  },
  {
    id: 32,
    name: "Formal Dress Shirt",
    price: 149,
    image: "/placeholder.svg?height=400&width=300",
    description: "Crisp cotton with French cuffs",
  },
  {
    id: 33,
    name: "Silk Bow Tie",
    price: 79,
    image: "/placeholder.svg?height=500&width=400",
    description: "Hand-tied pure silk",
  },
  {
    id: 34,
    name: "Evening Gown",
    price: 749,
    image: "/placeholder.svg?height=500&width=400",
    description: "Sophisticated silhouette in luxe fabric",
  },
  {
    id: 35,
    name: "Patent Leather Oxfords",
    price: 349,
    image: "/placeholder.svg?height=500&width=400",
    description: "Polished perfection for formal events",
  },
  {
    id: 36,
    name: "Cufflinks Set",
    price: 159,
    image: "/placeholder.svg?height=500&width=400",
    description: "Sterling silver with navy enamel",
  },
]

export default function FormalCollectionPage() {
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
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">Formal Collection</h1>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              Exceptional elegance for life&apos;s most important moments
            </p>
          </div>
        </div>
      </section>

      {/* Collection Description */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Our Formal Collection represents the pinnacle of sophisticated dressing. From black-tie galas to wedding
              celebrations, these meticulously crafted pieces ensure you make a lasting impression at every special
              occasion.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {formalProducts.map((product) => (
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
