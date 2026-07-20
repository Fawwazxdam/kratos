# ⚔️ KRATOS — Personal Micro-Analytics Dashboard

> **Kratos** (*Κράτος*): Strength, Endurance, and Mastery over Oneself.

**Kratos** is a web-based personal micro-analytics dashboard designed to visualize daily performance metrics in real time—focusing on tracking nutritional intake (protein & calories), workout habits, and overall daily consistency.

---

## 🛠️ Tech Stack

* **Frontend Framework:** Vue 3 (Composition API + `<script setup>`)
* **Build Tool:** Vite
* **Styling:** Tailwind CSS (Light Mode Base, High-Contrast Accent)
* **State Management:** Pinia (with `pinia-plugin-persistedstate`)
* **Data Visualization:** `Chart.js` + `vue-chartjs`
* **Data Persistence:** LocalStorage / IndexedDB (Offline-first architecture)

---

## 📊 Feature Breakdown & Layout Specs

### 1. Daily Summary Bar (Top Section)
* **Protein Gauge:** Circular progress indicator for real-time progress (`Total Input / Target Grams`).
* **Calorie Tracker Status:** Summary card comparing daily calorie intake vs target.
* **Streak Counter:** Habit consistency badge (e.g., `🔥 5-Day Streak`).
* **Quick Log Trigger:** Floating interactive button to trigger the *Quick Input* modal.

### 2. Core Performance Charts
* **Nutritional Trend (Bar / Line Chart):** 7–30 day historical comparison of protein and calorie intake.
* **Workout Volume & Frequency:** Visual breakdown of weekly training frequency and intensity.

### 3. Habit & Discipline Heatmap
* **GitHub-Style Consistency Grid:** Yearly matrix tracking daily completion of fitness and nutritional goals.

### 4. History & Micro-Journal
* **Recent Logs Feed:** Chronological list of today's log entries with inline edit/delete functionality.
* **Daily Reflection:** Qualitative journal card for brief daily check-ins.

---

## 💾 Data Architecture (Schemas)

### 1. `daily_logs`
Appended whenever a new entry is submitted via *Quick Add*.

```json
{
  "id": "log-101",
  "date": "2026-07-20",
  "timestamp": "12:30",
  "category": "NUTRITION",
  "title": "Dada Ayam + Nasi",
  "protein": 45,
  "calories": 400,
  "notes": "Makan siang"
}
```

### 2. `daily_summaries`
Aggregated daily metrics generated for charts and heatmap visualization.

```json
{
  "date": "2026-07-20",
  "total_protein": 135,
  "total_calories": 2100,
  "workout_completed": true,
  "target_achieved": true,
  "reflection_note": "Energy level tinggi, workout lancar."
}
```

### 3. `user_targets`
Threshold parameters used for daily target percentage calculations.

```json
{
  "protein_target": 150,
  "calorie_target": 2200,
  "workout_days_per_week": 4
}
```

---

## 🚀 Quick Start (Initialization)

```bash
# 1. Scaffold project Vue 3 + Vite
npm create vite@latest kratos -- --template vue

# 2. Navigate into project directory
cd kratos

# 3. Install core and supporting dependencies
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install pinia chart.js vue-chartjs
```

---

## 📂 Proposed Folder Structure

```text
kratos/
├── src/
│   ├── assets/          # CSS, Fonts, Icons
│   ├── components/      # UI & Chart Components
│   │   ├── charts/      # Reusable Chart.js wrappers
│   │   ├── dashboard/   # Summary Cards, Heatmap, Recent Logs
│   │   └── ui/          # Buttons, Modals, Forms
│   ├── stores/          # Pinia State Management (logs, targets)
│   ├── types/           # Interfaces / JS Data Models
│   ├── utils/           # Date formatters, Calculators
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
└── tailwind.config.js
```