"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Search, Edit, Trash2, Package } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Product } from "@/lib/store-context"

export default function ProductsPage() {
  const { isAdmin, isAuthenticated } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: "",
    stock: "",
  })

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/login")
      return
    }

    // Load products from localStorage
    const savedProducts = localStorage.getItem("ccb-admin-products")
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      // Initialize with sample products
      const initialProducts = [
        {
          id: 1,
          name: "Navy Blazer",
          price: 299.99,
          category: "Outerwear",
          description: "Classic navy blazer with UConn heritage styling",
          image: "/navy-blazer.png",
          stock: 15,
        },
        {
          id: 2,
          name: "White Oxford Shirt",
          price: 89.99,
          category: "Shirts",
          description: "Crisp white oxford shirt with button-down collar",
          image: "/white-oxford-shirt.png",
          stock: 25,
        },
        {
          id: 3,
          name: "Khaki Chinos",
          price: 119.99,
          category: "Pants",
          description: "Comfortable khaki chinos with classic fit",
          image: "/khaki-chinos.jpg",
          stock: 30,
        },
      ]
      setProducts(initialProducts as Product[])
      localStorage.setItem("ccb-admin-products", JSON.stringify(initialProducts))
    }
  }, [isAuthenticated, isAdmin, router])

  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts)
    localStorage.setItem("ccb-admin-products", JSON.stringify(updatedProducts))
  }

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: product.category || "",
        description: product.description || "",
        image: product.image,
        stock: (product as any).stock?.toString() || "0",
      })
    } else {
      setEditingProduct(null)
      setFormData({ name: "", price: "", category: "", description: "", image: "", stock: "" })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.price) return

    const productData = {
      id: editingProduct?.id || Date.now(),
      name: formData.name,
      price: Number.parseFloat(formData.price),
      category: formData.category,
      description: formData.description,
      image: formData.image || "/diverse-clothing-rack.png",
      stock: Number.parseInt(formData.stock) || 0,
    }

    if (editingProduct) {
      const updated = products.map((p) => (p.id === editingProduct.id ? productData : p))
      saveProducts(updated as Product[])
    } else {
      saveProducts([...products, productData] as Product[])
    }

    setIsDialogOpen(false)
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const updated = products.filter((p) => p.id !== id)
      saveProducts(updated)
    }
  }

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  if (!isAdmin) return null

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-serif text-balance">Product Management</h1>
            <p className="text-muted-foreground">Manage your inventory and product catalog</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Product</th>
                    <th className="text-left p-4 font-medium">Category</th>
                    <th className="text-left p-4 font-medium">Price</th>
                    <th className="text-left p-4 font-medium">Stock</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center p-8">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No products found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b last:border-0">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-12 h-12 rounded object-cover bg-muted"
                            />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{product.category}</td>
                        <td className="p-4 font-medium">${product.price.toFixed(2)}</td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              (product as any).stock > 10
                                ? "bg-green-100 text-green-800"
                                : (product as any).stock > 0
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {(product as any).stock || 0} units
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {editingProduct ? "Update product details and inventory" : "Add a new product to your catalog"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Navy Blazer"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="299.99"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="15"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Outerwear"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Classic navy blazer with UConn heritage styling"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/navy-blazer.png"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{editingProduct ? "Update" : "Add"} Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
