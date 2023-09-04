import { ThunkDispatch } from "@reduxjs/toolkit";
import { AnyAction } from "@reduxjs/toolkit";
import { setNotis, savingNotis } from "./notificationSlice";


interface DataM {
        status: boolean
        token: string
        user: object
}


export const checkingAuthentication = () => {

    return async( dispatch: ThunkDispatch<unknown, unknown, AnyAction> ) => {     
        dispatch( savingNotis(true) );      
    }

}


export const startUploadingNotis = ( payload: DataM ) => {
    return async( dispatch: ThunkDispatch<unknown, unknown, AnyAction> ) => {     
        dispatch( checkingAuthentication() )


        if( !payload ) return; 
        dispatch( setNotis( payload ) )   
         
    }

}

