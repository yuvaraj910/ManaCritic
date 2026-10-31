import { useState } from "react";
import { NutriProvider, useNutri } from "./AppContext";
import { AppShell, type PageKey } from "./components/AppShell";
import Dashboard from "./pages/Dashboard";
import FoodLog from "./pages/FoodLog";
import Nutrition from "./pages/Nutrition";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import Sleep from "./pages/Sleep";

function NutriApp() {
  const [page, setPage] = useState<PageKey>("dashboard");
  const { selectedDate, setSelectedDate, theme, toggleTheme } = useNutri();
  const content = {
    dashboard: <Dashboard goToFood={() => setPage("food")} />,
    food: <FoodLog />,
    nutrition: <Nutrition />,
    sleep: <Sleep />,
    progress: <Progress />,
    settings: <Settings />,
  }[page];
  return <AppShell page={page} setPage={setPage} selectedDate={selectedDate} setSelectedDate={setSelectedDate} theme={theme} toggleTheme={toggleTheme}>{content}</AppShell>;
}

export default function App() {
  return <NutriProvider><NutriApp /></NutriProvider>;
}
