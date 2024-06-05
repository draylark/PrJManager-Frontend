import { useEffect, useState  } from 'react'
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from 'axios'

export const usePersonalData = ( uid ) => {

    const [selected, setSelected] = useState(null)    
    const [projects, setProjets] = useState([]);
    const [timelineData, setTimelineData] = useState([])

    const [fetchingProjects, setFetchingProjects] = useState(true)
    const [fetchingTimelineData, setFetchingTimelineData] = useState(true)
    const [followersLength, setFollowersLength] = useState(null)

    const [projectsErrorMessage, setProjectsErrorMessage] = useState(null);
    const [projectsErrorWhileFetching, setProjectsErrorWhileFetching] = useState(false);

    const [timelineErrorMessage, setTimelineErrorMessage] = useState(null);
    const [timelineErrorWhileFetching, setTimelineErrorWhileFetching] = useState(false);


    const [endDate, setEndDate] = useState(new Date());
    const [startDate, setStartDate] = useState(() => {
      const date = new Date();
      date.setMonth(date.getMonth() - 3);
      return date;
    });
  
    const handlePrevious = () => {
      setStartDate(prevDate => {
        const newStartDate = new Date(prevDate);
        newStartDate.setMonth(newStartDate.getMonth() - 3);
        return newStartDate;
      });
      setEndDate(prevDate => {
        const newEndDate = new Date(prevDate);
        newEndDate.setMonth(newEndDate.getMonth() - 3);
        return newEndDate;
      });
    };
  
    const handleNext = () => {
      setStartDate(prevDate => {
        const newStartDate = new Date(prevDate);
        newStartDate.setMonth(newStartDate.getMonth() + 3);
        return newStartDate;
      });
      setEndDate(prevDate => {
        const newEndDate = new Date(prevDate);
        newEndDate.setMonth(newEndDate.getMonth() + 3);
        return newEndDate;
      });
    };

    const fetchProjectTimeline = () => {
        setFetchingTimelineData(true)
        const url = `${backendUrl}/users/project-timeline-activity/${selected.pid}`;
        axios.get(url, {
            params: {
                uid,
                startDate: startDate,
                endDate: endDate
            }   
        })
        .then( response => {
            setTimelineData(response.data);
            setFetchingTimelineData(false);
        })
        .catch( error => {
            setTimelineErrorWhileFetching(true);
            setTimelineErrorMessage( error.response.data.message ||  'An error occurred while fetching the data');
            setFetchingTimelineData(false);
        })
    };

    const fetchProjects = () => {
        setFetchingProjects(true)
        const url1 = `${backendUrl}/projects/get-projects/${uid}`;

        axios.get(url1)
        .then(res => {
            setProjets(res.data);
            setFetchingProjects(false);
        })
        .catch( error => {
            setProjectsErrorWhileFetching(true);
            setProjectsErrorMessage( error.response.data.message ||  'An error occurred while fetching the data');
            setFetchingProjects(false);
        })
    };

    const fetchTimelineData = () => {
        setFetchingTimelineData(true)
        const url = `${backendUrl}/users/timeline-activity/${uid}`;
        axios.get(url, {
            params: {
                startDate: startDate,
                endDate: endDate
            }   
        })
        .then( response => {
            setTimelineData(response.data);
            setFetchingTimelineData(false);
        })
        .catch( error => {
            setTimelineErrorWhileFetching(true);
            setTimelineErrorMessage( error.response.data.message ||  'An error occurred while fetching the data');
            setFetchingTimelineData(false);
        })
    };

    const fetchFollowersLength = () => {
        axios.get(`${backendUrl}/users/get-followers-length/${uid}`)
        .then((response) => {
            setFollowersLength(response.data.followersLength)
        })
        .catch((error) => {
            console.log(error)
        })
    
    };

    useEffect(() => {   
        fetchProjects()
        fetchFollowersLength()
    }, [])

    useEffect(() => {
        if( !selected ){
            fetchTimelineData()
        }
    }, [startDate, endDate, selected])

    useEffect(() => {
        if( selected ){
            fetchProjectTimeline()
        }
    }, [startDate, endDate, selected])


  return {
    timelineData,
    projects,
    followersLength,

    selected,
    setSelected,
    endDate,
    startDate,
    handlePrevious,
    handleNext,
    fetchingProjects,
    fetchingTimelineData,

    projectsErrorMessage,
    projectsErrorWhileFetching,
    timelineErrorMessage,
    timelineErrorWhileFetching
  }
}
