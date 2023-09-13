import { GRID, COORDS, MODE } from 'typings'

export interface IReducer {
  grid?: GRID
  selectionMode?: boolean
  lastTickledCell?: COORDS
  settingMode?: boolean
  mode?: MODE
}
