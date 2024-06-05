import { useState, useEffect } from 'react'
import axios from 'axios'
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const useBarData = (uid) => {

    const [totalProjects, setTotalProjects] = useState(0)
    const [ totalCommits, setTotalCommits ] = useState(0)    
    const [totalCompletedTasks, setTotalCompletedTasks] = useState(0)


    const fetchData = () => {
        axios.get(`${backendUrl}/users/my-monthly-activity/${uid}`, {
            params: {
                currentMonth: new Date().getMonth() + 1,
                currentYear: new Date().getFullYear()
            },
            headers: { 'Authorization': localStorage.getItem('x-token') } 
        })
        .then(response => {
            setTotalProjects(response.data.projectsLength);
            setTotalCommits(response.data.commitsLength);
            setTotalCompletedTasks(response.data.completedTasksLength);
        })
        .catch(error => {
            console.log(error);
        })
    };
    
    
    useEffect(() => {
        fetchData()
    }, [])

  return {
    totalProjects,
    totalCommits,
    totalCompletedTasks
  }
}
