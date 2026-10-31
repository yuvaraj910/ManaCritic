import { ArrowUpRight, Droplets, Plus, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useNutri } from "../AppContext";
import { GradientAreaChart, TinyLineChart, type ChartPoint } from "../components/charts";
import { MealCard } from "../components/MealCard";
import { MealEditor } from "../components/MealEditor";
import { Button, Card, PageHeading, ProgressBar, Ring } from "../components/ui";
import type { Meal } from "../types/nutrition";
import { scoreMeal } from "../utils/mealScoring";
import { dateLabel, dateShift, formatNumber, totalNutrients } from "../utils/nutrition";

const macroMeta = [
  ["Protein", "protein", "purple", "g"], ["Carbs", "carbs", "blue", "g"], ["Fat", "fat", "orange", "g"], ["Fiber", "fiber", "green", "g"],
] as const;

export default function Dashboard({ goToFood }: { goToFood: () => void }) {
  const { data, targets, selectedDate, setWater, deleteMeal } = useNutri();
  const [range, setRange] = useState<7 | 30 | 90>(7);
  const [editor, setEditor] = useState<Meal | undefined>();
  const [adding, setAdding] = useState(false);
  const todaysMeals = useMemo(() => data.meals.filter((meal) => meal.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time)), [data.meals, selectedDate]);
  const totals = totalNutrients(todaysMeals);
  const dayScoreMeal: Meal = { id: "day", date: selectedDate, type: "Custom", name: "Day", time: "", entries: todaysMeals.flatMap((meal) => meal.entries), createdAt: "" };
  const score = scoreMeal(dayScoreMeal, targets);
  const history = useMemo<ChartPoint[]>(() => Array.from({ length: range }, (_, index) => {
    const date = dateShift(index - range + 1);
    const dayTotals = totalNutrients(data.meals.filter((meal) => meal.date === date));
    return { label: range === 7 ? dateLabel(date, { weekday: "short" }) : dateLabel(date, { day: "numeric", month: index === 0 || index === range - 1 ? "short" : undefined }), value: dayTotals.calories, secondary: dayTotals.protein };
  }), [data.meals, range]);
  const caloriePercent = Math.min(100, totals.calories / targets.calories * 100);
  const water = data.waterByDate[selectedDate] ?? 0;
  const waterTarget = targets.water;
  return <div className="page page-dashboard"><PageHeading eyebrow="Daily wellness" title="Your day, in balance." description={`Here is your nutritional picture for ${dateLabel(selectedDate, { day: "numeric", month: "long" })}.`} action={<Button onClick={() => setAdding(true)}><Plus size={17} />Log meal</Button>} />
    <div className="dashboard-grid"><Card className="calorie-hero"><div><p className="eyebrow">Energy consumed</p><div className="hero-number">{formatNumber(totals.calories)}<span> kcal</span></div><p className="subtle">of {formatNumber(targets.calories)} kcal daily target</p><div className="calorie-progress"><ProgressBar value={caloriePercent} color="orange" /><span>{formatNumber(Math.max(0, targets.calories - totals.calories))} kcal remaining</span></div></div><Ring value={caloriePercent} size={136} stroke={10} color="orange"><strong>{Math.round(caloriePercent)}%</strong><span>complete</span></Ring><div className="hero-glow" /></Card>
      <Card className="score-card"><div><p className="eyebrow">Nutrition score</p><h2>{score.category}</h2><p className="subtle">A balanced day is built meal by meal.</p></div><Ring value={score.score} size={104} stroke={9} color="purple"><strong>{score.score}</strong><span>/ 100</span></Ring></Card>
      <Card className="water-card"><div className="water-icon"><Droplets size={22} /></div><div><p className="eyebrow">Hydration</p><h2>{(water / 1000).toFixed(1)} <span>L</span></h2><p className="subtle">of {(waterTarget / 1000).toFixed(1)} L today</p></div><div className="water-control"><Button variant="secondary" onClick={() => setWater(selectedDate, water + 250)}>+ 250 ml</Button><ProgressBar value={water / waterTarget * 100} color="blue" /></div></Card></div>
    <div className="macro-grid">{macroMeta.map(([label, key, color, unit]) => { const value = totals[key]; const target = targets[key]; return <Card className="macro-card" key={key}><div className={`macro-orb macro-${color}`} /><div><p>{label}</p><h3>{formatNumber(value, 1)}<span>/{target}{unit}</span></h3></div><ProgressBar value={value / target * 100} color={color} /></Card>; })}</div>
    <div className="content-grid"><Card className="analytics-card"><div className="card-head"><div><p className="eyebrow">Nutrition analytics</p><h2>Fuel consistency</h2></div><div className="segmented">{([7, 30, 90] as const).map((days) => <button onClick={() => setRange(days)} className={range === days ? "active" : ""} key={days}>{days}D</button>)}</div></div><div className="chart-legend"><span><i className="legend-dot orange" />Calories</span><span><i className="legend-dot purple" />Protein g</span><span className="trend-positive"><ArrowUpRight size={15} />Your current pattern</span></div><GradientAreaChart data={history} secondaryColor="#8b5cf6" /><div className="chart-summary"><div><strong>{Math.round(history.reduce((sum, point) => sum + point.value, 0) / Math.max(1, history.length))}</strong><span>avg. kcal/day</span></div><div><strong>{Math.round(history.reduce((sum, point) => sum + (point.secondary ?? 0), 0) / Math.max(1, history.length))}g</strong><span>avg. protein/day</span></div><button onClick={goToFood}>View full log <ArrowUpRight size={15} /></button></div></Card>
      <Card className="insight-card"><div className="insight-head"><span className="sparkle"><Sparkles size={18} /></span><div><p className="eyebrow">Smart insight</p><h2>Small win today</h2></div></div><p>{totals.protein >= targets.protein * 0.7 ? "You are building a strong protein base. A fiber-rich snack would make the day even more balanced." : "Protein is the most valuable next move. Try dal, eggs, paneer, or chicken at your next meal."}</p><div className="insight-chart"><TinyLineChart data={history.slice(-7)} color="#ff6b35" /></div><span className="insight-caption">Based on your meal pattern</span></Card></div>
    <div className="timeline-section"><div className="section-head"><div><p className="eyebrow">Daily meal timeline</p><h2>Today’s meals</h2></div><Button variant="secondary" onClick={() => setAdding(true)}><Plus size={16} />Add meal</Button></div>{todaysMeals.length ? <div className="timeline-list">{todaysMeals.map((meal) => <MealCard key={meal.id} meal={meal} targets={targets} onEdit={() => setEditor(meal)} onDelete={() => deleteMeal(meal.id)} />)}</div> : <Card className="empty-card"><h3>Nothing logged yet</h3><p>Start with a meal and NutriTrack will take care of the totals and insights.</p><Button onClick={() => setAdding(true)}><Plus size={16} />Add your first meal</Button></Card>}</div>
    {adding && <MealEditor onClose={() => setAdding(false)} />}{editor && <MealEditor meal={editor} onClose={() => setEditor(undefined)} />}
  </div>;
}
