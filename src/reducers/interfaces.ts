import { GRID, COORDS } from 'typings'

export interface IReducer {
  grid?: GRID
  selectionMode?: boolean
  lastTickledCell?: COORDS
  settingMode?: boolean
}
