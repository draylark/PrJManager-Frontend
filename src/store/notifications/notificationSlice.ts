import { createSlice } from '@reduxjs/toolkit';
import { Notification } from '../types/stateInterfaces';
import { NotiType } from '../types/stateTypes';

const initialState: Notification = {
    isSaving: false,
    notis: []
}

export const notisSlice = createSlice({
    name: 'notis',
    initialState,
    reducers: {

        savingNotis: ( state, action ) => {
            state.isSaving = action.payload 
        },

        setNotis: ( state, { payload: notis } ) => {
            state.notis = []
            notis.forEach( ( noti: NotiType ) => {
                state.notis.push( noti )
            });
            state.isSaving = false
        },

    }
});

// Action creators are generated for each case reducer function
export const { savingNotis,  setNotis  } = notisSlice.actions;		
	