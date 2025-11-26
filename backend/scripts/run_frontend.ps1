# Install frontend dependencies and start development server

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Airline Ticket Shopping Dashboard" -ForegroundColor Cyan
Write-Host "React Frontend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to frontend directory
Set-Location -Path "frontend"

# Check if node_modules exists
if (Test-Path "node_modules") {
    Write-Host "Dependencies already installed" -ForegroundColor Green
} else {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Development Server..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "The dashboard will open at: http://localhost:3000" -ForegroundColor Green
Write-Host ""

# Start development server
npm start
