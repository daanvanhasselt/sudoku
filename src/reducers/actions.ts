import { Action, AnyAction } from 'redux'
import * as types from './types'
import { N, COORDS } from 'typings'

export const createGrid = (): Action => {
  return { type: types.CREATE_GRID }
}

export const setSelectionMode = (mode: boolean): AnyAction => {
  return { type: types.SET_SELECTION_MODE, mode }
}

export const clearSelection = (): Action => {
  return { type: types.CLEAR_SELECTION }
}

export const selectAll = (): Action => {
  return { type: types.SELECT_ALL }
}

export const tickleCell = (coords: COORDS): AnyAction => {
  return { type: types.TICKLE_CELL, coords }
}

export const setValue = (value?: N): AnyAction => {
  return { type: types.SET_VALUE, value }
}
