
import { configureStore } from '@reduxjs/toolkit';
import sermonAdminReducer from '@/redux/sermonAdminSelector';
import sermonReducer from '@/redux/sermonSelector';
import searchReducer from '@/redux/searchselector'; // import the searchReducer

export const store = configureStore({
  reducer: {
    sermonAdmin: sermonAdminReducer,
    sermon: sermonReducer,
    search: searchReducer, // add the searchReducer to the store
    // other reducers
  },
});

export type RootState = ReturnType<typeof store.getState>;