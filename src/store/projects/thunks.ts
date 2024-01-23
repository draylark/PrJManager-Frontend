import { addProject, checkingProjects } from "./projectSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { AnyAction } from "@reduxjs/toolkit";
import { ProjectType } from "../types/stateTypes";



export const startSavingNewProject = ( project: ProjectType ) => {

    return async( dispatch: ThunkDispatch<unknown, unknown, AnyAction> ) => {     
        dispatch( checkingProjects( true ) )
        console.log(project)
        dispatch( addProject( project ) )
    }

}