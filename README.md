# 🧬 Commit DNA – Developer Coding Style Analyzer

> Analyze Git history and generate a behavioral “Coding DNA Profile” of developers.

Commit DNA transforms raw Git commit history into a powerful analytics dashboard that reveals coding patterns, productivity trends, refactoring behavior, bug tendencies, ownership distribution, and burnout indicators.

---

## 🚀 Project Vision

Software teams generate massive Git data every day.  
Commit DNA converts that raw data into meaningful insights like:

- 👨‍💻 Developer work patterns  
- 📊 Commit activity trends  
- 🐛 Bug introduction patterns  
- 🔁 Refactor frequency  
- 🗺 Code ownership heatmap  
- 🔥 Burnout risk indicator  

---

## 🎯 MVP Scope (Phase 1)

This version supports:

- ✅ Public GitHub repositories only  
- ✅ Repository link input  
- ✅ Automatic repo cloning  
- ✅ Commit analysis engine  
- ✅ Developer DNA dashboard  

Private repository support will be added in Phase 2 using GitHub OAuth.

---

## 🧠 How It Works

### 1️⃣ User Inputs Public Repository Link

Example: https://github.com/username/repository-name

### 2️⃣ Backend Performs

- Clone repository
- Extract commit logs
- Parse commit metadata
- Calculate behavioral metrics
- Generate structured analytics

### 3️⃣ Frontend Displays

- Developer Profile Card
- Commit Activity Graph
- Bug & Refactor Trends
- Code Ownership Map
- Burnout Indicator

---

## 📊 Key Metrics Calculated

### 🕒 Work Pattern
- Commits per hour
- Weekend activity
- Night coding ratio

### 🐛 Bug Rate
- Bug-fix commit ratio
- Fix frequency trend

### 🔁 Refactor Frequency
- Refactor commit ratio
- Structural change detection

### 📈 Commit Size Analysis
- Average lines per commit
- Risk assessment

### 🔥 Burnout Score
Based on:
- Late night commits
- Weekend commits
- Activity spikes
- Bug increase

---

## 🏗 Tech Stack

### 🔹 Frontend
- React (Vite)
- Tailwind CSS
- Recharts / D3.js

### 🔹 Backend
- Node.js
- Express.js
- simple-git

### 🔹 Database (Optional in MVP)
- PostgreSQL / MongoDB

---

