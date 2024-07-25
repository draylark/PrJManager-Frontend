import { useState, useEffect } from 'react'
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from 'axios'
import { UserBase } from '../../../../../interfaces/models';


interface MUser extends Pick<UserBase, 'username' | 'photoUrl'> {
  uid: string;
} 

interface UserState {
  name: string;
  photoUrl: string | null;
  id: string;
  new: boolean
}


export const useGlobalUsersSearcher = () => {

    const [users, setUsers] = useState<UserState[] | []>([])
    const [search, setSearch] = useState('')


  const handleUsersData = (users: MUser[]) => {
        const usersData = users.map( user => {
          return {
            name: user.username as string,
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
        axios.get(`${backendUrl}/users/find-user?search=${search}`)
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
