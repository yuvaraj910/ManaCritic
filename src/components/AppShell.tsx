import { BarChart3, CalendarDays, ChevronLeft, ChevronRight, CircleUserRound, Droplets, LayoutDashboard, Moon, Settings, Sun, UtensilsCrossed } from "lucide-react";
import type { ReactNode } from "react";
import type { Theme } from "../types/nutrition";
import { dateLabel } from "../utils/nutrition";
import { IconButton } from "./ui";
import { ManaLogo } from "./ManaLogo";

export type PageKey = "dashboard" | "food" | "nutrition" | "sleep" | "progress" | "settings";

const nav = [
  ["dashboard", "Dashboard", LayoutDashboard], ["food", "Food log", UtensilsCrossed], ["nutrition", "Nutrition", Droplets], ["sleep", "Sleep", Moon], ["progress", "Progress", BarChart3], ["settings", "Settings", Settings],
] as const;

export function AppShell({ page, setPage, selectedDate, setSelectedDate, theme, toggleTheme, children }: { page: PageKey; setPage: (page: PageKey) => void; selectedDate: string; setSelectedDate: (date: string) => void; theme: Theme; toggleTheme: () => void; children: ReactNode }) {
  const moveDate = (amount: number) => {
    const date = new Date(`${selectedDate}T12:00:00`);
    date.setDate(date.getDate() + amount);
    setSelectedDate(date.toISOString().slice(0, 10));
  };
  return <div className="app-shell">
    <aside className="sidebar"><a className="brand" href="#dashboard" onClick={() => setPage("dashboard")}><ManaLogo size={30} /><span className="brand-name">Mana <em>Critic</em></span></a>
      <nav>{nav.map(([key, label, Icon]) => <button key={key} className={page === key ? "nav-item active" : "nav-item"} onClick={() => setPage(key)}><Icon size={18} /><span>{label}</span></button>)}</nav>
      <div className="sidebar-foot"><div className="profile-chip"><span className="avatar">Y</span><div><strong>Your health</strong><small>Personal space</small></div></div></div>
    </aside>
    <main className="main"><header className="topbar"><div className="date-picker"><IconButton aria-label="Previous day" onClick={() => moveDate(-1)}><ChevronLeft size={18} /></IconButton><button onClick={() => setSelectedDate(new Date().toISOString().slice(0, 10))}><CalendarDays size={15} />{dateLabel(selectedDate, { weekday: "long", day: "numeric", month: "long" })}</button><IconButton aria-label="Next day" onClick={() => moveDate(1)}><ChevronRight size={18} /></IconButton></div><div className="top-actions"><IconButton aria-label="Toggle theme" onClick={toggleTheme}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</IconButton><IconButton className="desktop-only" aria-label="Profile"><CircleUserRound size={19} /></IconButton></div></header>{children}</main>
    <nav className="bottom-nav">{nav.slice(0, 5).map(([key, label, Icon]) => <button key={key} className={page === key ? "active" : ""} onClick={() => setPage(key)}><Icon size={20} /><span>{label}</span></button>)}</nav>
  </div>;
}
