import { createSlice } from '@reduxjs/toolkit';
import { Commit } from '../types/stateInterfaces';
import { CommitType } from '../types/stateTypes';
// import { PayloadAction } from '@reduxjs/toolkit';

const initialState: Commit = {
  commits: [],
  current: [],
  loading: false,
  error: null,
};

export const commitSlice = createSlice({

    name: 'Commit',
    initialState,
    reducers: {

        startCommits: ( state, { payload: commits }  ) => {
            state.commits = []
            commits.forEach( ( commit: CommitType ) => {
                state.commits.push( commit )
            });
            state.loading = false
        },

        addCommit: ( state, { payload } ) => {
            state.commits.push( payload )
            state.loading = false
        },

        editCommitt: ( state, { payload } ) => {

            console.log(state)
            console.log( payload )

        },

        deleteCommit: ( state, { payload } ) => {
            
            console.log(state)
            console.log( payload )

        },

        checkingCommits: (state, { payload }) => {
            state.loading = payload
        }
  
    }
});

// Action creators are generated for each case reducer function
export const { startCommits, addCommit, checkingCommits } = commitSlice.actions;		
