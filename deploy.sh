#!/bin/bash

# Deploy Script für dar-backend
# Löst Berechtigungsprobleme und Port-Konflikte
# cd /home/ubuntu/dar-backend && ./deploy-backend.sh

set -e  # Script bei Fehlern beenden

echo "🚀 Starting dar-backend deployment..."

# Farben für bessere Lesbarkeit
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Projektpfade
DAR_BACKEND_PATH="/home/ubuntu/dar-backend"

# Funktion für farbige Ausgaben
log_info() {
    echo -e "${GREEN}ℹ️  $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. PM2 Backend-Prozess stoppen
log_info "Stopping dar-backend PM2 process..."
pm2 stop dar-backend 2>/dev/null || true
pm2 delete dar-backend 2>/dev/null || true

# Kurz warten damit Port 3501 freigegeben wird
sleep 2

# 2. Backend bauen
log_info "Building dar-backend..."
cd $DAR_BACKEND_PATH

# Alte dist Ordner entfernen
if [ -d "dist" ]; then
    log_warn "Removing old backend dist directory"
    sudo rm -rf dist
fi

# Dependencies und Build
log_info "Installing dependencies..."
npm install --legacy-peer-deps

log_info "Building application..."
npm run build

# Checken ob das Build erfolgreich war
if [ ! -f "dist/main.js" ]; then
    log_error "BUILD FAILED! dist/main.js not found!"
    log_info "Checking what's in dist directory..."
    ls -la dist/ 2>/dev/null || echo "dist directory doesn't exist"
    log_info "Trying build again with verbose output..."
    npm run build -- --verbose
    
    if [ ! -f "dist/main.js" ]; then
        log_error "Build still failed! Exiting..."
        exit 1
    fi
fi

log_info "Build successful! dist/main.js exists"

# Berechtigungen korrigieren
if [ -d "dist" ]; then
    log_warn "Fixing dist directory permissions..."
    sudo chown -R $USER:$USER dist
    ls -la dist/main.js  # Kontrollausgabe
fi

# 3. Port 3501 BRUTAL freimachen - ABER VORSICHTIG!
log_info "BRUTAL killing ALL processes on port 3501..."
# Methode 1: lsof + kill (OHNE fuser!)
PIDS=$(sudo lsof -ti:3501 2>/dev/null || true)
if [ ! -z "$PIDS" ]; then
    log_warn "Found processes on port 3501: $PIDS"
    echo "$PIDS" | xargs sudo kill -9 2>/dev/null || true
fi

# KEIN fuser! Das löscht Files!
# KEIN netstat backup!

# Sicher gehen - nochmal checken
sleep 2
STILL_THERE=$(sudo lsof -ti:3501 2>/dev/null || true)
if [ ! -z "$STILL_THERE" ]; then
    log_error "Port 3501 STILL blocked! Killing again..."
    echo "$STILL_THERE" | xargs sudo kill -9 2>/dev/null || true
fi

# Checken ob dist noch da ist
log_info "Checking if dist survived the port killing..."
if [ ! -f "dist/main.js" ]; then
    log_error "Port killing deleted dist! WTF!"
    log_info "Rebuilding..."
    npm run build
    sudo chown -R $USER:$USER dist
fi

# 4. Backend starten (dist existiert bereits mit korrekten Rechten)
log_info "Starting dar-backend with PM2..."
cd /home/ubuntu

# Nochmal checken ob dist/main.js da ist
if [ ! -f "$DAR_BACKEND_PATH/dist/main.js" ]; then
    log_error "FUCK! dist/main.js disappeared! Something deleted it!"
    exit 1
fi

log_info "dist/main.js confirmed present, starting PM2..."
pm2 start ecosystem.config.js --only dar-backend

# Falls das fehlschlägt, nochmal versuchen
if ! pm2 list | grep -q "dar-backend.*online"; then
    log_warn "First start failed, retrying..."
    pm2 delete dar-backend 2>/dev/null || true
    sleep 2
    pm2 start ecosystem.config.js --only dar-backend
fi

# 5. PM2 Konfiguration speichern
pm2 save

# 6. Status anzeigen
log_info "dar-backend deployment completed! Current status:"
pm2 list | grep dar-backend

echo -e "${GREEN}✅ dar-backend deployment successful!${NC}"