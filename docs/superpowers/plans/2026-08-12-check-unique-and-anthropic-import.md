# Uniqueness Check + Anthropic Fable Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Check" button that reports whether the current puzzle still has a unique solution, and replace the broken OpenAI image import with Anthropic Claude Fable 5.

**Architecture:** A pure-TypeScript backtracking solver in `src/utils/solver.ts` counts solutions (capped at 2) over all placed digits; the Controls component surfaces the result on its existing status line. The OpenAI module is replaced by `src/utils/anthropic.ts` using the official `@anthropic-ai/sdk` in browser mode with structured JSON output.

**Tech Stack:** React 18 + TypeScript 4.9 (CRA/craco), Redux, styled-components v6, Jest (via `react-scripts test`), `@anthropic-ai/sdk`.

## Global Constraints

- `GRID` is **column-major**: `grid[col][row]` (see `src/typings/index.ts`). `createGridFromDigits` in `src/utils/grid.ts` takes **row-major** `digits[row][col]` with 0 = empty.
- TypeScript path aliases: imports like `from 'typings'`, `from 'utils'`, `from 'reducers'` work (baseUrl is `src`).
- Anthropic model ID is exactly `claude-fable-5`. Do NOT pass `thinking` or `temperature` parameters (they 400 on this model).
- Run tests with `npm test -- --watchAll=false`. Type-check with `npx tsc --noEmit`.
- Do not touch the service-worker, reducers, or grid components.

---

### Task 1: Solution-counting solver

**Files:**
- Create: `src/utils/solver.ts`
- Create: `src/utils/solver.test.ts`
- Modify: `src/utils/index.ts`

**Interfaces:**
- Consumes: `GRID` from `typings`, `createGridFromDigits` from `./grid` (tests only).
- Produces: `countSolutions(grid?: GRID, cap?: number): number` — counts solutions of the puzzle formed by all placed `cell.value` digits (givens and user entries; pencil marks ignored), stopping at `cap` (default 2). Returns 0 if the placed digits already contradict each other.

- [ ] **Step 1: Write the failing tests**

Create `src/utils/solver.test.ts`:

```typescript
import { countSolutions } from './solver'
import { createGridFromDigits } from './grid'

// Well-known puzzle with exactly one solution (Wikipedia's example).
const UNIQUE_PUZZLE = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
]

// Its unique solution.
const SOLVED = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
]

const clone = (digits: number[][]) => digits.map((row) => [...row])

describe('countSolutions', () => {
  it('returns 1 for a puzzle with a unique solution', () => {
    expect(countSolutions(createGridFromDigits(UNIQUE_PUZZLE))).toBe(1)
  })

  it('returns 1 for a fully solved grid', () => {
    expect(countSolutions(createGridFromDigits(SOLVED))).toBe(1)
  })

  it('returns 0 when a legal-looking but wrong digit is placed', () => {
    // Cell row 0, col 2 must be 4 in the solution; 1 does not conflict
    // with any peer but makes the puzzle unsolvable.
    const digits = clone(UNIQUE_PUZZLE)
    digits[0][2] = 1
    expect(countSolutions(createGridFromDigits(digits))).toBe(0)
  })

  it('returns 0 when placed digits directly contradict', () => {
    const digits = clone(UNIQUE_PUZZLE)
    digits[0][3] = 5 // second 5 in row 0
    expect(countSolutions(createGridFromDigits(digits))).toBe(0)
  })

  it('returns 2 (the cap) for an under-constrained grid', () => {
    const digits = clone(UNIQUE_PUZZLE)
    // Remove most givens so several solutions exist.
    for (let r = 3; r < 9; r++) digits[r] = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    expect(countSolutions(createGridFromDigits(digits))).toBe(2)
  })

  it('returns 2 for an undefined/empty grid', () => {
    expect(countSolutions(undefined)).toBe(2)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- --watchAll=false solver`
Expected: FAIL — `Cannot find module './solver'`

- [ ] **Step 3: Implement the solver**

Create `src/utils/solver.ts`:

```typescript
import { GRID } from 'typings'

const boxIndex = (row: number, col: number) =>
  Math.floor(row / 3) * 3 + Math.floor(col / 3)

/**
 * Counts the solutions of the puzzle formed by every placed digit in the
 * grid (givens and user entries alike), stopping once `cap` solutions are
 * found. Returns 0 when the placed digits already contradict each other.
 */
export function countSolutions(grid?: GRID, cap: number = 2): number {
  // Flatten to row-major cells[row * 9 + col]; 0 = empty. GRID is column-major.
  const cells: number[] = new Array(81).fill(0)
  if (grid) {
    for (let col = 0; col < 9; col++) {
      for (let row = 0; row < 9; row++) {
        const value = grid[col][row].value
        if (value) cells[row * 9 + col] = value
      }
    }
  }

  const rowMask: number[] = new Array(9).fill(0)
  const colMask: number[] = new Array(9).fill(0)
  const boxMask: number[] = new Array(9).fill(0)

  // Seed masks from placed digits; a duplicate in any unit means 0 solutions.
  for (let i = 0; i < 81; i++) {
    const value = cells[i]
    if (!value) continue
    const row = Math.floor(i / 9)
    const col = i % 9
    const box = boxIndex(row, col)
    const bit = 1 << value
    if (rowMask[row] & bit || colMask[col] & bit || boxMask[box] & bit) {
      return 0
    }
    rowMask[row] |= bit
    colMask[col] |= bit
    boxMask[box] |= bit
  }

  const empties: number[] = []
  for (let i = 0; i < 81; i++) {
    if (!cells[i]) empties.push(i)
  }

  let count = 0

  const solve = (depth: number): void => {
    if (count >= cap) return

    // Most-constrained-cell-first keeps the search tiny.
    let bestIdx = -1
    let bestCandidates = 0
    let bestCount = 10
    for (let k = depth; k < empties.length; k++) {
      const i = empties[k]
      const row = Math.floor(i / 9)
      const col = i % 9
      const used = rowMask[row] | colMask[col] | boxMask[boxIndex(row, col)]
      let candidates = 0
      let n = 0
      for (let v = 1; v <= 9; v++) {
        if (!(used & (1 << v))) {
          candidates |= 1 << v
          n++
        }
      }
      if (n < bestCount) {
        bestCount = n
        bestIdx = k
        bestCandidates = candidates
        if (n === 0) break
      }
    }

    if (bestIdx === -1) {
      // No empty cells left: found a complete valid solution.
      count++
      return
    }
    if (bestCount === 0) return // dead end

    const swapped = empties[depth]
    empties[depth] = empties[bestIdx]
    empties[bestIdx] = swapped

    const i = empties[depth]
    const row = Math.floor(i / 9)
    const col = i % 9
    const box = boxIndex(row, col)
    for (let v = 1; v <= 9; v++) {
      const bit = 1 << v
      if (!(bestCandidates & bit)) continue
      rowMask[row] |= bit
      colMask[col] |= bit
      boxMask[box] |= bit
      solve(depth + 1)
      rowMask[row] &= ~bit
      colMask[col] &= ~bit
      boxMask[box] &= ~bit
      if (count >= cap) break
    }

    empties[bestIdx] = empties[depth]
    empties[depth] = swapped
  }

  solve(0)
  return count
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- --watchAll=false solver`
Expected: PASS (6 tests)

- [ ] **Step 5: Export from utils**

Modify `src/utils/index.ts` — add:

```typescript
export * from './solver'
```

- [ ] **Step 6: Type-check and commit**

Run: `npx tsc --noEmit` — expected: no output.

```bash
git add src/utils/solver.ts src/utils/solver.test.ts src/utils/index.ts
git commit -m "feat: add solution-counting sudoku solver"
```

---

### Task 2: Replace OpenAI module with Anthropic Fable

**Files:**
- Create: `src/utils/anthropic.ts`
- Delete: `src/utils/openai.ts`
- Modify: `src/utils/index.ts`
- Modify: `package.json` (via `npm install @anthropic-ai/sdk`)

**Interfaces:**
- Consumes: `createGridFromDigits(digits: number[][]): GRID` from `./grid`.
- Produces (same call sites as the old openai.ts, new names):
  - `getStoredAnthropicApiKey(): string`
  - `setStoredAnthropicApiKey(key: string): void`
  - `clearStoredAnthropicApiKey(): void`
  - `requestSudokuGridFromImage({ apiKey, dataUrl, signal }): Promise<GRID>` (unchanged signature)

- [ ] **Step 1: Install the SDK**

Run: `npm install @anthropic-ai/sdk`

- [ ] **Step 2: Create the Anthropic module**

Create `src/utils/anthropic.ts`:

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { GRID } from 'typings'
import { createGridFromDigits } from './grid'

const STORAGE_KEY = 'sudoku_anthropic_api_key'

export const getStoredAnthropicApiKey = (): string => {
  if (typeof window === 'undefined') return ''
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? ''
  } catch (error) {
    console.error('Failed to read Anthropic API key from storage', error)
    return ''
  }
}

export const setStoredAnthropicApiKey = (key: string): void => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, key)
  } catch (error) {
    console.error('Failed to store Anthropic API key', error)
  }
}

export const clearStoredAnthropicApiKey = (): void => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear Anthropic API key', error)
  }
}

interface IRequestSudokuParams {
  apiKey: string
  dataUrl: string
  signal?: AbortSignal
}

const PROMPT =
  'Extract the Sudoku puzzle from this image. Return the grid as nine rows of nine integers, top row first, using digits 1-9 for given cells and 0 for empty cells.'

const GRID_SCHEMA = {
  type: 'object',
  properties: {
    grid: {
      type: 'array',
      description:
        'Nine rows of nine integers (0-9), top row of the puzzle first. 0 means an empty cell.',
      items: {
        type: 'array',
        items: { type: 'integer' },
      },
    },
  },
  required: ['grid'],
  additionalProperties: false,
}

type ImageMediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

const SUPPORTED_MEDIA_TYPES: ImageMediaType[] = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]

const parseDataUrl = (
  dataUrl: string
): { mediaType: ImageMediaType; data: string } => {
  const match = /^data:([a-z0-9/+.-]+);base64,(.+)$/i.exec(dataUrl)
  if (!match) {
    throw new Error('Could not read the selected image')
  }
  const mediaType = match[1].toLowerCase() as ImageMediaType
  if (!SUPPORTED_MEDIA_TYPES.includes(mediaType)) {
    throw new Error(`Unsupported image type: ${match[1]}`)
  }
  return { mediaType, data: match[2] }
}

export const requestSudokuGridFromImage = async ({
  apiKey,
  dataUrl,
  signal,
}: IRequestSudokuParams): Promise<GRID> => {
  const { mediaType, data } = parseDataUrl(dataUrl)

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  const response = await client.beta.messages.create(
    {
      model: 'claude-fable-5',
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      // Fable's safety classifiers can decline a request; "default" retries
      // it server-side on Anthropic's recommended fallback model.
      fallbacks: 'default',
      output_config: {
        format: { type: 'json_schema', schema: GRID_SCHEMA },
      },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data },
            },
            { type: 'text', text: PROMPT },
          ],
        },
      ],
    } as any,
    { signal }
  )

  if (response.stop_reason === 'refusal') {
    throw new Error(
      'Claude declined to read this image. Please try a different photo.'
    )
  }

  const textBlock = response.content.find((block) => block.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Unexpected response format from Anthropic')
  }

  let payload: { grid?: number[][] }
  try {
    payload = JSON.parse(textBlock.text)
  } catch (error) {
    console.error('Failed to parse Anthropic response', error, textBlock.text)
    throw new Error('Unable to parse grid from the Anthropic response')
  }

  if (
    !payload?.grid ||
    !Array.isArray(payload.grid) ||
    payload.grid.length !== 9 ||
    payload.grid.some((row) => !Array.isArray(row) || row.length !== 9)
  ) {
    throw new Error('Claude did not return a 9x9 grid')
  }

  return createGridFromDigits(payload.grid)
}
```

Notes:
- The `as any` on the request params is deliberate: `fallbacks: 'default'` and `output_config.format` may be newer than the installed SDK's TypeScript types. The runtime shape is correct; do NOT remove those fields to satisfy the compiler. If the installed SDK types them, remove the `as any`.
- Do NOT add `thinking` or `temperature` — both are rejected by `claude-fable-5`.
- Keep `{ signal }` as the second argument (request options) so aborting keeps working.

- [ ] **Step 3: Delete the old module and update the barrel export**

```bash
git rm src/utils/openai.ts
```

Modify `src/utils/index.ts` to read:

```typescript
export * from './grid'
export * from './anthropic'
export * from './solver'
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: errors ONLY in `src/components/page/controls.tsx` (stale imports of the old OpenAI names — fixed in Task 3). No errors in `src/utils/`.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/utils/anthropic.ts src/utils/index.ts
git commit -m "feat: replace OpenAI image import with Anthropic Claude Fable 5"
```

(It's fine that controls.tsx doesn't compile at this commit; Task 3 immediately fixes it.)

---

### Task 3: Wire up Controls — Check button + Anthropic renames

**Files:**
- Modify: `src/components/page/controls.tsx`

**Interfaces:**
- Consumes: `countSolutions` from `utils` (Task 1), `getStoredAnthropicApiKey` / `setStoredAnthropicApiKey` / `clearStoredAnthropicApiKey` / `requestSudokuGridFromImage` from `utils` (Task 2), `state.present.grid` via `useSelector`.

- [ ] **Step 1: Update imports and key handling**

In `src/components/page/controls.tsx`:

1. Replace the utils import block:

```typescript
import {
  decodeGrid,
  countSolutions,
  getStoredAnthropicApiKey,
  setStoredAnthropicApiKey,
  clearStoredAnthropicApiKey,
  requestSudokuGridFromImage,
} from 'utils'
```

2. Rename every OpenAI reference (state, handlers, copy):
   - `getStoredOpenAIApiKey()` → `getStoredAnthropicApiKey()` (both call sites in handlers and the `useState` initializer)
   - `setStoredOpenAIApiKey` → `setStoredAnthropicApiKey`
   - `clearStoredOpenAIApiKey` → `clearStoredAnthropicApiKey`
   - state `openAiKey`/`setOpenAiKey` → `anthropicKey`/`setAnthropicKey`
   - `handleConfigureOpenAiKey` → `handleConfigureAnthropicKey` (update its two callers in `handleLoadFromImageClick` / `handleTakePhotoClick` and the button `onClick`)
   - prompt text → `'Enter your Anthropic API key (leave empty to remove):'`
   - status strings → `'Anthropic API key saved locally.'` / `'Anthropic API key removed.'`
   - error → `'Please configure your Anthropic API key first.'`
   - upload status → `'Uploading image to Anthropic...'`
   - key button label → `{anthropicKey ? 'Update Anthropic key' : 'Set Anthropic key'}`

- [ ] **Step 2: Add the grid selector and check handler**

Inside the `Controls` component (near the existing `mode` selector):

```typescript
const grid = useSelector((state: IReducer) => state.present.grid)

const handleCheckUniqueness = () => {
  const solutions = countSolutions(grid)
  setLoadError('')
  if (solutions === 1) {
    setLoadStatus('✓ Still exactly one solution')
  } else if (solutions === 0) {
    setLoadStatus('✗ No solution — a mistake was made somewhere')
  } else {
    setLoadStatus('⚠ Multiple solutions — puzzle is under-constrained')
  }
}
```

- [ ] **Step 3: Add the Check button to the advanced section**

In the JSX, inside `<ControlsDiv data-tag="advanced">`, ABOVE the existing `<AdvancedButtonsRow>`, add:

```tsx
<Btn $small={true} onClick={handleCheckUniqueness}>
  Check unique solution
</Btn>
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit` — expected: clean.
Run: `npm test -- --watchAll=false` — expected: solver tests pass, no other failures.
Run: `grep -rn "OpenAI\|openai\|OpenAi" src/` — expected: no matches.

- [ ] **Step 5: Commit**

```bash
git add src/components/page/controls.tsx
git commit -m "feat: add uniqueness-check button and switch controls to Anthropic"
```

---

### Task 4: Production build verification

**Files:** none (verification only)

- [ ] **Step 1: Build**

Run: `npm run build`
Expected: "The build folder is ready to be deployed." (warnings OK, errors not)

- [ ] **Step 2: Report**

Write the final report (what was done, test/build output, any deviations) to the agreed report file.
