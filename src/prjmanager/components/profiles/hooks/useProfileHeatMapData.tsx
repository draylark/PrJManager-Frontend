import {useState, useEffect, useCallback, useMemo  } from 'react'
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from 'axios'
import { Location } from 'react-router-dom';
import { CommitBase, TaskBase, LayerBase, ProjectBase, RepositoryBase } from '../../../../interfaces/models';
import { AxiosError } from 'axios';

interface Task extends Pick<TaskBase, '_id' | 'task_name' | 'assigned_to' |  'completed_at' > {
    projectID: Pick<ProjectBase, 'name' | 'visibility'> & { _id: string };
    layerID: Pick<LayerBase, '_id' | 'name' | 'visibility'>;
    repositoryID: Pick<RepositoryBase, '_id' | 'name' | 'visibility'>;
}

interface Commit extends Pick<CommitBase, '_id' | 'uuid' | 'createdAt'> {
  author: { uid: string, name: string; photoUrl: string | null };
  projectID: Pick<ProjectBase, 'name' | 'visibility'> & { _id: string };
  layerID: Pick<LayerBase, '_id' | 'name' | 'visibility'>;
  repositoryID: Pick<RepositoryBase, '_id' | 'name' | 'visibility'>;
  associated_task: Pick<TaskBase, '_id' | 'task_name'>
}

interface ApiResponse {
    message: string;
}


export const useProfileHeatMapData = (location: Location, year: string) => {

    const [data, setData] = useState<{ date: string; count: number }[]>([]);
    const [detailsByDay, setDetailsByDay] = useState(new Map());
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [errorWhileFetching, setErrorWhileFetching] = useState(false);
    const [fetchingUserActivity, setFetchingUserActivity] = useState(true);
  
    const uid = useMemo(() => location.state.user.uid, [location.state.user.uid]);
  
    const formatDate = useCallback((date: string) => {
      const d = new Date(date);
      const year = d.getUTCFullYear();
      const month = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      return `${year}/${month}/${day}`;
    }, []);
  
    const formatDateFromHeatMap = useCallback((date: string) => {
      const parts = date.split('/');
      const year = parts[0];
      const month = parts[1].padStart(2, '0');
      const day = parts[2].padStart(2, '0');
      return `${year}/${month}/${day}`;
    }, []);
  
    const handleHeatMapData = useCallback((commits: Commit[], tasks: Task[]) => {
      const combinedData: { [key: string]: { count: number; commits: number; tasks: number } } = {};
      const details: { [key: string]: { commits: number; tasks: number } } = {};
      
  
      commits.forEach(commit => {
        const date = formatDate(commit.createdAt);
        if (!combinedData[date]) {
          combinedData[date] = { count: 0, commits: 0, tasks: 0 };
          details[date] = { commits: 0, tasks: 0 };
        }
        combinedData[date].commits += 1;
        combinedData[date].count += 1;
        details[date].commits += 1;
      });
  
      tasks.forEach(task => {
        const date = formatDate(task.completed_at as string);
        if (!combinedData[date]) {
          combinedData[date] = { count: 0, commits: 0, tasks: 0 };
          details[date] = { commits: 0, tasks: 0 };
        }
        combinedData[date].tasks += 1;
        combinedData[date].count += 1;
        details[date].tasks += 1;
      });
  
      const heatmapData = Object.keys(combinedData).map(date => ({
        date,
        count: combinedData[date].count
      }));
  
      setData(heatmapData);
      setDetailsByDay(new Map(Object.entries(details)));
      setFetchingUserActivity(false);
    }, [formatDate]);
  
    const fetchProfileActivity = useCallback(async (uid: string) => {
      setFetchingUserActivity(true);
      try {
        const tasksResponse = await axios.get(`${backendUrl}/tasks/get-profile-tasks/${uid}`, { 
          params: { year },
          headers: { Authorization: localStorage.getItem('x-token') }
        });
        const commitsResponse = await axios.get(`${backendUrl}/commits/get-profile-commits/${uid}`, { 
          params: { year },
          headers: { Authorization: localStorage.getItem('x-token') }
        });
  
        handleHeatMapData(commitsResponse.data.commits, tasksResponse.data.tasks);
      } catch (error) {

        const axiosError = error as AxiosError<ApiResponse>

        if (axiosError.response) {
            console.error('Error fetching notifications:', error);
            setErrorMessage(axiosError.response.data.message || 'An error occurred while fetching data'); 
            setErrorWhileFetching(true)
            setFetchingUserActivity(false);
        } else {
            setErrorMessage('An error occurred while fetching data');
            setErrorWhileFetching(true)
            setFetchingUserActivity(false);
        }
      }
    }, [year, handleHeatMapData]);
  
    useEffect(() => {
      fetchProfileActivity(uid);
    }, [uid, year, fetchProfileActivity]);
  
    const memoizedData = useMemo(() => ({
      data,
      detailsMap: detailsByDay,
      fetchingUserActivity,
      formatDateFromHeatMap,
      errorMessage,
      errorWhileFetching,
    }), [data, detailsByDay, fetchingUserActivity, formatDateFromHeatMap, errorMessage, errorWhileFetching]);
  
    return memoizedData;
  };

