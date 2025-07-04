import { configureStore } from '@reduxjs/toolkit';
import partsReducer from '../redux/slices/partsSlice';

export const store = configureStore({
  reducer: {
    parts: partsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

