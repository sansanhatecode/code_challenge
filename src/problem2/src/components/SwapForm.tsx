import { useState, useMemo } from "react";
import type { Token } from "../types/token";
import type { Theme } from "../hooks/useTheme";
import { formatNumber } from "../utils/format";
import { SwapHeader } from "./SwapHeader";
import { SwapPanel } from "./SwapPanel";
import { ExchangeRate } from "./ExchangeRate";
import { SubmitButton } from "./SubmitButton";
import { SuccessMessage } from "./SuccessMessage";

interface SwapFormProps {
  tokens: Token[];
  theme: Theme;
  onToggleTheme: () => void;
}

export function SwapForm({ tokens, theme, onToggleTheme }: SwapFormProps) {
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toAmount = useMemo(() => {
    if (!fromToken || !toToken || !fromAmount || isNaN(Number(fromAmount))) return "";
    return formatNumber(Number(fromAmount) * (fromToken.price / toToken.price));
  }, [fromToken, toToken, fromAmount]);

  const exchangeRate = useMemo(() => {
    if (!fromToken || !toToken) return null;
    return fromToken.price / toToken.price;
  }, [fromToken, toToken]);

  function handleSwapDirection() {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setErrors({});
    setSuccess(false);
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!fromToken) e.fromToken = "Select a token";
    if (!toToken) e.toToken = "Select a token";
    if (!fromAmount || isNaN(Number(fromAmount)) || Number(fromAmount) <= 0)
      e.fromAmount = "Enter a valid amount";
    if (fromToken && toToken && fromToken.currency === toToken.currency)
      e.toToken = "Cannot swap the same token";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setSuccess(false);
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setSubmitting(false);
    setSuccess(true);
  }

  function clearError(key: string) {
    setErrors((p) => { const n = { ...p }; delete n[key]; return n; });
    setSuccess(false);
  }

  const fromUsd = fromToken && fromAmount && !isNaN(Number(fromAmount))
    ? (Number(fromAmount) * fromToken.price).toFixed(2) : null;
  const toUsd = toToken && toAmount && !isNaN(Number(toAmount))
    ? (Number(toAmount) * toToken.price).toFixed(2) : null;
  const canSubmit = !!(fromToken && toToken && fromAmount && Number(fromAmount) > 0);

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="
        relative bg-s1/80 backdrop-blur-2xl border border-bd rounded-3xl p-4 sm:p-5
        shadow-[0_20px_60px_rgba(0,0,0,0.25)]
        animate-[card-in_0.45s_cubic-bezier(0.16,1,0.3,1)]
      "
    >
      <SwapHeader theme={theme} onToggleTheme={onToggleTheme} />

      <SwapPanel
        label="You pay"
        token={fromToken}
        amount={fromAmount}
        usd={fromUsd}
        error={errors.fromToken || errors.fromAmount}
        editable
        onAmountChange={(v) => { setFromAmount(v); clearError("fromAmount"); }}
        tokens={tokens}
        onSelectToken={(t) => { setFromToken(t); clearError("fromToken"); }}
      />

      <div className="flex justify-center h-0 relative z-10">
        <button
          type="button"
          onClick={handleSwapDirection}
          className="
            w-10 h-10 -mt-5 grid place-items-center rounded-xl
            bg-s1 border-4 border-bg text-t3
            hover:text-ac hover:bg-s3 hover:rotate-180
            active:scale-90 transition-all duration-300 cursor-pointer
          "
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
        </button>
      </div>

      <SwapPanel
        label="You receive"
        token={toToken}
        amount={toAmount}
        usd={toUsd}
        error={errors.toToken}
        tokens={tokens}
        onSelectToken={(t) => { setToToken(t); clearError("toToken"); }}
      />

      {exchangeRate != null && fromToken && toToken && (
        <ExchangeRate rate={exchangeRate} fromToken={fromToken} toToken={toToken} />
      )}

      <SubmitButton
        submitting={submitting}
        canSubmit={canSubmit}
        hasTokens={!!(fromToken && toToken)}
      />

      {success && fromToken && toToken && (
        <SuccessMessage
          fromAmount={fromAmount}
          fromCurrency={fromToken.currency}
          toAmount={toAmount}
          toCurrency={toToken.currency}
        />
      )}
    </form>
  );
}
