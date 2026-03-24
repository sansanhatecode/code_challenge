# Currency Swap Form

A modern currency swap interface built with React, TypeScript, Vite, and Tailwind CSS v4.

## Prerequisites

- **Node.js** >= 20
- **npm** >= 9

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

## Available Scripts

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Start dev server with HMR          |
| `npm run build`     | Type-check and build for production |
| `npm run preview`   | Preview the production build       |
| `npm run lint`      | Run ESLint                         |

## Tech Stack

- **Vite 5** — fast build tool
- **React 19** + **TypeScript**
- **Tailwind CSS v4** — utility-first styling via `@tailwindcss/vite` plugin

## Features

- Token prices fetched from [Switcheo API](https://interview.switcheo.com/prices.json), deduplicated by most recent date
- Token icons from [Switcheo token-icons](https://github.com/Switcheo/token-icons/tree/main/tokens)
- Searchable token selector modal with debounced input and mock loading state
- Real-time exchange rate calculation and USD equivalent display
- Swap direction toggle
- Input validation (empty fields, zero/negative amounts, same-token swap)
- Simulated swap submission with loading spinner
- Dark / Light theme toggle (persisted in localStorage)
- Mobile responsive — modal becomes a bottom sheet on small screens

## Project Structure

```
src/
  components/
    SwapForm.tsx         # Main swap form with panels, rate, submit
    TokenSelector.tsx    # Token picker modal with search + debounce
  hooks/
    useTokenPrices.ts    # Fetch and deduplicate token prices
    useTheme.ts          # Dark/light theme toggle with localStorage
  types/
    token.ts             # Token and TokenPrice type definitions
  App.tsx                # Root component
  index.css              # Tailwind imports, CSS variables, keyframes
  main.tsx               # Entry point
```
