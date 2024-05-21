import { useState, useEffect } from 'react';
import { RootState } from '../../../../../store/store';
import { useSelector } from 'react-redux';
import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface HeatMapData {
    date: string,
    count: number
}

export const useHeatMapDatesData = ( uid ) => {

    const currentDate = new Date()
    currentDate.setHours(23, 59, 59, 999);
    const sixMonthsAgo = new Date( currentDate )
    sixMonthsAgo.setMonth( currentDate.getMonth() - 6 )

    const [isLoading, setIsLoading] = useState(true)

    const [errorMessage, seterrorMessage] = useState(null)
    const [errorWhileFetching, setErrorWhileFetching] = useState(false)

    const [tasks, setTasks] = useState([]);
    const [commits, setCommits] = useState([]);
    const [endDate, setEndDate] = useState(currentDate);    
    const [startDate, setStartDate] = useState(sixMonthsAgo);
    const [tasksDetailsByDay, setTasksDetailsByDay] = useState(new Map());
    const [commitsDetailsByDay, setCommitsDetailsByDay] = useState(new Map());


    const formatDateFromHeatMap = (date: Date) => {
        // Asumiendo que date es una cadena en formato "YY/M/D"
        const parts = date.split("/"); // Separar la cadena por '/'
        const year = parts[0]; // Año ya está en formato YY
        const month = parts[1].padStart(2, '0'); // Añadir cero si es necesario para el mes
        const day = parts[2].padStart(2, '0'); // Añadir cero si es necesario para el día
        
        return `${year}-${month}-${day}`;
    };

    const handleHeatMapData = ( commits, tasks ) => {

        if( tasks.length === 0 && commits.length === 0 ) {
            setIsLoading(false)
            return;
            
        } else if ( tasks.length === 0 && commits.length > 0 ) {

            const commitCounts = {};  // Objeto para almacenar los conteos por fecha
            commits.forEach(commit => {
                const date = new Date(commit.createdAt);
                const dateString = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
        
                // Si la fecha ya está en el objeto, incrementa el conteo, si no, inicialízalo a 1
                if (commitCounts[dateString]) {
                    commitCounts[dateString].count += 1;
                } else {
                    commitCounts[dateString] = { date: dateString, count: 1 };
                }
            });
            const transformedCommits = Object.values(commitCounts);
            setCommits(transformedCommits); 
            setCommitsDetailsByDay(new Map(Object.entries(commitCounts)));
            setIsLoading(false)
            return;

        }  else if ( tasks.length > 0 && commits.length === 0 ) {      
            const taskCounts = {};  // Objeto para almacenar los conteos por fecha
            tasks.forEach(task => {
                const date = new Date(task.updatedAt);
                const dateString = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
        
                // Si la fecha ya está en el objeto, incrementa el conteo, si no, inicialízalo a 1
                if (taskCounts[dateString]) {
                    taskCounts[dateString].count += 1;
                } else {
                    taskCounts[dateString] = { date: dateString, count: 1 };
                }
            });
            const transformedTasks = Object.values(taskCounts);
            setTasks(transformedTasks); 
            setTasksDetailsByDay(new Map(Object.entries(taskCounts)));
            setIsLoading(false)
            return;
        }

        const taskCounts = {};  // Objeto para almacenar los conteos por fecha
        const commitCounts = {};  // Objeto para almacenar los conteos por fecha
    
        // Iterar sobre cada tarea y acumular el conteo de tareas por fecha
        tasks.forEach(task => {
            const date = new Date(task.updatedAt);
            const dateString = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
    
            // Si la fecha ya está en el objeto, incrementa el conteo, si no, inicialízalo a 1
            if (taskCounts[dateString]) {
                taskCounts[dateString].count += 1;
            } else {
                taskCounts[dateString] = { date: dateString, count: 1 };
            }
        });


        // Iterar sobre cada commit y acumular el conteo de commits por fecha
        commits.forEach(commit => {
            const date = new Date(commit.createdAt);
            const dateString = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
    
            // Si la fecha ya está en el objeto, incrementa el conteo, si no, inicialízalo a 1
            if (commitCounts[dateString]) {
                commitCounts[dateString].count += 1;
            } else {
                commitCounts[dateString] = { date: dateString, count: 1 };
            }
        });

    
        // Convertir el objeto de conteos en un array para el estado
        const transformedTasks = Object.values(taskCounts);
        const transformedCommits = Object.values(commitCounts);

        setTasks(transformedTasks); 
        setCommits(transformedCommits); 
        setTasksDetailsByDay(new Map(Object.entries(taskCounts)));
        setCommitsDetailsByDay(new Map(Object.entries(commitCounts)));
        setIsLoading(false)
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
            seterrorMessage(error.response.data.message || 'An error occurred while fetching data');
            setErrorWhileFetching(true)
            setIsLoading(false)
        }
    };


    useEffect(() => {
        setIsLoading(true)
        fetchData()
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
