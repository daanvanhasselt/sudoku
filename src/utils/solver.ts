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
