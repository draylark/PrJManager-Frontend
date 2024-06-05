import './styles/logout.css'
import { useState } from 'react'
import Dashboard  from '@ricons/carbon/DashboardReference'
import Folder from '@ricons/fluent/FolderOpen24Filled'
import GlobeSearch20Filled from '@ricons/fluent/GlobeSearch20Filled'
import platy from '../assets/imgs/platy.jpg'
import idk from '../assets/imgs/abstract.jpeg'
import Noti from '@ricons/material/NotificationsNoneOutlined'
import { Link, useLocation } from 'react-router-dom';
import './styles/fonts.css'
import { NotificationsModal } from './modals/NotificationsModal'
import { useSelector } from 'react-redux'

export const Nav = () => {

    const location = useLocation();
    const pathName = location.pathname
    const [isNotisModalOpen, setIsNotisModalOpen] = useState(false)
    const { username } = useSelector( state => state.auth )
    
    return (
      <div id='Nav' className="flex flex-col items-center bg-[#0a1128] text-white min-h-screen w-64">
        
        { isNotisModalOpen && <NotificationsModal setIsOpen={ setIsNotisModalOpen }/> }

        <div className="flex space-x-2 logo p-5 w-full items-center ">
          <img src={platy} alt="Logo" className="ml-2 h-14 w-14 mr-3 rounded-lg border-[1px] border-black"/>
          <span className="text-sm nav-button">PrJManager</span>
        </div>

        <span className='w-[80%] border-[1px] border-gray-500 mt-2'></span>
    
        <div className="navigation w-full py-10 px-4">
            <Link to="dashboard">
                <button
                    className={`${pathName.startsWith('/dashboard') ? 'bg-blue-50 rounded-2xl text-[#0c4a6e]' : 'text-white'} hover:text-[#0c4a6e] nav-button minimal-button hover:rounded-2xl flex items-center mb-4 mt-2 px-8 w-full  hover:bg-blue-50`}
                >  
                    <Dashboard className='w-9 h-9 mr-3' />
                    Dashboard
                </button>
            </Link>
            <Link to="projects">
                <button
                    className={`${pathName.startsWith('/projects') ? 'bg-blue-50 rounded-2xl text-[#0c4a6e]' : 'text-white'} hover:text-[#0c4a6e] nav-button minimal-button hover:rounded-2xl flex items-center mb-4 mt-2 px-8 w-full  hover:bg-blue-50`}
                >
                    <Folder  className='w-9 h-9 mr-3'/>
                    Projects
                </button>
            </Link>
            <Link to="searcher">
                <button
                    className={`${pathName.startsWith('/searcher') ? 'bg-blue-50 rounded-2xl text-[#0c4a6e]' : 'text-white'} hover:text-[#0c4a6e] nav-button minimal-button hover:rounded-2xl flex items-center mb-4 mt-2 px-8 w-full  hover:bg-blue-50`}
                >
                    <GlobeSearch20Filled className='w-9 h-9 mr-3' />
                    Searcher
                </button>
            </Link>
        </div>
        
        <div className="user-info flex flex-grow items-end  pb-10 p-5 w-full  pl-9">
            <div className='flex flex-col  space-y-6 '>
                <button 
                    className={`ml-[16px] flex items-center justify-center ${isNotisModalOpen ? 'bg-blue-50 text-sky-950' : ''} glassi w-8 h-8 rounded-full transition-all duration-150 ease-in-out transform active:translate-y-[2px]`}
                    onClick={() => setIsNotisModalOpen(!isNotisModalOpen)} // Modificado aquí
                >   
                    <Noti className='w-5 h-5'/>            
                </button>
                <div className='flex space-x-2 items-center'>
                    <Link to={`personal-area/${username}`}>
                        <img src={idk}  alt="User" className="cursor-pointer h-[65px] w-[65px] rounded-full mr-3 border-[2px] border-transparent hover:border-blue-50 transition-colors duration-200"/>
                    </Link>
                    
                    <span className="flex-grow text-[13px] nav-button2">{username}</span>
                </div>
            </div>
        </div>
      </div>
    );
  };