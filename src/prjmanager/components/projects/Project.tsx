import { useState, useEffect } from 'react'
import { DonutLargeTwotone } from '@ricons/material'
import { Icon } from '@ricons/utils'
import { ProjectInfo } from './ProjectInfo';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { fetchProjectLayers, fetchProjectRepositories } from '../../../store/platypus/thunks';
import { setCurrentProject } from '../../../store/platypus/platypusSlice';
import { Options } from './options/Options';
import { ProjectConfigForm } from './forms/ProjectConfigForm';
import { LayerForm } from './forms/LayerForm';
import { ProjectCollaboratorsForm } from './forms/ProjectCollaboratorsForm';
import projectbg from '../../assets/imgs/projectbg.jpg'
import { ArrowBackUp } from '@ricons/tabler';
import { AnimatePresence, motion } from 'framer-motion';

export const Project = () => {

  const dispatch = useDispatch()
  const location = useLocation();
  const { projects } = useSelector((state: RootState) => state.projects );
  const { ID, name } = location.state.project;
  const layer = location.state.layer;
  const repo = location.state.repository;
  const project = projects.find( project => project.pid === ID )
  const navigate = useNavigate()

  const [firstTime, setFirstTime] = useState(true)
  const [anotherRoute, setAnotherRoute] = useState(false)
  const [IsProjectCollaboratorsFormOpen, setIsProjectCollaboratorsFormOpen] = useState(false)
  const [IsLayerFormOpen, setIsLayerFormOpen] = useState(false)
  const [isProjectConfigFormOpen, setIsProjectConfigFormOpen] = useState(false)
  const [showOptModal, setShowOptModal] = useState(false)

  // console.log(location)
  const currentLocation = location.pathname.split('/').pop()
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
      console.log('Cambiando render nuevamente:', render)
      switch (render) {
        case 'Info':
          return <ProjectInfo project={project} firstTime={firstTime} setFirstTime={setFirstTime} />
        case 'Tree':
          return <Outlet/>
        case 'Activity':
          return <Outlet/>
        case 'Comments':
          return <Outlet/>
        case 'Configurations':
          return <Outlet/>
        default:
          return <ProjectInfo project={project} />
      }
    }


    useEffect(() => {
      if( currentLocation === 'activity' ) {
          setAnotherRoute(true)
      } else if ( currentLocation === 'comments' ) {
          setAnotherRoute(true)
      } else if ( currentLocation === 'tree' ) {
          setAnotherRoute(true)
      } else if ( layer?.layerID ) {
          setAnotherRoute(true)
      } else { 
          setAnotherRoute(false)
       }
    }, [location, currentLocation, layer?.layerID])
    


    useEffect(() => {     
      if( ID ) {
        dispatch(setCurrentProject(project))
        dispatch(fetchProjectLayers(ID))
        dispatch(fetchProjectRepositories(ID))
      }
    }, [ID])


    return (
      <div className='w-full h-full p-4'>
            <div 
                id='projectPanel' 
                className="relative flex flex-col w-full h-full max-h-[840px] overflow-hidden bg-white shadow-lg rounded-extra"
                style={{ 
                  backgroundImage: `url(${projectbg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                >
                
                <Options showOptModal={showOptModal} setIsProjectConfigFormOpen={setIsProjectConfigFormOpen} setIsLayerFormOpen={setIsLayerFormOpen} setIsProjectCollaboratorsFormOpen={setIsProjectCollaboratorsFormOpen} />
                { IsLayerFormOpen && <LayerForm isLayerFormOpen={IsLayerFormOpen} setIsLayerFormOpen={setIsLayerFormOpen} showOptModal={showOptModal} setShowOptModal={setShowOptModal}   /> }
                { isProjectConfigFormOpen && <ProjectConfigForm isProjectConfigFormOpen={isProjectConfigFormOpen} setIsProjectConfigFormOpen={setIsProjectConfigFormOpen} showOptModal={showOptModal} setShowOptModal={setShowOptModal} /> }
                { IsProjectCollaboratorsFormOpen && <ProjectCollaboratorsForm isProjectCollaboratorsFormOpen={IsProjectCollaboratorsFormOpen} setIsProjectCollaboratorsFormOpen={setIsProjectCollaboratorsFormOpen} showOptModal={showOptModal} setShowOptModal={setShowOptModal} /> }

                <div className={`flex ${ anotherRoute ? 'justify-between' : 'justify-end'} items-center py-4 px-5`}>
                  {
                    anotherRoute && (
                      <h1 className={`${anotherRoute ? 'text-lg font-bold' : 'text-3xl font-bold'}`}>
                        {`${project?.name} ${repo ? ` - ${repo.repoName}` : ''}`}
                      </h1>
                    )
                  }


                    <div className='flex space-x-4'>
                      <button onClick={ () => {
                          setRender('Info')
                          navigate('.', { state: { project: { ID: project.pid, name } } } )
                        } }  className='glass2 text-black border-1 border-gray-400 py-1 px-4 rounded transition-transform duration-150 ease-in-out transform active:translate-y-[2px]'>
                        Info
                      </button>
                      <button onClick={ () => {
                        setRender('Tree')
                        navigate('tree', { state: { project: { ID: project.pid, name } } } )
                        } } className='glass2 text-black border-1 border-gray-400 py-1 px-4 rounded transition-transform duration-150 ease-in-out transform active:translate-y-[2px]'>
                        Tree
                      </button>

                      <button 
                          onClick={ () => {
                              setRender('Activity')
                              navigate('activity', { state: { project: { ID: project.pid, name } } } )
                            }}
                        className='glass2 text-black border-1 border-gray-400 py-1 px-4 rounded transition-transform duration-150 ease-in-out transform active:translate-y-[2px]'>
                        Activity
                      </button>

                      <button 
                          onClick={ () => {
                              setRender('Comments')
                              navigate('comments', { state: { project: { ID: project.pid, name } } } )
                            }}
                        className='glass2 text-black border-1 border-gray-400 py-1 px-4 rounded transition-transform duration-150 ease-in-out transform active:translate-y-[2px]'>
                        Comments
                      </button>
                      <button 
                        onClick={ () => setShowOptModal(!showOptModal) }              
                        className='glass2 text-black border-1 border-gray-400 py-1 px-4 rounded transition-transform duration-150 ease-in-out transform active:translate-y-[2px]'>    
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