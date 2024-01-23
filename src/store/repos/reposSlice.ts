import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { fetchRepositories } from '../../api/repositories';
import { Repository } from '../types/stateInterfaces';


const initialState: Repository = {
    repos: [],
    current: [],
    loading: false,
    error: null,
};

// export const fetchRepositoriesAsync = createAsyncThunk(
//     'repositories/fetchRepositories',
//     async () => {
//         const response = await fetchRepositories();
//         return response.data;
//     }
// );

export const repositorySlice = createSlice({
    name: 'repositories',
    initialState,
    reducers: {

        startRepositories: ( state, { payload } ) => {
            state.repos = []
            payload.forEach( ( repo ) => {
                state.repos.push( repo )
            });
            state.loading = false
        },

        barsPerRepositoryId : ( state, { payload } ) => {
            state.current = []
            payload.forEach( ( repoId ) => {
                state.current.push( repoId )
            });
            state.loading = false
        },

        addRepository: ( state, { payload } ) => {
            state.repos.push( payload )
            state.loading = false
        },

        editRepository: ( state, { payload } ) => {

            console.log(state)
            console.log( payload )

        },

        deleteRepository: ( state, { payload } ) => {
            
            console.log(state)
            console.log( payload )

        },

    },
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(fetchRepositoriesAsync.pending, (state) => {
    //             state.loading = true;
    //             state.error = null;
    //         })
    //         .addCase(fetchRepositoriesAsync.fulfilled, (state, action) => {
    //             state.loading = false;
    //             state.data = action.payload;
    //         })
    //         .addCase(fetchRepositoriesAsync.rejected, (state, action) => {
    //             state.loading = false;
    //             state.error = action.error.message ?? 'Something went wrong';
    //         });
    // },
});

export const { startRepositories, addRepository, editRepository, deleteRepository } = repositorySlice.actions;
