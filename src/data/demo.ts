import { starterFoods } from "./foods";
import type { AppData, FoodEntry, Meal, MealType, Profile, SleepEntry, WeightEntry } from "../types/nutrition";
import { dateShift, scaleFood, totalSleepHours } from "../utils/nutrition";

const food = (id: string, quantity: number): FoodEntry => {
  const match = starterFoods.find((item) => item.id === id);
  if (!match) throw new Error(`Missing starter food: ${id}`);
  return scaleFood(match, quantity);
};

const meal = (date: string, id: string, type: MealType, name: string, time: string, entries: FoodEntry[]): Meal => ({
  id: `demo-${date}-${id}`, date, type, name, time, entries, createdAt: `${date}T${time}:00`,
});

export const defaultProfile: Profile = {
  currentWeight: 71.4, targetWeight: 75, height: 176, age: 27, sex: "male", activity: "moderate", goal: "gain", weeklyRate: 0.25, sleepTarget: 8,
};

export function makeDemoData(): AppData {
  const meals: Meal[] = [];
  for (let day = -6; day <= 0; day += 1) {
    const date = dateShift(day);
    const variation = Math.abs(day) % 3;
    meals.push(
      meal(date, "breakfast", "Breakfast", variation === 0 ? "Oats & banana bowl" : "Vegetable poha", "08:15", variation === 0 ? [food("oats", 55), food("milk", 250), food("banana", 118), food("almonds", 15)] : [food("poha", 200), food("curd", 100)]),
      meal(date, "lunch", "Lunch", variation === 1 ? "Rajma rice bowl" : "Dal, roti & greens", "13:05", variation === 1 ? [food("rajma", 190), food("rice", 150), food("mixedVeg", 150)] : [food("dal", 180), food("roti", 80), food("spinach", 100), food("curd", 100)]),
      meal(date, "dinner", "Dinner", variation === 2 ? "Soy & chapati plate" : "Chicken harvest bowl", "20:10", variation === 2 ? [food("soy", 180), food("roti", 80), food("mixedVeg", 180)] : [food("chicken", 160), food("rice", 160), food("mixedVeg", 200)]),
    );
    if (day > -4 || day === 0) meals.push(meal(date, "snack", "Snack", variation === 0 ? "Fruit & nuts" : "Eggs and fruit", "17:10", variation === 0 ? [food("apple", 182), food("peanuts", 25)] : [food("eggs", 100), food("banana", 118)]));
  }
  const sleep: SleepEntry[] = Array.from({ length: 7 }, (_, index) => {
    const date = dateShift(index - 6);
    const bedtimes = ["23:18", "22:56", "23:41", "23:08", "22:48", "23:25", "23:02"];
    const wakes = ["07:12", "06:44", "07:22", "06:58", "07:05", "07:18", "07:00"];
    return { id: `sleep-${date}`, date, bedtime: bedtimes[index], wakeTime: wakes[index], duration: totalSleepHours(bedtimes[index], wakes[index]), quality: [4, 4, 3, 4, 5, 3, 4][index], notes: index === 6 ? "Woke up refreshed." : undefined };
  });
  const weightHistory: WeightEntry[] = Array.from({ length: 8 }, (_, index) => ({ id: `weight-${index}`, date: dateShift((index - 7) * 4), weight: Number((70.7 + index * 0.1 + (index % 3) * 0.06).toFixed(1)) }));
  return { meals, customFoods: [], favourites: ["oats", "eggs", "dal", "chicken"], profile: defaultProfile, sleep, weightHistory, waterByDate: { [dateShift(0)]: 1650 } };
}
