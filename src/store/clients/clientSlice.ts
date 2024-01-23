
import { createSlice } from '@reduxjs/toolkit';
import { Client } from '../types/stateInterfaces';
import { PayloadAction } from '@reduxjs/toolkit';
import { ClientType } from '../types/stateTypes';

const initialState: Client = {
  clients: [],
  current: [],
  loading: false,
  error: null,
};

export const clientSlice = createSlice({

    name: 'Client',
    initialState,
    reducers: {

        startClients: ( state, { payload: clients } : PayloadAction<ClientType[]>  ) => {
            state.clients = []
            clients.forEach( ( project ) => {
                state.clients.push( project )
            });
            state.loading = false
        },


        barsPerProjectId : ( state, { payload: projectIds } : PayloadAction<string[]> ) => {
            state.current = []
            projectIds.forEach( ( projectId ) => {
                state.current.push( projectId )
            });
            state.loading = false
        },

        addClient: ( state, { payload } ) => {
            state.clients.push( payload )
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

        checkingClients: (state, { payload }) => {
            state.loading = payload
        }
  
    }
});

// Action creators are generated for each case reducer function
export const { startClients, addClient, checkingClients } = clientSlice.actions;		
