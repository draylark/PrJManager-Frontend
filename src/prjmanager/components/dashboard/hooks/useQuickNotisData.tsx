import { useState, useEffect } from 'react'
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios, { AxiosError } from 'axios'

interface Notification {
    _id: string;
    type: string;
    description: string;
    additionalData: {
      username?: string;
      taskName?: string;
      repositoryName?: string;
      projectName?: string;
      layerName?: string;
      repoName?: string;
      projectID?: string;
      layerId?: string;
      repoId?: string;
      accessLevel?: string;
      taskId?: string;
      date?: string;
    };
    from: {
      name: string
      ID: string;
  
    }
    createdAt: string;
}

interface ApiResponse {
    message: string;
}

export const useQuickNotisData = (uid: string) => {
  
    const [isLoading, setIsLoading] = useState(true)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [errorMessage, seterrorMessage] = useState<string | null>(null)
    const [errorWhileFetching, setErrorWhileFetching] = useState(false)

  
    const fetchNotis = async() => {
        try {
            const { data: { notis } } = await axios.get(`${backendUrl}/notis/${uid}`, { 
                params: { limit: 10, type: 'activity'},
                headers: { Authorization: localStorage.getItem('x-token') } 
            })
            setNotifications(notis)
            setIsLoading(false) 
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>

            if (axiosError.response) {
                console.error('Error fetching notifications:', error);
                seterrorMessage(axiosError.response.data.message); 
                setErrorWhileFetching(true)
                setIsLoading(false);
            } else {
                seterrorMessage('An error occurred while fetching data');
                setErrorWhileFetching(true)
                setIsLoading(false);
            }
        }
    };


    useEffect(() => {
        setIsLoading(true)
        fetchNotis()
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // console.log('notifications:', notifications)
    return {
        notifications,
        isLoading,
        errorMessage,
        errorWhileFetching
    }
}
