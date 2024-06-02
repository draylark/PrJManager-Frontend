import { useState, useEffect, useMemo, useRef } from 'react'
import { useProfileFollowersData } from '../hooks/useProfileFollowersData'
import { getInitialsAvatar, cleanUrl } from '../../../helpers/helpers'
import { ImCancelCircle } from "react-icons/im";
import { ScaleLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import { abbreviateNumber, capitalizeFirstLetter } from '../../../helpers/helpers';

export const ProfileFollowers = ({ isProfileFollowersModalOpen, setIsProfileFollowersModalOpen, profileUID, profileName }) => {

    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');    
    const [ render, setRender ] = useState('followers');
    const [filterType, setFilterType] = useState('followers'); 
    const { followers, following, fetchingUsers, 
        totalFollowersPages, totalFollowingPages, 
        FollowersPage, FollowingPage,
        followersLength, followingLength,
        fetchingMoreFollowers, fetchingMoreFollowing,
        setFollowersPage, setFollowingPage,
        errorWhileFetching,
        errorMessage
    } = useProfileFollowersData(profileUID);

    const renderDivRef = useRef(null);

    const renderLength = ( type ) => {
        switch (type) {
            case 'followers':
                return followersLength
            case 'following':
                return followingLength
            default:
                break;
        }
    }

    const renderType = ( type ) => {
        switch (type) {
            case 'followers':
                return (                  
                    filteredUsers.length > 0 ? filteredUsers.map((follower, index) => (
                        <div 
                            key={index} 
                            className='flex space-x-4 w-full items-center border-b-2 py-3 px-3 hover:bg-gray-200 transition-colors duration-200 cursor-pointer'
                            onClick={() => {
                                navigate(`/profile/${cleanUrl(follower.username)}`, {
                                    state: { 
                                        user: { 
                                            uid: follower.uid, 
                                            username: follower.username 
                                        } 
                                    }        
                                })
                                handleClose();                               
                            }}
                        >                
                            <div className='flex space-x-4 w-[85%]  h-full items-center'>
                                <img 
                                    src={follower.photoUrl || getInitialsAvatar(follower.username)} alt="profile" 
                                    className='w-10 h-10 rounded-full cursor-pointer'

                                />
                                <h4 className=''><span className='font-semibold'>@</span>{follower.username}</h4>  
                            </div>
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
                            onClick={() => {
                                navigate(`/profile/${cleanUrl(follow.username)}`, {
                                    state: { 
                                        user: { 
                                            uid: follow.uid, 
                                            username: follow.username 
                                        } 
                                    }        
                                })
                                handleClose();                              
                            }}
                        >
                            <div className='flex space-x-4 w-[85%] h-full items-center'>
                                <img 
                                    src={follow.photoUrl || getInitialsAvatar(follow.username)} alt="profile" 
                                    className='w-10 h-10 rounded-full cursor-pointer'

                                />
                                <h4><span className='font-semibold'>@</span>{follow.username}</h4>
                            </div>
                        </div>
                    ))
                    : <div className='flex w-full h-full  items-center justify-center'>                    
                            <p>No following</p>
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
        }

        return usersToFilter.filter((user) => user.username.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm, followers, following, filterType]);
    
    const handleClose = () => {
        const modal = document.getElementById('profileFollowersModal');
        if (modal) {
            // Inicia la transición de opacidad a 0
            modal.classList.replace('opacity-100', 'opacity-0');
  
            // Espera a que la animación termine antes de ocultar el modal completamente
            setTimeout(() => {
                setIsProfileFollowersModalOpen(false);
            }, 500); // Asume que la duración de tu transición es de 500ms
        }
    };

    useEffect(() => {
        if (isProfileFollowersModalOpen) {
            // Asegúrate de que el modal existe antes de intentar acceder a él
            // Luego, después de un breve retraso, inicia la transición de opacidad
            const timer = setTimeout(() => {
            document.getElementById('profileFollowersModal').classList.remove('opacity-0');
            document.getElementById('profileFollowersModal').classList.add('opacity-100');
            }, 20); // Un retraso de 20ms suele ser suficiente
            return () => clearTimeout(timer);
        }
    }, [isProfileFollowersModalOpen]);

    useEffect(() => {
    if (isProfileFollowersModalOpen) {
        const handleScroll = () => {
        // console.log('useEffect handleScroll scrolling');
        const renderDiv = renderDivRef?.current;
        if (renderDiv) {
            console.log('Entrando a handleScroll')
        //   console.log(`scrollTop: ${renderDiv.scrollTop}, clientHeight: ${renderDiv.clientHeight}, scrollHeight: ${renderDiv.scrollHeight}`);
            if (renderDiv.scrollTop + renderDiv.clientHeight >= renderDiv.scrollHeight - 5) { // Ajustar el umbral si es necesario
                // console.log('Entrando a la condicion base');
                if (filterType === 'followers' && FollowersPage < totalFollowersPages && !fetchingMoreFollowers) {
                //   console.log('Entrando a la primera condicion');
                    setFollowersPage((prev) => prev + 1);
                } else if (filterType === 'following' && FollowingPage < totalFollowingPages && !fetchingMoreFollowing) {
                //   console.log('Entrando a la segunda condicion');
                    setFollowingPage((prev) => prev + 1);
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
    }, [isProfileFollowersModalOpen, filterType, FollowersPage, FollowingPage, totalFollowersPages, totalFollowingPages,  fetchingMoreFollowers, fetchingMoreFollowing]);
      


  return (
    <div className='fixed flex w-screen h-full pb-5 top-0 right-0 justify-center items-center bg-black/30 z-50'>
        <div 
            id="profileFollowersModal" 
            className={`flex flex-col space-y-3 w-[70%] md:w-[50%] md:max-h-[635px] md:h-[635px] overflow-hidden items-center rounded-2xl bg-white glassi border-[1px] border-gray-400 transition-opacity duration-300 ease-in-out opacity-0 ${isProfileFollowersModalOpen ? '' : 'pointer-events-none'}`}
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

                    <div ref={renderDivRef} id='render' className='flex flex-col flex-grow  overflow-y-auto max-h-[445px]'> 
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
                        { fetchingMoreFollowers || fetchingMoreFollowing && (
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
