import { useState, useEffect} from 'react'
import axios from 'axios'

export const useQuickNotisData = (uid) => {
  
    const [isLoading, setIsLoading] = useState(true)
    const [notifications, setNotifications] = useState([])
    const [errorMessage, seterrorMessage] = useState(null)
    const [errorWhileFetching, setErrorWhileFetching] = useState(false)

  
    const fetchNotis = async() => {
        try {
            const { data: { notis } } = await axios.get(`http://localhost:3000/api/notis/${uid}`, { 
                params: { limit: 10, type: 'activity'},
                headers: { Authorization: localStorage.getItem('x-token') } 
            })
            setNotifications(notis)
            setIsLoading(false) 
        } catch (error) {
            console.error('Error fetching notifications:', error);
            seterrorMessage(error.response.data.message || 'An error occurred while fetching data');
            setErrorWhileFetching(true)
            setIsLoading(false)
        }
    };


    useEffect(() => {
        setIsLoading(true)
        fetchNotis()
    }, [])

    // console.log('notifications:', notifications)
    return {
        notifications,
        isLoading,
        errorMessage,
        errorWhileFetching
    }
}
