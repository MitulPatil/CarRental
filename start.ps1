# Car Rental - Development Server Startup Script

Write-Host "🚗 Starting Car Rental Application..." -ForegroundColor Green
Write-Host ""

# Check if dependencies are installed
Write-Host "Checking dependencies..." -ForegroundColor Yellow

$serverNodeModules = Test-Path "server/node_modules"
$clientNodeModules = Test-Path "client/node_modules"

if (-not $serverNodeModules) {
    Write-Host "❌ Server dependencies not installed" -ForegroundColor Red
    Write-Host "   Run: cd server; npm install" -ForegroundColor Yellow
    exit 1
}

if (-not $clientNodeModules) {
    Write-Host "❌ Client dependencies not installed" -ForegroundColor Red
    Write-Host "   Run: cd client; npm install" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Check environment files
$serverEnv = Test-Path "server/.env"
$clientEnv = Test-Path "client/.env"

if (-not $serverEnv) {
    Write-Host "❌ Server .env file missing" -ForegroundColor Red
    Write-Host "   Copy server/.env.example to server/.env and configure" -ForegroundColor Yellow
    exit 1
}

if (-not $clientEnv) {
    Write-Host "❌ Client .env file missing" -ForegroundColor Red
    Write-Host "   Copy client/.env.example to client/.env and configure" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Environment files configured" -ForegroundColor Green
Write-Host ""

# Instructions
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Car Rental Application - Ready to Start!" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the application, open TWO separate terminals:" -ForegroundColor Yellow
Write-Host ""
Write-Host "📌 Terminal 1 (Backend Server):" -ForegroundColor Green
Write-Host "   cd server" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host "   Server will run on: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "📌 Terminal 2 (Frontend):" -ForegroundColor Green
Write-Host "   cd client" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host "   Frontend will run on: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Quick Tips:" -ForegroundColor Yellow
Write-Host "   • Register as 'owner' to list cars" -ForegroundColor White
Write-Host "   • Register as 'user' to book cars" -ForegroundColor White
Write-Host "   • Owner dashboard: /owner" -ForegroundColor White
Write-Host "   • View full docs in README.md" -ForegroundColor White
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Ask if user wants to start servers now
$response = Read-Host "Start servers now? (Y/N)"

if ($response -eq 'Y' -or $response -eq 'y') {
    Write-Host ""
    Write-Host "Starting backend server..." -ForegroundColor Green
    
    # Start backend in new terminal
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; npm run dev"
    
    Start-Sleep -Seconds 3
    
    Write-Host "Starting frontend server..." -ForegroundColor Green
    
    # Start frontend in new terminal
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client'; npm run dev"
    
    Write-Host ""
    Write-Host "✅ Servers started in separate windows!" -ForegroundColor Green
    Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Cyan
    Write-Host "   Backend: http://localhost:3000" -ForegroundColor Cyan
} else {
    Write-Host "Startup cancelled. Run servers manually when ready." -ForegroundColor Yellow
}
