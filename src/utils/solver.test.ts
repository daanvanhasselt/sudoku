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
