import { ThunkDispatch } from "@reduxjs/toolkit";
import { AnyAction } from "@reduxjs/toolkit";
import { checkingCredentials, login, logout } from "./authSlice";
import { setNotis } from "../notifications/notificationSlice";
import { startProjects } from "../projects/projectSlice";
import { startTasks } from "../tasks/taskSlice";
import { startClients } from "../clients/clientSlice";
import { startEvents } from "../events/eventSlice";
// import { startRepositories } from "../repos/reposSlice";
import { startLayers, startRepositories } from "../gitlab/gitlabSlice";


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

        if( !payload.status ) return dispatch( logout({ errorMessage: 'Email o Passwords Incorrectos' }) );

        setTimeout(() => {
            dispatch( login( payload.user ) )   
        }, 3000);
         
    }

}


export const startGoogleLoginWEmailPassword = ( payload: DataM ) => {

    return async( dispatch: ThunkDispatch<unknown, unknown, AnyAction> ) => {     
        dispatch( checkingAuthentication() )

        if( !payload.status ) return dispatch( logout({ msg: 'Email o Passwords Incorrectos' }) )
        setTimeout(() => {
                dispatch( login( payload.user ) )
        }, 2000);
            
    }

}


export const startStatePersistence = ( userData: DataM, userNotes: [], userProjects: [], userTasks: [], userClients: [], userEvents: [], userRepos: [], userGroups: [] ) => {

    return async( dispatch: ThunkDispatch<unknown, unknown, AnyAction> ) => {     
        dispatch( checkingAuthentication() )

        // console.log(userGroups)
        setTimeout(() => {
            dispatch( startProjects( userProjects ))
            dispatch( setNotis( userNotes ) )   
            dispatch( login( userData.user ) )   
            dispatch( startTasks( userTasks ) )
            dispatch( startClients( userClients ))
            dispatch( startEvents( userEvents ))
            dispatch( startRepositories( userRepos ))
            dispatch( startLayers( userGroups ))
        }, 3000);
 
    }

}