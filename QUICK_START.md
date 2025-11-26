# 🚀 Quick Start Guide

## Prerequisites
- Node.js v24+ (for frontend)
- Python 3.9+ (for backend)
- AWS Account (for backend deployment)

---

## Frontend (Dashboard)

### Install & Run
```bash
cd frontend
npm install
npm start
```

**Opens at:** http://localhost:3000

---

## Backend (AWS/Python)

### Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### Deploy to AWS
```bash
cd backend
bash scripts/setup_aws_resources.sh dev
```

---

## Project Structure

```
L-10/
├── frontend/          # React Dashboard
├── backend/           # Python/AWS Backend
└── docs/              # Documentation
```

---

## Documentation

- **README.md** - Main project overview
- **QUICK_START.md** - This file (quick setup)
- **SYSTEM_DESIGN.md** - Detailed architecture
- **PROJECT_SUMMARY.md** - Business value & ROI
- **PROJECT_COMPLETE.md** - Complete deliverables
- **DASHBOARD_RUNNING.md** - Dashboard usage guide

---

## Common Commands

### Frontend
```bash
npm start       # Start dev server
npm run build   # Build for production
```

### Backend
```bash
# Stream sample data
python src/ingestion/kinesis_producer.py

# Train model
python src/training/train_xgboost.py

# Deploy endpoint
python src/deployment/sagemaker_endpoint.py
```

---

## Support

- Check `README.md` for detailed information
- See `SYSTEM_DESIGN.md` for architecture
- Review folder-specific READMEs

---

**Built with ❤️ for the Airline Industry**
