import { useState, useEffect } from 'react'
import axios from 'axios'

export const useNotificationsData = (uid) => {

    const [notifications, setNotifications] = useState([])
    const [fetchingNotifications, setFetchingNotifications] = useState(true)

    const [errorMessage, seterrorMessage] = useState(null)
    const [errorWhileFetching, setErrorWhileFetching] = useState(false)

    const fetchNotifications = () => {
        setFetchingNotifications(true)
        axios.get(`http://localhost:3000/api/notis/${uid}`, {
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
    }, [])


  return {
    notifications,
    fetchingNotifications,
    errorMessage,
    errorWhileFetching
  }
}
