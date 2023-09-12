import { AnyAction } from 'redux'
import { IReducer } from './interfaces'
import * as types from './types'
import {
  createEmptyGrid,
  tickleCell,
  clearSelection,
  selectAll,
  setValueToSelectedCells,
  moveSelection,
  expandSelection,
} from 'utils'
import { addDirectionToCoords } from 'typings'

const initialState: IReducer = {}

function reducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case types.CREATE_GRID:
      return {
        ...state,
        grid: createEmptyGrid(),
      }
    case types.SET_SELECTION_MODE:
      return {
        ...state,
        selectionMode: action.mode === true ? true : false,
      }
    case types.TICKLE_CELL:
      return {
        ...state,
        grid: tickleCell(action.coords, state.selectionMode, state.grid),
        lastTickledCell: action.coords,
      }
    case types.SET_VALUE:
      return {
        ...state,
        grid: setValueToSelectedCells(action.value, state.grid),
      }
    case types.CLEAR_SELECTION:
      return {
        ...state,
        grid: clearSelection(state.grid),
      }
    case types.SELECT_ALL:
      return {
        ...state,
        grid: selectAll(state.grid),
      }
    case types.MOVE_SELECTION: {
      const coords = addDirectionToCoords(state.lastTickledCell, action.dir)
      return {
        ...state,
        grid: moveSelection(state.grid, coords),
        lastTickledCell: coords,
      }
    }
    case types.EXPAND_SELECTION: {
      const coords = addDirectionToCoords(state.lastTickledCell, action.dir)
      return {
        ...state,
        grid: expandSelection(state.grid, coords),
        lastTickledCell: coords,
      }
    }
    default:
      return state
  }
}

export default reducer
