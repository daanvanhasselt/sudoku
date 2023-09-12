import { GRID, COORDS, ROW, CELL, N } from 'typings'
import update from 'immutability-helper'

function createEmptyGrid(): GRID {
  const grid = Array.from({ length: 9 }).map<ROW>(
    () =>
      Array.from({ length: 9 }).map<CELL>(() => ({
        isSelected: false,
        isInitial: false,
      })) as ROW
  ) as GRID

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

function tickleCell(
  coords: COORDS,
  selectionMode?: boolean,
  grid?: GRID
): GRID | undefined {
  if (!grid) return createEmptyGrid()

  return update(grid, {
    [coords.col]: { [coords.row]: { isSelected: { $set: selectionMode } } },
  })
}

function setValueToSelectedCells(
  value?: N,
  grid?: GRID,
  settingModeActive: boolean = false
): GRID | undefined {
  if (!grid) return createEmptyGrid()

  return update(grid, {
    $set: grid.map((col) =>
      col.map((cell) => {
        if (
          cell.isSelected &&
          (!cell.isInitial ||
            settingModeActive ||
            (settingModeActive && !value))
        ) {
          return {
            ...cell,
            value,
            isInitial: settingModeActive && value ? true : false,
          }
        }
        return cell
      })
    ) as GRID,
  })
}

function setSelectionToAllCells(
  grid?: GRID,
  selected?: boolean
): GRID | undefined {
  if (!grid) return createEmptyGrid()

  return update(grid, {
    $set: grid.map((col) =>
      col.map((cell) => ({
        ...cell,
        isSelected: selected,
      }))
    ) as GRID,
  })
}

function clearSelection(grid?: GRID): GRID | undefined {
  return setSelectionToAllCells(grid, false)
}

function selectAll(grid?: GRID): GRID | undefined {
  return setSelectionToAllCells(grid, true)
}

function moveSelection(grid?: GRID, coords?: COORDS): GRID | undefined {
  if (!grid) return createEmptyGrid()

  return update(grid, {
    $set: grid.map((col, colIndex) =>
      col.map((cell, rowIndex) => ({
        ...cell,
        isSelected: colIndex === coords?.col && rowIndex === coords?.row,
      }))
    ) as GRID,
  })
}

function expandSelection(grid?: GRID, coords?: COORDS): GRID | undefined {
  if (!grid) return createEmptyGrid()

  return update(grid, {
    $set: grid.map((col, colIndex) =>
      col.map((cell, rowIndex) => ({
        ...cell,
        isSelected:
          cell.isSelected ||
          (colIndex === coords?.col && rowIndex === coords?.row),
      }))
    ) as GRID,
  })
}

export {
  createEmptyGrid,
  isInCol,
  isInRow,
  isInBlock,
  tickleCell,
  setValueToSelectedCells,
  clearSelection,
  selectAll,
  moveSelection,
  expandSelection,
}
