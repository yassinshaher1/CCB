# CCB Project - Infrastructure & State Reference

**Last Updated:** December 22, 2025  
**Repository:** `https://github.com/yassinshaher1/CCB`

---

## Server Infrastructure

| Property | Value |
|----------|-------|
| Hostname | `ratatosk` |
| OS | Ubuntu Server (Headless) |
| RAM | ~2GB |
| Privileged User | `yassin` (sudo) |
| Collaborator | `guestuser` (limited) |
| Shared Workspace | `/opt/ccb-project` |
| Group | `devteam` (setgid enabled) |

### Network Access

1. **Twingate** - VPN-like SSH access via Docker connector
2. **Cloudflare Quick Tunnel** - Ephemeral HTTP exposure (`trycloudflare.com`)
   - Must be restarted after each session/reboot

---

## Kubernetes (KinD)

| Property | Value |
|----------|-------|
| Cluster Name | `kind` |
| Version | v1.27.3 |
| Memory Config | `system-reserved=256Mi`, `eviction-hard=100Mi` |

> ⚠️ **CAUTION:** Do NOT run heavy stacks (Istio/Kafka) - server will crash.

### Installed Components
- **NGINX Ingress Controller** (`ingress-nginx` namespace)
- **ArgoCD** (`argocd` namespace, `server.insecure: "true"`)

---

## Application Architecture

### Microservices

| Service | Stack | Port | Status |
|---------|-------|------|--------|
| catalog-service | Python FastAPI | 8001 | ✅ Ready |
| order-service | Python FastAPI | 8002 | ✅ Ready |
| cart-service | Python FastAPI | TBD | ❌ Empty |
| wishlist-service | Python FastAPI | TBD | ❌ Empty |
| payment-service | Python Script | - | ✅ Ready |
| user-profile-service | Python FastAPI | 8000 | ✅ Ready |
| frontend-react | React (Next.js) | 3000 | ✅ Ready |

### Event-Driven Pattern

```
Order Service → Firestore (PENDING) → Payment Service (listener) → Update to PAID
```

- Uses **Firebase Realtime Database listeners** (`onSnapshot`) instead of Kafka/RabbitMQ
- Secret: `serviceAccountKey.json` mounted as K8s Secret `firebase-key`

---

## GitOps State

- **Strategy:** Monorepo (code in `service-name/`, manifests in `k8s-manifests/`)
- **ArgoCD App:** `ccb-infrastructure`
- **Source:** `k8s-manifests/` on `main` branch
- **Sync Policy:** Automatic + Self-Heal

---

## Daily Startup Routine

```bash
# 1. Kill stale processes
sudo killall kubectl cloudflared

# 2. Re-establish ArgoCD Bridge
nohup kubectl port-forward svc/argocd-server -n argocd 8080:80 --address 0.0.0.0 > /dev/null 2>&1 &

# 3. Wait for pod ready
kubectl wait --for=condition=Ready pod -l app.kubernetes.io/name=argocd-server -n argocd --timeout=60s

# 4. Start Cloudflare Tunnel
nohup cloudflared tunnel --url http://localhost:8080 > tunnel.log 2>&1 &

# 5. Get public URL
grep "trycloudflare.com" tunnel.log
```

---

## Project File Structure

```
CCB/
├── frontend-react/         # Next.js frontend
├── user-profile-service/   # Auth, profile, users (FastAPI)
├── catalog-service/        # Product CRUD (FastAPI)
├── order-service/          # Order creation (FastAPI)
├── cart-service/           # Cart (empty)
├── wishlist-service/       # Wishlist (empty)
├── payment-service/        # Event listener (script)
├── shared-assets/          # Firebase config
└── k8s-manifests/          # K8s YAML files
    ├── 00-namespaces.yaml  # ccb-dev, ccb-prod
    ├── deployments.yaml    # (pending)
    └── secrets.yaml        # (pending)
```
