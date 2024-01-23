import { useEffect } from 'react'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from '../store/auth/authSlice';

export interface State {
    auth: {
      status: string;
      uid: string | null;
      email: string | null;
    };
    // ... otras partes del estado
  }


export const useCheckAuth = () => {

    const [ isLoading, setIsLoading ] = useState(true);
    const { status, uid, email } = useSelector( (state: State) => state.auth )
    const dispatch = useDispatch()

    useEffect( () => {

      setIsLoading( false );
      
      if( !uid && !email ){    
          dispatch( logout({}) )
          return 
      } 

    }, [dispatch, email, uid])
    

  return {
    status,
    isLoading
  }
}

export default useCheckAuth
