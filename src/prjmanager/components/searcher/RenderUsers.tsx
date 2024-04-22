import {  useState, Fragment } from 'react'
import { PersonAdd28Regular, PersonAvailable20Regular } from '@ricons/fluent'
import Friendship from '@ricons/carbon/Friendship'
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, ListItemSecondaryAction, Divider } from '@mui/material';
import WechatOutlined from '@ricons/antd/WechatOutlined'
import { Icon } from '@ricons/utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import axios from 'axios'

export const RenderUsers = ({ users }) => {

    const { uid, username, photoUrl } = useSelector( (state: RootState) => state.auth )
    const { friends } = useSelector( (state: RootState) => state.friends )

    const onAddFriend = async (userId) => {
        setRequests([...requests, userId])
        const response = await axios.post(`http://localhost:3000/api/friends/add-friend/${userId}`, { uid, username, photoUrl } )
        console.log(response)
    }

    const [requests, setRequests] = useState([])

  return (
    
        <List dense>
            {
                users.map( ( user, index ) => (                       
                        <Fragment  key={user.uid} > 
                            <ListItem style={{ padding: '10px' }} >
                                <ListItemAvatar>
                                    <Avatar alt={ user.username } src={ user.photoUrl || user.username }  />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={user.username}
                                    secondary={user.uid}
                                />
                                <ListItemSecondaryAction>
                                <div className='flex space-x-6 items-center h-full mb-2'>                      
                                        <div className='flex flex-col justify-center items-center h-12 mt-2'>
                                            <button className='w-10 h-8 rounded-xl glassi border-1 border-black hover:bg-blue-500/40 transition-colors duration-150 ml-1'>
                                                <Icon >
                                                    <WechatOutlined/>
                                                </Icon>
                                            </button>
                                            <p className='text-[9px] ml-1'>Message</p>
                                        </div>
                                        <div className='flex flex-col justify-center items-center h-12 mt-2'>

                                            {

                                                friends.includes(user.uid) ? (
                                                    <>
                                                        <div className='flex items-center justify-center w-10 h-8 rounded-xl glassi border-1 border-black ml-1'>
                                                            <Icon >
                                                                <Friendship className='text-green-600'/>
                                                            </Icon>
                                                        </div>
                                                        <p className='text-[9px] ml-1'>Friend</p>                   

                                                    </>
                                                ) : 
                                                requests.includes(user.uid) ? (
                                                    <>
                                                        <div className='flex items-center justify-center w-10 h-8 rounded-xl glassi border-1 border-black ml-1'>
                                                            <Icon >
                                                                <PersonAvailable20Regular className='text-green-600' />
                                                            </Icon>
                                                        </div>
                                                        <p className='text-[9px] ml-1 text-green-600'>Added</p>                   
                                                    </>
                                                    
                                                ) : (   
                                                    <>
                                                        <button 
                                                            onClick={ () => onAddFriend(user.uid)}
                                                            className='w-10 h-8 rounded-xl glassi border-1 border-black hover:bg-blue-500/40 transition-colors duration-150 ml-1'>
                                                            <Icon >
                                                                <PersonAdd28Regular/>
                                                            </Icon>
                                                            
                                                        </button>
                                                        <p className='text-[9px] ml-1'>Add</p>
                                                    </>                                                         
                                                    )

                                            }                                     
                                       </div>
                                    </div>  
                                    
                                </ListItemSecondaryAction>
                            </ListItem>

                            {
                                user !== users[users.length - 1] && <Divider variant="inset" component="li"   style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', marginBottom: '5px'  }} />
                            }

                        </Fragment>
                    ))
            }
        </List>
  )
}
