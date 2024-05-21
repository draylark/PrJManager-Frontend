import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Project } from '../types/stateInterfaces';
import { ProjectType } from '../types/stateTypes';
import { platypusSlice } from '../gitlab/gitlabSlice';

const initialState = {    
    currentProject: null,   
    layers: [], 
    repositories: [],
    fetchingResources: false,
    errorWhileFetching: false,
    errorMessage: null,
    errorType: null
};


export const platypusSlice = createSlice({

    name: 'platypus',
    initialState,
    reducers: {

        setCurrentProject: ( state, { payload } : PayloadAction<ProjectType> ) => {
            state.currentProject = payload
        },

        setLayers: ( state, { payload: layers } : PayloadAction<ProjectType[]> ) => {
            state.layers = []
            layers.forEach( ( layer ) => {
                state.layers.push( layer )
            });
        },

        setRepositories: ( state, { payload: repositories } : PayloadAction<ProjectType[]> ) => {
            state.repositories = []
            repositories.forEach( ( repository ) => {
                state.repositories.push( repository )
            });
        },

        addNewLayer : ( state, { payload: layer } : PayloadAction<ProjectType> ) => {
            state.layers.push( layer )
        },

        addNewLayerRepository : ( state, { payload: repository } : PayloadAction<ProjectType> ) => {
            state.repositories.push( repository )
        },

        setFetchingResources: ( state, { payload } : PayloadAction<boolean> ) => {
            state.fetchingResources = payload
        },

        setErrorMessage: ( state, { payload } : PayloadAction<string> ) => {
            state.errorMessage = payload    
        },

        setError: (
            state,
            action: PayloadAction<{ fetchingResources: boolean, errorWhileFetching: boolean; errorMessage: string | null; errorType: string | null }>
          ) => {
            console.log('fetchingResources',action.payload.fetchingResources)
            state.fetchingResources = action.payload.fetchingResources;
            state.errorWhileFetching = action.payload.errorWhileFetching;
            state.errorMessage = action.payload.errorMessage;
            state.errorType = action.payload.errorType;
          },

        setErrorType: ( state, { payload } : PayloadAction<string> ) => {
            state.errorType = payload
        }
  
    }
});


export const { setCurrentProject, setLayers, setRepositories, addNewLayer, addNewLayerRepository, setFetchingResources, setError, setErrorMessage, setErrorType } = platypusSlice.actions;