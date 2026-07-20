export interface NutritionSource {
  name: string
  protein: number
  calories: number
}

export const PROTEIN_SOURCES: Record<string, NutritionSource> = {
  AYAM: { name: 'Ayam / Unggas', protein: 25, calories: 165 },
  DAGING: { name: 'Daging Sapi', protein: 22, calories: 200 },
  TELUR: { name: 'Telur (1 butir)', protein: 6, calories: 70 },
  IKAN: { name: 'Ikan / Seafood', protein: 20, calories: 120 },
  TEMPE_TAHU: { name: 'Tempe / Tahu', protein: 8, calories: 100 },
  WHEY: { name: 'Whey / Suplemen', protein: 24, calories: 120 },
  LAINNYA: { name: 'Lainnya', protein: 10, calories: 100 },
}
