import { ThunkDispatch } from "@reduxjs/toolkit";
import { AnyAction } from "@reduxjs/toolkit";
import { checkingCredentials, login, logout } from "./authSlice";
import { setNotis } from "../notifications/notificationSlice";


interface DataM {
        status: boolean
        token: string
        user: object
}


export const checkingAuthentication = () => {

    return async( dispatch: ThunkDispatch<unknown, unknown, AnyAction> ) => {     
        dispatch( checkingCredentials() );      
    }

}


export const startLoginWEmailPassword = ( payload: DataM ) => {

    return async( dispatch: ThunkDispatch<unknown, unknown, AnyAction> ) => {     
        dispatch( checkingAuthentication() )

        // console.log(payload)
        if( !payload.status ) return dispatch( logout({ errorMessage: 'Email o Passwords Incorrectos' }) );

        setTimeout(() => {
            dispatch( login( payload.user ) )   
        }, 3000);
         
    }

}


export const startGoogleLoginWEmailPassword = ( payload: DataM ) => {

    return async( dispatch: ThunkDispatch<unknown, unknown, AnyAction> ) => {     
        dispatch( checkingAuthentication() )

        

        // console.log(payload)
        if( !payload.status ) return dispatch( logout({ msg: 'Email o Passwords Incorrectos' }) )
        setTimeout(() => {
                dispatch( login( payload.user ) )
        }, 2000);
            
    }

}


export const startStatePersistence = ( userData: DataM, userNotes: [] ) => {

    return async( dispatch: ThunkDispatch<unknown, unknown, AnyAction> ) => {     
        dispatch( checkingAuthentication() )

        console.log(userNotes)
        setTimeout(() => {
            dispatch( setNotis( userNotes ) )   
            dispatch( login( userData.user ) )   
        }, 3000);
 
    }

}