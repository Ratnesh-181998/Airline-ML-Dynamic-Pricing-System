# ========================================
# Airline Ticket Shopping Dashboard
# Installation & Setup Guide
# ========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Airline Ticket Shopping Dashboard" -ForegroundColor Cyan
Write-Host "Installation Guide" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
$nodeInstalled = Get-Command node -ErrorAction SilentlyContinue

if ($nodeInstalled) {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
    
    # Check npm
    $npmVersion = npm --version
    Write-Host "✓ npm is installed: $npmVersion" -ForegroundColor Green
    Write-Host ""
    
    # Navigate to frontend directory
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    Set-Location -Path "frontend"
    
    # Install dependencies
    npm install
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Installation Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "To start the dashboard, run:" -ForegroundColor Cyan
    Write-Host "  npm start" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or run:" -ForegroundColor Cyan
    Write-Host "  .\scripts\run_frontend.ps1" -ForegroundColor Yellow
    Write-Host ""
    
}
else {
    Write-Host "✗ Node.js is NOT installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host "Installation Instructions" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Download Node.js LTS (Long Term Support):" -ForegroundColor Cyan
    Write-Host "   https://nodejs.org/" -ForegroundColor Green
    Write-Host ""
    Write-Host "2. Run the installer (.msi file)" -ForegroundColor Cyan
    Write-Host "   - Accept the license agreement" -ForegroundColor White
    Write-Host "   - Use default installation path" -ForegroundColor White
    Write-Host "   - Make sure 'npm package manager' is checked" -ForegroundColor White
    Write-Host "   - Click 'Install'" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Restart PowerShell/Terminal" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "4. Verify installation:" -ForegroundColor Cyan
    Write-Host "   node --version" -ForegroundColor Yellow
    Write-Host "   npm --version" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "5. Run this script again:" -ForegroundColor Cyan
    Write-Host "   .\scripts\setup_frontend.ps1" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host ""
    
    # Open Node.js download page
    $response = Read-Host "Would you like to open the Node.js download page? (Y/N)"
    if ($response -eq 'Y' -or $response -eq 'y') {
        Start-Process "https://nodejs.org/"
        Write-Host ""
        Write-Host "✓ Opening Node.js download page in your browser..." -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
