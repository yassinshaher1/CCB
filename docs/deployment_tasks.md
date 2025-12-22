# CCB Deployment Guide

## 📋 Local Machine (Your PC)

### Step 1: Commit & Push Changes
```powershell
cd D:\University\Cloud` computing\Project\CCB
git add .
git commit -m "Add Dockerfiles, K8s manifests, and deployment configs"
git push origin main
```

### Step 2: Build Docker Images
```powershell
# Login to Docker Hub
docker login -u yassinshaher

# Build images
docker build -t yassinshaher/ccb-user:latest ./user-profile-service
docker build -t yassinshaher/ccb-catalog:latest ./catalog-service
docker build -t yassinshaher/ccb-order:latest ./order-service
docker build -t yassinshaher/ccb-payment:latest ./payment-service
docker build -t yassinshaher/ccb-frontend:latest ./frontend-react

# Push to Docker Hub
docker push yassinshaher/ccb-user:latest
docker push yassinshaher/ccb-catalog:latest
docker push yassinshaher/ccb-order:latest
docker push yassinshaher/ccb-payment:latest
docker push yassinshaher/ccb-frontend:latest
```

---

## 🖥️ Server (ratatosk)

### Step 1: Clone Repository
```bash
cd /opt/ccb-project
git clone https://github.com/yassinshaher1/CCB.git
cd CCB
```

### Step 2: Create Firebase Secret
```bash
kubectl create secret generic firebase-key \
  --from-file=serviceAccountKey.json=/path/to/key.json \
  -n ccb-dev
```

### Step 3: Deploy
```bash
kubectl apply -f k8s-manifests/
```

### Step 4: Verify
```bash
kubectl get pods -n ccb-dev
kubectl get svc -n ccb-dev
```

### Step 5: Expose
```bash
nohup cloudflared tunnel --url http://localhost:80 > tunnel.log 2>&1 &
grep "trycloudflare.com" tunnel.log
```

---

## Port Reference
| Service | Port |
|---------|------|
| user-profile | 8000 |
| catalog | 8001 |
| order | 8002 |
| frontend | 3000 |
