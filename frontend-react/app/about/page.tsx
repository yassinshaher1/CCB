import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Award, Heart, Users, MapPin } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-block mb-4">
              <Image src="/images/image.png" alt="CCB Seal" width={100} height={100} className="mx-auto" />
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight text-balance">Our Story</h1>
            <p className="text-xl text-primary-foreground/90 leading-relaxed text-balance">
              Heritage meets modern elegance. Established in 1881.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl font-bold">Connecticut Clothing Brand</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Founded in 1881, Connecticut Clothing Brand has been a cornerstone of American fashion for over a
                century. What began as a small tailoring workshop in Hartford has evolved into a premier fashion house
                known for timeless elegance and exceptional craftsmanship.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our commitment to quality, heritage, and innovation continues to define who we are. Every piece we
                create tells a story of Connecticut&apos;s rich history and our dedication to sustainable, ethical
                fashion.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 pt-8">
              <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                <Image
                  src="/historic-connecticut-tailoring-workshop.jpg"
                  alt="Historic Workshop"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                <Image
                  src="/modern-fashion-atelier-connecticut.jpg"
                  alt="Modern Atelier"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles that guide everything we create
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-2">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-xl">Craftsmanship</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every stitch, every detail, crafted with precision and care by skilled artisans.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-2">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-xl">Sustainability</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Committed to ethical practices and eco-friendly materials for a better tomorrow.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-2">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-xl">Community</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Building lasting relationships with our customers and supporting local communities.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-2">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-xl">Heritage</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Honoring Connecticut&apos;s rich history while embracing modern innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 bg-primary text-primary-foreground rounded-2xl p-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-balance">Experience CCB</h2>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              Discover our collections and become part of a legacy that spans generations.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/shop">Shop Now</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link href="/collections">View Collections</Link>
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
