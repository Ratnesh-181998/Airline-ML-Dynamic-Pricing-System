# 🚀 How to Run the Airline Ticket Shopping Dashboard

## ⚠️ Current Status
**Node.js is not installed on your system.** You need to install it first to run the React dashboard.

---

## 📋 Step-by-Step Installation Guide

### **Step 1: Install Node.js**

1. **Download Node.js LTS (Long Term Support)**
   - Go to: https://nodejs.org/
   - Click the **green "LTS" button** (recommended for most users)
   - Download will start automatically (file: `node-v20.x.x-x64.msi`)

2. **Run the Installer**
   - Double-click the downloaded `.msi` file
   - Click "Next" through the installation wizard
   - **Important**: Make sure "npm package manager" is checked
   - Accept the license agreement
   - Use default installation path: `C:\Program Files\nodejs\`
   - Click "Install"
   - Wait for installation to complete
   - Click "Finish"

3. **Verify Installation**
   - Open a **NEW** PowerShell window (important!)
   - Run these commands:
   ```powershell
   node --version
   # Should show: v20.x.x
   
   npm --version
   # Should show: 10.x.x
   ```

---

### **Step 2: Install Dashboard Dependencies**

Once Node.js is installed:

```powershell
# Navigate to the frontend directory
cd c:\Users\rattu\Downloads\L-10\frontend

# Install all dependencies (this will take 2-3 minutes)
npm install
```

You should see:
```
added 1500+ packages in 2m
```

---

### **Step 3: Start the Dashboard**

```powershell
# Make sure you're in the frontend directory
cd c:\Users\rattu\Downloads\L-10\frontend

# Start the development server
npm start
```

The dashboard will automatically open in your browser at:
**http://localhost:3000**

---

## 🎯 What You'll See

### **Dashboard Features**
- ✅ Real-time statistics in the header
- ✅ Interactive sidebar navigation
- ✅ 4 metric cards (Revenue, Users, Searches, Accuracy)
- ✅ Price trends chart (24-hour)
- ✅ Weekly demand chart
- ✅ Top routes pie chart
- ✅ Recent alerts panel

### **Price Prediction Page**
- ✅ Flight search form (Origin, Destination, Dates, etc.)
- ✅ AI-powered price predictions
- ✅ Confidence intervals
- ✅ Price factors analysis
- ✅ Smart recommendations

---

## 🔧 Troubleshooting

### **Issue: "npm is not recognized"**
**Solution**: 
- Restart your PowerShell/Terminal
- If still not working, restart your computer
- Verify Node.js is in PATH: `$env:PATH -split ';' | Select-String nodejs`

### **Issue: PowerShell execution policy error**
**Solution**:
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **Issue: Port 3000 already in use**
**Solution**:
```powershell
# Kill the process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Or use a different port
set PORT=3001 && npm start
```

### **Issue: Dependencies installation fails**
**Solution**:
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

---

## 🎨 Alternative: Static HTML Preview

If you want to see a preview without installing Node.js, I can create a static HTML version. However, it won't have:
- Real-time data updates
- Interactive form submissions
- Backend API integration

---

## 📦 Quick Commands Reference

```powershell
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Check for outdated packages
npm outdated

# Update packages
npm update
```

---

## 🌐 After Installation

Once the dashboard is running:

1. **Navigate** using the sidebar menu
2. **Try Price Prediction**:
   - Select Origin: SFO
   - Select Destination: JFK
   - Pick a future date
   - Click "Predict Price"
3. **View Charts** on the Dashboard
4. **Check Alerts** panel for notifications

---

## 🚀 Next Steps

After you have the dashboard running:

1. **Connect to Backend API**
   - Update API endpoints in components
   - Connect to SageMaker endpoints
   - Enable real-time predictions

2. **Customize**
   - Change colors in `src/index.css`
   - Add new components
   - Modify charts

3. **Deploy**
   - Build: `npm run build`
   - Deploy to AWS S3, Netlify, or Vercel

---

## 📞 Need Help?

If you encounter any issues:
1. Check the error message carefully
2. Search for the error on Google/Stack Overflow
3. Check Node.js documentation: https://nodejs.org/docs/
4. Check React documentation: https://react.dev/

---

## ✅ Installation Checklist

- [ ] Download Node.js from nodejs.org
- [ ] Install Node.js (with npm)
- [ ] Restart PowerShell/Terminal
- [ ] Verify: `node --version` and `npm --version`
- [ ] Navigate to: `c:\Users\rattu\Downloads\L-10\frontend`
- [ ] Run: `npm install`
- [ ] Run: `npm start`
- [ ] Open: http://localhost:3000
- [ ] Enjoy your dashboard! 🎉

---

**Once Node.js is installed, the entire setup takes less than 5 minutes!**
