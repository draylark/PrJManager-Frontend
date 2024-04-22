
import {useState, useEffect } from 'react'
const backendUrl = import.meta.env.VITE_BACKEND_URL
import { Avatar } from '@mui/material'
import axios from 'axios'

export const useActivityData = ( project, uid ) => {

    const [isLoading, setIsLoading] = useState(false);

    const [tasksCompleted, setTasksCompleted] = useState([])
    const [wFApprovalTasks, setWFApprovalTasks] = useState([])
    const [commits, setCommits] = useState([])


    const fetchCollaborators = async ( collaborators ) => {
        try {
          const response = await axios.post(`http://localhost:3000/api/users?limit=${collaborators.length}`, { IDS: collaborators });
          return response.data.users 
        } catch (error) {
          console.error("Error fetching collaborators:", error);
        }
    };

    const fetchAndSetData = async (completedTasks, approvalTasks) => {
        setIsLoading(true);
        try {
            const tasksWithCollaborators = await Promise.all(completedTasks.map(async (task) => {
                const collaborators = await fetchCollaborators(task.contributorsIds);
                return { ...task, contributors: collaborators };
            }));
            
            const wFTasksWithCollaborators = await Promise.all(approvalTasks.map(async (task) => {
                const collaborators = await fetchCollaborators(task.contributorsIds);
                return { ...task, contributors: collaborators };
            }));

            setTasksCompleted(tasksWithCollaborators);
            setWFApprovalTasks(wFTasksWithCollaborators);
            setIsLoading(false)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setIsLoading(false);
    };


    const fetchTasks = async () => {
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
            console.log('completedTasks', completedTasks)
            console.log('approvalTasks', approvalTasks)
            fetchAndSetData(completedTasks, approvalTasks)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchCommits = async () => {
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

            console.log('commits', commits)
            setCommits(commits)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setIsLoading(true)
        fetchTasks()
        fetchCommits()
    }, [project])


  return {
    isLoading,
    setIsLoading,
    tasksCompleted,
    wFApprovalTasks,
    setWFApprovalTasks,
    setTasksCompleted,
    commits
  }
}
