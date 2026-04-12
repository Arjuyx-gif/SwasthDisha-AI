<div align="center">
  <h1>🩺 SwasthDisha AI</h1>
  <p><strong>Intelligent Indian Health Report Analysis · Personalized Nutrition · Bilingual AI Coaching</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" />
    <img src="https://img.shields.io/badge/Groq-LLaMA_3.1-orange?style=flat-square" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss" />
    <img src="https://img.shields.io/badge/Zustand-State-green?style=flat-square" />
    <img src="https://img.shields.io/badge/lang-EN_%7C_HI-saffron?style=flat-square" />
  </p>
  <p><em>Built by Arjun Singh</em></p>
</div>

---

## 🎯 What is SwasthDisha AI?

SwasthDisha AI turns complex medical lab reports into clear, personalised health journeys — in English *and* Hindi. It reads your actual blood work values, flags abnormalities, and generates a fully tailored diet plan, exercise routine, and AI coaching response — all grounded in your specific clinical data.

> **Swasth** (स्वस्थ) = Healthy · **Disha** (दिशा) = Direction

---

## ✨ Features

### 🧬 1 — AI Report Analyzer
Upload or paste any pathology report. The system:
- Extracts lab values with status (HIGH / LOW / NORMAL)
- Identifies organ flags (liver, blood, bones, metabolic)
- Computes a live **Health Score** (0–100) from your biomarker panel
- Displays an interactive **Body Map** highlighting affected organs
- Provides an AI-generated explanation in plain English and Hindi via **LLaMA 3.1 8B** on Groq

### 🥗 2 — Poshan Lab (Nutrition Intelligence)
The nutrition module is built around your medical flags, not generic RDAs:
- **Apple Watch–style concentric SVG rings** for Calories, Protein, Iron, Vitamin C — animated with spring physics
- **Mifflin-St Jeor BMR engine**: personalised calorie target based on age, gender, weight, height, activity level, and **goal** (Lose / Maintain / Gain)
- Condition multipliers — liver disease gets ×0.85, kidney ×0.80, diabetes ×0.90
- **Junk food guard**: warns and blocks contraindicated food additions based on your dietaryFlags
- 1,000+ Indian food database with cultural food suggestions (palak, rajma, amla, ragi, til)
- AI coaching card powered by **RAG pipeline + Groq** — rendered with a custom inline markdown renderer

### 💪 3 — Adaptive Exercise Planner
- 7-day dynamic workout schedules generated from your report flags
- Safety-tiered intensity: anemia patients get gentle yoga; liver patients get walking only
- Exercise logs with XP and level progression

### 📈 4 — Vitals Vault (Historical Tracking)
- Stores all past reports in a timestamped archive (up to 20)
- **Biomarker trend charts** via Recharts — track Hemoglobin, ALT, Vitamin D over time
- Vitality score progression graph
- Daily vitals logger: Blood Pressure, Heart Rate, Weight
- **Delete individual reports** from history with confirmation

### 🗣️ 5 — Dr. Umeed (AI Chat)
- Contextual Q&A assistant — knows your current report's lab values
- Streams responses in real-time via Groq API
- Bilingual: answers in English or Hindi switch

### 🌐 6 — Full Hindi Localisation
Every UI label, filter button, section header, and status badge switches between English and Hindi via a central `t()` translation system — no hardcoded strings.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, Framer Motion, custom BioSeva design tokens |
| UI Primitives | Shadcn/UI (Card, Badge, Button) |
| State | Zustand + localStorage persistence |
| AI / LLM | Groq API — `llama-3.1-8b-instant` |
| RAG Pipeline | Custom 3-stage retrieval → rerank → augment |
| Charts | Recharts (trend lines) + custom SVG (radial rings) |
| Font | Space Grotesk (Google Fonts) |

---

## 🚀 Getting Started

```bash
# 1. Clone & install
git clone https://github.com/Arjuyx-gif/SwasthDisha-AI.git
cd SwasthDisha-AI
npm install

# 2. Set environment variable
echo "GROQ_API_KEY=your_groq_key_here" > .env.local

# 3. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> Get a free Groq API key at [console.groq.com](https://console.groq.com) — the app works with demo data even without one.

---

## 📁 Project Structure

```
SwasthDisha-AI/
├── app/
│   ├── page.tsx              # Landing page — upload / demo reports
│   ├── dashboard/page.tsx    # Health score, lab table, body map
│   ├── nutrition/page.tsx    # Poshan Lab — rings, food tracking, AI insight
│   ├── vitals/page.tsx       # Historical archive & biomarker charts
│   ├── move/page.tsx         # Exercise planner
│   └── api/
│       ├── chat/route.ts     # Dr. Umeed streaming chat API
│       └── diet-insight/     # AI nutrition coaching API (RAG + Groq)
├── components/
│   ├── NutrientRings.tsx     # Custom SVG Apple Watch–style rings
│   ├── UserProfileModal.tsx  # BMR profile — age/weight/height/goal
│   ├── DoctorChat.tsx        # Streaming chat UI
│   └── Nav.tsx               # Bottom navigation bar
├── lib/
│   ├── store.ts              # Zustand global state + localStorage
│   ├── nutritionEngine.ts    # Mifflin-St Jeor BMR, food scoring
│   ├── ragEngine.ts          # 3-stage RAG pipeline
│   ├── vitalsEngine.ts       # Biomarker trend calculations
│   ├── translations.ts       # EN/HI translation map
│   └── mockData.ts           # 3 realistic demo patient reports
```

---

## 🎨 Design System

SwasthDisha uses the **BioSeva** design language:
- **Primary**: Saffron `#f97c0a` — Indian identity, warmth, action
- **Accent**: Bio-green `#10b981` — health, growth, vitality
- **Base**: Near-black `#070A0E` with a subtle blueprint grid overlay
- **Font**: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) — modern, clinical, legible

---

## 📄 Licence

MIT — feel free to fork, build upon, and adapt.
