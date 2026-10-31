import { Clock3, Pencil, Trash2 } from "lucide-react";
import type { Meal, Targets } from "../types/nutrition";
import { scoreMeal } from "../utils/mealScoring";
import { totalNutrients } from "../utils/nutrition";
import { IconButton, Pill } from "./ui";

const colors: Record<Meal["type"], string> = { Breakfast: "orange", Lunch: "purple", Snack: "blue", Dinner: "green", Custom: "pink" };

export function MealCard({ meal, targets, onEdit, onDelete, compact = false }: { meal: Meal; targets: Targets; onEdit?: () => void; onDelete?: () => void; compact?: boolean }) {
  const totals = totalNutrients(meal.entries);
  const score = scoreMeal(meal, targets);
  return <article className={`meal-card ${compact ? "meal-card-compact" : ""}`}><div className="meal-type-dot" data-color={colors[meal.type]} /><div className="meal-card-main"><div className="meal-card-title"><div><span className="meal-type">{meal.type}</span><h3>{meal.name}</h3></div><div className="meal-score"><strong>{score.score}</strong><span>score</span></div></div><div className="meal-meta"><span><Clock3 size={14} />{meal.time}</span><span>{meal.entries.map((entry) => entry.name).join(" · ")}</span></div>{!compact && <div className="meal-macros"><Pill tone="orange">{Math.round(totals.calories)} kcal</Pill><span>P {totals.protein}g</span><span>C {totals.carbs}g</span><span>F {totals.fat}g</span></div>}</div>{(onEdit || onDelete) && <div className="meal-actions"><IconButton aria-label={`Edit ${meal.name}`} onClick={onEdit}><Pencil size={15} /></IconButton>{onDelete && <IconButton aria-label={`Delete ${meal.name}`} className="delete-icon" onClick={onDelete}><Trash2 size={15} /></IconButton>}</div>}</article>;
}
