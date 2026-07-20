# ⚔️ KRATOS — Personal Fitness Dashboard

> **Kratos** (*Κράτος*): Strength, Endurance, and Mastery over Oneself.

**Kratos** is a web-based personal fitness micro-analytics dashboard for tracking daily nutritional intake (protein & calories), workout habits, and overall consistency — with an integrated BMR/TDEE calculator and macro target system.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Vue 3 (Composition API + `<script setup lang="ts">`) |
| **Language** | TypeScript |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite` plugin) |
| **State Management** | Pinia + `pinia-plugin-persistedstate` |
| **Charts** | Chart.js + vue-chartjs (Bar, Line) |
| **Routing** | Vue Router 5 |
| **Testing** | Vitest (unit) + Playwright (e2e) |
| **Linting** | ESLint + oxlint + Prettier |
| **Data Persistence** | localStorage (offline-first) |

---

## 📊 Features

### 1. BMR / TDEE Calculator & Target System
* **Mifflin-St Jeor Formula** — accurate BMR calculation based on body stats.
* **6 Activity Levels** — from Sedentary (1.2x) to Athlete (2.1x).
* **3 Fitness Programs:**
  | Program | Calorie Target | Protein Range | Macro Split |
  |---|---|---|---|
  | Lean Bulk 🔥 | TDEE + 300 | 1.6–2.2g/kg | P30 / C45 / F25 |
  | Fat Loss ✂️ | TDEE − 400 | 1.8–2.4g/kg | P35 / C35 / F30 |
  | Maintenance 🛡️ | TDEE | 1.4–1.8g/kg | P25 / C45 / F30 |
* **Smart Recommendation** — one-click auto-calculate targets from body stats.
* **Custom Override** — manually set protein & calorie targets with validation (protein ≥ 1g/kg, calories ≥ BMR).
* **Macro Split Display** — visual protein/carbs/fat breakdown with bar chart.

### 2. Daily Progress Overview
* **DailyProgressCard** — unified view showing protein & calorie progress with remaining amounts, workout status, streak, and total macros.
* **Protein Gauge** — SVG circular progress ring for protein intake.
* **Calorie Card** — horizontal progress bar for calorie tracking.
* **Streak Badge** — consecutive days with logged activity.
* **Workout Status** — today's workout completed indicator.

### 3. Quick Log System
* **Nutrition Estimator** — pick a protein source (Ayam, Daging, Telur, etc.), set portion count, auto-calculate protein & calories.
* **Workout Templates** — Push, Pull, Leg, Cardio, HIIT, etc. with auto-calculated calorie burn.
* **Manual Input Mode** — enter exact protein and calorie values.
* **Edit & Delete** — inline editing of existing log entries.

### 4. Charts & Visualization
* **Nutrition Chart** — 7-day bar chart of protein & calorie intake.
* **Calorie Trend Chart** — 7-day line chart of calorie consumption.
* **Habit Heatmap** — GitHub-style contribution grid tracking daily activity.

### 5. Daily Reflection
* **Journal Card** — qualitative daily check-in for notes and reflections.

---

## 💾 Data Schemas

### `daily_logs`
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

### `user_targets`
```json
{
  "protein_target": 150,
  "calorie_target": 2200,
  "workout_days_per_week": 4
}
```

### `user_profile`
```json
{
  "weight_kg": 70,
  "height_cm": 175,
  "age": 25,
  "gender": "male",
  "activity_level": "moderate",
  "program": "lean_bulk",
  "is_configured": true
}
```

### `daily_summaries`
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

---

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone <repo-url> kratos
cd kratos

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

---

## 📂 Folder Structure

```text
kratos/
├── src/
│   ├── assets/
│   │   └── main.css                  # Tailwind entry + dark variant
│   ├── components/
│   │   ├── charts/
│   │   │   ├── CalorieTrendChart.vue  # 7-day calorie line chart
│   │   │   └── NutritionChart.vue     # 7-day protein/calorie bar chart
│   │   ├── dashboard/
│   │   │   ├── CalorieCard.vue        # Calorie progress card
│   │   │   ├── DailyProgressCard.vue  # Unified daily target overview
│   │   │   ├── DailyReflection.vue    # Daily journal/reflection
│   │   │   ├── HabitHeatmap.vue       # GitHub-style heatmap grid
│   │   │   ├── MacroSplitCard.vue     # Macro breakdown (P/C/F)
│   │   │   ├── ProteinGauge.vue       # SVG circular protein ring
│   │   │   ├── RecentLogs.vue         # Today's log list
│   │   │   ├── StreakBadge.vue        # Daily streak fire badge
│   │   │   └── WorkoutStatus.vue      # Workout completed indicator
│   │   └── ui/
│   │       ├── DarkModeToggle.vue     # Sun/moon toggle
│   │       ├── QuickLogButton.vue     # FAB + log input modal
│   │       └── UserProfileModal.vue   # Profile setup + calculator
│   ├── router/
│   │   └── index.ts                   # Single route: /
│   ├── stores/
│   │   └── kratos.ts                  # Pinia store (logs, targets, profile)
│   ├── types/
│   │   └── index.ts                   # TypeScript interfaces & constants
│   ├── utils/
│   │   ├── darkMode.ts                # Dark mode composable
│   │   ├── heatmap.ts                 # Heatmap grid builder
│   │   ├── mockData.ts                # Static mock data
│   │   ├── nutritionMatrix.ts         # Protein source lookup
│   │   └── workoutMatrix.ts           # Workout template lookup
│   ├── views/
│   │   └── DashboardView.vue          # Main dashboard page
│   ├── App.vue                        # Root component
│   └── main.ts                        # App bootstrap
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint + oxlint |
| `npm run format` | Run Prettier |
| `npm run typecheck` | Run vue-tsc type check |
| `npm run test:unit` | Run Vitest unit tests |
| `npm run test:e2e` | Run Playwright e2e tests |
