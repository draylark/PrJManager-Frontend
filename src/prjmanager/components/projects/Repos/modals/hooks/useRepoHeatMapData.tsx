import { useState, useEffect } from 'react'
import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { TaskBase, CommitBase } from '../../../../../../interfaces/models';


interface CompletedTasks extends Omit<TaskBase, 'status'> {
    status: 'completed';
}

interface DedicatedCommit extends Omit<CommitBase, 'hash' | 'associated_task'> {
    associated_task: Pick<TaskBase, '_id' | 'task_name'> | null;
}

interface HeatMapData {
    date: string;
    count: number;
    details?: { commits: number; tasks: number };
}

interface CombinedData {
    [date: string]: { count: number; commits: number; tasks: number };
}

interface DetailsByDay {
    [date: string]: { commits: number; tasks: number };
}

export const useRepoHeatMapData = (repoID: string, uid: string ) => {

    const [data, setData] = useState<HeatMapData[]>([]);
    const [detailsByDay, setDetailsByDay] = useState(new Map());
    const [year, setYear] = useState(new Date().getFullYear().toString());


    const formatDate = (date: string) => {
        const d = new Date(date);
        // Convertir a UTC
        const year = d.getUTCFullYear();
        const month = String(d.getUTCMonth() + 1).padStart(2, '0'); // getUTCMonth() devuelve un valor de 0 a 11, por lo tanto, sumamos 1
        const day = String(d.getUTCDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    const formatDateFromHeatMap = (date: string) => {
        // Asumiendo que date es una cadena en formato "YY/M/D"
        const parts = date.split("/"); // Separar la cadena por '/'
        const year = parts[0]; // Año ya está en formato YY
        const month = parts[1].padStart(2, '0'); // Añadir cero si es necesario para el mes
        const day = parts[2].padStart(2, '0'); // Añadir cero si es necesario para el día
        
        return `${year}/${month}/${day}`;
    };

    const handleHeatMapData = (commits: DedicatedCommit[], tasks: CompletedTasks[]) => {
        const combinedData: CombinedData = {};
        const details: DetailsByDay = {};

        // Procesar commits
        commits.forEach(commit => {
            const date = formatDate(commit.createdAt);
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
        setDetailsByDay(new Map(Object.entries(details)));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tasksData = await axios.get(`${backendUrl}/tasks/repo-activity/${repoID}`, { 
                    params: { year, uid },
                    headers: { Authorization: localStorage.getItem('x-token') } 
                });
                // console.log('tasksData',tasksData)
                const commitsData = await axios.get(`${backendUrl}/commits/repo-activity/${repoID}`, { 
                    params: { year, uid },
                    headers: { Authorization: localStorage.getItem('x-token') } 
                });
                // console.log('commitsData', commitsData)
                handleHeatMapData(commitsData.data.commits, tasksData.data.tasks);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [repoID, year]);

    return {
        data,
        detailsMap: detailsByDay, // Ahora devuelve el mapa de detalles por día
        formatDateFromHeatMap,
        year, 
        setYear
    };
}
