import { AnyAction } from 'redux'
import { IReducer } from './interfaces'
import * as types from './types'
import { createEmptyGrid } from 'utils'

const initialState: IReducer = {}

function reducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case types.CREATE_GRID:
      return {
        ...state,
        grid: createEmptyGrid(),
      }
    default:
      return state
  }
}

export default reducer
