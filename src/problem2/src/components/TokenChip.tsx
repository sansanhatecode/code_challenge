import type { Token } from "../types/token";

interface TokenChipProps {
  token: Token;
  isSelected: boolean;
  onSelect: () => void;
}

export function TokenChip({ token, isSelected, onSelect }: TokenChipProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        flex items-center gap-1.5 pl-1.5 pr-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer
        ${isSelected
          ? "bg-ac/15 border-ac/40 text-t1"
          : "bg-s2 border-bd-md text-t2 hover:border-ac/30 hover:bg-s3"
        }
      `}
    >
      <img
        src={token.image}
        alt={token.currency}
        className="w-5 h-5 rounded-full bg-s3"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
      {token.currency}
    </button>
  );
}
