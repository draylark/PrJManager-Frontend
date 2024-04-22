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

    const [isProjectModalOpen, setisProjectModalOpen] = useState(false)
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
    const [isClientModalOpen, setIsClientModalOpen] = useState(false)


    const [projectCount, setProjectCount] = useState(projects.length);
    
    useEffect(() => {
        setProjectCount(projects.length);
    }, [projects]);



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


            { isProjectModalOpen && <ProjectModal setIsProjectModalOpen={setisProjectModalOpen} /> }
            { isTaskModalOpen && <TaskModal setIsTaskModalOpen={setIsTaskModalOpen} /> }
            { isClientModalOpen && <ClientModal setIsClientModalOpen={setIsClientModalOpen} /> }
            
         </div>

    )
}

