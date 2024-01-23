import { useEffect, useState } from 'react'
import { TextField } from '@mui/material'
import PersonAdd28Regular from '@ricons/fluent/PersonAdd28Regular'
import WechatOutlined from '@ricons/antd/WechatOutlined'
import { Icon } from '@ricons/utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import axios from 'axios'

export const Searcher = () => {


    const { uid } = useSelector( (state: RootState) => state.auth )
    const [results, setResults] = useState([])
    const [searchTerm, setSearchTerm] = useState('')



    const onAddFriend = async (userId) => {
        const response = await axios.post(`http://localhost:3000/api/friends/add-friend/${userId}`, { uid } )
        console.log(response)
    }




    useEffect(() => {
        const fetchSearch = async () => {
            if (searchTerm === '') {
                setResults([])
                return
            }

            const response = await axios.post(`http://localhost:3000/api/searcher`, { searchTerm } )            
            const users = response.data.users

            console.log(users)

            if ( users.length > 0 ) {
                setResults(users)
            } 
        }
        fetchSearch()
    }, [searchTerm])

  return (
    <div className='flex flex-col w-full space-y-4 rounded-extra overflow-y-auto p-2'>
        <div className='flex flex-col w-full rounded-extra  mt-1 '>
            <TextField
                id="outlined-basic"
                label="Search"
                variant="outlined"
                className='w-full h-full glass2'
                sx={{
                    borderRadius: '25px', // Puedes ajustar el valor para cambiar el grado de redondeo
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '25px', // Aplica el mismo redondeo al contenedor del input
                    },
                }}
                onChange={ (e) => setSearchTerm(e.target.value) }
            />

            <div className='flex space-x-7 mt-4 ml-2'>
                    <button className='border-2 w-20 h-8 rounded-xl glass2 border-1 border-blue-200'>
                        <p className='text-sm'>Projects</p>
                    </button>

                    <button className='border-2 w-20 h-8 rounded-xl glass2 border-1 border-blue-200'>
                        <p className='text-sm'>Teams</p>
                    </button>

                    <button className='border-2 w-20 h-8 rounded-xl glass2 border-1 border-blue-200'>
                        <p className='text-sm'>Users</p>
                    </button>
            </div>       
        </div>


        <div className="h-full rounded-extra p-4 space-y-4">

            {

                results.length === 0 ?
                ( 
                    <div className='flex flex-col items-center justify-center h-full'>
                        <p className='text-3xl font-bold'>No results</p>
                        <p className='text-xl font-bold'>Try searching for something else</p>
                    </div>
                )

                :
                
                (
                    <ul className='space-y-4 h-full overflow-y-auto'>
                        {
                            results.map( user => (                       
                                    <li 
                                        key={user.uid}
                                        className='flex h-24 items-center px-6 justify-between rounded-extra border-2 border-black'>       
                                
                                            <div className='flex space-x-5 items-center'>
                                                <div id='profile-image' className='h-12 w-12 rounded-xl border-1 glass2 border-black'></div>

                                                <div id='user-data' className='flex flex-col h-16 justify-center '>
                                                    <p className='text-lg font-bold'>{user.username}</p>
                                                    <p className='text-[12px]'>{user.uid}</p>
                                                </div>
                                            </div>       

                                            <div className='flex space-x-6 items-center h-full'>
                                            
                                                <div className='flex flex-col justify-center items-center h-12 mt-2'>
                                                    <button className='w-10 h-8 rounded-xl glass2 border-1 border-black ml-1'>
                                                        <Icon >
                                                            <WechatOutlined/>
                                                        </Icon>
                                                    </button>
                                                    <p className='text-[10px] ml-1'>Message</p>
                                                </div>

                                                <div className='flex flex-col justify-center items-center h-12 mt-2'>
                                                    <button 
                                                        onClick={ () => onAddFriend(user.uid)}
                                                        className='w-10 h-8 rounded-xl glass2 border-1 border-black ml-1'>
                                                        <Icon >
                                                            <PersonAdd28Regular/>
                                                        </Icon>
                                                        
                                                    </button>
                                                    <p className='text-[10px] ml-1'>Add</p>
                                                </div>
                                            </div>                
                                    </li>
                                ))
                        }
                    </ul>

                    
                )

            }

        </div>


        
    </div>
  )
}
