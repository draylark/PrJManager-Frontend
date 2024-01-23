import { ThunkDispatch } from "@reduxjs/toolkit";
import { AnyAction } from "@reduxjs/toolkit";
import { checkingClients, addClient } from "./clientSlice";
import { ClientType } from "../types/stateTypes";


export const checkingAuthentication = () => {

    return async( dispatch: ThunkDispatch<unknown, unknown, AnyAction> ) => {     
        dispatch( checkingClients(true) );      
    }

}


export const startSavingNewClient = ( payload: ClientType ) => {

    return async( dispatch: ThunkDispatch<unknown, unknown, AnyAction> ) => {     
        dispatch( checkingAuthentication() )

        console.log(payload)

        setTimeout(() => {
            dispatch( addClient( payload ) )   
        }, 3000);
         
    }

}
