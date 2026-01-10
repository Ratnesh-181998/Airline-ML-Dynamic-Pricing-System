# 🚀 Airline Ticket Shopping System
<img width="1171" height="1036" alt="image" src="https://github.com/user-attachments/assets/36934c71-959a-4020-961c-74e8f76d4f44" />

# Airline ML Dynamic Pricing System 

<img width="2859" height="1425" alt="image" src="https://github.com/user-attachments/assets/15d38176-d18a-4ce2-a146-0ae6b9470f52" />

<img width="2859" height="1446" alt="image" src="https://github.com/user-attachments/assets/38c1f7c1-2c46-40a5-aab9-e80c3cdd6217" />

<img width="2828" height="1443" alt="image" src="https://github.com/user-attachments/assets/bbf2da54-1173-4035-ae88-59755bfc6013" />

<img width="2848" height="1473" alt="image" src="https://github.com/user-attachments/assets/8fdb8ebe-c070-45d3-9729-aff8af042e54" />

<img width="2851" height="1455" alt="image" src="https://github.com/user-attachments/assets/5e3d95ac-28d9-4533-afaa-96fdee13d18f" />

<img width="2841" height="1450" alt="image" src="https://github.com/user-attachments/assets/a204f0d5-96e1-4fec-b510-162a63773acd" />
<img width="2852" height="1461" alt="image" src="https://github.com/user-attachments/assets/06db8c6b-16f9-4990-9eb7-114615d87025" />

<img width="2859" height="1414" alt="image" src="https://github.com/user-attachments/assets/b16bf187-b789-4b60-944d-7dd614cf4be7" />

<img width="2857" height="1436" alt="image" src="https://github.com/user-attachments/assets/e856ebda-44ae-4dfd-b7aa-36bcd82bcf10" />

<img width="2861" height="1457" alt="image" src="https://github.com/user-attachments/assets/e4e614a8-9ebd-41c1-9da2-3a5018ff1a46" />

<img width="2871" height="1474" alt="image" src="https://github.com/user-attachments/assets/2f64a02e-2892-42cb-9a51-cd6421ae2731" />

<img width="2859" height="1451" alt="image" src="https://github.com/user-attachments/assets/6c32ffbc-6b86-4ce3-8dae-37a0a2179811" />



## Project Structure

This project is organized into two main folders for clean separation of concerns:

```
L-10/
├── frontend/                    # React Dashboard (UI)
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── App.js              # Main application
│   │   └── index.css           # Global styles
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── backend/                     # Python/AWS Backend
│   ├── src/
│   │   ├── ingestion/          # Data streaming
│   │   ├── processing/         # ETL pipelines
│   │   ├── training/           # ML training
│   │   └── deployment/         # Model deployment
│   ├── infrastructure/         # CloudFormation
│   ├── scripts/                # Automation
│   ├── requirements.txt
│   └── README.md
│
├── docs/                        # Documentation
├── README.md                    # This file
└── ... (other config files)
```

---

## 🎯 Quick Start

### Frontend (React Dashboard)

```bash
cd frontend
npm install
npm start
# Opens at http://localhost:3000
```

### Backend (Python/AWS)

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

---

## 📊 What's in Each Folder

### **Frontend** (`frontend/`)
- **Technology**: React.js 18
- **Purpose**: Interactive dashboard UI
- **Features**:
  - Real-time statistics
  - Interactive charts
  - Price prediction form
  - Demand forecasting
  - Market analytics
  - Anomaly detection alerts

**See:** `frontend/README.md` for details

### **Backend** (`backend/`)
- **Technology**: Python 3.9+, AWS Services
- **Purpose**: Data processing and ML
- **Components**:
  - Data ingestion (Kinesis)
  - ETL pipelines (Glue)
  - ML training (SageMaker)
  - Model deployment
  - Infrastructure as Code

**See:** `backend/README.md` for details

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
│  • Dashboard UI                                              │
│  • Price Prediction Form                                     │
│  • Charts & Visualizations                                   │
│  • Real-time Updates                                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ API Calls
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    BACKEND (Python/AWS)                      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Kinesis    │  │   AWS Glue   │  │  SageMaker   │     │
│  │  (Ingestion) │→ │  (ETL)       │→ │  (ML Models) │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │              │
│         ▼                  ▼                  ▼              │
│  ┌──────────────────────────────────────────────────┐       │
│  │              S3 Data Lake                         │       │
│  │  • Raw Data (JSON)                                │       │
│  │  • Curated Data (Parquet)                         │       │
│  │  • Model Artifacts                                │       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### 1. Run Frontend (Dashboard)

```bash
# Navigate to frontend
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm start

# Dashboard opens at http://localhost:3000
```

### 2. Setup Backend (AWS)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Deploy AWS infrastructure
bash scripts/setup_aws_resources.sh dev
```

---

## 📚 Documentation

- **Main README**: This file
- **Frontend README**: `frontend/README.md`
- **Backend README**: `backend/README.md`
- **System Design**: `SYSTEM_DESIGN.md`
- **Quick Start**: `QUICK_START.md`
- **Data Dictionary**: `docs/data_dictionary.md`

---

## 🎨 Features

### Frontend Features
- ✅ Beautiful dark theme UI
- ✅ Real-time statistics
- ✅ Interactive charts (Recharts)
- ✅ Price prediction form
- ✅ Responsive design
- ✅ Smooth animations

### Backend Features
- ✅ Real-time data ingestion (Kinesis)
- ✅ Scalable ETL pipelines (Glue)
- ✅ ML model training (SageMaker)
- ✅ Auto-scaling endpoints
- ✅ Infrastructure as Code
- ✅ Monitoring & alerts

---

## 🛠️ Technology Stack

### Frontend
- React 18.2.0
- Recharts 2.10.0
- Lucide React (icons)
- React Hot Toast (notifications)
- CSS3 (custom design system)

### Backend
- Python 3.9+
- AWS Kinesis
- AWS Glue (PySpark)
- AWS Lambda
- Amazon SageMaker
- Amazon S3
- Amazon Athena
- CloudFormation

---

## 📊 Project Stats

| Metric | Value |
|--------|-------|
| **Total Files** | 40+ |
| **Lines of Code** | 5,000+ |
| **React Components** | 8 |
| **Python Scripts** | 5 |
| **CloudFormation Templates** | 2 |
| **Documentation Files** | 15+ |

---

## 🎯 Use Cases

1. **Dynamic Pricing** - Real-time price optimization
2. **Demand Forecasting** - Predict booking volumes
3. **Market Analysis** - Popular routes and trends
4. **Anomaly Detection** - Unusual price spikes
5. **Personalized Recommendations** - Tailored suggestions

---

## 💰 Cost Estimate

**Monthly Cost** (10M searches/day): ~$3,000

- Kinesis: $72
- S3: $1,950
- Glue: $220
- Lambda: $2
- SageMaker: $550
- Athena: $25
- CloudWatch: $50

---

## 🔒 Security

- ✅ Encryption at rest (S3, Kinesis)
- ✅ Encryption in transit (TLS 1.2+)
- ✅ IAM roles with least privilege
- ✅ VPC isolation
- ✅ CloudTrail audit logs

---

## 📞 Support

For questions or issues:
- Check documentation in respective folders
- Review CloudWatch logs
- Contact: 
-**Author**: Ratnesh Kumar  
**Email**: rattudacsit2021gate@gmail.com  
**GitHub**: https://github.com/Ratnesh-181998  
**LinkedIn**: https://www.linkedin.com/in/ratneshkumar1998/

---

## 📄 License

MIT License - see LICENSE file

---

**Built with ❤️ for the Airline Industry**

*Last Updated: November 2025*

---


<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=24,20,12,6&height=3" width="100%">


## 📜 **License**

![License](https://img.shields.io/badge/License-MIT-success?style=for-the-badge&logo=opensourceinitiative&logoColor=white)

**Licensed under the MIT License** - Feel free to fork and build upon this innovation! 🚀

---

# 📞 **CONTACT & NETWORKING** 📞


### 💼 Professional Networks

[![LinkedIn](https://img.shields.io/badge/💼_LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ratneshkumar1998/)
[![GitHub](https://img.shields.io/badge/🐙_GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Ratnesh-181998)
[![X](https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/RatneshS16497)
[![Portfolio](https://img.shields.io/badge/🌐_Portfolio-FF6B6B?style=for-the-badge&logo=google-chrome&logoColor=white)](https://share.streamlit.io/user/ratnesh-181998)
[![Email](https://img.shields.io/badge/✉️_Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:rattudacsit2021gate@gmail.com)
[![Medium](https://img.shields.io/badge/Medium-000000?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@rattudacsit2021gate)
[![Stack Overflow](https://img.shields.io/badge/Stack_Overflow-F58025?style=for-the-badge&logo=stack-overflow&logoColor=white)](https://stackoverflow.com/users/32068937/ratnesh-kumar)

### 🚀 AI/ML & Data Science
[![Streamlit](https://img.shields.io/badge/Streamlit-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)](https://share.streamlit.io/user/ratnesh-181998)
[![HuggingFace](https://img.shields.io/badge/HuggingFace-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)](https://huggingface.co/RattuDa98)
[![Kaggle](https://img.shields.io/badge/Kaggle-20BEFF?style=for-the-badge&logo=kaggle&logoColor=white)](https://www.kaggle.com/rattuda)

### 💻 Competitive Programming
[![LeetCode](https://img.shields.io/badge/LeetCode-FFA116?style=for-the-badge&logo=leetcode&logoColor=black)](https://leetcode.com/u/Ratnesh_1998/)
[![HackerRank](https://img.shields.io/badge/HackerRank-00EA64?style=for-the-badge&logo=hackerrank&logoColor=black)](https://www.hackerrank.com/profile/rattudacsit20211)
[![CodeChef](https://img.shields.io/badge/CodeChef-5B4638?style=for-the-badge&logo=codechef&logoColor=white)](https://www.codechef.com/users/ratnesh_181998)
[![Codeforces](https://img.shields.io/badge/Codeforces-1F8ACB?style=for-the-badge&logo=codeforces&logoColor=white)](https://codeforces.com/profile/Ratnesh_181998)
[![GeeksforGeeks](https://img.shields.io/badge/GeeksforGeeks-2F8D46?style=for-the-badge&logo=geeksforgeeks&logoColor=white)](https://www.geeksforgeeks.org/profile/ratnesh1998)
[![HackerEarth](https://img.shields.io/badge/HackerEarth-323754?style=for-the-badge&logo=hackerearth&logoColor=white)](https://www.hackerearth.com/@ratnesh138/)
[![InterviewBit](https://img.shields.io/badge/InterviewBit-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://www.interviewbit.com/profile/rattudacsit2021gate_d9a25bc44230/)


---

## 📊 **GitHub Stats & Metrics** 📊



![Profile Views](https://komarev.com/ghpvc/?username=Ratnesh-181998&color=blueviolet&style=for-the-badge&label=PROFILE+VIEWS)





<img src="https://github-readme-streak-stats.herokuapp.com/?user=Ratnesh-181998&theme=radical&hide_border=true&background=0D1117&stroke=4ECDC4&ring=F38181&fire=FF6B6B&currStreakLabel=4ECDC4" width="48%" />




<img src="https://github-readme-activity-graph.vercel.app/graph?username=Ratnesh-181998&theme=react-dark&hide_border=true&bg_color=0D1117&color=4ECDC4&line=F38181&point=FF6B6B" width="48%" />

---

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=24&duration=3000&pause=1000&color=4ECDC4&center=true&vCenter=true&width=600&lines=Ratnesh+Kumar+Singh;Data+Scientist+%7C+AI%2FML+Engineer;4%2B+Years+Building+Production+AI+Systems" alt="Typing SVG" />

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=18&duration=2000&pause=1000&color=F38181&center=true&vCenter=true&width=600&lines=Built+with+passion+for+the+AI+Community+🚀;Innovating+the+Future+of+AI+%26+ML;MLOps+%7C+LLMOps+%7C+AIOps+%7C+GenAI+%7C+AgenticAI+Excellence" alt="Footer Typing SVG" />


<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer" width="100%">


