import { AnyAction } from 'redux'
import { IReducer } from './interfaces'
import * as types from './types'
import {
  createEmptyGrid,
  tickleCell,
  clearSelection,
  selectAll,
  setValueToSelectedCells,
} from 'utils'

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
    default:
      return state
  }
}

export default reducer
