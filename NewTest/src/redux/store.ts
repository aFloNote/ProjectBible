// src/redux/store.ts

import { configureStore } from '@reduxjs/toolkit';
import sermonAdminReducer from '@/redux/sermonAdminSelector';
import sermonReducer from '@/redux/sermonSelector';

export const store = configureStore({
  reducer: {
    sermonAdmin: sermonAdminReducer,
    sermon: sermonReducer,
    // other reducers
  },
});

export type RootState = ReturnType<typeof store.getState>;

