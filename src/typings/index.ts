export type N = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type INDEX = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export type CELL = {
  value?: N
  isInitial?: boolean
  isSelected?: boolean
}

export type COORDS = {
  col: INDEX
  row: INDEX
}

export type ROW = [CELL, CELL, CELL, CELL, CELL, CELL, CELL, CELL, CELL]
export type GRID = [ROW, ROW, ROW, ROW, ROW, ROW, ROW, ROW, ROW]
