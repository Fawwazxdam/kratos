# ⚔️ KRATOS — Personal Micro-Analytics Dashboard

> **Kratos** (*Κράτος*) berarti **kekuatan, daya tahan, dan kendali atas diri sendiri**.

**Kratos** adalah *personal micro-analytics dashboard* berbasis web yang dirancang untuk membantu memvisualisasikan performa harian secara *real-time*. Fokus utamanya adalah memantau asupan nutrisi, aktivitas workout, serta menjaga konsistensi kebiasaan sehari-hari melalui visualisasi data yang sederhana namun informatif.

---

# ✨ Features

* 📈 Melacak asupan **protein** dan **kalori** harian.
* 🏋️ Mencatat aktivitas workout beserta frekuensinya.
* 🔥 Menghitung *daily streak* secara otomatis.
* 📊 Menampilkan grafik perkembangan nutrisi dan latihan.
* 🟩 Heatmap ala GitHub untuk melihat konsistensi sepanjang tahun.
* 📝 Daily reflection untuk evaluasi singkat setiap hari.
* 💾 Offline-first menggunakan LocalStorage / IndexedDB.

---

# 🛠 Tech Stack

| Layer            | Technology                                 |
| ---------------- | ------------------------------------------ |
| Frontend         | Vue 3 (Composition API + `<script setup>`) |
| Build Tool       | Vite                                       |
| Styling          | Tailwind CSS                               |
| State Management | Pinia + `pinia-plugin-persistedstate`      |
| Charts           | Chart.js + vue-chartjs                     |
| Storage          | LocalStorage / IndexedDB                   |

---

# 📊 Dashboard Overview

## 1. Daily Summary

Menampilkan ringkasan performa harian.

### Components

* **Protein Gauge**

  * Progress menuju target protein harian.
  * Menampilkan `Current / Target (gram)`.

* **Calorie Tracker**

  * Ringkasan total kalori dibanding target.

* **Daily Streak**

  * Badge konsistensi.
  * Contoh:

    ```
    🔥 5 Days Streak
    ```

* **Quick Log**

  * Tombol untuk membuka modal input cepat.

---

## 2. Performance Analytics

### Nutritional Trend

Visualisasi perkembangan nutrisi selama:

* 7 hari
* 14 hari
* 30 hari

Menampilkan:

* Protein
* Kalori

Menggunakan:

* Line Chart
* Bar Chart

---

### Workout Analytics

Visualisasi:

* Workout Frequency
* Workout Volume
* Weekly Progress

---

## 3. Habit Heatmap

Visualisasi konsistensi menggunakan **GitHub-style contribution grid**.

Setiap kotak mewakili satu hari.

Status contoh:

| Color  | Meaning               |
| ------ | --------------------- |
| Gray   | Tidak ada data        |
| Green  | Target tercapai       |
| Yellow | Hampir tercapai       |
| Red    | Tidak mencapai target |

---

## 4. History & Journal

### Recent Logs

Daftar aktivitas hari ini.

Contoh:

* 🍗 Dada Ayam + Nasi
* 🥛 Whey Protein
* 🏋️ Push Workout

Setiap item dapat:

* Edit
* Delete

---

### Daily Reflection

Catatan singkat mengenai kondisi hari itu.

Contoh:

> Energy tinggi, workout lancar. Besok perlu tidur lebih awal.

---

# 💾 Data Architecture

## `daily_logs`

Data mentah setiap aktivitas yang dicatat melalui **Quick Add**.

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

---

## `daily_summaries`

Data hasil agregasi per hari untuk kebutuhan dashboard.

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

## `user_targets`

Target harian yang menjadi acuan seluruh dashboard.

```json
{
  "protein_target": 150,
  "calorie_target": 2200,
  "workout_days_per_week": 4
}
```

---

# 🚀 Getting Started

## 1. Create Project

```bash
npm create vite@latest kratos -- --template vue
```

## 2. Enter Project Directory

```bash
cd kratos
```

## 3. Install Dependencies

```bash
npm install
```

### Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Pinia

```bash
npm install pinia
```

### Persisted State

```bash
npm install pinia-plugin-persistedstate
```

### Charts

```bash
npm install chart.js vue-chartjs
```

---

# 📂 Project Structure

```text
kratos/
├── src/
│   ├── assets/
│   │   ├── css/
│   │   ├── fonts/
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── charts/
│   │   ├── dashboard/
│   │   └── ui/
│   │
│   ├── stores/
│   │
│   ├── types/
│   │
│   ├── utils/
│   │
│   ├── App.vue
│   └── main.js
│
├── public/
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

# 🎯 Project Goals

Kratos bukan sekadar aplikasi pencatat nutrisi, tetapi sebuah **personal performance dashboard** yang membantu membangun disiplin melalui visualisasi data yang sederhana, cepat dipahami, dan dapat digunakan sepenuhnya secara offline.

Fokus utama proyek ini adalah:

* 📈 Monitoring progres nutrisi.
* 🏋️ Tracking aktivitas workout.
* 🔥 Membangun konsistensi harian.
* 📊 Menyajikan insight melalui visualisasi data.
* 💾 Offline-first dengan pengalaman penggunaan yang ringan dan responsif.
