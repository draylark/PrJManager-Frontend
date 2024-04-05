import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Project } from '../types/stateInterfaces';
import { ProjectType } from '../types/stateTypes';
import { platypusSlice } from '../gitlab/gitlabSlice';

const initialState = {    
    currentProject: null,   
    layers: [], 
    repositories: [],
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
  
    }
});


export const { setCurrentProject, setLayers, setRepositories, addNewLayer, addNewLayerRepository } = platypusSlice.actions;