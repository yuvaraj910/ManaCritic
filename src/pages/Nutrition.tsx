import { CheckCircle2, ChevronRight, CircleAlert, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useNutri } from "../AppContext";
import { MealCard } from "../components/MealCard";
import { Card, PageHeading, Pill, ProgressBar, Ring } from "../components/ui";
import { mineralTargets, vitaminTargets } from "../data/foods";
import type { Meal } from "../types/nutrition";
import { scoreMeal } from "../utils/mealScoring";
import { formatNumber, totalNutrients } from "../utils/nutrition";

type NutrientRow = { label: string; value?: number; target: number; unit: string };

export default function Nutrition() {
  const { data, targets, selectedDate } = useNutri();
  const [view, setView] = useState<"macros" | "micros">("macros");
  const meals = useMemo(() => data.meals.filter((meal) => meal.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time)), [data.meals, selectedDate]);
  const total = totalNutrients(meals);
  const dayScore = scoreMeal({ id: "day", date: selectedDate, type: "Custom", name: "Day", time: "", entries: meals.flatMap((meal) => meal.entries), createdAt: "" }, targets);
  const vitamins: NutrientRow[] = Object.entries(vitaminTargets).map(([key, info]) => ({ label: info.label, value: total.vitamins?.[key as keyof typeof vitaminTargets], target: info.target, unit: info.unit }));
  const minerals: NutrientRow[] = Object.entries(mineralTargets).map(([key, info]) => ({ label: info.label, value: total.minerals?.[key as keyof typeof mineralTargets], target: info.target, unit: info.unit }));
  const macroRows = [
    ["Protein", total.protein, targets.protein, "g", "purple"], ["Carbohydrates", total.carbs, targets.carbs, "g", "blue"], ["Fat", total.fat, targets.fat, "g", "orange"], ["Fiber", total.fiber, targets.fiber, "g", "green"],
  ] as const;
  return <div className="page"><PageHeading eyebrow="Nutrition intelligence" title="Understand what fuels you." description="Numbers are useful. The pattern behind them is what matters." />
    <div className="nutrition-top-grid"><Card className="nutrition-score-card"><div><p className="eyebrow">Today’s balance</p><h2>{dayScore.category}</h2><p className="subtle">Your score considers goals, macros, fiber and the nutrients available in your food data.</p><div className="score-chip-row"><Pill tone="purple">{meals.length} meals assessed</Pill>{dayScore.estimated && <Pill tone="orange">Partly estimated</Pill>}</div></div><Ring value={dayScore.score} size={146} stroke={11} color="purple"><strong>{dayScore.score}</strong><span>/ 100</span></Ring></Card>
      <Card className="score-explainer"><div className="card-head"><div><p className="eyebrow">Why this score</p><h2>Clear, not cryptic</h2></div><Sparkles size={20} className="accent-purple" /></div><div className="explainer-columns"><div><h3>Working well</h3>{dayScore.strengths.length ? dayScore.strengths.map((item) => <p className="explain-good" key={item}><CheckCircle2 size={16} />{item}</p>) : <p className="subtle">Log a meal to surface strengths.</p>}</div><div><h3>Next best move</h3>{dayScore.improvements.slice(0, 2).map((item) => <p className="explain-tip" key={item}><ChevronRight size={16} />{item}</p>)}</div></div></Card></div>
    <div className="section-tabs"><button className={view === "macros" ? "active" : ""} onClick={() => setView("macros")}>Macro balance</button><button className={view === "micros" ? "active" : ""} onClick={() => setView("micros")}>Vitamins & minerals</button></div>
    {view === "macros" ? <><div className="macro-detail-grid">{macroRows.map(([label, value, target, unit, color]) => <Card className="macro-detail-card" key={label}><div className="macro-detail-head"><span>{label}</span><strong>{formatNumber(value, 1)}<small> / {target}{unit}</small></strong></div><ProgressBar value={value / target * 100} color={color} /><p>{Math.round(value / target * 100)}% of your goal</p></Card>)}</div><Card className="score-breakdown"><div className="card-head"><div><p className="eyebrow">Meal scoring model</p><h2>What shaped your score</h2></div><Pill tone="purple">100 point scale</Pill></div><div className="score-points">{dayScore.points.map((point) => <div key={point.label}><div><span>{point.label}</span><strong>{point.score}<small>/{point.max}</small></strong></div><ProgressBar value={point.score / point.max * 100} color={point.score / point.max > .7 ? "green" : point.score / point.max > .45 ? "orange" : "pink"} /></div>)}</div><p className="score-note">A missing micronutrient value is treated as unknown, not as zero. Scores adapt to your calorie goal and protein target.</p></Card></> : <div className="micronutrient-view"><Card className="micro-intro"><CircleAlert size={20} /><p>Micronutrient totals only include foods with referenced values. “Unknown” means your local food data did not include that nutrient — not that you consumed none.</p></Card><div className="micro-columns"><NutrientGroup title="Vitamins" rows={vitamins} color="purple" /><NutrientGroup title="Minerals" rows={minerals} color="blue" /></div></div>}
    <div className="meal-scores-section"><div className="section-head"><div><p className="eyebrow">Meal health scores</p><h2>Today, meal by meal</h2></div></div>{meals.length ? <div className="meal-scores-list">{meals.map((meal) => <MealCard key={meal.id} meal={meal} targets={targets} compact />)}</div> : <Card className="empty-card"><p>Meal scores appear here once you log food for the day.</p></Card>}</div>
  </div>;
}

function NutrientGroup({ title, rows, color }: { title: string; rows: NutrientRow[]; color: "purple" | "blue" }) {
  return <Card className="micro-group"><div className="card-head"><h2>{title}</h2><Pill tone={color}>{rows.filter((row) => row.value !== undefined).length} tracked</Pill></div><div className="micro-list">{rows.map((row) => { const available = row.value !== undefined; const percent = available ? row.value! / row.target * 100 : 0; return <div className="micro-row" key={row.label}><div className="micro-label"><span>{row.label}</span><strong>{available ? `${formatNumber(row.value!, 1)} ${row.unit}` : "Unknown"}</strong></div><div className="micro-progress"><ProgressBar value={percent} color={color} /><span>{available ? `${Math.round(percent)}%` : "—"}</span></div></div>; })}</div></Card>;
}
