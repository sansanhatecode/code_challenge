import type { Token } from "../types/token";
import { formatUsd } from "../utils/format";
import { TokenSelector } from "./TokenSelector";

interface SwapPanelProps {
  label: string;
  token: Token | null;
  amount: string;
  usd: string | null;
  error?: string;
  editable?: boolean;
  onAmountChange?: (v: string) => void;
  tokens: Token[];
  onSelectToken: (t: Token) => void;
}

export function SwapPanel({
  label, token, amount, usd, error, editable, onAmountChange, tokens, onSelectToken,
}: SwapPanelProps) {
  return (
    <div className={`
      rounded-2xl p-4 transition-all duration-200
      ${error
        ? "bg-red-500/4 border border-red-500/30"
        : "bg-s2 border border-bd hover:border-bd-md focus-within:border-ac/30 focus-within:shadow-[0_0_0_3px_rgba(108,92,231,0.08)]"
      }
    `}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-t3">{label}</span>
        {token && (
          <span className="text-[11px] font-medium text-ac tabular-nums">
            1 {token.currency} = {formatUsd(token.price)}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <input
          type="text"
          inputMode={editable ? "decimal" : undefined}
          placeholder="0"
          value={amount}
          readOnly={!editable}
          tabIndex={editable ? undefined : -1}
          onChange={editable ? (e) => {
            const v = e.target.value;
            if (v === "" || /^\d*\.?\d*$/.test(v)) onAmountChange?.(v);
          } : undefined}
          className={`
            flex-1 min-w-0 bg-transparent outline-none
            text-[28px] sm:text-[32px] font-semibold tabular-nums tracking-tight
            placeholder:text-t3
            ${editable ? "text-t1" : "text-t2 cursor-default"}
          `}
        />
        <TokenSelector tokens={tokens} selected={token} onSelect={onSelectToken} />
      </div>
      <div className="flex items-center justify-between mt-2 min-h-[18px]">
        {usd && <span className="text-xs text-t3 tabular-nums">~${usd}</span>}
        {error && <span className="text-xs font-medium text-red-400 ml-auto">{error}</span>}
      </div>
    </div>
  );
}
