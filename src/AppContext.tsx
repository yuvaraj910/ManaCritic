import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { makeDemoData } from "./data/demo";
import { starterFoods } from "./data/foods";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { AppData, Food, Meal, Profile, SleepEntry, Targets, Theme, WeightEntry } from "./types/nutrition";
import { calculateTargets } from "./utils/goals";
import { isoDate } from "./utils/nutrition";

type NutriContextValue = {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  foods: Food[];
  targets: Targets;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  theme: Theme;
  toggleTheme: () => void;
  addMeal: (meal: Meal) => void;
  updateMeal: (meal: Meal) => void;
  deleteMeal: (id: string) => void;
  saveCustomFood: (food: Food) => void;
  deleteCustomFood: (id: string) => void;
  toggleFavourite: (id: string) => void;
  saveSleep: (entry: SleepEntry) => void;
  deleteSleep: (id: string) => void;
  saveWeight: (entry: WeightEntry) => void;
  deleteWeight: (id: string) => void;
  setProfile: (profile: Profile) => void;
  setManualTargets: (targets?: Targets) => void;
  setWater: (date: string, value: number) => void;
  resetData: () => void;
};

const NutriContext = createContext<NutriContextValue | null>(null);

export function NutriProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useLocalStorage<AppData>("nutritrack-data-v1", makeDemoData());
  const [theme, setTheme] = useLocalStorage<Theme>("nutritrack-theme-v1", "light");
  const [selectedDate, setSelectedDate] = useState(isoDate());
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  const value = useMemo<NutriContextValue>(() => ({
    data, setData, foods: [...starterFoods, ...data.customFoods], targets: data.manualTargets ?? calculateTargets(data.profile), selectedDate, setSelectedDate, theme,
    toggleTheme: () => setTheme((old) => old === "light" ? "dark" : "light"),
    addMeal: (meal) => setData((old) => ({ ...old, meals: [...old.meals, meal] })),
    updateMeal: (meal) => setData((old) => ({ ...old, meals: old.meals.map((item) => item.id === meal.id ? meal : item) })),
    deleteMeal: (id) => setData((old) => ({ ...old, meals: old.meals.filter((item) => item.id !== id) })),
    saveCustomFood: (food) => setData((old) => ({ ...old, customFoods: old.customFoods.some((item) => item.id === food.id) ? old.customFoods.map((item) => item.id === food.id ? food : item) : [...old.customFoods, { ...food, custom: true }] })),
    deleteCustomFood: (id) => setData((old) => ({ ...old, customFoods: old.customFoods.filter((item) => item.id !== id), favourites: old.favourites.filter((foodId) => foodId !== id) })),
    toggleFavourite: (id) => setData((old) => ({ ...old, favourites: old.favourites.includes(id) ? old.favourites.filter((foodId) => foodId !== id) : [...old.favourites, id] })),
    saveSleep: (entry) => setData((old) => ({ ...old, sleep: old.sleep.some((item) => item.id === entry.id) ? old.sleep.map((item) => item.id === entry.id ? entry : item) : [...old.sleep, entry] })),
    deleteSleep: (id) => setData((old) => ({ ...old, sleep: old.sleep.filter((item) => item.id !== id) })),
    saveWeight: (entry) => setData((old) => ({ ...old, weightHistory: old.weightHistory.some((item) => item.id === entry.id) ? old.weightHistory.map((item) => item.id === entry.id ? entry : item) : [...old.weightHistory, entry].sort((a, b) => a.date.localeCompare(b.date)) })),
    deleteWeight: (id) => setData((old) => ({ ...old, weightHistory: old.weightHistory.filter((item) => item.id !== id) })),
    setProfile: (profile) => setData((old) => ({ ...old, profile })),
    setManualTargets: (manualTargets) => setData((old) => ({ ...old, manualTargets })),
    setWater: (date, water) => setData((old) => ({ ...old, waterByDate: { ...old.waterByDate, [date]: Math.max(0, water) } })),
    resetData: () => setData(makeDemoData()),
  }), [data, selectedDate, setData, setTheme, theme]);
  return <NutriContext.Provider value={value}>{children}</NutriContext.Provider>;
}

export function useNutri() {
  const context = useContext(NutriContext);
  if (!context) throw new Error("useNutri must be used within NutriProvider");
  return context;
}
