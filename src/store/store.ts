import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './auth/authSlice'
import { projectSlice } from './projects/projectSlice';
import { platypusSlice } from './platypus/platypusSlice';
import { Project, Auth, Platypus } from './types/stateInterfaces';

export interface RootState {
    auth: Auth,
    projects: Project,
    platypus: Platypus,
}

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    projects: projectSlice.reducer,
    platypus: platypusSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})