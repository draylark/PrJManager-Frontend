import { ThunkDispatch } from "@reduxjs/toolkit";
import { AnyAction } from "@reduxjs/toolkit";
import { addEvent, checkingEvents } from "./eventSlice";
import { EventType } from "../types/stateTypes";


export const checkingAuthentication = () => {

    return async( dispatch: ThunkDispatch<unknown, unknown, AnyAction> ) => {     
        dispatch( checkingEvents(true) );      
    }

}


export const startSavingNewEvent = ( payload: EventType ) => {

    return async( dispatch: ThunkDispatch<unknown, unknown, AnyAction> ) => {     
        dispatch( checkingAuthentication() )

        console.log(payload)

        setTimeout(() => {
            dispatch( addEvent( payload ) )   
        }, 3000);
         
    }

}
