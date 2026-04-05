<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/activity.svg" alt="SwasthDisha Logo" width="80" height="80">
  <h1 align="center">SwasthDisha AI</h1>
  <p align="center">
    <strong>Intelligent Health Report Analysis & Personalized Wellness Journey</strong>
  </p>
  <p align="center">
    <em>Built by Arjun Singh</em>
  </p>
</div>

---

## 🎯 The Vision

SwasthDisha transforms complex medical lab reports into clear, actionable health journeys. Built entirely around the user's specific health data, it provides an instant diagnosis summary followed by highly personalized dietary and exercise plans.

### 🧬 Component 1: AI Report Analyzer
*Upload, parse, and visualize any medical report.*
The system processes lab values, extracts critical organ and dietary flags (e.g., Anemia, Liver issues), and instantly visualizes the data via customized UI components, dynamic body maps, and AI confidence charts powered by LLaMA 3.3.

### 🥗 Component 2: Nutrition Intelligence
*Personalized Indian food nutrient profiles.*
A fully functional nutrition lab leveraging a dataset of over 1,000 distinct Indian food items. Daily macro targets adjust specifically to the user's uploaded medical flags, intelligently warning users when consuming contraindicated foods based on their exact lab results.

### 💪 Component 3: Adaptive Exercise
*Adaptive plans based on health condition.*
Generates dynamic, 7-day adaptive workout regimens tailored strictly to the user's medical report. It features an intelligent safety-tiering architecture that limits high-intensity activities if the user's report indicates vulnerability.

### 🗣️ Component 4: Bilingual Explainability
*Understand your health in English or Hindi.*
Instant translation of complex medical jargon into clear, compassionate insights in multiple languages.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS, Framer Motion, Shadcn UI
- **AI Engine:** Groq API (LLaMA 3.3 70B)
- **State Management:** Zustand
- **Data Visualization:** Recharts

## 🚀 Getting Started

To run the platform locally:

```bash
# 1. Install dependencies
npm install

# 2. Set up your environment variables
# Create a .env.local file in the root directory and add your Groq API key:
echo "GROQ_API_KEY=your_api_key_here" > .env.local

# 3. Start the local server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
