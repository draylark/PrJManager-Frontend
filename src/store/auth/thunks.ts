import { ThunkDispatch } from "@reduxjs/toolkit";
import {  UnknownAction } from "@reduxjs/toolkit";
import { checkingCredentials, login, logout } from "./authSlice";

interface DataM {
        status: boolean
        token: string
        user: object
}

export const checkingAuthentication = () => {

    return async( dispatch: ThunkDispatch<unknown, unknown, UnknownAction> ) => {     
        dispatch( checkingCredentials() );      
    }

};

export const startLoginWEmailPassword = ( payload: DataM ) => {

    return async( dispatch: ThunkDispatch<unknown, unknown, UnknownAction> ) => {     
        dispatch( checkingAuthentication() )

        if( !payload.status ) return dispatch( logout({ errorMessage: 'Email o Passwords Incorrectos' }) );

        setTimeout(() => {
            dispatch( login( payload.user ) )   
        }, 3000);
         
    }

};

export const startGoogleLoginWEmailPassword = ( payload: DataM ) => {

    return async( dispatch: ThunkDispatch<unknown, unknown, UnknownAction> ) => {     
        dispatch( checkingAuthentication() )

        if( !payload.status ) return dispatch( logout({ msg: 'Email o Passwords Incorrectos' }) )
        setTimeout(() => {
                dispatch( login( payload.user ) )
        }, 2000);
            
    }

};

export const startStatePersistence = ( userData: DataM ) => {
    return async( dispatch: ThunkDispatch<unknown, unknown, UnknownAction> ) => {     
        dispatch( login( userData.user ) )   
    }
};