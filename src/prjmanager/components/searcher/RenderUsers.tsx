import { useNavigate } from 'react-router-dom';
import { cleanUrl, getInitialsAvatar } from '../projects/helpers/helpers';

export const RenderUsers = ({ users }) => {
  const navigate = useNavigate()
  return (
    <>
        {
            users.map( ( user) => (                       
                <div 
                    key={user.uid} 
                    className='flex justify-between items-center hover:bg-slate-300 transition-all duration-150 ease-in-out cursor-pointer py-4 px-4   border-b-[1px] border-black'  
                    onClick={() => navigate(`/profile/${cleanUrl(user.username)}`, { state: { user: { uid: user.uid, username: user.username } } })}
                    > 
                        <div className='flex space-x-4 items-center'>
                            <img 
                                className='w-12 h-12 rounded-full'
                                alt={ user.username } 
                                src={ user.photoUrl || getInitialsAvatar(user.username) }                                      
                            />
                            <h3 className='text-[15px] font-semibold'>@{user.username}</h3>
                        </div>

                        <div className='flex space-x-6 items-center h-full'>                      
                            <h2
                                className='text-[18px] font-semibold text-blue-400 nav-button'
                            >
                                Projects: <span className='text-black ml-2'>{user.projects}</span>
                            </h2>
                        </div>  
                </div>
            ))
        }
    </>
  )
}
