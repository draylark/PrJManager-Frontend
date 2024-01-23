
import { createSlice } from '@reduxjs/toolkit';
import { Friend } from '../types/stateInterfaces';
import { PayloadAction } from '@reduxjs/toolkit';
import { FriendType } from '../types/stateTypes';

const initialState: Friend = {
  friends: [],
  current: [],
  loading: false,
  error: null,
};

export const friendSlice = createSlice({

    name: 'Friend',
    initialState,
    reducers: {

        startFriends: ( state, { payload: friends } : PayloadAction<FriendType[]>  ) => {
            state.friends = []
            friends.forEach( ( friend ) => {
                state.friends.push( friend )
            });
            state.loading = false
        },


        addFriend: ( state, { payload } ) => {
            state.friends.push( payload )
            state.loading = false
        },


        checkingFriends: (state, { payload }) => {
            state.loading = payload
        }
  
    }
});

// Action creators are generated for each case reducer function
export const { addFriend, startFriends } = friendSlice.actions;		
