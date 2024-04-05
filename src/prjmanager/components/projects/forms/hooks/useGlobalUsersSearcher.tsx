import { useState, useEffect } from 'react'
import axios from 'axios'

export const useGlobalUsersSearcher = () => {

    const [users, setUsers] = useState([])
    const [search, setSearch] = useState('')


    const handleUsersData = (users) => {
        const usersData = users.map( user => {
          return {
            name: user.username,
            photoUrl: user?.photoUrl || null,
            id: user.uid,
            new: true
          }
        });
        setUsers(usersData)
    };

    useEffect(() => {
        if (search === '') {
            setUsers([])
            return
        }
        axios.get(`http://localhost:3000/api/users/find-user?search=${search}`)
            .then(res => {
                console.log(res.data)
                handleUsersData(res.data.users)
            })
            .catch(err => {
                console.error(err)
            })
    }, [search])

  return {
    users,
    setSearch
  }
}
