import {useState, useEffect, useCallback, useMemo  } from 'react'
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from 'axios'



export const useProfileHeatMapData = (location, year) => {
    const [data, setData] = useState([]);
    const [detailsByDay, setDetailsByDay] = useState(new Map());
    const [errorMessage, setErrorMessage] = useState(null);
    const [errorWhileFetching, setErrorWhileFetching] = useState(false);
    const [fetchingUserActivity, setFetchingUserActivity] = useState(true);
  
    const uid = useMemo(() => location.state.user.uid, [location.state.user.uid]);
  
    const formatDate = useCallback((date) => {
      const d = new Date(date);
      const year = d.getUTCFullYear();
      const month = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      return `${year}/${month}/${day}`;
    }, []);
  
    const formatDateFromHeatMap = useCallback((date) => {
      const parts = date.split('/');
      const year = parts[0];
      const month = parts[1].padStart(2, '0');
      const day = parts[2].padStart(2, '0');
      return `${year}/${month}/${day}`;
    }, []);
  
    const handleHeatMapData = useCallback((commits, tasks) => {
      const combinedData = {};
      const details = {};
  
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
        const date = formatDate(task.completed_at);
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
  
    const fetchProfileActivity = useCallback(async (uid) => {
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
        setErrorMessage(error.response?.data.message || 'An error occurred while fetching data');
        setErrorWhileFetching(true);
        setFetchingUserActivity(false);
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

