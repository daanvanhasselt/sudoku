import { configureStore } from '@reduxjs/toolkit'

import reducer from 'reducers'

function setupStore(initialState = {}) {
  const store = configureStore({
    reducer,
  })

  return store
}

export default setupStore
