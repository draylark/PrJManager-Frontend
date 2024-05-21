import { useState, useEffect } from 'react'
import axios from 'axios'
const backendUrl = import.meta.env.VITE_BACKEND_URL


export const useRepositoryTasksData = ( repoID: string ) => {

    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [errorMessage, setErrorMessage] = useState(null)
    const [errorWhileFetching, setErrorWhileFetching] = useState(false)

    const fetchCollaborators = async ( collaborators ) => {
        try {
          const response = await axios.post(`http://localhost:3000/api/users?limit=${collaborators.length}`, { IDS: collaborators });
          return response.data.users 
        } catch (error) {
          console.error("Error fetching collaborators:", error);
        }
    };

    const fetchAndSetData = async (tasks) => {
        setIsLoading(true);
        try {
        const tasksWithCollaborators = await Promise.all(tasks.map(async (task) => {
            const collaborators = await fetchCollaborators(task.contributorsIds);
            console.log('collaborators', collaborators)
            return { ...task, contributors: collaborators };
        }));
        
        // const wFTasksWithCollaborators = await Promise.all(wFApprovalTasksData.map(async (task) => {
        //   const collaborators = await fetchCollaborators(task.collaboratorsIds);
        //   const { completedBy, ...rest } = task;
        //   return { ...rest, completedBy: collaborators };
        // }));

        // console.log(wFTasksWithCollaborators)

        setTasks(tasksWithCollaborators);
        setIsLoading(false)
        } catch (error) {
          console.error("Error fetching data:", error);
        }
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
            // console.log(res)
            fetchAndSetData(res.data.tasks)
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setIsLoading(false)
            setErrorWhileFetching(true)
            setErrorMessage(error.response.data.message || 'There was an error while fetching repository tasks.')
        }
    }

    useEffect(() => {
        fetchTasks()
    }, [])
    
  return {
    isLoading,
    tasks,
    setTasks,
    errorMessage,
    errorWhileFetching
  }
}
