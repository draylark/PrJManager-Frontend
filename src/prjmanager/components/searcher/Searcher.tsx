import { useEffect, useState, Fragment } from 'react'
import { PersonAdd28Regular, PersonAvailable20Regular } from '@ricons/fluent'
import { TextField, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, ListItemSecondaryAction, Divider, Box, IconButton, Dialog, DialogContent, DialogTitle, DialogActions, Typography } from '@mui/material';
import WechatOutlined from '@ricons/antd/WechatOutlined'
import { Icon } from '@ricons/utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import axios from 'axios'
import { RenderUsers } from './RenderUsers';
import { RenderProjects } from './RenderProjects';

export const Searcher = () => {


    const { uid } = useSelector( (state: RootState) => state.auth )
    const [results, setResults] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [searchType, setSearchType] = useState('profiles')


    useEffect(() => {
        const fetchSearch = async () => {
            if (searchTerm === '') {
                setResults([])
                return
            }

            const response = await axios.post(`http://localhost:3000/api/searcher/${searchType}`, { searchTerm } )            
            const results = response.data.results

            console.log(results)
            setResults(results)

        }
        fetchSearch()
    }, [searchTerm, searchType])

  return (
    <div className='flex flex-col w-full space-y-7 rounded-extra p-2'>
        <div className='flex flex-col w-full rounded-extra  mt-4 '>
            <TextField
                id="outlined-basic"
                label="Search"
                variant="outlined"
                className='w-full h-full glassi'
                sx={{
                    borderRadius: '25px', // Puedes ajustar el valor para cambiar el grado de redondeo
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '25px', // Aplica el mismo redondeo al contenedor del input
                    },
                }}
                onChange={ (e) => setSearchTerm(e.target.value) }
            />

            <div className='flex space-x-7 mt-4 ml-2'>
                    <button 
                        onClick={ () => {
                            setResults([])
                            setSearchType('profiles')
                        } }
                        className={`border-2 w-20 h-8 rounded-xl glassi ${ searchType === 'profiles' ? 'bg-blue-500/40' : '' } transition-all duration-150 ease-in-out transform active:translate-y-[2px] border-[1px] border-gray-400`}>
                        <p className='text-sm'>Profiles</p>
                    </button>

                    <button
                        onClick={ () => {
                            setResults([])
                            setSearchType('projects')
                        } } 
                        className={`border-2 w-20 h-8 rounded-xl glassi ${ searchType === 'projects' ? 'bg-blue-500/40' : '' } transition-all duration-150 ease-in-out transform active:translate-y-[2px]  border-[1px] border-gray-400`}>
                        <p className='text-sm'>Projects</p>
                    </button>
            </div>       
        </div>


        <div className="h-full max-h-[690px] overflow-y-auto rounded-extra px-4 space-y-4 pr-8">
            {
                searchTerm === '' ?
                (
                    <div className='flex flex-col items-center justify-center h-full'>
                        <p className='text-3xl font-bold'>Search something</p>
                        <p className='text-xl font-bold'>Start typing to search</p>
                    </div>
                ) 
                :
                results.length === 0 ?
                ( 
                    <div className='flex flex-col items-center justify-center h-full'>
                        <p className='text-3xl font-bold'>No results</p>
                        <p className='text-xl font-bold'>Try searching for something else</p>
                    </div>
                )

                :
                    searchType === 'profiles' 
                    ? ( <RenderUsers users={results}  /> )      
                    : ( <RenderProjects projects={results} />)
                
            }
        </div>   
    </div>
  )
}



