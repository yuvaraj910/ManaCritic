import type { Food, FoodEntry, Meal, Nutrients } from "../types/nutrition";

export const emptyNutrients = (): Nutrients => ({ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0, vitamins: {}, minerals: {} });

export function round(value: number, digits = 1) {
  const multiplier = 10 ** digits;
  return Math.round(value * multiplier) / multiplier;
}

function summedMap<T extends string>(items: Partial<Record<T, number>>[]): Partial<Record<T, number>> {
  return items.reduce((total, item) => {
    Object.entries(item).forEach(([key, value]) => {
      const previous = Number(total[key as T] ?? 0);
      total[key as T] = round(previous + Number(value ?? 0), 2);
    });
    return total;
  }, {} as Partial<Record<T, number>>);
}

export function scaleFood(food: Food, quantity: number): FoodEntry {
  const ratio = quantity / food.serving;
  return {
    id: crypto.randomUUID(), foodId: food.id, name: food.name, quantity, unit: food.unit,
    calories: round(food.calories * ratio), protein: round(food.protein * ratio), carbs: round(food.carbs * ratio), fat: round(food.fat * ratio), fiber: round(food.fiber * ratio),
    sugar: round((food.sugar ?? 0) * ratio), sodium: round((food.sodium ?? 0) * ratio),
    vitamins: Object.fromEntries(Object.entries(food.vitamins ?? {}).map(([key, value]) => [key, round((value ?? 0) * ratio, 2)])),
    minerals: Object.fromEntries(Object.entries(food.minerals ?? {}).map(([key, value]) => [key, round((value ?? 0) * ratio, 2)])),
  };
}

export function totalNutrients(items: Array<Nutrients | FoodEntry | Meal>): Nutrients {
  const nutrients = items.map((item) => "entries" in item ? totalNutrients(item.entries) : item);
  return {
    calories: round(nutrients.reduce((sum, item) => sum + item.calories, 0)),
    protein: round(nutrients.reduce((sum, item) => sum + item.protein, 0)),
    carbs: round(nutrients.reduce((sum, item) => sum + item.carbs, 0)),
    fat: round(nutrients.reduce((sum, item) => sum + item.fat, 0)),
    fiber: round(nutrients.reduce((sum, item) => sum + item.fiber, 0)),
    sugar: round(nutrients.reduce((sum, item) => sum + (item.sugar ?? 0), 0)),
    sodium: round(nutrients.reduce((sum, item) => sum + (item.sodium ?? 0), 0)),
    vitamins: summedMap(nutrients.map((item) => item.vitamins ?? {})),
    minerals: summedMap(nutrients.map((item) => item.minerals ?? {})),
  };
}

export function formatNumber(value: number, maxFraction = 0) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: maxFraction }).format(value);
}

export function isoDate(date = new Date()) {
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

export function dateShift(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return isoDate(d);
}

export function dateLabel(date: string, options: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" }) {
  return new Intl.DateTimeFormat("en-IN", options).format(new Date(`${date}T12:00:00`));
}

export function totalSleepHours(bedtime: string, wakeTime: string) {
  const [bedH, bedM] = bedtime.split(":").map(Number);
  const [wakeH, wakeM] = wakeTime.split(":").map(Number);
  let minutes = wakeH * 60 + wakeM - (bedH * 60 + bedM);
  if (minutes <= 0) minutes += 24 * 60;
  return round(minutes / 60, 1);
}
