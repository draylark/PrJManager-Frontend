import axios from 'axios'
import { ThunkDispatch } from "@reduxjs/toolkit";
import { AnyAction } from "@reduxjs/toolkit";
import { RootState } from '../store/store';
import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { logout } from '../store/auth/authSlice';
import { startStatePersistence } from "../store/auth/thunks";


export const useStateVerifier = () => {


    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>()


    const token = localStorage.getItem('x-token')
    
    useEffect(() => {
  
      const verifyUserState = async() => {
  
        if( !token ) {
            setLoading( false )
            return dispatch(logout({}))
           
        }

        try {    
              if(token) {
        
                    const response = await axios.post('http://localhost:3000/api/auth/me', {},  {
                          headers: {
                                'Authorization': token
                          } 
                    })

                    if( !response.data.state ){ 
                        setLoading(false)
                        return dispatch(logout({}))      
                    }


                    const notesResponse = await axios.get(`http://localhost:3000/api/notis/${response.data.user.uid}`)

                    dispatch( startStatePersistence( response.data, notesResponse.data.notis) )
                    setLoading( false )              
              } 
  
        } catch (error: unknown) {
                    // console.error(error.response.data); // No token - error message
                    setLoading(false)
                    dispatch(logout({}))
                
        }
  
      }
  
      verifyUserState()
  
    }, [dispatch, token])

  return {
    loading
  }
}
