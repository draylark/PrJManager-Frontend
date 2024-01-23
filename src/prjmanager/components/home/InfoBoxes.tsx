import Pencil from '@ricons/fluent/EditArrowBack20Filled'
import { Icon } from '@ricons/utils'
import { ProjectModal } from './modals/ProjectModal'
import { TaskModal } from './modals/TaskModal'
import { ClientModal } from './modals/ClientModal'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

import { RootState } from '../../../store/store'

export const InfoBoxes = () => {


    const { projects } = useSelector((state: RootState) => state.projects);
    const { tasks } = useSelector((state: RootState) => state.task);
    const { clients } = useSelector((state: RootState) => state.clients);

    const [isProjectModalOpen, setisProjectModalOpen] = useState(false)
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
    const [isClientModalOpen, setIsClientModalOpen] = useState(false)


    const [projectCount, setProjectCount] = useState(projects.length);
    const [taskCount, setTaskCount] = useState(tasks.length);
    const [clientCount, setClientCount] = useState(clients.length);
    
    useEffect(() => {
        setProjectCount(projects.length);
        setTaskCount(tasks.length);
        setClientCount(clients.length);
    }, [projects, tasks, clients]);



  return (


        <div className="flex space-y-4 sm:space-x-4 flex-wrap lg:flex-nowrap w-full justify-center">
          
            <div className="info-box-shadow mt-4 info-box bg-[#ffffff26] text-white rounded-extra p-5 h-20 sm:w-60 w-[90%] flex justify-center flex-col ">
            
                <div className='flex space-x-2'>
                    <h2 className="text-xl text-sky-950 w-3/2 h-8">Projects</h2>
                        <button onClick={ () => setisProjectModalOpen(true) } className='mb-2 transition-transform duration-300 ease-in-out transform hover:translate-y-[-2px]'>
                            <Icon color='black' size={14}>
                                <Pencil/>
                            </Icon>
                        </button>
                </div>
                <p className="text-2xl text-sky-950">{ projectCount }</p>
            </div>   



            <div className="info-box-shadow info-box  bg-[#0455b19a] text-white rounded-extra p-5 h-20 sm:w-60 w-[90%] flex justify-center flex-col">
                <div className='flex space-x-2'>
                    <h2 className="text-xl text-white w-3/2 h-8">Tasks</h2>
                        <button onClick={ () => setIsTaskModalOpen(true)} className='mb-2 transition-transform duration-300 ease-in-out transform hover:translate-y-[-2px]'>
                            <Icon color='white' size={14}>
                                <Pencil/>
                            </Icon>
                        </button>
                    </div>
                    <p className="text-2xl">{ taskCount }</p>
            </div>



            <div className="info-box-shadow  info-box bg-[#491ab526] text-white rounded-extra p-5 h-20 sm:w-60 w-[90%] flex justify-center flex-col">
                <div className='flex space-x-2'>
                    <h2 className="text-xl text-black w-3/2 h-8">Clients</h2>
                        <button onClick={() => setIsClientModalOpen(true)} className='mb-2 transition-transform duration-300 ease-in-out transform hover:translate-y-[-2px]'>
                            <Icon color='black' size={14}>
                                <Pencil/>
                            </Icon>
                        </button>
                    </div>
                    <p className="text-2xl text-black">{ clientCount }</p>
            </div>


            { isProjectModalOpen && <ProjectModal setIsProjectModalOpen={setisProjectModalOpen} /> }
            { isTaskModalOpen && <TaskModal setIsTaskModalOpen={setIsTaskModalOpen} /> }
            { isClientModalOpen && <ClientModal setIsClientModalOpen={setIsClientModalOpen} /> }
            
         </div>

    )
}

