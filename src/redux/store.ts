import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
// import UserSlice, { UserState } from './slices/userSlice';
import servicesSlice, { servicesState } from './slices/servicesSlice';
import locationsSlice, { locationsState } from './slices/locationsSlice';
import inputFocusSlice, { inputFocusState } from './slices/inputFocusSlice';

import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import { combineReducers } from 'redux';

const persistConfig = {
  key: 'search_a3',
  storage,
  stateReconciler: autoMergeLevel2,
  // no need to persist this reducers
  blacklist: [
    'inputFocus'
  ]
}


const rootReducer: any = combineReducers({
  services: servicesSlice,
  locations: locationsSlice,
  inputFocus: inputFocusSlice,
});


const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})
export const persistor = persistStore(store)

export type AppState =  {
  // User: UserState,
  services: servicesState,
  locations: locationsState
  inputFocus: inputFocusState
}


export default store;