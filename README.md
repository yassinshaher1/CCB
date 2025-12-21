# CCB - Connecticut Clothing Brand

A cloud-native e-commerce platform built with microservices architecture.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Frontend (Next.js)                            │
│                          http://localhost:3000                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐
│ User Profile Svc  │   │  Catalog Service  │   │  Order Service    │
│   Port: 8000      │   │    Port: 8001     │   │    Port: 8002     │
│   - Auth/Login    │   │   - Products      │   │   - Orders        │
│   - User profiles │   │   - Categories    │   │   - Checkout      │
└───────────────────┘   └───────────────────┘   └───────────────────┘
        │                           │                           │
        └───────────────────────────┴───────────────────────────┘
                                    │
                                    ▼
                        ┌───────────────────────┐
                        │    Firebase RTDB      │
                        │    (Cloud Database)   │
                        └───────────────────────┘
```

## 📁 Project Structure

```
CCB/
├── frontend-react/          # Next.js 16 frontend application
├── user-profile-service/    # FastAPI - Authentication & user profiles
├── catalog-service/         # FastAPI - Product catalog management
├── order-service/           # FastAPI - Order processing
├── cart-service/            # FastAPI - Shopping cart (WIP)
├── wishlist-service/        # FastAPI - User wishlists (WIP)
├── payment-service/         # Payment processing (WIP)
├── shared-assets/           # Shared Firebase configuration
├── k8s-manifests/           # Kubernetes deployment files
└── .venv/                   # Python virtual environment
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+** with pip
- **Node.js 18+** with npm
- **Firebase Project** with Realtime Database enabled

### 1. Clone & Setup Virtual Environment

```bash
# Clone the repository
git clone <repository-url>
cd CCB

# Create and activate virtual environment
python -m venv .venv

# Windows (PowerShell)
.\.venv\Scripts\Activate.ps1

# Windows (Command Prompt)
.\.venv\Scripts\activate.bat

# Linux/macOS
source .venv/bin/activate
```

### 2. Install Python Dependencies

```bash
# Install all service dependencies
pip install -r user-profile-service/requirements.txt
pip install -r catalog-service/requirements.txt
pip install -r order-service/requirements.txt
```

### 3. Install Frontend Dependencies

```bash
cd frontend-react
npm install
cd ..
```

### 4. Configure Firebase

Each service requires a `serviceAccountKey.json` file. Download it from:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project → Project Settings → Service Accounts
3. Click "Generate new private key"
4. Save as `serviceAccountKey.json` in each service directory

> ⚠️ **IMPORTANT**: Never commit `serviceAccountKey.json` to version control!

### 5. Start All Services

Open **4 terminal windows** and run each command:

**Terminal 1 - User Profile Service (Auth)**
```bash
cd user-profile-service
python -m uvicorn app:app --reload --port 8000
```

**Terminal 2 - Catalog Service (Products)**
```bash
cd catalog-service
python -m uvicorn app:app --reload --port 8001
```

**Terminal 3 - Order Service**
```bash
cd order-service
python -m uvicorn app:app --reload --port 8002
```

**Terminal 4 - Frontend**
```bash
cd frontend-react
npm run dev
```

### 6. Access the Application

| Service              | URL                           |
|----------------------|-------------------------------|
| 🌐 Frontend          | http://localhost:3000         |
| 👤 User Profile API  | http://localhost:8000         |
| 📦 Catalog API       | http://localhost:8001         |
| 📋 Order API         | http://localhost:8002         |

## 🔐 Demo Credentials

| Role  | Email           | Password  |
|-------|-----------------|-----------|
| Admin | admin@ccb.com   | admin123  |

## 🛠️ API Documentation

Each FastAPI service provides interactive API documentation:

- **User Service**: http://localhost:8000/docs
- **Catalog Service**: http://localhost:8001/docs
- **Order Service**: http://localhost:8002/docs

## 📝 Development Notes

### Windows PowerShell Execution Policy

If you encounter script execution errors, run PowerShell as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Or use Command Prompt (`cmd`) instead:
```cmd
npm run dev
```

### Hot Reload

All services support hot reload:
- **FastAPI**: Uses `--reload` flag with uvicorn
- **Next.js**: Built-in with Turbopack

## 🚢 Deployment

Kubernetes manifests are available in `k8s-manifests/` for container orchestration.

## 📄 License

Private - Connecticut Clothing Brand
