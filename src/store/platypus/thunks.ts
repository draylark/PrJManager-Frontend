import { setLayers, setRepositories, setFetchingResources, setError } from './platypusSlice';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios, { AxiosError } from 'axios';
import { Action } from 'redux';
import { RootState } from '../store';
import { ThunkAction } from 'redux-thunk';

interface ApiResponse {
  message: string;
  type: string;
}


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
        const axiosError = error as AxiosError<ApiResponse>;
        if (axiosError.response) {
          dispatch(setError({
            fetchingResources: false,
            errorWhileFetching: true,
            errorMessage: axiosError.response?.data.message || 'An error occurred while fetching data',
            errorType: axiosError.response?.data.type || 'Error',
          }));
        } else {
          dispatch(setError({
            fetchingResources: false,
            errorWhileFetching: true,
            errorMessage: 'An error occurred while fetching data',
            errorType: 'Error',
          }));
        }
      }
    };
  };

export const fetchLayerRepositories = ( 
    projectID: string, 
    layerID: string, 
    uid: string 
  ): ThunkAction<void, RootState, unknown, Action<string>> => {
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
          console.log('repos', response)
            dispatch( setRepositories( response.data.repos ) )
            dispatch( setFetchingResources( false ) )
        })
        .catch( ( error ) => {
            console.log( error )
        })   
    };
};