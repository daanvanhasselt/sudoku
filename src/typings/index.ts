export type N = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type INDEX = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export type CELL = {
  value?: N
  isInitial?: boolean
  isSelected?: boolean
  cornerValues?: N[]
  centerValues?: N[]
  highlight?: N
  illegal?: boolean
}

export type COORDS = {
  col: INDEX
  row: INDEX
}

export type DIRECTION = 'up' | 'down' | 'left' | 'right'

export type ROW = [CELL, CELL, CELL, CELL, CELL, CELL, CELL, CELL, CELL]
export type GRID = [ROW, ROW, ROW, ROW, ROW, ROW, ROW, ROW, ROW]

export function addDirectionToCoords(coords?: COORDS, dir?: DIRECTION): COORDS {
  if (!coords || !dir) return { col: 0, row: 0 }

  switch (dir) {
    case 'up': {
      let newRow = coords.row - 1
      if (newRow < 0) newRow = 8
      return { ...coords, row: newRow as INDEX }
    }
    case 'down': {
      let newRow = (coords.row + 1) % 9
      return { ...coords, row: newRow as INDEX }
    }
    case 'left': {
      let newCol = coords.col - 1
      if (newCol < 0) newCol = 8
      return { ...coords, col: newCol as INDEX }
    }
    case 'right': {
      let newCol = (coords.col + 1) % 9
      return { ...coords, col: newCol as INDEX }
    }
  }
}

export type MODE = 'normal' | 'corner' | 'center' | 'highlight' | 'lines'
