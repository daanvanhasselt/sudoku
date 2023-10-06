import { Action, AnyAction } from 'redux'
import * as types from './types'
import { N, COORDS, DIRECTION, MODE, GRID } from 'typings'

export const createGrid = (): Action => {
  return { type: types.CREATE_GRID }
}

export const softReset = (): Action => {
  return { type: types.SOFT_RESET }
}

export const setGrid = (grid?: GRID): AnyAction => {
  return { type: types.SET_GRID, grid }
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

export const moveSelection = (dir: DIRECTION): AnyAction => {
  return { type: types.MOVE_SELECTION, dir }
}

export const expandSelection = (dir: DIRECTION): AnyAction => {
  return { type: types.EXPAND_SELECTION, dir }
}

export const tickleCell = (coords: COORDS): AnyAction => {
  return { type: types.TICKLE_CELL, coords }
}

export const setValue = (value?: N): AnyAction => {
  return { type: types.SET_VALUE, value }
}

export const toggleSettingMode = (): Action => {
  return { type: types.TOGGLE_SETTING_MODE }
}

export const setMode = (mode: MODE): AnyAction => {
  return { type: types.SET_MODE, mode }
}

export const selectNumber = (value?: N): AnyAction => {
  return { type: types.SELECT_NUMBER, value }
}
