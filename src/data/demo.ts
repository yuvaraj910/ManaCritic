import type { AppData, Profile } from "../types/nutrition";

export const defaultProfile: Profile = {
  currentWeight: 70, targetWeight: 70, height: 170, age: 25, sex: "other", activity: "moderate", goal: "maintenance", weeklyRate: 0.25, sleepTarget: 8,
};

export function makeEmptyData(): AppData {
  return { meals: [], customFoods: [], favourites: [], profile: { ...defaultProfile }, sleep: [], weightHistory: [], waterByDate: {} };
}
