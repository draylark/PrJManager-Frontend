import { useState, useEffect } from 'react'
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from 'axios'
import { NotiBase } from '../../../../interfaces/models/notification';

export const useNotificationsData = (uid: string) => {

    const [notifications, setNotifications] = useState<NotiBase[]>([])
    const [fetchingNotifications, setFetchingNotifications] = useState(true)

    const [errorMessage, seterrorMessage] = useState(null)
    const [errorWhileFetching, setErrorWhileFetching] = useState(false)

    const fetchNotifications = () => {
        setFetchingNotifications(true)
        axios.get(`${backendUrl}/notis/${uid}`, {
            params: {
                limit: 15,
                type: 'general'
            },
            headers: {
                Authorization: localStorage.getItem('x-token')
            }
        })
        .then((response) => {
            // console.log(response)
            setNotifications(response.data.notis)
            setFetchingNotifications(false)
        })
        .catch((error) => {
            console.error('Error fetching notifications:', error);
            seterrorMessage(error.response.data.message || 'An error occurred while fetching data');
            setErrorWhileFetching(true)
            setFetchingNotifications(false)
        })
    }

    useEffect(() => {
        fetchNotifications()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return {
    notifications,
    fetchingNotifications,
    errorMessage,
    errorWhileFetching
  }
}
