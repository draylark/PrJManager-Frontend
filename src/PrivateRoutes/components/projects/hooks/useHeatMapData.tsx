import { useState, useEffect, useCallback } from 'react'
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios, { AxiosError } from 'axios'
import { CommitWithATPopulated, TaskBase } from '../../../../interfaces/models';

type HeatMapData = { 
    date: string; 
    count: number; 
    details?: { commits: number, tasks: number } 
}

interface ApiResponse {
    message: string;
}
  
export const useHeatMapData = ( projectID: string, uid: string ) => {

    const [data, setData] = useState<HeatMapData[]>([]);
    const [detailsByDay, setDetailsByDay] = useState(new Map());
    const [year, setYear] = useState(new Date().getFullYear().toString());

    const [errorMessage, seterrorMessage] = useState<string | null>(null)
    const [errorWhileFetching, setErrorWhileFetching] = useState(false)


    const formatDate = (date: string) => {
        const d = new Date(date);
        // Convertir a UTC
        const year = d.getUTCFullYear();
        const month = String(d.getUTCMonth() + 1).padStart(2, '0'); // getUTCMonth() devuelve un valor de 0 a 11, por lo tanto, sumamos 1
        const day = String(d.getUTCDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    const formatDateFromHeatMap = (date: string): string => {
        // Asumiendo que date es una cadena en formato "YY/M/D"
        const parts = date.split("/"); // Separar la cadena por '/'
        const year = parts[0]; // Año ya está en formato YY
        const month = parts[1].padStart(2, '0'); // Añadir cero si es necesario para el mes
        const day = parts[2].padStart(2, '0'); // Añadir cero si es necesario para el día
        
        return `${year}/${month}/${day}`;
    };

    const handleHeatMapData = useCallback((
        commits: CommitWithATPopulated[], 
        tasks: TaskBase[]
    ) => {

        const combinedData : { [key: string]: { count: number, commits: number, tasks: number } }
        = {};
        const details : { [key: string]: { commits: number, tasks: number } }
        = {};

        // Procesar commits
        commits.forEach(commit => {
            const date = formatDate(commit.createdAt) 
            if (!combinedData[date]) {
                combinedData[date] = { count: 0, commits: 0, tasks: 0 };
                details[date] = { commits: 0, tasks: 0 }; // Inicializa los arrays de detalles
            }
            combinedData[date].commits += 1;
            combinedData[date].count += 1;
            details[date].commits += 1 // Agrega el commit a los detalles
        });

        // Procesar tasks
        tasks.forEach(task => {
            const date = formatDate(task.updatedAt);
            if (!combinedData[date]) {
                combinedData[date] = { count: 0, commits: 0, tasks: 0 };
                details[date] = { commits: 0, tasks: 0 }; // Asegúrate de inicializar si aún no existe
            }
            combinedData[date].tasks += 1;
            combinedData[date].count += 1;
            details[date].tasks += 1 // Agrega la tarea a los detalles
        });

        // Convertir a formato adecuado para el heatmap
        const heatmapData = Object.keys(combinedData).map(date => ({
            date,
            count: combinedData[date].count,
            // details: { commits: combinedData[date].commits, tasks: combinedData[date].tasks }
        }));

        setData(heatmapData);
        // Actualiza el estado con los detalles por día
        setDetailsByDay(new Map(Object.entries(details)));
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const tasksData = await axios.get(`${backendUrl}/tasks/activity/${projectID}`, { 
                    params: { year, uid },
                    headers: { Authorization: localStorage.getItem('x-token') } 
                });

                const commitsData = await axios.get(`${backendUrl}/commits/activity-data/${projectID}`, { 
                    params: { year, uid },
                    headers: { Authorization: localStorage.getItem('x-token') } 
                });

                handleHeatMapData(commitsData.data.commits, tasksData.data.tasks);
            } catch (error) {
                // console.error('Error fetching heatmap data:', error);
                const axiosError = error as AxiosError<ApiResponse>
                if (axiosError.response) {
                    seterrorMessage(axiosError.response.data.message || 'An error occurred while fetching data');
                    setErrorWhileFetching(true)

                } else {
                    seterrorMessage('An error occurred while fetching data');
                    setErrorWhileFetching(true)
                }
            }
        };
        fetchData();
    }, [projectID, year, handleHeatMapData, uid]);

    return {
        data,
        detailsMap: detailsByDay, // Ahora devuelve el mapa de detalles por día
        formatDateFromHeatMap,
        year, 
        setYear,
        errorMessage,
        errorWhileFetching
    };
};


