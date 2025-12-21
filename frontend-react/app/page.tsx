'use client';

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { ArrowRight, ShoppingBag, Plus, Trash2, Edit, Minus, Heart } from "lucide-react"
import { useEffect, useState } from "react"
import { useStore } from "@/lib/store-context"
import { useAuth } from "@/lib/auth-context"

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get actual admin status from auth context
  const { isAdmin } = useAuth();

  // --- STORE HOOKS ---
  const {
    cart,
    addToCart,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  } = useStore() as any;

  // --- FETCH PRODUCTS ---
  const fetchProducts = () => {
    setLoading(true);
    fetch('http://localhost:8001/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setProducts([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- HELPER: GET CART QUANTITY ---
  const getCartQuantity = (productId: string) => {
    if (!cart || !Array.isArray(cart)) return 0;
    const item = cart.find((item: any) => item.id === productId);
    return item ? item.quantity : 0;
  };

  // --- ADMIN FUNCTIONS ---
  const handleAdd = async () => {
    const name = prompt("Enter Product Name:");
    if (!name) return;
    const price = prompt("Enter Price:");
    const desc = prompt("Enter Description:");
    const stock = prompt("Enter Quantity in Stock:");
    const imageUrl = prompt("Enter Image URL (e.g., https://example.com/shoe.jpg):");

    const newProduct = {
      name: name,
      price: parseFloat(price || "0"),
      description: desc,
      stock: parseInt(stock || "0"),
      imageUrl: imageUrl || "",
      categoryId: "general"
    };

    await fetch('http://localhost:8001/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    await fetch(`http://localhost:8001/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const handleEdit = async (product: any) => {
    const newName = prompt("Edit Name:", product.name);
    if (newName === null) return;

    const newPrice = prompt("Edit Price:", product.price);
    const newDesc = prompt("Edit Description:", product.description);
    const newStock = prompt("Edit Stock:", product.stock);
    const newImage = prompt("Edit Image URL:", product.imageUrl);

    const updatedProduct = {
      ...product,
      name: newName,
      price: parseFloat(newPrice || "0"),
      description: newDesc,
      stock: parseInt(newStock || "0"),
      imageUrl: newImage
    };

    await fetch(`http://localhost:8001/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct)
    });
    fetchProducts();
  };

  const toggleWishlist = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-balance">
              Connecticut Clothing Brand
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 text-balance leading-relaxed">
              {"Premium fashion rooted in heritage. Established 1881."}
            </p>
          </div>
        </div>
      </section>

      {/* Live Catalog */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Best Sellers</h2>
              <p className="text-muted-foreground text-lg">Our most popular items this season</p>
            </div>
            {isAdmin && (
              <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            )}
          </div>

          {!loading && (
            <div className="grid md:grid-cols-3 gap-6">
              {products.map((product: any) => {
                const quantityInCart = getCartQuantity(product.id);
                const currentStock = product.stock - quantityInCart;
                const isLiked = isInWishlist(product.id);

                return (
                  <div key={product.id || Math.random()} className="group relative border rounded-lg p-6 hover:shadow-lg transition">

                    {/* --- HEART BUTTON (Now Top Right) --- */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white rounded-full shadow-sm"
                      onClick={() => toggleWishlist(product)}
                    >
                      <Heart
                        className={`h-5 w-5 transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
                          }`}
                      />
                    </Button>

                    {/* --- ADMIN CONTROLS (Moved to Top Left) --- */}
                    {isAdmin && (
                      <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <Button size="icon" variant="outline" className="h-8 w-8 text-blue-600 bg-white" onClick={() => handleEdit(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 hover:bg-red-50 bg-white" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {/* Image */}
                    {product.imageUrl && (
                      <div className="relative w-full h-48 mb-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                    )}

                    <h3 className="text-2xl font-semibold pr-16">{product.name}</h3>
                    <p className="text-lg font-bold text-primary mt-2">${product.price}</p>
                    <p className="text-gray-500 mt-2">{product.description}</p>

                    <div className="mt-4 text-sm font-medium">
                      {currentStock > 0 ? (
                        <span className="text-gray-500">In Stock: {currentStock}</span>
                      ) : (
                        <span className="text-red-600">Out of Stock</span>
                      )}
                    </div>

                    {/* DYNAMIC BUTTONS */}
                    <div className="mt-4">
                      {quantityInCart > 0 ? (
                        <div className="flex items-center gap-3 w-full">
                          <Button size="icon" variant="outline" onClick={() => removeFromCart(product.id)}>
                            <Minus className="h-4 w-4" />
                          </Button>

                          <span className="font-bold text-lg flex-1 text-center">{quantityInCart} in Cart</span>

                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => addToCart(product)}
                            disabled={currentStock <= 0}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => addToCart(product)}
                          disabled={currentStock <= 0}
                        >
                          Add to Cart
                        </Button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12 text-center">
        <p className="text-sm text-muted-foreground">© 2025 Connecticut Clothing Brand.</p>
      </footer>
    </div>
  )
}