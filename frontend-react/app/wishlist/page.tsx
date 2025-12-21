import type { Metadata } from "next"
import WishlistClient from "./WishlistClient"

export const metadata: Metadata = {
  title: "Wishlist | CCB - Connecticut Clothing Brand",
  description: "Your saved fashion items and favorites",
}

export default function WishlistPage() {
  return <WishlistClient />
}
