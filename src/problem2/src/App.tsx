import { useTokenPrices } from "./hooks/useTokenPrices";
import { useTheme } from "./hooks/useTheme";
import { SwapForm } from "./components/SwapForm";

function App() {
  const { tokens, loading, error } = useTokenPrices();
  const { theme, toggleTheme } = useTheme();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-3 border-white/10 border-t-violet-500 rounded-full animate-spin mb-5" />
        <p className="text-sm text-slate-500">Loading tokens...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 text-sm bg-surface-1 border border-white/5 rounded-2xl p-10">
        Failed to load token prices: {error}
      </div>
    );
  }

  return <SwapForm tokens={tokens} theme={theme} onToggleTheme={toggleTheme} />;
}

export default App;
