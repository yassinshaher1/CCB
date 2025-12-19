import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Our Collections</h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
            Explore our curated collections of timeless fashion pieces inspired by Connecticut heritage
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Heritage Collection */}
            <Link
              href="/collections/heritage"
              className="group relative overflow-hidden rounded-lg border hover:shadow-xl transition-all"
            >
              <div className="aspect-[4/3] relative bg-muted">
                <Image
                  src="/navy-blazer.png"
                  alt="Heritage Collection"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <Badge className="mb-2 bg-accent text-accent-foreground">New Collection</Badge>
                  <h2 className="font-serif text-3xl font-bold mb-2">Heritage Collection</h2>
                  <p className="text-white/90 mb-3">Classic pieces rooted in tradition</p>
                  <Button variant="secondary" size="sm">
                    Shop Now
                  </Button>
                </div>
              </div>
            </Link>

            {/* Modern Essentials */}
            <Link
              href="/collections/modern"
              className="group relative overflow-hidden rounded-lg border hover:shadow-xl transition-all"
            >
              <div className="aspect-[4/3] relative bg-muted">
                <Image
                  src="/white-oxford-shirt.png"
                  alt="Modern Essentials"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <Badge className="mb-2 bg-accent text-accent-foreground">Bestsellers</Badge>
                  <h2 className="font-serif text-3xl font-bold mb-2">Modern Essentials</h2>
                  <p className="text-white/90 mb-3">Contemporary wardrobe staples</p>
                  <Button variant="secondary" size="sm">
                    Shop Now
                  </Button>
                </div>
              </div>
            </Link>
          </div>

          {/* Additional Collections */}
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/collections/casual"
              className="group relative overflow-hidden rounded-lg border hover:shadow-lg transition-all bg-card"
            >
              <div className="aspect-square relative bg-muted">
                <Image
                  src="/khaki-chinos.jpg"
                  alt="Casual Wear"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-semibold mb-2">Casual Wear</h3>
                <p className="text-sm text-muted-foreground mb-3">Relaxed everyday styles</p>
                <span className="text-sm font-medium text-primary">Explore →</span>
              </div>
            </Link>

            <Link
              href="/collections/formal"
              className="group relative overflow-hidden rounded-lg border hover:shadow-lg transition-all bg-card"
            >
              <div className="aspect-square relative bg-muted">
                <Image
                  src="/navy-cashmere-sweater.jpg"
                  alt="Formal Collection"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-semibold mb-2">Formal Collection</h3>
                <p className="text-sm text-muted-foreground mb-3">Sophisticated evening wear</p>
                <span className="text-sm font-medium text-primary">Explore →</span>
              </div>
            </Link>

            <Link
              href="/collections/accessories"
              className="group relative overflow-hidden rounded-lg border hover:shadow-lg transition-all bg-card"
            >
              <div className="aspect-square relative bg-muted">
                <Image
                  src="/brown-leather-belt.png"
                  alt="Accessories"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-semibold mb-2">Accessories</h3>
                <p className="text-sm text-muted-foreground mb-3">Finishing touches</p>
                <span className="text-sm font-medium text-primary">Explore →</span>
              </div>
            </Link>
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
