import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './auth/authSlice'
import { notisSlice } from './notifications/notificationSlice';

export type RootState = ReturnType<typeof store.getState>;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    notis: notisSlice.reducer
  },
})