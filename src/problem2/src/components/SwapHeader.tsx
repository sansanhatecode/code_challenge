import type { Theme } from "../hooks/useTheme";

interface SwapHeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export function SwapHeader({ theme, onToggleTheme }: SwapHeaderProps) {
  return (
    <div className="flex items-center justify-between px-1 sm:px-2 pb-4">
      <h1 className="text-xl font-bold text-t1 tracking-tight">Swap</h1>
      <button
        type="button"
        onClick={onToggleTheme}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        className="
          w-9 h-9 grid place-items-center rounded-xl
          border border-bd bg-s2 text-t3
          hover:text-ac hover:bg-s3 hover:border-ac/30
          active:scale-90 transition-all duration-200 cursor-pointer
        "
      >
        {theme === "dark" ? (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        ) : (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        )}
      </button>
    </div>
  );
}
