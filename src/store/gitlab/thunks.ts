
import { ThunkDispatch } from "@reduxjs/toolkit";
import { AnyAction } from "@reduxjs/toolkit";

import { checkingGitlab, addNewLayer, addNewRepository } from "../gitlab/gitlabSlice";



export const loadNewLayer = ( layer ) => {

    return async( dispatch: ThunkDispatch<unknown, unknown, AnyAction> ) => {
        dispatch( checkingGitlab(true) )

        setTimeout(() => {
            dispatch( addNewLayer( layer ) )    
        }, 2000);

    }

}
export const loadNewRepo = ( repo ) => {

    return async( dispatch: ThunkDispatch<unknown, unknown, AnyAction> ) => {
        dispatch( checkingGitlab(true) )

        setTimeout(() => {
            dispatch( addNewRepository( repo ) )    
        }, 2000);

    }

}
