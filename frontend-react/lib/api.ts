// API calls go through Next.js rewrites (see next.config.mjs)
// This allows the frontend server to proxy to internal K8s services
const BASE_URL = "/api";

export const api = {
    async signup(type: 'user' | 'admin', data: any) {
        const res = await fetch(`${BASE_URL}/auth/signup/${type}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || "Signup failed");
        }
        return res.json();
    },

    async login(data: any) {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || "Login failed");
        }
        return res.json();
    },

    async getProfile(token: string) {
        const res = await fetch(`${BASE_URL}/profile/me`, {
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
    },

    async updateProfile(token: string, data: {
        name?: string;
        phone?: string;
        address?: string;
        city?: string;
        state?: string;
        zip?: string;
    }) {
        const res = await fetch(`${BASE_URL}/profile/me`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || "Failed to update profile");
        }
        return res.json();
    }
};
