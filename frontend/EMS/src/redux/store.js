import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import employeeSlice from "./employeeSlice";
import LoadSlice from "./LoadSlice";
import adminSlice from "./adminSlice"
import WorkSlice from "./WorkSlice"
import SubmitWorkSlice from "./SubmitWorkSlice"
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Define your persist configuration
const persistConfig = {
  key: 'EMS', // Adjust this key if needed for separation
  version: 1,
  storage,
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authSlice,
  employee: employeeSlice,
  load: LoadSlice,
  admin:adminSlice,
  work:WorkSlice,
  SubmitWork:SubmitWorkSlice
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Export persistor and store
export const persistor = persistStore(store);
export default store;
