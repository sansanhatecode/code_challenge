# Code Challenge

Solutions for three coding challenges covering algorithms, frontend development, and code review.

## Problems

### Problem 1 — Sum to N

Three implementations of a function that computes the sum of integers from 1 to `n`:

| Approach | Complexity | Description |
| --- | --- | --- |
| `sum_to_n_a` | O(1) | Mathematical formula: `n * (n + 1) / 2` |
| `sum_to_n_b` | O(n) | Iterative loop |
| `sum_to_n_c` | O(n) | Recursion |

**Language:** JavaScript

### Problem 2 — Currency Swap Form

A modern token swap interface with real-time exchange rates, searchable token selector, and theme toggle.

**Tech stack:** React 19, TypeScript, Vite 5, Tailwind CSS v4

**Key features:**
- Token prices from [Switcheo API](https://interview.switcheo.com/prices.json)
- Debounced search, input validation, swap direction toggle
- Dark/light theme (persisted in localStorage)
- Mobile responsive

See [src/problem2/README.md](src/problem2/README.md) for setup instructions.

### Problem 3 — Messy React (Code Review)

A detailed code review identifying 13 issues in a poorly-written React component for displaying wallet balances. Includes the refactored solution with explanations.

**Issues covered:** undefined variables, inverted filter logic, missing interface properties, improper memoization, unstable React keys, unused variables, and more.

See [src/problem3/readme.md](src/problem3/readme.md) for the full analysis.

## Project Structure

```
src/
  problem1/
    sum_to_n.js           # Three sum implementations
  problem2/
    src/                  # React app source code
    package.json          # Dependencies and scripts
    README.md             # Setup and details
  problem3/
    readme.md             # Code review document
```
