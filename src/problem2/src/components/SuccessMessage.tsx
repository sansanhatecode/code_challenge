interface SuccessMessageProps {
  fromAmount: string;
  fromCurrency: string;
  toAmount: string;
  toCurrency: string;
}

export function SuccessMessage({ fromAmount, fromCurrency, toAmount, toCurrency }: SuccessMessageProps) {
  return (
    <div className="mt-3 p-3.5 rounded-2xl flex items-start gap-3 bg-emerald-500/6 border border-emerald-500/20 animate-[slide-up_0.3s_cubic-bezier(0.16,1,0.3,1)]">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 mt-0.5 shrink-0">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <div>
        <strong className="block text-sm font-semibold text-emerald-400">Swap confirmed!</strong>
        <p className="text-xs text-t2 mt-0.5">
          {fromAmount} {fromCurrency} &rarr; {toAmount} {toCurrency}
        </p>
      </div>
    </div>
  );
}
