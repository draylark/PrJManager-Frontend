import { useState, useEffect, useMemo, useRef } from 'react'
import { ImCancelCircle } from "react-icons/im";
import { useFollowersData } from '../hooks/useFollowersData';
import { getInitialsAvatar } from '../../projects/helpers/helpers';
import axios from 'axios'
import { ScaleLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cleanUrl } from '../../projects/helpers/helpers';
import { TextField } from '@mui/material';
import { capitalizeFirstLetter, abbreviateNumber } from '../../../helpers/helpers';

export const Followers = ({ isFollowersModalOpen, setIsFollowersModalOpen }) => {

    const [handlingProfile, setHandlingProfile] = useState(null)
    const { uid, username, photoUrl } = useSelector((state) => state.auth)

    const { 
            fetchingUsers, fetchingMoreFollowers,
            fetchingMoreFollowing,
            fetchingMoreFriends,
        
            followers, following, friends, 
            followingMap, setFollowingMap, 
            setFollowing, setFriends,

            followersLength,
            followingLength,
            friendsLength, 

            setfollowingLength,
            setfriendsLength,

            totalFollowersPages,
            totalFollowingPages,
            totalFriendsPages,
        
            FollowingPage,
            FollowersPage,
            FriendsPage,

            setFollowingPage,
            setFollowersPage,
            setFriendsPage,

            errorMessage,
            errorWhileFetching

          } = useFollowersData(uid);
        
    const [searchTerm, setSearchTerm] = useState('');        
    const [ render, setRender ] = useState('followers')
    const [filterType, setFilterType] = useState('followers'); 
    const renderDivRef = useRef(null);

    const navigate = useNavigate()

    const handleClose = () => {
        const modal = document.getElementById('followersModal');
        if (modal) {
            // Inicia la transición de opacidad a 0
            modal.classList.replace('opacity-100', 'opacity-0');
  
            // Espera a que la animación termine antes de ocultar el modal completamente
            setTimeout(() => {
                setIsFollowersModalOpen(false);
            }, 500); // Asume que la duración de tu transición es de 500ms
        }
    };

    const handleUnfollow = (uid, type, friendshipRef) => {
        const followingMapCopy = new Map(followingMap)
        followingMapCopy.set(uid, false)
        setFollowingMap(followingMapCopy)

        if( type === 'friendship'){
            setFriends(friends.filter(friend => friend._id !== friendshipRef))
            setFollowing(following.filter(follow => follow.uid.uid !== uid))
            setfollowingLength(followingLength - 1)
            setfriendsLength(friendsLength - 1)
            setHandlingProfile(null)
        } else {
            setFollowing(following.filter(follow => follow.uid.uid !== uid))
            setfollowingLength(followingLength - 1)
            setHandlingProfile(null)
        }
    };

    const handleFollow = (uid, type, followedProfile, friendship) => {
        const followingMapCopy = new Map(followingMap)
        followingMapCopy.set(uid, true)
        setFollowingMap(followingMapCopy)

        if( type === 'friendship' ){
            setFriends([friendship, ...friends])
            setFollowing([followedProfile, ...following])
            setfollowingLength(followingLength + 1)
            setfriendsLength(friendsLength + 1)
            setHandlingProfile(null)
        } else {
            setFollowing([followedProfile, ...following])
            setfollowingLength(followingLength + 1)
            setHandlingProfile(null)
        }
    };

    const handleFollowUnfollow = (uid, ) => {
        if (followingMap.get(uid)) {
            unfollowUser(uid)
        } else {
            followUser(uid)
        }
    };

    const filterFriend = (frienship) => {
        const { ids, createdAt } = frienship
        const friend = ids.filter(u => u.uid !== uid)
        return { ...friend[0], createdAt }
    };

    const followUser = (profileUID, ) => {
        axios.post(`http://localhost:3000/api/users/follow-profile`,{ profileUID, uid, username, photoUrl })
        .then( res => {
          const { followedProfile, friendship, type } = res.data
          handleFollow(profileUID, type, followedProfile, friendship)
        })
        .catch( error => {
            setHandlingProfile(null)
        })
    }

    const unfollowUser = (followedUID) => {
        axios.delete(`http://localhost:3000/api/users/unfollow-profile/${followedUID}`, { 
            params: { uid }
        })
        .then( res => {
            handleUnfollow(followedUID, res.data.type, res.data.friendshipRef)
        })
        .catch( error => {
            setHandlingProfile(null)
        })
    };

    const renderLength = ( type ) => {
        switch (type) {
            case 'followers':
                return followersLength
            case 'following':
                return followingLength
            case 'friends':
                return friendsLength
            default:
                break;
        }
    };

    const resetScroll = () => {
        const renderDiv = renderDivRef.current;
        if (renderDiv) {
          renderDiv.scrollTop = 0;
        }
    };

    const renderType = ( type ) => {
        switch (type) {
            case 'followers':
                return (                  
                    filteredUsers.length > 0 ? filteredUsers.map((follower, index) => (
                        <div 
                            key={index} 
                            className='flex space-x-4 w-full items-center border-b-2 py-3 px-3 hover:bg-gray-200 transition-colors duration-200 cursor-pointer'
                            onClick={() => navigate(`/profile/${cleanUrl(follower.username)}`, {
                                state: { 
                                    user: { 
                                        uid: follower.uid, 
                                        username: follower.username 
                                    } 
                                }        
                            })}
                        >                
                            <div className='flex space-x-4 w-[85%]  h-full items-center'>
                                <img 
                                    src={follower.photoUrl || getInitialsAvatar(follower.username)} alt="profile" 
                                    className='w-10 h-10 rounded-full cursor-pointer'

                                />
                                <h4 className=''><span className='font-semibold'>@</span>{follower.username}</h4>  
                            </div>
                            <button 
                                disabled={handlingProfile === follower.uid}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setHandlingProfile(follower.uid)
                                    handleFollowUnfollow(follower.uid)
                                }}
                                className='py-[10px] text-[13px] text-white w-[15%] rounded-xl h-full bg-black border-[1px] border-gray-400 transition-all duration-150 ease-in-out transform active:translate-y-[2px]'>
                                {followingMap.get(follower.uid) ? 'Unfollow' : 'Follow Back'}
                            </button>
                        </div>
                    ))
                    : <div className='flex w-full h-full  items-center justify-center'>    
                            <p>No followers</p>
                      </div>
                )
            case 'following':
                return (
                    filteredUsers.length > 0 ? filteredUsers.map((follow, index) => (
                        <div               
                            key={index} 
                            className='flex space-x-4 w-full items-center border-b-2 py-3 px-3 hover:bg-gray-200 transition-colors duration-200 cursor-pointer'
                            onClick={() => navigate(`/profile/${cleanUrl(follow.username)}`, {
                                state: { 
                                    user: { 
                                        uid: follow.uid, 
                                        username: follow.username 
                                    } 
                                }        
                            })}
                        >
                            <div className='flex space-x-4 w-[85%]  h-full items-center'>
                                <img 
                                    src={follow.photoUrl || getInitialsAvatar(follow.username)} alt="profile" 
                                    className='w-10 h-10 rounded-full cursor-pointer'

                                />
                                <h4><span className='font-semibold'>@</span>{follow.username}</h4>
                            </div>
                            <button 
                                disabled={handlingProfile === follow.uid}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setHandlingProfile(follow.uid)
                                    handleFollowUnfollow(follow.uid)
                                }}
                                className='py-[10px] text-[13px] text-white w-[15%] rounded-xl h-full bg-black border-[1px] border-gray-400 transition-all duration-150 ease-in-out transform active:translate-y-[2px]'
                            >
                               {followingMap.get(follow.uid) ? 'Unfollow' : 'Follow'}    
                            </button>
                        </div>
                    ))
                    : <div className='flex w-full h-full  items-center justify-center'>                    
                            <p>No following</p>
                      </div>
                )
            case 'friends':
                return (
                    filteredUsers.length > 0 ? filteredUsers.map((friend, index) => (
                            <div 
                                key={index} 
                                className='flex space-x-4 w-full items-center border-b-2 py-3 px-3 hover:bg-gray-200 transition-colors duration-200 cursor-pointer'
                                onClick={() => navigate(`/profile/${cleanUrl(friend.username)}`, {
                                    state: { 
                                        user: { 
                                            uid: friend.uid, 
                                            username: friend.username 
                                        } 
                                    }        
                                })}
                            >
                                <div className='flex space-x-4 w-[80%]  h-full items-center '>
                                    <img 
                                        src={friend.photoUrl || getInitialsAvatar(friend.username)} alt="profile" 
                                        className='w-10 h-10 rounded-full cursor-pointer'

                                    />
                                    <h4><span className='font-semibold'>@</span>{friend.username}</h4>
                                </div>
                                <p className='text-[13px] font-semibold'>
                                    Since <span>{new Date(friend.createdAt).toLocaleDateString()}</span> 
                                </p>
                            </div>
                        )
                    )
                    : <div className='flex w-full h-full  items-center justify-center'>                    
                            <p>No friends</p>
                      </div>
                )
            default:
                break;
        }

    };

    const filteredUsers = useMemo(() => {
        let usersToFilter = [];
        if (filterType === 'followers') {
          usersToFilter = followers.map((f) => f.followerId);
        } else if (filterType === 'following') {
          usersToFilter = following.map((f) => f.uid);
        } else if (filterType === 'friends') {
          usersToFilter = friends.map((f) => filterFriend(f));
        }
        return usersToFilter.filter((user) => user.username.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm, followers, following, friends, filterType]);

    useEffect(() => {
        if (isFollowersModalOpen) {
            // Asegúrate de que el modal existe antes de intentar acceder a él
            // Luego, después de un breve retraso, inicia la transición de opacidad
            const timer = setTimeout(() => {
            document.getElementById('followersModal').classList.remove('opacity-0');
            document.getElementById('followersModal').classList.add('opacity-100');
            }, 20); // Un retraso de 20ms suele ser suficiente
            return () => clearTimeout(timer);
        }
    }, [isFollowersModalOpen]);

    useEffect(() => {
        if (isFollowersModalOpen) {
          const handleScroll = () => {
            // console.log('useEffect handleScroll scrolling');
            const renderDiv = renderDivRef?.current;
            if (renderDiv) {
            //   console.log(`scrollTop: ${renderDiv.scrollTop}, clientHeight: ${renderDiv.clientHeight}, scrollHeight: ${renderDiv.scrollHeight}`);
              if (renderDiv.scrollTop + renderDiv.clientHeight >= renderDiv.scrollHeight - 5) { // Ajustar el umbral si es necesario
                // console.log('Entrando a la condicion base');
                if (filterType === 'followers' && FollowersPage < totalFollowersPages && !fetchingMoreFollowers) {
                //   console.log('Entrando a la primera condicion');
                  setFollowersPage((prev) => prev + 1);
                } else if (filterType === 'following' && FollowingPage < totalFollowingPages && !fetchingMoreFollowing) {
                //   console.log('Entrando a la segunda condicion');
                  setFollowingPage((prev) => prev + 1);
                } else if (filterType === 'friends' && FriendsPage < totalFriendsPages && !fetchingMoreFriends) {
                //   console.log('Entrando a la tercera condicion');
                  setFriendsPage((prev) => prev + 1);
                }
              }
            }
          };
      
          const renderDiv = renderDivRef.current;
          if (renderDiv) {
            renderDiv.addEventListener('scroll', handleScroll);
          }
      
          return () => {
            if (renderDiv) {
              renderDiv.removeEventListener('scroll', handleScroll);
            }
          };
        }
      }, [isFollowersModalOpen, filterType, FollowersPage, FollowingPage, FriendsPage, totalFollowersPages, 
        totalFollowingPages, totalFriendsPages, fetchingMoreFollowers, fetchingMoreFollowing, fetchingMoreFriends]);
      

  return (
    <div className='fixed flex w-screen h-full pb-5 top-0 right-0 justify-center items-center bg-black/30 z-50'>
        <div id="followersModal" 
            className={`flex flex-col space-y-3 w-[70%] md:w-[50%] md:max-h-[635px] md:h-[635px] overflow-hidden items-center rounded-2xl bg-white glassi border-[1px] border-gray-400 transition-opacity duration-300 ease-in-out opacity-0 ${isFollowersModalOpen ? '' : 'pointer-events-none'}`}
        >
            <div className='flex justify-between w-[95%] h-12 ml-auto mr-auto mt-2 p-2'>
                <h3 className='text-lg font-semibold'> 
                   <span> {abbreviateNumber(renderLength(render))} </span>  {capitalizeFirstLetter(render)}
                </h3>
                <button onClick={handleClose}>
                        <ImCancelCircle/>
                </button>                   
            </div>


            <div className='flex flex-col w-full h-full'>
                <div className='flex w-[92%] mx-auto h-11 border-b-2'>
                    <button 
                        onClick={() => {
                            resetScroll()
                            setRender('friends')
                            setFilterType('friends')
                        }}
                        className={` ${render === 'friends' ? 'bg-gray-200' : ''} flex w-1/2 justify-center items-center  text-center text-sm hover:bg-gray-200 transition-colors duration-200 `}>
                        <h4>
                           Friends 
                        </h4>          
                    </button>
                    <button 
                        onClick={() => {
                            resetScroll()
                            setRender('following')
                            setFilterType('following')
                        }}
                        className={` ${render === 'following' ? 'bg-gray-200' : ''} flex w-1/2 justify-center items-center text-center text-sm hover:bg-gray-200 transition-colors duration-200`}>
                        <h4>
                           Following 
                        </h4>          
                    </button>
                    <button 
                        onClick={() => {
                            resetScroll()
                            setRender('followers')
                            setFilterType('followers')
                        }}
                        className={` ${render === 'followers' ? 'bg-gray-200' : ''} flex w-1/2 justify-center items-center text-center text-sm hover:bg-gray-200 transition-colors duration-200`}>
                        <h4>
                           Followers 
                        </h4>          
                    </button>
                </div>
                
                <div className='flex flex-grow space-y-4 flex-col w-full h-full overflow-y-auto  pt-5 px-8'>
                    <TextField
                        variant="outlined"
                        label="Search"
                        size="small"
                        className='w-full'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <div ref={renderDivRef} id='renderPAreaFollowers' className='flex flex-col flex-grow  overflow-y-auto max-h-[445px]'> 
                        <div className='flex flex-col flex-grow'>
                            {                 
                                fetchingUsers ?  
                                (
                                    <div className='flex w-full h-full items-center justify-center'>
                                        <ScaleLoader color='#000' loading={fetchingUsers} size={20} />
                                    </div>  
                                  )
                                :                                
                                errorWhileFetching ?
                                 (
                                    <div className='flex w-full h-full items-center justify-center'>
                                        <p>{errorMessage}</p>
                                    </div>
                                  )
                                :
                                renderType(render)          
                            }  
                        </div>   
                        
                               
                        { fetchingMoreFollowers || fetchingMoreFollowing || fetchingMoreFriends && (
                            <div className='flex justify-center py-4'>
                                <ScaleLoader color='#000' loading={true} className='w-8 h-8' />
                            </div> 
                        ) }                                     
                    </div>       
                </div>
            </div>
        </div>
    </div>
  )
}
