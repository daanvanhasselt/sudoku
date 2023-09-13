import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import reducer from 'reducers'

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, reducer)

function setupStore(initialState = {}) {
  const store = configureStore({
    reducer: persistedReducer,
  })

  const persistor = persistStore(store)
  return { store, persistor }
}

export default setupStore
