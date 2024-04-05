
import { createSlice } from '@reduxjs/toolkit';
import { Platypus } from '../types/stateInterfaces';
import { PayloadAction } from '@reduxjs/toolkit';
import { LayerType } from '../types/stateTypes';

const initialState: Platypus = {
  layers: [],
  repositories: [],
  current: [],
  loading: false,
  error: null,
};

export const platypusSlice2 = createSlice({

    name: 'Platypus',
    initialState,
    reducers: {

        startLayers: ( state, { payload: layers } : PayloadAction<LayerType[]> ) => {
            state.layers = []
            layers.forEach( ( layer ) => {
                state.layers.push( layer )
            });
            state.loading = false
        },

        startRepositories: ( state, { payload: repositories } : PayloadAction<LayerType[]> ) => {
            state.repositories = []
            repositories.forEach( ( repository ) => {
                state.repositories.push( repository )
            });
            state.loading = false
        },

        addNewLayer : ( state, { payload: layer } : PayloadAction<LayerType> ) => {
            state.layers.push( layer )
            state.loading = false
        },

        addNewRepository : ( state, { payload: repository } : PayloadAction<LayerType> ) => {
            state.repositories.push( repository )
            state.loading = false
        },

        checkingGitlab: (state, { payload }) => {
            state.loading = payload
        }
  
    }
});

// Action creators are generated for each case reducer function
export const { startLayers, startRepositories, addNewLayer, addNewRepository, checkingGitlab } = platypusSlice2.actions;		
