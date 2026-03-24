import { useEffect, useState } from "react";
import type { Token, TokenPrice } from "../types/token";

const PRICES_URL = "https://interview.switcheo.com/prices.json";
const TOKEN_ICON_URL =
  "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens";

export function useTokenPrices() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch(PRICES_URL);
        if (!res.ok) throw new Error("Failed to fetch prices");
        const data: TokenPrice[] = await res.json();

        const priceMap = new Map<string, TokenPrice>();
        for (const item of data) {
          const existing = priceMap.get(item.currency);
          if (
            !existing ||
            new Date(item.date) > new Date(existing.date)
          ) {
            priceMap.set(item.currency, item);
          }
        }

        // Filter out tokens without a price and build token list
        const tokenList: Token[] = [];
        for (const [currency, info] of priceMap) {
          if (info.price > 0) {
            tokenList.push({
              currency,
              price: info.price,
              image: `${TOKEN_ICON_URL}/${currency}.svg`,
            });
          }
        }

        // Sort alphabetically
        tokenList.sort((a, b) => a.currency.localeCompare(b.currency));
        setTokens(tokenList);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchPrices();
  }, []);

  return { tokens, loading, error };
}
