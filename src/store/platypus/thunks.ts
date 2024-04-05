import { createAsyncThunk } from '@reduxjs/toolkit';
import { setLayers, setRepositories } from './platypusSlice';
import axios from 'axios';



export const fetchProjectLayers = ( payload ) => {
    return async ( dispatch ) => {
       axios.get(`http://localhost:3000/api/layer/get-layers/${ payload }`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('x-token')
            }
        }
       )
        .then( ( response ) => {
            // console.log('Respuesta desde el thunk L', response)
            dispatch( setLayers( response.data.layers ) )
        })
        .catch( ( error ) => {
            console.log( error )
        })   
    };
};

export const fetchProjectRepositories = ( payload ) => {
    return async ( dispatch ) => {
       axios.get(`http://localhost:3000/api/repos/get-repos/${ payload }`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('x-token')
            }
        }
       )
        .then( ( response ) => {
            console.log('Respuesta desde el thunk R:', response)
            dispatch( setRepositories( response.data.repos ) )
        })
        .catch( ( error ) => {
            console.log( error )
        })   
    };
};




