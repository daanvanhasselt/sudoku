# Design: Uniqueness-check button + OpenAI → Anthropic Fable image import

Date: 2026-08-12
Status: Approved

## Goal

Two changes to the Sudoku player:

1. A **Check** button that reports whether the current puzzle state still has a
   unique solution, so the player can detect that a mistake was made — without
   revealing which cells are wrong.
2. Replace the broken OpenAI image-import backend (model error on
   `gpt-5-chat-latest`) with **Anthropic Claude Fable 5** via the official
   TypeScript SDK. Both "Load image" and "Take photo" use this path.

## Feature 1: Solution-uniqueness check

### Solver (`src/utils/solver.ts`)

- `countSolutions(grid?: GRID, cap = 2): number` — counts solutions of the
  puzzle formed by **all currently placed digits** (givens and user entries
  alike; pencil marks ignored), capped at `cap`.
- Standard backtracking with row/column/box bitmasks. `GRID` is column-major
  (`grid[col][row]`).
- An initial contradiction (duplicate digit in a row/col/box) returns 0
  without searching.
- Exported from `src/utils/index.ts`.

### UI (`src/components/page/controls.tsx`)

- A full-width **Check** button in the `advanced` controls section, placed
  above the Load image / Take photo row (that row is width-constrained to
  ~360px and can't fit a third button).
- On click, run the solver synchronously and write the result to the existing
  status line (`loadStatus` — not `loadError`, whose renderer prepends
  "Error:"):
  - 1 solution → "✓ Still exactly one solution"
  - 0 solutions → "✗ No solution — a mistake was made somewhere"
  - ≥2 solutions → "⚠ Multiple solutions — puzzle is under-constrained"
- Never indicates which cells are wrong.

### Tests

Jest unit tests (`src/utils/solver.test.ts`): unique puzzle → 1; that puzzle
with one wrong entry → 0; direct contradiction → 0; empty/sparse grid → 2
(capped); solved grid → 1.

## Feature 2: Anthropic Fable image import

### Module rename

`src/utils/openai.ts` → `src/utils/anthropic.ts`. Key storage moves to
localStorage key `sudoku_anthropic_api_key` (old OpenAI key is left behind,
unused). Exported names change accordingly (`getStoredAnthropicApiKey`, …).

### API call (`requestSudokuGridFromImage`)

- New dependency: `@anthropic-ai/sdk`. Client constructed per-request with the
  stored key and `dangerouslyAllowBrowser: true` (key is user-supplied and
  lives in their browser; the SDK then sends the CORS opt-in header).
- Model: `claude-fable-5`.
- Request: one user message with the image as a base64 `image` content block
  (media type parsed from the data URL) plus the extraction instruction.
- **Structured output** via `output_config.format` (`json_schema` for
  `{grid: number[][]}`) replaces the old fence-stripping/regex JSON parsing.
  The 9×9 shape is still validated client-side (JSON-schema array-length
  constraints aren't supported) and converted with `createGridFromDigits`.
- Fable constraints respected: no `thinking` or `temperature` params (400 on
  Fable), `max_tokens: 16000` headroom (thinking is always on and shares the
  cap), and a `stop_reason === "refusal"` check before reading content.
- Server-side fallback enabled: beta `server-side-fallback-2026-07-01` +
  `fallbacks: "default"`, so a rare classifier refusal transparently retries
  on an Opus-tier model.
- Abort support preserved by passing `{ signal }` as request options.

### UI text (`controls.tsx`)

"Set/Update OpenAI key" → "Set/Update Anthropic key"; key prompt and error
messages updated; status "Uploading image to Anthropic…".

## Error handling

- Solver: total function, no failure modes; empty grid is a valid input.
- API: SDK typed errors surface their message on the existing error line;
  refusal → clear message; abort keeps the existing "cancelled" path.

## Verification

`tsc --noEmit`, `npm test` (solver tests), production build; manual check of
the Check button; then deploy to GitHub Pages.
