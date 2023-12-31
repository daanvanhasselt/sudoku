import { AnyAction } from 'redux'
import undoable, { includeAction } from 'redux-undo'
import { IReducer } from './interfaces'
import * as types from './types'
import {
  createEmptyGrid,
  softReset,
  tickleCell,
  clearSelection,
  selectAll,
  setValueToSelectedCells,
  moveSelection,
  expandSelection,
  toggleCornerForSelectedCells,
  toggleCenterForSelectedCells,
  setHighlightForSelectedCells,
  markIllegalCells,
  selectAnyKindOfNumber,
} from 'utils'
import { addDirectionToCoords } from 'typings'

const initialState: IReducer = {
  mode: 'normal',
  settingMode: false,
}

function reducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case types.CREATE_GRID:
      return {
        ...state,
        grid: createEmptyGrid(),
      }
    case types.SOFT_RESET:
      return {
        ...state,
        grid: softReset(state.grid),
      }
    case types.SET_GRID:
      return {
        ...state,
        grid: action.grid,
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
    case types.SET_VALUE: {
      let returnState
      if (state.mode === 'normal') {
        returnState = {
          ...state,
          grid: setValueToSelectedCells(
            action.value,
            state.grid,
            state.settingMode
          ),
        }
      } else if (state.mode === 'corner') {
        returnState = {
          ...state,
          grid: toggleCornerForSelectedCells(action.value, state.grid),
        }
      } else if (state.mode === 'center') {
        returnState = {
          ...state,
          grid: toggleCenterForSelectedCells(action.value, state.grid),
        }
      } else if (state.mode === 'highlight') {
        returnState = {
          ...state,
          grid: setHighlightForSelectedCells(action.value, state.grid),
        }
      } else if (state.mode === 'lines') {
        // TODO
      }

      return {
        ...returnState,
        grid: markIllegalCells(returnState?.grid),
      }
    }
    case types.CLEAR_SELECTION:
      return {
        ...state,
        grid: clearSelection(state.grid),
        lastTickledCell: undefined,
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
    case types.TOGGLE_SETTING_MODE:
      return {
        ...state,
        settingMode: state.settingMode === true ? false : true,
      }
    case types.SET_MODE:
      return {
        ...state,
        mode: action.mode,
      }
    case types.SELECT_NUMBER:
      return {
        ...state,
        grid: selectAnyKindOfNumber(state.grid, action.value),
      }
    default:
      return state
  }
}

const undoableReducer = undoable(reducer, {
  limit: 500,
  filter: includeAction([
    types.CREATE_GRID,
    types.SOFT_RESET,
    types.SET_GRID,
    types.SET_MODE,
    types.SET_VALUE,
  ]),
})
export default undoableReducer
