import { configureStore } from '@reduxjs/toolkit'
import rootReducer from '@/redux/reducer'; // Import your root reducer

export const store = configureStore({
    
    reducer: rootReducer,
  });

