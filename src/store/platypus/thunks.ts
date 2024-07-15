import { setLayers, setRepositories, setFetchingResources, setError } from './platypusSlice';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from 'axios';
import { ThunkDispatch } from 'redux-thunk';
import { Action, UnknownAction } from 'redux';
import { RootState } from '../store';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';

export const fetchProjectLayers = ( projectID, accessLevel, uid ) => {
    return async ( dispatch ) => {
       axios.get(`${backendUrl}/layer/get-layers/${ projectID }`,
        {
            params: {
                uid,
                accessLevel
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('x-token')
            }
        }
       )
        .then( ( response ) => {
            console.log('Respuesta desde el thunk L', response)
            dispatch( setLayers( response.data.layers ) )
        })
        .catch( ( error ) => {
            dispatch(
                setError({
                  fetchingResources: false,
                  errorWhileFetching: true,
                  errorMessage: error.response.data.message || 'An error occurred while fetching data',
                  errorType: error.response.data.type || 'Error',
                })
              );
        })   
    };
};

export const fetchProjectRepositories = ( payload, accessLevel, uid ) => {
    return async ( dispatch ) => {
       axios.get(`${backendUrl}/repos/get-repos/${ payload }`,
        {
            params: {
                uid,
                accessLevel
            },
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
            dispatch(
                setError({
                  fetchingResources: false,
                  errorWhileFetching: true,
                  errorMessage: error.response.data.message || 'An error occurred while fetching data',
                  errorType: error.response.data.type || 'Error',
                })
              );
        })   
    };
};

export const fetchProjectReposAndLayers = (
    projectID: string,
    uid: string,
    accessLevel?: string
  ): ThunkAction<void, RootState, unknown, Action<string>> => {
    const repoUrl = `${backendUrl}/repos/get-repos/${projectID}`;
    const layerUrl = `${backendUrl}/layer/get-layers/${projectID}`;
  
    return async (dispatch) => {
      dispatch(setFetchingResources(true));
  
      try {
        const [repoResponse, layerResponse] = await Promise.all([
          axios.get(repoUrl, {
            params: { uid, accessLevel },
            headers: {
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('x-token')
            }
          }),
          axios.get(layerUrl, {
            params: { uid, accessLevel },
            headers: {
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('x-token')
            }
          })
        ]);
  
        dispatch(setRepositories(repoResponse.data.repos));
        dispatch(setLayers(layerResponse.data.layers));
        dispatch(setFetchingResources(false));
      } catch (error) {
        dispatch(setError({
          fetchingResources: false,
          errorWhileFetching: true,
          errorMessage: error.response?.data.message || 'An error occurred while fetching data',
          errorType: error.response?.data.type || 'Error',
        }));
      }
    };
  };

export const fetchLayerRepositories = ( projectID: string, layerID: string, uid: string ) => {
    return async ( dispatch ) => {
        dispatch( setFetchingResources( true ) )
        axios.get(`${backendUrl}/repos/get-layer-repos/${ projectID }/${layerID}`,
        {
            params: {
                uid
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('x-token')
            }
        }
        )
        .then( ( response ) => {
            dispatch( setRepositories( response.data.repos ) )
            dispatch( setFetchingResources( false ) )
        })
        .catch( ( error ) => {
            console.log( error )
        })   
    };
};