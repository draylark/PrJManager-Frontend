import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './auth/authSlice'
import { projectSlice } from './projects/projectSlice';
import { eventSlice } from './events/eventSlice';
import { friendSlice } from './friends/friendSlice';
import { platypusSlice } from './platypus/platypusSlice';
import { Task, Project, Auth, Client, Event, Friend, Commit, Repository, Platypus } from './types/stateInterfaces';

export interface RootState {
    auth: Auth,
    projects: Project,
    task: Task,
    clients: Client,
    events: Event,
    friends: Friend,
    commits: Commit,
    repos: Repository,
    platypus: Platypus,

}

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    projects: projectSlice.reducer,
    events: eventSlice.reducer,
    friends: friendSlice.reducer,
    platypus: platypusSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})