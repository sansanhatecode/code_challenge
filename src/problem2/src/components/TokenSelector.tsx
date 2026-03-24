import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import type { Token } from "../types/token";
import { useDebounce } from "../hooks/useDebounce";
import { useMockLoading } from "../hooks/useMockLoading";
import { TokenListItem } from "./TokenListItem";
import { TokenChip } from "./TokenChip";

interface TokenSelectorProps {
  tokens: Token[];
  selected: Token | null;
  onSelect: (token: Token) => void;
  disabled?: boolean;
}

export function TokenSelector({ tokens, selected, onSelect, disabled }: TokenSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useDebounce(search, 300);
  const { loading: mockLoading, reset: resetMockLoading } = useMockLoading(debouncedSearch);

  const filtered = useMemo(() => {
    if (debouncedSearch === "") return tokens;
    return tokens.filter((t) =>
      t.currency.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch, tokens]);

  const searching = mockLoading || (search !== "" && search !== debouncedSearch);

  useEffect(() => {
    if (open) {
      searchRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  function pick(token: Token) { onSelect(token); close(); }
  function close() {
    setOpen(false);
    setSearch("");
    resetMockLoading();
  }

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(true)}
        className={`
          flex items-center gap-2 shrink-0 rounded-full font-bold transition-all duration-200 cursor-pointer
          ${selected
            ? "bg-s3 text-t1 text-lg pl-2 pr-3 py-1.5 hover:bg-s-hover hover:shadow-md"
            : "bg-ac text-white text-sm font-semibold px-4 py-2.5 hover:bg-ac-hover"
          }
        `}
      >
        {selected ? (
          <>
            <img src={selected.image} alt={selected.currency}
              className="w-7 h-7 rounded-full bg-s2"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <span className="tracking-tight">{selected.currency}</span>
          </>
        ) : (
          <span>Select token</span>
        )}
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="opacity-60">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-1000 flex items-center justify-center p-4 sm:p-5 animate-[overlay-in_0.2s_ease]"
          onClick={close}
        >
          <div
            className="
              w-full max-w-105 max-h-[80dvh] sm:max-h-[min(80dvh,600px)] bg-s1 border border-bd-md
              rounded-3xl flex flex-col overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.4)]
              animate-[modal-in_0.25s_cubic-bezier(0.16,1,0.3,1)]
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 shrink-0">
              <h2 className="text-base font-bold text-t1">Select a token</h2>
              <button
                type="button"
                onClick={close}
                className="w-9 h-9 grid place-items-center rounded-xl bg-s2 text-t3 hover:bg-s3 hover:text-t2 active:scale-90 transition-all cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Search */}
            <div className="relative mx-5 mt-4 shrink-0">
              {searching ? (
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-t3/30 border-t-ac rounded-full animate-[spin_0.6s_linear_infinite]" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-t3 pointer-events-none">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
              )}
              <input
                ref={searchRef}
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-s2 border border-bd text-t1 placeholder:text-t3 outline-none focus:border-ac/40 focus:shadow-[0_0_0_3px_rgba(108,92,231,0.1)] transition-all max-sm:text-base"
              />
            </div>

            {/* Popular chips */}
            <div className="flex flex-wrap gap-2 px-5 pt-3 shrink-0 max-[360px]:hidden">
              {tokens.slice(0, 6).map((token) => (
                <TokenChip
                  key={token.currency}
                  token={token}
                  isSelected={selected?.currency === token.currency}
                  onSelect={() => pick(token)}
                />
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-bd mx-5 mt-3 shrink-0" />

            {/* List */}
            <ul className="flex-1 min-h-0 overflow-y-auto p-2 [-webkit-overflow-scrolling:touch]">
              {searching ? (
                <li className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="w-7 h-7 border-[2.5px] border-t3/20 border-t-ac rounded-full animate-[spin_0.7s_linear_infinite]" />
                  <span className="text-xs text-t3">Searching...</span>
                </li>
              ) : filtered.length === 0 ? (
                <li className="py-10 text-center text-sm text-t3">No tokens found</li>
              ) : filtered.map((token) => (
                <TokenListItem
                  key={token.currency}
                  token={token}
                  isSelected={selected?.currency === token.currency}
                  onSelect={() => pick(token)}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
