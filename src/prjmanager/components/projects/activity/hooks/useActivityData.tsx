
import {useState, useEffect, useCallback } from 'react'
const backendUrl = import.meta.env.VITE_BACKEND_URL
import axios, { AxiosError } from 'axios'
import { CommitBase, TaskBase, ProjectBase, ModifiedTaskBase } from '../../../../../interfaces/models'


interface ApiResponse {
    message: string;
    type: string;
}

export interface DedicatedCommit extends Omit<CommitBase, 'hash'>{}

export const useActivityData = ( project: ProjectBase, uid: string ) => {

    const [isLoading, setIsLoading] = useState(false);
    const [errorType, setErrorType] = useState<string | null>(null);    
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [errorWhileFetching, setErrorWhileFetching] = useState<boolean>(false);

    const [commits, setCommits] = useState<DedicatedCommit[]>([]);
    const [tasksCompleted, setTasksCompleted] = useState<ModifiedTaskBase[]>([]);
    const [wFApprovalTasks, setWFApprovalTasks] = useState<ModifiedTaskBase[]>([]);


    const fetchAndSetData = async (completedTasks: TaskBase[], approvalTasks: TaskBase[]) => {
        setIsLoading(true);
        const tasksWithCollaborators = await Promise.all(completedTasks.map(async (task: TaskBase) => {
            const { contributorsIds, ...rest } = task
            return { ...rest, contributors: contributorsIds } 
        })) as ModifiedTaskBase[];
        
        const wFTasksWithCollaborators = await Promise.all(approvalTasks.map(async (task: TaskBase) => {
            const { contributorsIds, ...rest } = task
            return { ...rest, contributors: contributorsIds } 
        })) as ModifiedTaskBase[];

        setTasksCompleted(tasksWithCollaborators);
        setWFApprovalTasks(wFTasksWithCollaborators);
        setIsLoading(false);
    };

    const fetchTasks = useCallback( async () => {
        try {
            const { data: { completedTasks, approvalTasks }} = await axios.get(`${backendUrl}/tasks/activity-data/${project.pid}`, { 
                params: {
                    uid
                },       
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('x-token')
                }
            });

            fetchAndSetData(completedTasks, approvalTasks)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>; // Asumir que es un error de Axios

            if (axiosError.response) {
                setErrorMessage(axiosError.response.data.message || 'An error occurred while fetching data');
                setErrorType(axiosError.response.data.type || 'Error');
            } else {
                // Manejar errores que no son de Axios
                setErrorMessage('An unexpected error occurred');
                setErrorType('Unknown Error');
            }
            setErrorWhileFetching(true);
        }
    }, [project, uid]);

    const fetchCommits = useCallback( async () => {
        try {
            const { data: { commits } } = await axios.get(`${backendUrl}/commits/activity-data/${project.pid}`, {  
                params: {
                    uid
                },      
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('x-token')
                }
            });

            setCommits(commits)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>; // Asumir que es un error de Axios

            if (axiosError.response) {
                setErrorMessage(axiosError.response.data.message || 'An error occurred while fetching data');
                setErrorType(axiosError.response.data.type || 'Error');
            } else {
                // Manejar errores que no son de Axios
                setErrorMessage('An unexpected error occurred');
                setErrorType('Unknown Error');
            }
            setErrorWhileFetching(true);
        }
    }, [project, uid]);


    const fetchData = () => {
        setIsLoading(true)
        fetchTasks()
        fetchCommits()
    };

    useEffect(() => {
        setIsLoading(true)
        fetchTasks()
        fetchCommits()
    }, [project, fetchTasks, fetchCommits]);

  return {
    isLoading,
    setIsLoading,
    tasksCompleted,
    wFApprovalTasks,
    setWFApprovalTasks,
    setTasksCompleted,
    commits,
    errorMessage,
    errorWhileFetching,
    errorType,
    fetchData
  }
}
