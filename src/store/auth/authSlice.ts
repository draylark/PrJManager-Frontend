import { createSlice } from '@reduxjs/toolkit';
import { Auth } from '../types/stateInterfaces';


const initialState: Auth = {
  status: 'not-authenticated',
  uid: '',
  email: '',
  username: '',
  photoUrl: '',
  description: '',
  followers: 0,
  topProjects: [],
  website: '',
  github: '',
  linkedin: '',
  twitter: '',
  gitlabAuth: false,
  errorMessage: '',
  state: true,
};

export const authSlice = createSlice({

    name: 'auth',
    initialState,
    reducers: {

        login: ( state, { payload } ) => {
          state.status = 'authenticated', // 'not-authenticated', 'authenticated'
          state.uid = payload.uid,
          state.email = payload.email,
          state.username = payload.username,
          state.photoUrl = payload.photoUrl || null,
          state.description = payload.description || null,
          state.topProjects = payload.topProjects || [],
          state.website = payload.website || null,
          state.github = payload.github || null,
          state.linkedin = payload.linkedin || null,
          state.twitter = payload.twitter || null,
          state.followers = payload.followers || 0,
          state.errorMessage = null,
          state.state = payload.state
        },

        setGitlabAuth: ( state, { payload } ) => {
          // console.log(payload)
          state.gitlabAuth = payload
        },

        logout: ( state, { payload } ) => {

          state.status = 'not-authenticated', // 'not-authenticated', 'authenticated'
          state.uid = null,
          state.email = null,
          state.username = null,
          state.photoUrl = null,
          state.errorMessage = payload?.msg || null
          state.state = payload?.b ?? null

        },


        checkingCredentials: (state) => {
          state.status = 'checking'
        },


        setTopProjects: ( state, { payload } ) => {
          state.topProjects = payload
        }
  
    }
});

// Action creators are generated for each case reducer function
export const { login, logout, setGitlabAuth ,checkingCredentials, setTopProjects } = authSlice.actions;		