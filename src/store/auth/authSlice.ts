import { createSlice } from '@reduxjs/toolkit';


interface AuthState {
  status: string;
  uid: string | null;
  email: string | null;
  username: string | null;
  photoURL: string | null;
  description: string | null;
  site: string | null;
  errorMessage: string | null;
  state: boolean | null;  // <-- Reemplaza 'any' con el tipo apropiado si es posible
}

const initialState: AuthState = {
  status: 'not-authenticated',
  uid: null,
  email: null,
  username: null,
  photoURL: null,
  description: null,
  site: null,
  errorMessage: null,
  state: null,
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
export const { login, logout, checkingCredentials } = authSlice.actions;		