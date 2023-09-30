import { GRID, COORDS, ROW, CELL, N } from 'typings'
import update from 'immutability-helper'
import JSONCrush from 'jsoncrush'

function createEmptyGrid(): GRID {
  const grid = Array.from({ length: 9 }).map<ROW>(
    () =>
      Array.from({ length: 9 }).map<CELL>(() => ({
        isSelected: false,
        isInitial: false,
        illegal: false,
      })) as ROW
  ) as GRID

  return grid
}

interface IInput {
  grid: GRID
  coords: COORDS
  value?: N
}

function isInCol({ grid, coords, value }: IInput): boolean {
  if (!value) return false
  for (let i = 0; i < 9; i++) {
    if (i === coords.row) continue
    if (grid[coords.col][i].value === value) return true
  }
  return false
}

function isInRow({ grid, coords, value }: IInput): boolean {
  if (!value) return false
  for (let i = 0; i < 9; i++) {
    if (i === coords.col) continue
    if (grid[i][coords.row].value === value) return true
  }
  return false
}

function isInBlock({ grid, coords, value }: IInput): boolean {
  if (!value) return false
  const row = Math.floor(coords.row / 3) * 3
  const col = Math.floor(coords.col / 3) * 3

  for (let i = row; i < row + 3; i++) {
    for (let j = col; j < col + 3; j++) {
      if (i === coords.row && j === coords.col) continue
      if (grid[j][i].value === value) return true
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

const addOrRemove = (arr: N[], item: N) =>
  arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]

function toggleCornerForSelectedCells(
  value?: N,
  grid?: GRID
): GRID | undefined {
  if (!grid) return createEmptyGrid()

  return update(grid, {
    $set: grid.map((col) =>
      col.map((cell) => {
        if (cell.isSelected) {
          const cornerValues =
            value === undefined
              ? []
              : cell.cornerValues
              ? addOrRemove(cell.cornerValues as N[], value as N)
              : [value as N]
          return {
            ...cell,
            cornerValues: cornerValues.sort(),
          }
        }
        return cell
      })
    ) as GRID,
  })
}

function toggleCenterForSelectedCells(
  value?: N,
  grid?: GRID
): GRID | undefined {
  if (!grid) return createEmptyGrid()

  return update(grid, {
    $set: grid.map((col) =>
      col.map((cell) => {
        if (cell.isSelected) {
          const centerValues =
            value === undefined
              ? []
              : cell.centerValues
              ? addOrRemove(cell.centerValues as N[], value as N)
              : [value as N]
          return {
            ...cell,
            centerValues: centerValues.sort(),
          }
        }
        return cell
      })
    ) as GRID,
  })
}

function setHighlightForSelectedCells(
  value?: N,
  grid?: GRID
): GRID | undefined {
  if (!grid) return createEmptyGrid()

  return update(grid, {
    $set: grid.map((col) =>
      col.map((cell) => {
        if (cell.isSelected) {
          return {
            ...cell,
            highlight: value,
          }
        }
        return cell
      })
    ) as GRID,
  })
}

/*
 * Selection
 */

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

function markIllegalCells(grid?: GRID): GRID | undefined {
  if (!grid) return createEmptyGrid()

  return update(grid, {
    $set: grid.map((col, colIndex) =>
      col.map((cell, rowIndex) => ({
        ...cell,
        illegal:
          isInCol({
            grid,
            value: cell.value,
            coords: { col: colIndex, row: rowIndex } as COORDS,
          }) ||
          isInRow({
            grid,
            value: cell.value,
            coords: { col: colIndex, row: rowIndex } as COORDS,
          }) ||
          isInBlock({
            grid,
            value: cell.value,
            coords: { col: colIndex, row: rowIndex } as COORDS,
          }),
      }))
    ) as GRID,
  })
}

function selectNormalNumber(grid?: GRID, number?: N) {
  if (!grid) return createEmptyGrid()

  return update(grid, {
    $set: grid.map((col) =>
      col.map((cell) => ({
        ...cell,
        isSelected: number !== undefined && cell.value === number,
      }))
    ) as GRID,
  })
}

function selectCornerNumber(grid?: GRID, number?: N) {
  if (!grid) return createEmptyGrid()

  return update(grid, {
    $set: grid.map((col) =>
      col.map((cell) => ({
        ...cell,
        isSelected:
          number !== undefined &&
          cell.value === undefined &&
          cell.cornerValues?.includes(number),
      }))
    ) as GRID,
  })
}

function selectCenterNumber(grid?: GRID, number?: N) {
  if (!grid) return createEmptyGrid()

  return update(grid, {
    $set: grid.map((col) =>
      col.map((cell) => ({
        ...cell,
        isSelected:
          number !== undefined &&
          cell.value === undefined &&
          cell.centerValues?.includes(number),
      }))
    ) as GRID,
  })
}

function selectAnyKindOfNumber(grid?: GRID, number?: N) {
  if (!grid) return createEmptyGrid()

  return update(grid, {
    $set: grid.map((col) =>
      col.map((cell) => ({
        ...cell,
        isSelected:
          number !== undefined &&
          (cell.value === number ||
            (cell.value === undefined &&
              (cell.cornerValues?.includes(number) ||
                cell.centerValues?.includes(number)))),
      }))
    ) as GRID,
  })
}

function encodeGrid(grid?: GRID) {
  if (!grid) return ''

  // save values, cornerValues, centerValues, highlight
  const values = grid.map((col) =>
    col.map((cell) => ({
      value: cell.value ? cell.value : 0,
      cornerValues: cell.cornerValues ? cell.cornerValues : undefined,
      centerValues: cell.centerValues ? cell.centerValues : undefined,
      highlight: cell.highlight ? cell.highlight : undefined,
      selected: cell.isSelected ? cell.isSelected : undefined,
      initial: cell.isInitial ? cell.isInitial : undefined,
    }))
  )

  const valuesString = JSON.stringify(values)
  const compressed = JSONCrush.crush(valuesString)
  return compressed
}

function decodeGrid(encoded?: string) {
  if (!encoded) return createEmptyGrid()
  const valuesString = JSONCrush.uncrush(encoded)
  const values = JSON.parse(valuesString)
  const grid = values.map((col: any) =>
    col.map((cell: any) => ({
      value: cell.value ? cell.value : undefined,
      cornerValues: cell.cornerValues ? cell.cornerValues : undefined,
      centerValues: cell.centerValues ? cell.centerValues : undefined,
      highlight: cell.highlight ? cell.highlight : undefined,
      isSelected: cell.selected ? cell.selected : undefined,
      isInitial: cell.initial ? cell.initial : undefined,
    }))
  )
  return grid
}

function isCompleted(grid?: GRID) {
  if (!grid) return false
  return grid.every((col) =>
    col.every((cell) => cell.value !== undefined && !cell.illegal)
  )
}

export {
  createEmptyGrid,
  tickleCell,
  setValueToSelectedCells,
  clearSelection,
  selectAll,
  moveSelection,
  expandSelection,
  toggleCornerForSelectedCells,
  toggleCenterForSelectedCells,
  setHighlightForSelectedCells,
  markIllegalCells,
  selectNormalNumber,
  selectCornerNumber,
  selectCenterNumber,
  selectAnyKindOfNumber,
  encodeGrid,
  decodeGrid,
  isCompleted,
}
