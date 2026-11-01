import { Calculator, Check, Download, Moon, RefreshCcw, Sun, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useNutri } from "../AppContext";
import { Button, Card, PageHeading, Pill, ProgressBar } from "../components/ui";
import type { ActivityLevel, AppData, Goal, Profile, Targets } from "../types/nutrition";
import { activityLabel, calculateBmr, calculateTargets } from "../utils/goals";
import { formatNumber } from "../utils/nutrition";

function TargetsForm({ profile }: { profile: Profile }) {
  const { data, setProfile, setManualTargets } = useNutri();
  const [draft, setDraft] = useState(profile);
  const [manual, setManual] = useState<Targets>(data.manualTargets ?? calculateTargets(profile));
  const [useManual, setUseManual] = useState(Boolean(data.manualTargets));
  const estimated = calculateTargets(draft);
  function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    setProfile(draft);
    setManualTargets(useManual ? manual : undefined);
  }
  return <form onSubmit={saveProfile}><Card className="settings-card"><div className="card-head"><div><p className="eyebrow">Personal calculation</p><h2>Set your goal</h2></div><Pill tone="purple">Local only</Pill></div><div className="settings-form-grid"><label>Primary goal<select value={draft.goal} onChange={(event) => setDraft({ ...draft, goal: event.target.value as Goal })}><option value="gain">Bulking / gain</option><option value="maintenance">Maintenance</option><option value="loss">Weight loss</option></select></label><label>Current weight (kg)<input type="number" min="25" max="300" step="0.1" value={draft.currentWeight} onChange={(event) => setDraft({ ...draft, currentWeight: Number(event.target.value) })} /></label><label>Target weight (kg)<input type="number" min="25" max="300" step="0.1" value={draft.targetWeight} onChange={(event) => setDraft({ ...draft, targetWeight: Number(event.target.value) })} /></label><label>Height (cm)<input type="number" min="100" max="240" value={draft.height} onChange={(event) => setDraft({ ...draft, height: Number(event.target.value) })} /></label><label>Age<input type="number" min="15" max="100" value={draft.age} onChange={(event) => setDraft({ ...draft, age: Number(event.target.value) })} /></label><label>Sex<select value={draft.sex} onChange={(event) => setDraft({ ...draft, sex: event.target.value as Profile["sex"] })}><option value="female">Female</option><option value="male">Male</option><option value="other">Other / prefer not to say</option></select></label><label>Activity level<select value={draft.activity} onChange={(event) => setDraft({ ...draft, activity: event.target.value as ActivityLevel })}>{(["sedentary", "light", "moderate", "active", "veryActive"] as ActivityLevel[]).map((level) => <option key={level} value={level}>{activityLabel(level)}</option>)}</select></label><label>Goal pace (kg/week)<input type="number" min="0.1" max="1" step="0.05" value={draft.weeklyRate} onChange={(event) => setDraft({ ...draft, weeklyRate: Number(event.target.value) })} /></label><label>Sleep target (hours)<input type="number" min="4" max="12" step="0.5" value={draft.sleepTarget} onChange={(event) => setDraft({ ...draft, sleepTarget: Number(event.target.value) })} /></label></div><div className="target-estimate"><div><Calculator size={18} /><span>BMR estimate</span><strong>{formatNumber(calculateBmr(draft))} kcal</strong></div><div><span>Estimated TDEE</span><strong>{formatNumber(estimated.calories - (draft.goal === "gain" ? 280 : draft.goal === "loss" ? -360 : 0))} kcal</strong></div><div><span>Activity</span><strong>{activityLabel(draft.activity)}</strong></div></div><div className="manual-toggle"><div><strong>Manual targets</strong><p>Override estimates when you have targets from a clinician or coach.</p></div><label className="switch"><input type="checkbox" checked={useManual} onChange={(event) => setUseManual(event.target.checked)} /><span /></label></div>{useManual && <div className="target-input-grid">{(["calories", "protein", "carbs", "fat", "fiber", "water"] as (keyof Targets)[]).map((key) => <label key={key}>{key[0].toUpperCase() + key.slice(1)}<input type="number" min="0" value={manual[key] as number} onChange={(event) => setManual({ ...manual, [key]: Number(event.target.value), manual: true })} /></label>)}</div>}<div className="settings-save"><Button type="submit"><Check size={17} />Save profile & targets</Button></div></Card></form>;
}

export default function Settings() {
  const { data, setData, theme, toggleTheme, resetData } = useNutri();
  const fileRef = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState("");
  const exportData = () => {
    const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), data }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = `mana-critic-backup-${new Date().toISOString().slice(0, 10)}.json`; anchor.click(); URL.revokeObjectURL(url);
    setNotice("Your local backup has been downloaded.");
  };
  const importData = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { try { const parsed = JSON.parse(String(reader.result)) as { data?: unknown } | AppData; const imported = ("data" in parsed && parsed.data ? parsed.data : parsed) as AppData; if (!Array.isArray(imported.meals) || !imported.profile || !Array.isArray(imported.sleep)) throw new Error("Not a Mana Critic backup"); setData(imported); setNotice("Backup imported. Your dashboard now reflects the restored data."); } catch { setNotice("That file could not be read as a Mana Critic backup."); } };
    reader.readAsText(file);
  };
  return <div className="page"><PageHeading eyebrow="Your space" title="Settings" description="Personalize your estimates, appearance, and local data." />
    <div className="settings-layout"><div><TargetsForm profile={data.profile} /><Card className="settings-card theme-card"><div className="card-head"><div><p className="eyebrow">Appearance</p><h2>Theme</h2></div>{theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}</div><p className="subtle">Use the interface that feels calmest to you. Your preference stays on this device.</p><div className="theme-options"><button className={theme === "light" ? "selected" : ""} onClick={() => theme !== "light" && toggleTheme()}><span className="theme-preview light-preview" /><strong>Light</strong><small>Warm & bright</small></button><button className={theme === "dark" ? "selected" : ""} onClick={() => theme !== "dark" && toggleTheme()}><span className="theme-preview dark-preview" /><strong>Dark</strong><small>Deep & quiet</small></button></div></Card></div>
      <aside className="settings-side"><Card className="settings-card"><p className="eyebrow">Calculated targets</p><h2>Your daily focus</h2><div className="settings-target-summary">{[["Calories", data.manualTargets?.calories ?? calculateTargets(data.profile).calories, "kcal", "orange"], ["Protein", data.manualTargets?.protein ?? calculateTargets(data.profile).protein, "g", "purple"], ["Carbohydrates", data.manualTargets?.carbs ?? calculateTargets(data.profile).carbs, "g", "blue"], ["Fat", data.manualTargets?.fat ?? calculateTargets(data.profile).fat, "g", "green"]].map(([label, value, unit, color]) => <div key={label as string}><span>{label}</span><strong>{value} {unit}</strong><ProgressBar value={74} color={color as "orange"} /></div>)}</div><p className="form-note">{data.manualTargets ? "Using your manual targets." : "Estimated with Mifflin–St Jeor and your selected activity level."}</p></Card><Card className="settings-card data-card"><p className="eyebrow">Your data</p><h2>Private by design</h2><p className="subtle">Everything in Mana Critic stays in this browser until you choose to export it.</p><div className="data-actions"><Button variant="secondary" onClick={exportData}><Download size={16} />Export JSON</Button><Button variant="secondary" onClick={() => fileRef.current?.click()}><Upload size={16} />Import backup</Button><input ref={fileRef} type="file" accept="application/json" hidden onChange={(event) => importData(event.target.files?.[0])} /></div>{notice && <p className="import-notice">{notice}</p>}<button className="reset-button" onClick={() => { if (window.confirm("Reset all Mana Critic logs and local settings? This cannot be undone without a backup.")) { resetData(); setNotice("All local logs have been reset."); } }}><RefreshCcw size={15} />Reset local data</button></Card></aside></div>
  </div>;
}
