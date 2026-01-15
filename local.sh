#!/bin/bash
set -e

echo "🚀 Starting local dar-backend deployment..."

# PM2 Backend-Prozess stoppen (falls vorhanden)
pm2 stop dar-backend 2>/dev/null || true
pm2 delete dar-backend 2>/dev/null || true

# Build
echo "Building dar-backend..."
npm install --legacy-peer-deps
npm run build

# Mit PM2 starten (du brauchst eine lokale ecosystem.config.js)
pm2 start dist/main.js --name dar-backend

echo "✅ Local deployment successful!"
pm2 list