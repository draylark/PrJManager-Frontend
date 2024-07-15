import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { LayerBase,ProjectBase, RepositoryBase } from '../../interfaces/models';


interface Layer extends Pick<LayerBase, '_id' | 'name' | 'description' | 'visibility' | 'creator'  | 'project' | 'status' > {}
interface Repository extends Omit<RepositoryBase, 'webUrl' | 'gitUrl' | 'gitlabId' > {}


interface PlatypusState { 
    currentProject: ProjectBase | null;
    layers: Layer[];
    repositories: Repository[];
    fetchingResources: boolean;
    errorWhileFetching: boolean;
    errorMessage: string | null;
    errorType: string | null;
}


const initialState: PlatypusState = {    
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

        setCurrentProject: ( state, { payload } : PayloadAction<ProjectBase> ) => {
            state.currentProject = payload
        },

        setLayers: ( state, { payload: layers } : PayloadAction<LayerBase[]> ) => {
            state.layers = []
            layers.forEach( ( layer ) => {
                state.layers.push( layer )
            });
        },

        setRepositories: ( state, { payload: repositories } : PayloadAction<RepositoryBase[]> ) => {
            state.repositories = []
            repositories.forEach( ( repository ) => {
                state.repositories.push( repository )
            });
        },

        addNewLayer : ( state, { payload: layer } : PayloadAction<LayerBase> ) => {
            state.layers.push( layer )
        },

        addNewLayerRepository : ( state, { payload: repository } : PayloadAction<RepositoryBase> ) => {
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