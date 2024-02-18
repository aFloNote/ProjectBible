// src/redux/store.ts

import { configureStore } from '@reduxjs/toolkit';
import selectedReducer from '@/redux/selected';

export const store = configureStore({
  reducer: {
    selected: selectedReducer,
    // other reducers
  },
});

export type RootState = ReturnType<typeof store.getState>;

