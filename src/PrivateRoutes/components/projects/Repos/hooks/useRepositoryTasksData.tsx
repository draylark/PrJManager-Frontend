import { useState, useEffect } from 'react'
import axios, { AxiosError } from 'axios'
const backendUrl = import.meta.env.VITE_BACKEND_URL
import { TaskBase, ModifiedTaskBase } from '../../../../../interfaces/models'


interface ApiResponse {
  message: string;
  type: string;
}

export const useRepositoryTasksData = ( repoID: string ) => {


    const [tasks, setTasks] = useState<ModifiedTaskBase[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [errorWhileFetching, setErrorWhileFetching] = useState(false);


    const reorganizeAndSetData = async (tasks: TaskBase[]) => {
      setIsLoading(true);

      const tasksWithCollaborators = await Promise.all(tasks.map(async (task: TaskBase) => {
        const { contributorsIds, ...rest } = task;
          return { ...rest, contributors: contributorsIds };
      })) as ModifiedTaskBase[];

      setTasks(tasksWithCollaborators);
      setIsLoading(false);
    };


    const fetchTasks = async () => {
        try {
            setIsLoading(true)
            const res = await axios.get(`${backendUrl}/tasks/${repoID}`, {        
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('x-token')
                }
            });
            reorganizeAndSetData(res.data.tasks)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>; // Asumir que es un error de Axios

          if (axiosError.response) {
              setErrorWhileFetching(true);    
              setErrorMessage(axiosError.response.data.message || 'An error occurred while fetching data');
              setIsLoading(false)
          } else {
              // Manejar errores que no son de Axios
              setErrorWhileFetching(true);              
              setErrorMessage('An unexpected error occurred');
              setIsLoading(false)
          }
        }
    };

    useEffect(() => {
        fetchTasks()    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
  return {
    isLoading,
    tasks,
    setTasks,
    errorMessage,
    errorWhileFetching
  }
}
