import type { Token } from "../types/token";

interface TokenListItemProps {
  token: Token;
  isSelected: boolean;
  onSelect: () => void;
}

export function TokenListItem({ token, isSelected, onSelect }: TokenListItemProps) {
  return (
    <li
      onClick={onSelect}
      className={`
        flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-colors duration-150
        ${isSelected ? "bg-ac/10" : "hover:bg-s-hover"}
      `}
    >
      <img
        src={token.image}
        alt={token.currency}
        className="w-9 h-9 rounded-full bg-s3 shrink-0"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
      <span className="text-sm font-bold text-t1">{token.currency}</span>
      <span className="ml-auto text-xs text-t3 tabular-nums">
        ${token.price < 0.01 ? token.price.toFixed(6) : token.price.toFixed(2)}
      </span>
      {isSelected && (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-ac shrink-0">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      )}
    </li>
  );
}
