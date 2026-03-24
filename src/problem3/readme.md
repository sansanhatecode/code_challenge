# Problem 3: Messy React — Code Review

## Issues Found

### 1. Bug: Undefined variable `lhsPriority`

```ts
const balancePriority = getPriority(balance.blockchain);
if (lhsPriority > -99) { // ❌ lhsPriority is not defined, should be balancePriority
```

**Explanation:** The filter callback assigns the result to `balancePriority` but then references `lhsPriority`, which does not exist. This causes a runtime `ReferenceError` or always evaluates as falsy, meaning no items pass the filter.

**Fix:** Change `lhsPriority` to `balancePriority`.

---

### 2. Inverted filter logic

```ts
if (balance.amount <= 0) {
  return true;
}
```

**Explanation:** The filter keeps balances with `amount <= 0` (zero or negative balances) and discards positive ones. This is backwards — we want to **show** wallets that actually have funds.

**Fix:** Change condition to `balance.amount > 0`.

---

### 3. `blockchain` property missing from `WalletBalance` interface

```ts
interface WalletBalance {
  currency: string;
  amount: number;
  // ❌ missing: blockchain: string;
}
```

**Explanation:** The code accesses `balance.blockchain` in the filter and sort, but the `WalletBalance` interface does not declare this property. TypeScript would flag this as an error.

**Fix:** Add `blockchain: string` to the interface.

---

### 4. `getPriority` uses `any` type

```ts
const getPriority = (blockchain: any): number => { ... }
```

**Explanation:** Using `any` defeats TypeScript's type safety. It should be typed as `string` or a union type of the supported blockchain names.

**Fix:** Use `string` or a specific union type like `'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo'`.

---

### 5. `getPriority` is recreated every render

**Explanation:** `getPriority` is defined inside the component body. Since it is a pure function with no dependency on props or state, it gets unnecessarily recreated on every render.

**Fix:** Move `getPriority` **outside** the component. It also should be listed in the `useMemo` dependency array if kept inside, but moving it out is the cleanest solution.

---

### 6. `prices` in `useMemo` dependency but unused in the computation

```ts
const sortedBalances = useMemo(() => {
  // prices is never used here
}, [balances, prices]); // ❌ prices causes unnecessary recomputation
```

**Explanation:** `prices` is included as a dependency of `sortedBalances`, but it is never referenced inside the memo callback. Every time `prices` updates, the entire filter+sort is re-executed for no reason.

**Fix:** Remove `prices` from the dependency array.

---

### 7. `sort` comparator returns `undefined` for equal elements

```ts
if (leftPriority > rightPriority) {
  return -1;
} else if (rightPriority > leftPriority) {
  return 1;
}
// ❌ implicitly returns undefined when priorities are equal
```

**Explanation:** When two elements have equal priority, neither branch triggers and the function returns `undefined` instead of `0`. This leads to unstable/implementation-dependent sort behavior.

**Fix:** Return `0` for equal priorities, or simplify to `return rightPriority - leftPriority`.

---

### 8. `formattedBalances` is computed but never used

```ts
const formattedBalances = sortedBalances.map(...); // ❌ computed but ignored

const rows = sortedBalances.map((balance: FormattedWalletBalance, ...) => {
  // uses sortedBalances, not formattedBalances
  // balance.formatted would be undefined
});
```

**Explanation:** `formattedBalances` is created by mapping over `sortedBalances`, but then `rows` maps over `sortedBalances` again (not `formattedBalances`). The type annotation says `FormattedWalletBalance` but the actual objects don't have the `formatted` property, so `balance.formatted` is `undefined`.

**Fix:** Either use `formattedBalances` in the `rows` mapping, or merge the formatting directly into `rows` and remove the intermediate variable.

---

### 9. `formattedBalances` is not memoized

**Explanation:** Even if `formattedBalances` were used correctly, it is computed on every render without `useMemo`. Since it depends on `sortedBalances` (which is memoized), it should also be memoized to avoid unnecessary recalculations.

**Fix:** Wrap in `useMemo` or merge into the `rows` mapping.

---

### 10. Using array `index` as React `key`

```tsx
<WalletRow key={index} ... />
```

**Explanation:** Using the array index as a key causes incorrect DOM reconciliation when the list is reordered, filtered, or items are added/removed. React may reuse the wrong component instances, leading to visual bugs and stale state.

**Fix:** Use a stable, unique identifier such as `balance.currency`.

---

### 11. Empty `Props` interface

```ts
interface Props extends BoxProps {}
```

**Explanation:** This interface adds nothing over `BoxProps`. It's unnecessary indirection.

**Fix:** Use `BoxProps` directly as the component's prop type.

---

### 12. `children` destructured but never used

```ts
const { children, ...rest } = props;
// children is never rendered
```

**Explanation:** `children` is pulled out of props but is never included in the JSX return. If the component should render children, it should be included. If not, there's no need to destructure it.

**Fix:** Either render `{children}` in the returned JSX or remove the destructuring.

---

### 13. `classes.row` referenced but never defined

```tsx
className={classes.row}
```

**Explanation:** There is no `classes` object defined anywhere in the component. This would cause a `ReferenceError` at runtime. It likely requires a CSS-in-JS hook like `useStyles()` or a CSS module import.

**Fix:** Add the appropriate style import/hook, or use a plain CSS class string.

---

## Refactored Version

```tsx
import React, { useMemo } from "react";

// --- Types ---

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

// --- Constants ---

type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";

const BLOCKCHAIN_PRIORITY: Record<Blockchain, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

// Pure function — no deps on props/state, so it lives outside the component
const getPriority = (blockchain: string): number =>
  BLOCKCHAIN_PRIORITY[blockchain as Blockchain] ?? -99;

// --- Component ---

const WalletPage: React.FC<BoxProps> = (props: BoxProps) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Filter and sort balances — only depends on `balances`
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        return getPriority(balance.blockchain) > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        return getPriority(rhs.blockchain) - getPriority(lhs.blockchain);
      });
  }, [balances]);

  // Build rows — depends on sortedBalances AND prices
  const rows = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={balance.currency}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.amount.toFixed()}
        />
      );
    });
  }, [sortedBalances, prices]);

  return <div {...rest}>{rows}</div>;
};
```

### Summary of key changes

| # | What changed | Why |
|---|---|---|
| 1 | Fixed `lhsPriority` → `balancePriority` | Bug fix — variable was undefined |
| 2 | Flipped `<= 0` to `> 0` | Show wallets with positive balances |
| 3 | Added `blockchain` to interface | TypeScript correctness |
| 4 | Typed `blockchain` as `string` | Removed `any` |
| 5 | Moved `getPriority` outside component | Avoid recreation every render |
| 6 | Removed `prices` from `sortedBalances` deps | Not used in that computation |
| 7 | Sort uses subtraction (`rhs - lhs`) | Returns `0` for equal, cleaner |
| 8 | Merged formatting into `rows` | Eliminated unused `formattedBalances` |
| 9 | Memoized `rows` with `useMemo` | Avoids recomputing on every render |
| 10 | `key={balance.currency}` | Stable key instead of array index |
| 11 | Used `BoxProps` directly | Removed empty wrapper interface |
