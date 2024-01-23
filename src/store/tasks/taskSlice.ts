import { createSlice } from '@reduxjs/toolkit';
import { Task } from '../types/stateInterfaces';
import { TaskType } from '../types/stateTypes';

const initialState: Task = {
  tasks: [],
  current: [],
  loading: false,
  error: null,
};

export const taskSlice = createSlice({

    name: 'auth',
    initialState,
    reducers: {

        startTasks: ( state, { payload } ) => {
            
            state.tasks = []
            payload.forEach( ( project:  TaskType) => {
                state.tasks.push( project )
            });
            state.loading = false
        },

        tasksPerProjectId : ( state, { payload: project } ) => {
            state.current = []
            state.current.push( project )
            state.loading = false
        },

        addTasks: ( state, { payload } ) => {
            state.tasks.push( payload )
            state.loading = false
        },

        editTasks: ( state, { payload } ) => {

            console.log(state)
            console.log( payload )

        },

        deleteTasks: ( state, { payload } ) => {
            
            console.log(state)
            console.log( payload )

        },

        checkingTasks: (state, { payload } ) => {
            state.loading = payload
        }
  
    }
});

// Action creators are generated for each case reducer function
export const { startTasks, tasksPerProjectId, addTasks, editTasks, deleteTasks, checkingTasks } = taskSlice.actions;		