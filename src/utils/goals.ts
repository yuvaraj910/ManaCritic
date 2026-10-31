import type { ActivityLevel, Profile, Targets } from "../types/nutrition";

const activityMultipliers: Record<ActivityLevel, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };

export function calculateBmr(profile: Profile) {
  const sexAdjustment = profile.sex === "male" ? 5 : profile.sex === "female" ? -161 : -78;
  return Math.round(10 * profile.currentWeight + 6.25 * profile.height - 5 * profile.age + sexAdjustment);
}

export function calculateTargets(profile: Profile): Targets {
  const bmr = calculateBmr(profile);
  const tdee = bmr * activityMultipliers[profile.activity];
  const change = profile.goal === "gain" ? 280 : profile.goal === "loss" ? -360 : 0;
  const calories = Math.round(tdee + change);
  const proteinPerKg = profile.goal === "gain" ? 1.9 : profile.goal === "loss" ? 2 : 1.6;
  const protein = Math.round(profile.currentWeight * proteinPerKg);
  const fat = Math.round(profile.currentWeight * 0.8);
  const carbs = Math.max(100, Math.round((calories - protein * 4 - fat * 9) / 4));
  return { calories, protein, carbs, fat, fiber: profile.sex === "male" ? 38 : 25, water: Math.round(profile.currentWeight * 35) };
}

export function activityLabel(activity: ActivityLevel) {
  return { sedentary: "Sedentary", light: "Lightly active", moderate: "Moderately active", active: "Very active", veryActive: "Extra active" }[activity];
}
