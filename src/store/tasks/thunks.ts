
import { addTasks, checkingTasks } from "./taskSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { AnyAction } from "@reduxjs/toolkit";
import { TaskType } from "../types/stateTypes";

export const startSavingNewTask = ( task: TaskType ) => {

    return async( dispatch: ThunkDispatch<unknown, unknown, AnyAction> ) => {     
        dispatch( checkingTasks( true ) )
        console.log(task)
        dispatch( addTasks( task ) )
    }

}
