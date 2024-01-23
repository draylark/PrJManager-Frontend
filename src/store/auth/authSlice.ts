import { createSlice } from '@reduxjs/toolkit';
import { Auth } from '../types/stateInterfaces';


const initialState: Auth = {
  status: 'not-authenticated',
  uid: '',
  email: '',
  username: '',
  photoURL: '',
  description: '',
  site: '',
  gitlabAuth: false,
  errorMessage: '',
  state: true,
  friendsRequests: [],
  friends: []
};

export const authSlice = createSlice({

    name: 'auth',
    initialState,
    reducers: {

        login: ( state, { payload } ) => {

          // console.log(payload)

          state.status = 'authenticated', // 'not-authenticated', 'authenticated'
          state.uid = payload.uid,
          state.email = payload.email,
          state.username = payload.username,
          state.photoURL = payload.photoUrl || null,
          state.description = payload.description || null,
          state.site = payload.site || null,
          state.errorMessage = null,
          state.state = payload.state
          state.friendsRequests = payload.friendsRequests || []
          state.friends = payload.friends || []

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
          state.photoURL = null,
          state.errorMessage = payload?.msg || null
          state.state = payload?.b ?? null

        },


        checkingCredentials: (state) => {
          state.status = 'checking'
        }
  
    }
});

// Action creators are generated for each case reducer function
export const { login, logout, setGitlabAuth ,checkingCredentials } = authSlice.actions;		