import { createAsyncThunk } from '@reduxjs/toolkit';
import { setLayers, setRepositories, setFetchingResources } from './platypusSlice';
import axios from 'axios';



export const fetchProjectLayers = ( projectID, accessLevel, uid ) => {
    return async ( dispatch ) => {
       axios.get(`http://localhost:3000/api/layer/get-layers/${ projectID }`,
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
            console.log( error )
        })   
    };
};

export const fetchProjectRepositories = ( payload, accessLevel, uid ) => {
    return async ( dispatch ) => {
       axios.get(`http://localhost:3000/api/repos/get-repos/${ payload }`,
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
            console.log( error )
        })   
    };
};


export const fetchProjectReposAndLayers = ( projectID, accessLevel, uid ) => {

    const repoUrl = `http://localhost:3000/api/repos/get-repos/${ projectID }`
    const layerUrl = `http://localhost:3000/api/layer/get-layers/${ projectID }`

    return async ( dispatch ) => {
        dispatch( setFetchingResources( true ) )

        axios.all([
            axios.get( repoUrl, {
                params: {
                    uid,
                    accessLevel
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('x-token')
                }
            }),
            axios.get( layerUrl, {
                params: {
                    uid,
                    accessLevel
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('x-token')
                }
            })
        ])
        .then( axios.spread( ( repos, layers ) => {
            console.log('Respuesta desde el thunk R:', repos)
            console.log('Respuesta desde el thunk L:', layers)
            dispatch( setRepositories( repos.data.repos ) )
            dispatch( setLayers( layers.data.layers ) )
            dispatch( setFetchingResources( false ) )
        }))
        .catch( ( error ) => {
            console.log( error )
        })   
    };  
}



export const fetchLayerRepositories = ( projectID: string, layerID: string, uid: string ) => {
    return async ( dispatch ) => {
        dispatch( setFetchingResources( true ) )
        axios.get(`http://localhost:3000/api/repos/get-layer-repos/${ projectID }/${ layerID}`,
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
            console.log('Respuesta desde el thunk L', response)
            dispatch( setRepositories( response.data.repos ) )
            dispatch( setFetchingResources( false ) )
        })
        .catch( ( error ) => {
            console.log( error )
        })   
    };
}
