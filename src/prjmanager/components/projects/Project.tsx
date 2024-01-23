import { useState} from 'react'

import { DonutLargeTwotone } from '@ricons/material'
import { ArrowBack } from '@ricons/ionicons5'
import { Icon } from '@ricons/utils'
import { ProjectInfo } from './ProjectInfo';
// import { Repositories } from './Repositories';


import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

export const Project = () => {

  const location = useLocation();
  const { projects } = useSelector((state: RootState) => state.projects );
  const projectId = location.state?.projectId;
  const project = projects.find( project => project.pid === projectId )
  const navigate = useNavigate()


  // console.log(location)

  const [render, setRender] = useState('Info')
  // const render = location.pathname.split('/').pop();

    const getStatusIcon = (status) => {
      switch (status) {
        case 'In Progress':
          return <span className="bg-green-500 rounded-full w-4 h-4 inline-block"></span>;
        case 'Completed':
          return <span className="bg-orange-500 rounded-full w-4 h-4 inline-block"></span>;
        case 'Paused':
          return <span className="bg-red-500 rounded-full w-4 h-4 inline-block"></span>;
        default:
          return <span className="bg-green-500 rounded-full w-4 h-4 inline-block"></span>;
      }
    }


    const renderComponent = () => {
      switch (render) {
        case 'Info':
          return <ProjectInfo project={project} />
        case 'Tree':
          return <div>Coming Soon</div>
        case 'Layers':
          return <Outlet/>
        case 'Repositories':
          return <Outlet/>
        case 'Comments':
          return <Outlet/>
        case 'Configurations':
          return <Outlet/>
        default:
          return <ProjectInfo project={project} />
      }
    }

    return (
      <div className='flex flex-col w-full h-full px-4'>
  
        <button 
          onClick={ () => navigate('..') }
          className='flex w-10 mb-4  rounded pl-1'
        >
          <Icon size={22}>
            <ArrowBack/>
          </Icon>
        </button>
  
        <div className="bg-white shadow-lg rounded-extra p-5 h-[93%]">
  
          <div className='flex justify-between items-center mb-4'>
            <h1 className='text-3xl font-bold'>
              {project.name} {getStatusIcon(project.status)}
            </h1>
            <div className='flex space-x-4'>
              <button onClick={ () => {
                  setRender('Info')
                  navigate('.', { state: { projectId: project.pid } } )
                } }  className='glass2 text-black border-1 border-gray-400 py-1 px-4 rounded'>
                Info
              </button>
              <button onClick={ () => setRender('Tree') } className='glass2 text-black border-1 border-gray-400 py-1 px-4 rounded'>
                Tree
              </button>
              <button onClick={ () => {
                setRender('Layers')
                navigate('layers', { state: { projectId: project.pid } } )
                } } className='glass2 text-black border-1 border-gray-400 py-1 px-4 rounded'>
                Layers
              </button>

              <button 
                  onClick={ () => {
                      setRender('Comments')
                      navigate('comments', { state: { projectId: project.pid } } )
                    }}
                 className='glass2 text-black border-1 border-gray-400 py-1 px-4 rounded'>
                Comments
              </button>
              <button 
                  onClick={ () => {
                    setRender('Configurations')
                    navigate('configurations', { state: { projectId: project.pid } } )
                  }}              
                className='glass2 text-black border-1 border-gray-400 py-1 px-4 rounded'>    
                <Icon>
                    <DonutLargeTwotone/>
                </Icon>
              </button>
            </div>
          </div>
  
         { renderComponent() }

        </div>
  



      </div>
    )
  }