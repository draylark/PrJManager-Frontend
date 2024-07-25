import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { CommitBase, TaskBase } from '../../../../../interfaces/models';


type HeatMapFormat = {
    date: string;
    count: number;
}

interface Commit extends Pick<CommitBase, 'createdAt' | '_id' | 'message'> {}
interface Task extends Pick<TaskBase, 'completed_at' | '_id' | 'task_name'> {}

interface ApiResponse {
    message: string;
}

export const useHeatMapDatesData = ( uid: string ) => {

    const currentDate = new Date()
    currentDate.setHours(23, 59, 59, 999);
    const sixMonthsAgo = new Date( currentDate )
    sixMonthsAgo.setMonth( currentDate.getMonth() - 6 )


    const [commits, setCommits] = useState<HeatMapFormat[]>([]);
    const [tasks, setTasks] = useState<HeatMapFormat[]>([]);
    const [endDate, setEndDate] = useState(currentDate);    
    const [startDate, setStartDate] = useState(sixMonthsAgo);
    const [tasksDetailsByDay, setTasksDetailsByDay] = useState<Map<string, HeatMapFormat>>(new Map());
    const [commitsDetailsByDay, setCommitsDetailsByDay] = useState<Map<string, HeatMapFormat>>(new Map());

    const [isLoading, setIsLoading] = useState(true);
    const [errorWhileFetching, setErrorWhileFetching] = useState(false)    
    const [errorMessage, seterrorMessage] = useState<string | null>(null)
   
    const formatDateFromHeatMap = (date: string) => {
        // Asumiendo que date es una cadena en formato "YY/M/D"
        const parts = date.split("/"); // Separar la cadena por '/'
        const year = parts[0]; // Año ya está en formato YY
        const month = parts[1].padStart(2, '0'); // Añadir cero si es necesario para el mes
        const day = parts[2].padStart(2, '0'); // Añadir cero si es necesario para el día
        
        return `${year}-${month}-${day}`;
    };

    const handleHeatMapData = (commits: Commit[], tasks: Task[]) => {

        const addOrUpdateCount = (
            countsObj: { [key: string]: { date: string; count: number; } }, 
            date: Date, 
        ) => {
            const dateString = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
            if (countsObj[dateString]) {
                countsObj[dateString].count += 1;
            } else {
                countsObj[dateString] = { date: dateString, count: 1 };
            }
        };
    
        const processData = (
            items: (Task | Commit)[], 
            dateKey: 'completed_at' | 'createdAt', 
            setFunction: React.Dispatch<React.SetStateAction<HeatMapFormat[]>>, 
            detailsByDaySetter: React.Dispatch<React.SetStateAction<Map<string, HeatMapFormat>>>
        ) => {

            const counts = {};
            items.forEach(item => {
                const date = new Date(item[dateKey as keyof (Task | Commit)]);
                addOrUpdateCount(counts, date);
            });
            const transformedItems = Object.values(counts);
            setFunction(transformedItems as HeatMapFormat[]);
            detailsByDaySetter(new Map(Object.entries(counts)));

        };
    
        setIsLoading(true);
    
        if (!tasks.length && !commits.length) {
            setIsLoading(false);
            return;
        }
    
        if (tasks.length && commits.length) {
            processData(
                tasks, 
                'completed_at', 
                setTasks as React.Dispatch<React.SetStateAction<HeatMapFormat[]>>, 
                setTasksDetailsByDay
            );
            processData(
                commits, 
                'createdAt', 
                setCommits as React.Dispatch<React.SetStateAction<HeatMapFormat[]>>, 
                setCommitsDetailsByDay
            );
        } else if (tasks.length) {
            processData(
                tasks, 
                'completed_at', 
                setTasks as React.Dispatch<React.SetStateAction<HeatMapFormat[]>>, 
                setTasksDetailsByDay
            );
        } else if (commits.length) {
            processData(
                commits, 
                'createdAt', 
                setCommits as React.Dispatch<React.SetStateAction<HeatMapFormat[]>>, 
                setCommitsDetailsByDay
            );
        }
    
        setIsLoading(false);
    };

    const fetchData = async() => {
        try {
            const { data: { tasks } } = await axios.get(`${backendUrl}/tasks/get-tasks-for-dashboard/${uid}`, { 
                params: { startDate, endDate, uid },
                headers: { Authorization: localStorage.getItem('x-token') } 
            });

            const { data: { commits } } = await axios.get(`${backendUrl}/commits/get-commits-for-dashboard/${ uid }`, { 
                params: { startDate, endDate, uid },
                headers: { Authorization: localStorage.getItem('x-token') } 
            });

            handleHeatMapData(commits, tasks);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>

            if( axiosError.response ) {
                seterrorMessage(axiosError.response.data.message); 
                setErrorWhileFetching(true)
            } else {
                seterrorMessage('An error occurred while fetching data');
                setErrorWhileFetching(true)
            }
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        setIsLoading(true)
        fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ startDate, endDate ])
    

  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    currentDate,
    sixMonthsAgo,
    errorMessage,
    errorWhileFetching,
    commits, 
    tasks,
    isLoading,
    setIsLoading,
    tasksDetailsByDay,
    commitsDetailsByDay,
    formatDateFromHeatMap
  }

}
