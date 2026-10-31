import { Check, Minus, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useNutri } from "../AppContext";
import type { Food, FoodEntry, Meal, MealType } from "../types/nutrition";
import { scaleFood, totalNutrients } from "../utils/nutrition";
import { Button, IconButton, Modal, ProgressBar } from "./ui";

const mealTypes: MealType[] = ["Breakfast", "Lunch", "Snack", "Dinner", "Custom"];

export function MealEditor({ meal, initialFood, onClose }: { meal?: Meal; initialFood?: Food; onClose: () => void }) {
  const { foods, selectedDate, addMeal, updateMeal, data } = useNutri();
  const [type, setType] = useState<MealType>(meal?.type ?? "Breakfast");
  const [name, setName] = useState(meal?.name ?? "");
  const [time, setTime] = useState(meal?.time ?? new Date().toTimeString().slice(0, 5));
  const [entries, setEntries] = useState<FoodEntry[]>(meal?.entries ?? (initialFood ? [scaleFood(initialFood, initialFood.serving)] : []));
  const [query, setQuery] = useState("");
  const [showPicker, setShowPicker] = useState(!meal && !initialFood);
  const results = useMemo(() => foods.filter((food) => food.name.toLowerCase().includes(query.toLowerCase())).slice(0, 7), [foods, query]);
  const totals = totalNutrients(entries);

  function addFood(food: Food) {
    setEntries((old) => [...old, scaleFood(food, food.serving)]);
    setShowPicker(false);
    setQuery("");
  }
  function updateQuantity(entry: FoodEntry, quantity: number) {
    const source = foods.find((food) => food.id === entry.foodId);
    setEntries((old) => old.map((item) => {
      if (item.id !== entry.id) return item;
      if (!source) return { ...item, quantity: Math.max(1, quantity) };
      return { ...scaleFood(source, Math.max(1, quantity)), id: item.id };
    }));
  }
  function save(event: React.FormEvent) {
    event.preventDefault();
    if (!entries.length) return;
    const item: Meal = { id: meal?.id ?? crypto.randomUUID(), date: meal?.date ?? selectedDate, type, name: name.trim() || `${type} meal`, time, entries, createdAt: meal?.createdAt ?? new Date().toISOString() };
    if (meal) updateMeal(item); else addMeal(item);
    onClose();
  }
  return <Modal title={meal ? "Edit meal" : "Build a meal"} onClose={onClose} wide><form className="meal-editor" onSubmit={save}>
    <div className="form-grid form-grid-3"><label>Meal type<select value={type} onChange={(event) => setType(event.target.value as MealType)}>{mealTypes.map((option) => <option key={option}>{option}</option>)}</select></label><label className="field-grow">Meal name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Protein power bowl" /></label><label>Time<input type="time" value={time} onChange={(event) => setTime(event.target.value)} required /></label></div>
    <div className="editor-layout"><div className="editor-foods"><div className="editor-section-title"><div><h3>Foods in this meal</h3><p>{entries.length ? `${entries.length} item${entries.length === 1 ? "" : "s"} · ${Math.round(totals.calories)} kcal` : "Start by adding a food"}</p></div><Button type="button" variant="secondary" onClick={() => setShowPicker((old) => !old)}><Plus size={16} />Add food</Button></div>
      {entries.length === 0 ? <div className="editor-empty">Choose something from your food library to build this meal.</div> : <div className="entry-list">{entries.map((entry) => <div className="entry-row" key={entry.id}><div className="entry-dot" /><div className="entry-title"><strong>{entry.name}</strong><span>{Math.round(entry.calories)} kcal · {entry.protein}g protein</span></div><div className="quantity-stepper"><IconButton type="button" aria-label={`Reduce ${entry.name}`} onClick={() => updateQuantity(entry, entry.quantity - 10)}><Minus size={14} /></IconButton><input aria-label={`${entry.name} quantity`} type="number" min="1" value={entry.quantity} onChange={(event) => updateQuantity(entry, Number(event.target.value))} /><span>{entry.unit}</span><IconButton type="button" aria-label={`Increase ${entry.name}`} onClick={() => updateQuantity(entry, entry.quantity + 10)}><Plus size={14} /></IconButton></div><IconButton type="button" aria-label={`Remove ${entry.name}`} className="delete-icon" onClick={() => setEntries((old) => old.filter((item) => item.id !== entry.id))}><Trash2 size={16} /></IconButton></div>)}</div>}
      {showPicker && <div className="food-picker"><div className="search-field"><Search size={16} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search rice, dal, paneer…" /></div><div className="picker-results">{results.map((food) => <button type="button" key={food.id} onClick={() => addFood(food)}><span className="food-avatar">{food.name.charAt(0)}</span><span><strong>{food.name}</strong><small>{Math.round(food.calories)} kcal / {food.serving}{food.unit}</small></span><Plus size={17} /></button>)}</div></div>}
    </div><aside className="meal-preview"><p className="eyebrow">Meal total</p><strong className="preview-calories">{Math.round(totals.calories)}</strong><span>kcal</span><div className="preview-macros"><div><span>Protein</span><strong>{totals.protein}g</strong><ProgressBar value={totals.protein / (data.manualTargets?.protein ?? 130) * 100} color="purple" /></div><div><span>Carbs</span><strong>{totals.carbs}g</strong><ProgressBar value={totals.carbs / (data.manualTargets?.carbs ?? 320) * 100} color="blue" /></div><div><span>Fat</span><strong>{totals.fat}g</strong><ProgressBar value={totals.fat / (data.manualTargets?.fat ?? 75) * 100} color="orange" /></div></div></aside></div>
    <div className="modal-footer"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button disabled={!entries.length} type="submit"><Check size={17} />{meal ? "Save changes" : "Add to today"}</Button></div>
  </form></Modal>;
}
