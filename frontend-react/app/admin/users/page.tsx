"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Users, Shield, RefreshCw, Ban, CheckCircle, Trash2, Edit } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const API_URL = "/api"

interface User {
    id: string
    email: string
    name: string
    phone?: string
    role: string
    status: string
    createdAt: string
    lastLoginAt?: string
}

export default function UsersPage() {
    const { isAdmin, isAuthenticated, isLoading, token } = useAuth()
    const router = useRouter()
    const [users, setUsers] = useState<User[]>([])
    const [admins, setAdmins] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState<"users" | "admins">("users")

    // Edit dialog state
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [editFormData, setEditFormData] = useState({
        name: "",
        phone: "",
        status: "active",
    })

    const fetchUsers = async () => {
        if (!token) return
        setLoading(true)
        try {
            const headers = { Authorization: `Bearer ${token}` }

            const [usersRes, adminsRes] = await Promise.all([
                fetch(`${API_URL}/users`, { headers }),
                fetch(`${API_URL}/users/admins`, { headers }),
            ])

            const usersData = await usersRes.json()
            const adminsData = await adminsRes.json()

            setUsers(Array.isArray(usersData) ? usersData : [])
            setAdmins(Array.isArray(adminsData) ? adminsData : [])
        } catch (err) {
            console.error("Failed to fetch users:", err)
        }
        setLoading(false)
    }

    useEffect(() => {
        // Wait for auth to finish loading before checking auth status
        if (isLoading) return

        if (!isAuthenticated || !isAdmin) {
            router.push("/login")
            return
        }
        fetchUsers()
    }, [isLoading, isAuthenticated, isAdmin, router, token])

    const handleOpenEditDialog = (user: User) => {
        setEditingUser(user)
        setEditFormData({
            name: user.name || "",
            phone: user.phone || "",
            status: user.status || "active",
        })
        setIsEditDialogOpen(true)
    }

    const handleEditSubmit = async () => {
        if (!token || !editingUser) return
        try {
            const params = new URLSearchParams()
            if (editFormData.name) params.append("name", editFormData.name)
            if (editFormData.phone) params.append("phone", editFormData.phone)
            if (editFormData.status) params.append("status", editFormData.status)

            await fetch(`${API_URL}/users/${editingUser.id}?${params.toString()}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            })
            await fetchUsers()
            setIsEditDialogOpen(false)
        } catch (err) {
            console.error("Failed to update user:", err)
            alert("Failed to update user")
        }
    }

    const handleStatusChange = async (userId: string, newStatus: string) => {
        if (!token) return
        try {
            await fetch(`${API_URL}/users/${userId}/status?status=${newStatus}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            })
            await fetchUsers()
        } catch (err) {
            console.error("Failed to update status:", err)
            alert("Failed to update user status")
        }
    }

    const handleDelete = async (userId: string) => {
        if (!token || !confirm("Are you sure you want to delete this user?")) return
        try {
            await fetch(`${API_URL}/users/${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            })
            await fetchUsers()
        } catch (err) {
            console.error("Failed to delete user:", err)
            alert("Failed to delete user")
        }
    }

    const displayData = activeTab === "users" ? users : admins
    const filteredData = displayData.filter((user) => {
        const query = searchQuery.toLowerCase()
        return (
            user.name?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query) ||
            user.role?.toLowerCase().includes(query) ||
            user.status?.toLowerCase().includes(query)
        )
    })

    if (!isAdmin) return null

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold font-serif">User Management</h1>
                        <p className="text-muted-foreground">Manage users and administrators</p>
                    </div>
                    <Button variant="outline" onClick={fetchUsers} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                    <Button
                        variant={activeTab === "users" ? "default" : "outline"}
                        onClick={() => setActiveTab("users")}
                        className="gap-2"
                    >
                        <Users className="h-4 w-4" />
                        Users ({users.length})
                    </Button>
                    <Button
                        variant={activeTab === "admins" ? "default" : "outline"}
                        onClick={() => setActiveTab("admins")}
                        className="gap-2"
                    >
                        <Shield className="h-4 w-4" />
                        Admins ({admins.length})
                    </Button>
                </div>

                {/* Search */}
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, email, role, or status..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                            autoComplete="off"
                        />
                    </div>
                </div>

                {/* Users Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="flex justify-center items-center py-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead className="border-b bg-muted/50">
                                        <tr>
                                            <th className="text-left p-4 font-medium">User</th>
                                            <th className="text-left p-4 font-medium">Email</th>
                                            <th className="text-left p-4 font-medium">Role</th>
                                            <th className="text-left p-4 font-medium">Status</th>
                                            <th className="text-left p-4 font-medium">Joined</th>
                                            <th className="text-right p-4 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="text-center p-8">
                                                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                                                    <p className="text-muted-foreground">No {activeTab} found</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredData.map((user) => (
                                                <tr key={user.id} className="border-b last:border-0">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                                <span className="text-primary font-semibold">
                                                                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "?"}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">{user.name || "No name"}</p>
                                                                {user.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-muted-foreground">{user.email}</td>
                                                    <td className="p-4">
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${user.role === "admin"
                                                                ? "bg-purple-100 text-purple-800"
                                                                : "bg-blue-100 text-blue-800"
                                                                }`}
                                                        >
                                                            {user.role === "admin" ? <Shield className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <span
                                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.status === "active"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                                }`}
                                                        >
                                                            {user.status || "active"}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-muted-foreground text-sm">
                                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                title="Edit user"
                                                                onClick={() => handleOpenEditDialog(user)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            {user.status === "active" ? (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    title="Suspend user"
                                                                    onClick={() => handleStatusChange(user.id, "suspended")}
                                                                >
                                                                    <Ban className="h-4 w-4 text-orange-500" />
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    title="Activate user"
                                                                    onClick={() => handleStatusChange(user.id, "active")}
                                                                >
                                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-destructive"
                                                                title="Delete user"
                                                                onClick={() => handleDelete(user.id)}
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
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Edit User Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Update user information for {editingUser?.email}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                                id="edit-name"
                                value={editFormData.name}
                                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                placeholder="User name"
                            />
                        </div>
                        {editingUser?.role !== "admin" && (
                            <div className="grid gap-2">
                                <Label htmlFor="edit-phone">Phone</Label>
                                <Input
                                    id="edit-phone"
                                    value={editFormData.phone}
                                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                                    placeholder="Phone number"
                                />
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select
                                value={editFormData.status}
                                onValueChange={(value) => setEditFormData({ ...editFormData, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditSubmit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    )
}
