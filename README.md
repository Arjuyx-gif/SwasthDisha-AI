<div align="center">
  <h1>🩺 SwasthDisha AI</h1>
  <p><strong>Intelligent Indian Health Report Analysis · Personalised Nutrition · Bilingual AI Coaching</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" />
    <img src="https://img.shields.io/badge/Groq-LLaMA_3.1-orange?style=flat-square" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss" />
    <img src="https://img.shields.io/badge/Zustand-State-green?style=flat-square" />
    <img src="https://img.shields.io/badge/lang-EN_%7C_HI-saffron?style=flat-square" />
    <img src="https://img.shields.io/badge/Live-Vercel-black?style=flat-square&logo=vercel" />
  </p>
  <p>
    <a href="https://swasth-disha-ai.vercel.app/"><strong>🌐 Live Demo → swasth-disha-ai.vercel.app</strong></a>
  </p>
  <p><em>Built by Arjun Singh</em></p>
</div>

---

## 🎯 What is SwasthDisha AI?

SwasthDisha AI turns complex medical lab reports into clear, personalised health journeys — in English *and* Hindi. Upload your blood work, get an instant AI-powered analysis, a tailored Indian diet plan, historical biomarker tracking, and a bilingual AI doctor you can chat with — all grounded in your actual clinical data.

> **Swasth** (स्वस्थ) = Healthy · **Disha** (दिशा) = Direction

---

## ✨ Features

### 🧬 1 — AI Report Analyser
Upload or paste any pathology report (text or PDF). The system:
- Extracts all lab values with status badges — **HIGH / LOW / NORMAL**
- Identifies organ flags: liver, blood, bones, metabolic
- Computes a live **Health Score** (0–100) from your full biomarker panel
- Displays an interactive **Body Map** highlighting affected organs
- Generates plain-English and Hindi AI summaries via **LLaMA 3.1 8B** on Groq
- OCR support for scanned reports via `tesseract.js`

### 🥗 2 — Poshan Lab (Nutrition Intelligence)
Built around your medical flags — not generic RDAs:
- **Apple Watch–style concentric SVG rings** for Calories, Protein, Iron, Vitamin C — animated with spring physics
- **Mifflin-St Jeor BMR engine** — personalised calorie target based on age, gender, weight, height, activity level, and **goal** (Lose / Maintain / Gain)
- Condition multipliers — liver disease ×0.85, kidney ×0.80, diabetes ×0.90
- **Junk food guard** — warns on contraindicated food additions based on your dietary flags
- 1,000+ Indian food database with cultural suggestions (palak, rajma, amla, ragi, til)
- AI coaching card powered by **Groq + LLaMA** — rendered with a custom inline markdown renderer

### 📈 3 — Vitals Vault (Historical Tracking)
- Stores all past reports in a timestamped archive (up to 20)
- **Biomarker trend charts** via Recharts — track Hemoglobin, ALT, Vitamin D over time
- Vitality score progression graph across reports
- Daily vitals logger: Blood Pressure, Heart Rate, Weight
- Delete individual reports from history

### 🗣️ 4 — Dr. Umeed (Bilingual AI Chat)
- Contextual Q&A assistant — knows your current report's lab values
- **Language mirroring** — write in English → get English; write in Hinglish → get Hinglish; write in Hindi → get Hindi. Never mixes languages.
- Streams responses token-by-token in real time via Groq API
- Full **inline markdown rendering** — bold, italic, bullet lists, numbered steps, warnings
- Text-to-speech with pause / resume / stop controls

### 🌐 5 — Full Hindi Localisation
Every UI label, status badge, section header, and filter switches between English and Hindi via a central `t()` translation system — no hardcoded strings anywhere.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, Framer Motion |
| UI Primitives | Shadcn/UI (Card, Badge, Button, ScrollArea) |
| State | Zustand v5 + localStorage persistence |
| AI / LLM | Groq API — `llama-3.1-8b-instant` |
| Embeddings | HuggingFace `all-MiniLM-L6-v2` (with fallback) |
| PDF Parsing | `pdf-parse` + `tesseract.js` for OCR |
| Indian Food DB | `ifct2017` (ICMR food composition tables) |
| Charts | Recharts (trend lines) + custom SVG (radial rings) |
| Validation | Zod |
| Deployment | Vercel |

---

## 🚀 Getting Started

```bash
# 1. Clone & install
git clone https://github.com/Arjuyx-gif/SwasthDisha-AI.git
cd SwasthDisha-AI
npm install

# 2. Set environment variable
echo "GROQ_API_KEY=your_groq_key_here" > .env

# 3. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> Get a free Groq API key at [console.groq.com](https://console.groq.com) — the app runs in demo mode even without one.

---

## 📁 Project Structure

```
SwasthDisha-AI/
├── app/
│   ├── page.tsx                  # Landing page — upload / demo reports
│   ├── dashboard/page.tsx        # Health score, lab table, body map, Dr. Umeed chat
│   ├── nutrition/page.tsx        # Poshan Lab — rings, food tracking, AI insight
│   ├── vitals/page.tsx           # Historical archive & biomarker charts
│   └── api/
│       ├── analyze-report/       # LLM report extraction endpoint
│       ├── chat/route.ts         # Dr. Umeed streaming chat API
│       ├── diet-insight/         # AI nutrition coaching (Groq)
│       ├── food-search/          # ICMR food database search
│       └── layman/               # Jargon simplifier endpoint
├── components/
│   ├── DoctorChat.tsx            # Streaming chat UI with markdown renderer
│   ├── NutrientRings.tsx         # Custom SVG Apple Watch–style rings
│   ├── UserProfileModal.tsx      # BMR profile — age/weight/height/goal
│   ├── BodyMap.tsx               # Interactive organ body map
│   ├── LabTable.tsx              # Lab values table with status badges
│   └── Nav.tsx                   # Bottom navigation bar
├── lib/
│   ├── store.ts                  # Zustand global state + localStorage
│   ├── nutritionEngine.ts        # Mifflin-St Jeor BMR, food scoring, junk guard
│   ├── ragEngine.ts              # HF embeddings + FAISS + Groq pipeline
│   ├── vitalsEngine.ts           # Vitality score, biomarker trend calculations
│   ├── translations.ts           # EN/HI translation map (~80+ keys)
│   └── mockData.ts               # 3 realistic demo patient reports
```

---

## 🎨 Design System

SwasthDisha uses the **BioSeva** design language:
- **Primary**: Saffron `#f97c0a` — Indian identity, warmth, action
- **Accent**: Bio-green `#10b981` — health, growth, vitality
- **Base**: Near-black `#070A0E` with a subtle blueprint grid overlay
- **Font**: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) — modern, clinical, legible

---

## 🌐 Live Deployment

**→ [https://swasth-disha-ai.vercel.app/](https://swasth-disha-ai.vercel.app/)**

Deployed on Vercel. Auto-deploys on every push to `main`.

---

## 📄 Licence

MIT — feel free to fork, build upon, and adapt.
