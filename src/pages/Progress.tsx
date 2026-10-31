import { ArrowDownRight, ArrowUpRight, Plus, Scale, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useNutri } from "../AppContext";
import { GradientAreaChart, type ChartPoint } from "../components/charts";
import { Button, Card, IconButton, Modal, PageHeading, Pill, ProgressBar } from "../components/ui";
import type { WeightEntry } from "../types/nutrition";
import { dateLabel, dateShift, formatNumber, totalNutrients } from "../utils/nutrition";

function WeightEditor({ onClose }: { onClose: () => void }) {
  const { saveWeight, selectedDate, data } = useNutri();
  const current = data.weightHistory.find((item) => item.date === selectedDate);
  const [date, setDate] = useState(selectedDate);
  const [weight, setWeight] = useState(current?.weight ?? data.profile.currentWeight);
  return <Modal title="Log weight" onClose={onClose}><form className="food-form" onSubmit={(event) => { event.preventDefault(); const sameDate = data.weightHistory.find((item) => item.date === date); saveWeight({ id: sameDate?.id ?? crypto.randomUUID(), date, weight }); onClose(); }}><label>Date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><label>Weight (kg)<input type="number" min="25" max="300" step="0.1" value={weight} onChange={(event) => setWeight(Number(event.target.value))} /></label><div className="modal-footer"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit">Save weight</Button></div></form></Modal>;
}

export default function Progress() {
  const { data, selectedDate, targets, deleteWeight } = useNutri();
  const [adding, setAdding] = useState(false);
  const entries = [...data.weightHistory].sort((a, b) => a.date.localeCompare(b.date));
  const latest = entries[entries.length - 1]?.weight ?? data.profile.currentWeight;
  const start = entries[0]?.weight ?? latest;
  const direction = data.profile.goal === "loss" ? -1 : 1;
  const overall = latest - start;
  const goalDistance = Math.abs(data.profile.targetWeight - start) || 1;
  const progress = Math.min(100, Math.abs(latest - start) / goalDistance * 100);
  const history = entries.map((entry) => ({ label: dateLabel(entry.date, { day: "numeric", month: "short" }), value: entry.weight }));
  const calorieHistory = useMemo<ChartPoint[]>(() => Array.from({ length: 7 }, (_, index) => { const date = dateShift(index - 6); const total = totalNutrients(data.meals.filter((meal) => meal.date === date)); return { label: dateLabel(date, { weekday: "short" }), value: total.calories, secondary: total.protein }; }), [data.meals]);
  return <div className="page"><PageHeading eyebrow="Progress over time" title="Every check-in counts." description="Focus on the trend, not a single day." action={<Button onClick={() => setAdding(true)}><Plus size={17} />Log weight</Button>} />
    <div className="progress-stat-grid"><Card className="weight-main-stat"><div className="weight-icon"><Scale size={22} /></div><div><p className="eyebrow">Current weight</p><h2>{latest.toFixed(1)}<span> kg</span></h2><p className={overall * direction >= 0 ? "trend-positive" : "trend-negative"}>{overall * direction >= 0 ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}{Math.abs(overall).toFixed(1)} kg from start</p></div></Card><Card className="weight-goal-stat"><p className="eyebrow">Goal weight</p><h2>{data.profile.targetWeight.toFixed(1)}<span> kg</span></h2><ProgressBar value={progress} color="purple" /><p>{Math.max(0, Math.abs(data.profile.targetWeight - latest)).toFixed(1)} kg to go · {Math.round(progress)}% there</p></Card><Card className="weight-goal-stat"><p className="eyebrow">Recommended pace</p><h2>{data.profile.weeklyRate.toFixed(2)}<span> kg/wk</span></h2><p>For your {data.profile.goal === "gain" ? "bulking" : data.profile.goal === "loss" ? "weight-loss" : "maintenance"} goal</p></Card></div>
    <div className="progress-grid"><Card className="weight-chart-card"><div className="card-head"><div><p className="eyebrow">Weight trend</p><h2>Measured progress</h2></div><Pill tone="purple">{entries.length} check-ins</Pill></div><GradientAreaChart data={history} color="#8b5cf6" valueLabel="Weight" /></Card><Card className="goal-path-card"><p className="eyebrow">Goal path</p><h2>{data.profile.goal === "gain" ? "Building steadily" : data.profile.goal === "loss" ? "Moving lighter" : "Holding strong"}</h2><p className="subtle">Your target is {data.profile.targetWeight.toFixed(1)} kg. Sustainable changes tend to look small day-to-day and clear over weeks.</p><div className="goal-line"><span className="start">{start.toFixed(1)} kg</span><ProgressBar value={progress} color="purple" /><span>{data.profile.targetWeight.toFixed(1)} kg</span></div></Card></div>
    <Card className="fuel-trend-card"><div className="card-head"><div><p className="eyebrow">Fuel context</p><h2>Calories & protein, recent 7 days</h2></div><Pill tone="orange">Target {formatNumber(targets.calories)} kcal</Pill></div><GradientAreaChart data={calorieHistory} color="#ff6b35" secondaryColor="#8b5cf6" /></Card>
    <Card className="weight-history-card"><div className="card-head"><div><p className="eyebrow">History</p><h2>Weight entries</h2></div></div><div>{[...entries].reverse().map((entry: WeightEntry) => <div className="weight-row" key={entry.id}><span>{dateLabel(entry.date)}</span><strong>{entry.weight.toFixed(1)} kg</strong><IconButton className="delete-icon" aria-label={`Delete weight logged on ${entry.date}`} onClick={() => deleteWeight(entry.id)}><Trash2 size={15} /></IconButton></div>)}</div></Card>{adding && <WeightEditor onClose={() => setAdding(false)} />}
  </div>;
}
