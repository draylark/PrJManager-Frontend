import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Project } from '../types/stateInterfaces';
import { ProjectType } from '../types/stateTypes';

const initialState: Project = {
  projects: [],
  current: [],
  topProjects: [],
  loading: false,
  error: null,
};


export const projectSlice = createSlice({

    name: 'auth',
    initialState,
    reducers: {

        startProjects: ( state, { payload: projects } : PayloadAction<ProjectType[]>  ) => {
            state.projects = projects
            state.loading = false
        },


        barsPerProjectId : ( state, { payload: projectIds } : PayloadAction<string[]> ) => {
            state.current = []
            projectIds.forEach( ( projectId ) => {
                state.current.push( projectId )
            });
            state.loading = false
        },

        addProject: ( state, { payload } ) => {
            state.projects.push( payload )
            state.loading = false
        },

        addTopProject: ( state, { payload } ) => {
            console.log( payload )            
            state.topProjects = payload
            state.loading = false
        },

        editProject: ( state, { payload } ) => {

            console.log(state)
            console.log( payload )

        },

        deleteProject: ( state, { payload } ) => {
            
            console.log(state)
            console.log( payload )

        },

        checkingProjects: (state, { payload }) => {
            state.loading = payload
        }
  
    }
});

// Action creators are generated for each case reducer function
export const { startProjects, barsPerProjectId, addProject, addTopProject, editProject, deleteProject, checkingProjects } = projectSlice.actions;		