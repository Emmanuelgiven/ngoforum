# Build script for all Next.js applications and Django static files
# Run this before deploying to production

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Building NGO Forum Web System" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Set error action preference
$ErrorActionPreference = "Stop"

# Build Django static files
Write-Host "`n[1/6] Collecting Django static files..." -ForegroundColor Yellow
python manage.py collectstatic --noinput
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to collect static files" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Django static files collected" -ForegroundColor Green

# Build main frontend
Write-Host "`n[2/6] Building main frontend..." -ForegroundColor Yellow
Set-Location frontend
if (Test-Path "node_modules") {
    npm run build
} else {
    Write-Host "Installing dependencies first..." -ForegroundColor Yellow
    npm install
    npm run build
}
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to build main frontend" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..
Write-Host "✓ Main frontend built" -ForegroundColor Green

# Build docs portal
Write-Host "`n[3/6] Building docs portal..." -ForegroundColor Yellow
if (Test-Path "docs-portal") {
    Set-Location docs-portal
    if (Test-Path "node_modules") {
        npm run build
    } else {
        npm install
        npm run build
    }
    Set-Location ..
    Write-Host "✓ Docs portal built" -ForegroundColor Green
} else {
    Write-Host "⊗ Docs portal not found (skipping)" -ForegroundColor Yellow
}

# Build comms portal
Write-Host "`n[4/6] Building comms portal..." -ForegroundColor Yellow
if (Test-Path "comms-portal") {
    Set-Location comms-portal
    if (Test-Path "node_modules") {
        npm run build
    } else {
        npm install
        npm run build
    }
    Set-Location ..
    Write-Host "✓ Comms portal built" -ForegroundColor Green
} else {
    Write-Host "⊗ Comms portal not found (skipping)" -ForegroundColor Yellow
}

# Build services portal
Write-Host "`n[5/6] Building services portal..." -ForegroundColor Yellow
if (Test-Path "services-portal") {
    Set-Location services-portal
    if (Test-Path "node_modules") {
        npm run build
    } else {
        npm install
        npm run build
    }
    Set-Location ..
    Write-Host "✓ Services portal built" -ForegroundColor Green
} else {
    Write-Host "⊗ Services portal not found (skipping)" -ForegroundColor Yellow
}

# Build nngocaptool portal
Write-Host "`n[6/6] Building nngocaptool portal..." -ForegroundColor Yellow
if (Test-Path "nngocaptool-portal") {
    Set-Location nngocaptool-portal
    if (Test-Path "node_modules") {
        npm run build
    } else {
        npm install
        npm run build
    }
    Set-Location ..
    Write-Host "✓ NNGO Cap Tool portal built" -ForegroundColor Green
} else {
    Write-Host "⊗ NNGO Cap Tool portal not found (skipping)" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Build Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`nBuilt files locations:" -ForegroundColor White
Write-Host "  Django static: public/static/" -ForegroundColor Gray
Write-Host "  Main frontend: frontend/out/" -ForegroundColor Gray
Write-Host "  Docs portal: docs-portal/out/" -ForegroundColor Gray
Write-Host "  Comms portal: comms-portal/out/" -ForegroundColor Gray
Write-Host "  Services portal: services-portal/out/" -ForegroundColor Gray
Write-Host "  NNGO Cap Tool: nngocaptool-portal/out/" -ForegroundColor Gray

Write-Host "`nReady for deployment!" -ForegroundColor Green
