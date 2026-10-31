import type { Meal, ScoreBreakdown, Targets } from "../types/nutrition";
import { totalNutrients } from "./nutrition";

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function scoreMeal(meal: Meal, targets: Targets): ScoreBreakdown {
  const n = totalNutrients(meal.entries);
  const estimated = !meal.entries.some((entry) => Object.keys(entry.vitamins ?? {}).length || Object.keys(entry.minerals ?? {}).length);
  const calorieShare = n.calories / targets.calories;
  const idealMealShare = meal.type === "Snack" ? 0.13 : 0.29;
  const calorie = 15 * (1 - clamp(Math.abs(calorieShare - idealMealShare) / idealMealShare, 0, 0.85));
  const protein = 20 * clamp(n.protein / (targets.protein * 0.3));
  const carbRatio = n.carbs * 4 / Math.max(n.calories, 1);
  const carbs = 10 * (1 - clamp(Math.abs(carbRatio - 0.48) / 0.48, 0, 0.75));
  const fatRatio = n.fat * 9 / Math.max(n.calories, 1);
  const fat = 10 * (1 - clamp(Math.abs(fatRatio - 0.27) / 0.35, 0, 0.8));
  const fiber = 10 * clamp(n.fiber / (targets.fiber * 0.25));
  const vitaminCount = Object.values(n.vitamins ?? {}).filter((value) => value > 0).length;
  const mineralCount = Object.values(n.minerals ?? {}).filter((value) => value > 0).length;
  const vitamins = 10 * clamp(vitaminCount / 4);
  const minerals = 10 * clamp(mineralCount / 4);
  const sugar = 5 * (1 - clamp((n.sugar ?? 0) / 20));
  const sodium = 5 * (1 - clamp((n.sodium ?? 0) / 700));
  const density = 5 * clamp((n.fiber / Math.max(n.calories, 1)) * 65 + vitaminCount / 8);
  const points = [
    ["Calorie fit", calorie, 15], ["Protein", protein, 20], ["Carb balance", carbs, 10], ["Fat balance", fat, 10], ["Fiber", fiber, 10],
    ["Vitamins", vitamins, 10], ["Minerals", minerals, 10], ["Added sugar", sugar, 5], ["Sodium", sodium, 5], ["Nutrient density", density, 5],
  ].map(([label, score, max]) => ({ label: label as string, score: Math.round(score as number), max: max as number }));
  const score = points.reduce((sum, item) => sum + item.score, 0);
  const category = score >= 85 ? "Excellent" : score >= 70 ? "Good" : score >= 52 ? "Average" : "Needs improvement";
  const strengths: string[] = [];
  const improvements: string[] = [];
  if (protein >= 15) strengths.push("Excellent protein contribution for your goal."); else improvements.push("Add a protein-rich food to make this meal more satisfying.");
  if (fiber >= 7) strengths.push("Strong fiber support for fullness and digestion."); else improvements.push("Include vegetables, fruit, or whole grains for more fiber.");
  if (vitamins + minerals >= 14) strengths.push("Good micronutrient diversity from whole foods."); else if (!estimated) improvements.push("Add colorful vegetables or fruit to broaden micronutrients.");
  if (sugar < 3) improvements.push("Keep added sugar modest to retain a higher score.");
  return { score, category, estimated, points, strengths: strengths.slice(0, 3), improvements: improvements.slice(0, 3) };
}
