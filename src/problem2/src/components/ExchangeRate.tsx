import type { Token } from "../types/token";
import { formatNumber } from "../utils/format";

interface ExchangeRateProps {
  rate: number;
  fromToken: Token;
  toToken: Token;
}

export function ExchangeRate({ rate, fromToken, toToken }: ExchangeRateProps) {
  return (
    <div className="flex items-center justify-center gap-1.5 mt-3 text-xs font-medium text-t3 tabular-nums bg-s2 border border-bd rounded-xl py-2.5 px-3">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ac">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
      1 {fromToken.currency} = {formatNumber(rate)} {toToken.currency}
    </div>
  );
}
