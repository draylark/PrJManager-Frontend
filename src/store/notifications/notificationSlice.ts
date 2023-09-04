import { createSlice } from '@reduxjs/toolkit';

interface Noti {
    _id: string;
    title: string;
    description: string;
    status: boolean;
    to: string;
    by: string;
    createdAt: string;
    updatedAt: string;
  }
  
  interface NotisState {
    isSaving: boolean;
    notis: Noti[];
  }


const initialState: NotisState = {
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
            notis.forEach( ( noti: Noti ) => {
                // console.log(noti)
                state.notis.push( noti )
            });
            state.isSaving = false
        },

    }
});

// Action creators are generated for each case reducer function
export const { savingNotis,  setNotis  } = notisSlice.actions;		
	