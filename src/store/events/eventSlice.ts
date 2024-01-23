
import { createSlice } from '@reduxjs/toolkit';
import { Event } from '../types/stateInterfaces';
import { PayloadAction } from '@reduxjs/toolkit';
import { EventType } from '../types/stateTypes';

const initialState: Event = {
  events: [],
  current: [],
  loading: false,
  error: null,
};

export const eventSlice = createSlice({

    name: 'Event',
    initialState,
    reducers: {

        startEvents: ( state, { payload: events } : PayloadAction<EventType[]>  ) => {
            state.events = []
            events.forEach( ( event ) => {
                state.events.push( event )
            });
            state.loading = false
        },


        addEvent: ( state, { payload } ) => {
            state.events.push( payload )
            state.loading = false
        },


        checkingEvents: (state, { payload }) => {
            state.loading = payload
        }
  
    }
});

// Action creators are generated for each case reducer function
export const { addEvent, startEvents, checkingEvents } = eventSlice.actions;		
