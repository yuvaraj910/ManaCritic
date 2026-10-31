export type Theme = "light" | "dark";
export type Goal = "loss" | "maintenance" | "gain";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "veryActive";
export type Sex = "female" | "male" | "other";
export type MealType = "Breakfast" | "Lunch" | "Snack" | "Dinner" | "Custom";

export type Nutrients = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar?: number;
  sodium?: number;
  vitamins?: Partial<Record<VitaminKey, number>>;
  minerals?: Partial<Record<MineralKey, number>>;
};

export type VitaminKey = "A" | "B1" | "B2" | "B3" | "B6" | "B9" | "B12" | "C" | "D" | "E" | "K";
export type MineralKey = "Calcium" | "Iron" | "Magnesium" | "Zinc" | "Potassium" | "Phosphorus" | "Sodium" | "Selenium";

export type Food = Nutrients & {
  id: string;
  name: string;
  category: string;
  serving: number;
  unit: "g" | "ml" | "piece" | "cup";
  quality: number;
  favourite?: boolean;
  custom?: boolean;
};

export type FoodEntry = Nutrients & {
  id: string;
  foodId?: string;
  name: string;
  quantity: number;
  unit: string;
};

export type Meal = {
  id: string;
  date: string;
  type: MealType;
  name: string;
  time: string;
  entries: FoodEntry[];
  createdAt: string;
};

export type Profile = {
  currentWeight: number;
  targetWeight: number;
  height: number;
  age: number;
  sex: Sex;
  activity: ActivityLevel;
  goal: Goal;
  weeklyRate: number;
  sleepTarget: number;
};

export type Targets = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number;
  manual?: boolean;
};

export type SleepEntry = {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number;
  quality: number;
  notes?: string;
};

export type WeightEntry = {
  id: string;
  date: string;
  weight: number;
};

export type AppData = {
  meals: Meal[];
  customFoods: Food[];
  favourites: string[];
  profile: Profile;
  manualTargets?: Targets;
  sleep: SleepEntry[];
  weightHistory: WeightEntry[];
  waterByDate: Record<string, number>;
};

export type ScoreBreakdown = {
  score: number;
  category: "Excellent" | "Good" | "Average" | "Needs improvement";
  estimated: boolean;
  points: { label: string; score: number; max: number }[];
  strengths: string[];
  improvements: string[];
};
