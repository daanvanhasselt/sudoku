import { GRID, ROW, CELL, N } from 'typings'

function createEmptyGrid(): GRID {
  const grid: GRID = [
    [{}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}],
  ]

  return grid
}

interface IColInput {
  grid: GRID
  col: number
  value: N
}

interface IRowInput {
  grid: GRID
  row: number
  value: N
}

interface IBlockInput {
  grid: GRID
  col: number
  row: number
  value: N
}

function isInCol({ grid, col, value }: IColInput): boolean {
  for (let i = 0; i < 9; i++) {
    if (grid[i][col].value === value) return true
  }
  return false
}

function isInRow({ grid, row, value }: IRowInput): boolean {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i].value === value) return true
  }
  return false
}

function isInBlock({ grid, col, row, value }: IBlockInput): boolean {
  row = Math.floor(row / 3) * 3
  col = Math.floor(col / 3) * 3
  console.log(`row: ${row}, col: ${col}, value: ${value}`)

  for (let i = row; i < row + 3; i++) {
    for (let j = col; j < col + 3; j++) {
      console.log(`grid[${i}][${j}]`, grid[i][j])
      if (grid[i][j].value === value) return true
    }
  }
  return false
}

export { createEmptyGrid, isInCol, isInRow, isInBlock }
