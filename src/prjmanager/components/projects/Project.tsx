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
import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { tierS } from '../../helpers/accessLevels-validator';
import { cleanUrl } from './helpers/cleanUrl';
import { PuffLoader  } from 'react-spinners';

export const Project = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { ID, name } = location.state.project;
  const { uid } = useSelector((state: RootState) => state.auth );
  const { projects } = useSelector((state: RootState) => state.projects );  
  const { project: projectRoute, layer, repository } = location.state || {}; // Asegurándonos de que state exista

  const [errorType, setErrorType] = useState(null)    
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorWhileFetching, setErrorWhileFetching] = useState(false)


  const [render, setRender] = useState('');
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [firstTime, setFirstTime] = useState(true);
  const [anotherRoute, setAnotherRoute] = useState(false);
  const [showOptModal, setShowOptModal] = useState(false);
  const [IsLayerFormOpen, setIsLayerFormOpen] = useState(false);  
  const [isBackgroundReady, setIsBackgroundReady] = useState(false); 
  const [isProjectConfigFormOpen, setIsProjectConfigFormOpen] = useState(false);
  const [IsProjectCollaboratorsFormOpen, setIsProjectCollaboratorsFormOpen] = useState(false);
  const currentLocation = location.pathname.split('/').pop();

  const capitalizeFirstLetter = (text) => {
    if (typeof text !== 'string' || text.length === 0) {
      return ''; // Si el texto está vacío o no es una cadena, retorna una cadena vacía
    }
    return text.charAt(0).toUpperCase() + text.slice(1); // Convierte la primera letra a mayúscula y concatena el resto
  };

  const renderComponent = (locationState) => {
    switch (render) {
      case 'hash':
        return <Outlet/>
      case 'commits':
        return <Outlet/>
      case 'repository': 
        return <Outlet/>
      case 'layer': 
        return <Outlet/>
      case 'Info':
        return <ProjectInfo project={project} projectID={ID} firstTime={firstTime} setFirstTime={setFirstTime} />
      case 'Tree':
        return <Outlet/>
      case 'Activity':
        return <Outlet/>
      case 'Comments':
        return <Outlet/>
      case 'Configurations':
        return <Outlet/>
      default:
          if( locationState?.commitHash ) return setRender('hash')
          else if ( locationState?.commits ) return setRender('commits')
          else if ( locationState?.repository ) return setRender('repository')
          else if ( locationState?.layer ) return setRender('layer')
          else if( currentLocation === 'comments' ) return setRender('Comments')
          else if( currentLocation === 'activity' ) return setRender('Activity')
          else if( currentLocation === 'tree' ) return setRender('Tree')
          else return <ProjectInfo project={project} projectID={ID} firstTime={firstTime} setFirstTime={setFirstTime} />
    }
  };


  useEffect(() => {
    const preloadImage = new Image(); // Crea una nueva instancia para cargar la imagen
    preloadImage.src = projectbg;

    preloadImage.onload = () => {
      setIsBackgroundReady(true); // Indica que la imagen ha cargado
    };
  }, []);

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
      const project = projects.find( project => project.pid === ID )
      if( project && project !== undefined ){
        dispatch(setCurrentProject(project))
        setProject(project)
        setIsLoading(false)     
      } else {
        axios.get(`${backendUrl}/projects/get-project-by-id/${ID}`, {
          params: {
            uid
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('x-token')
          }
        })
        .then( ( response ) => {
          const { project, accessLevel } = response.data
          dispatch(setCurrentProject({...project, accessLevel: accessLevel ? accessLevel : null}))          
          setProject({...project, accessLevel: accessLevel ? accessLevel : null})
          setIsLoading(false)
        })
        .catch( ( error ) => {   
          setErrorWhileFetching(true)
          setErrorType(error.response.data.type || 'Error')
          setErrorMessage(error.response.data.message)
          setIsLoading(false)   
        })
      }
    }
  }, [])


    if( errorWhileFetching ) return (
      <div className='flex w-full h-full items-center justify-center'>
        <h1 className='text-red-500'>{errorMessage}</h1>
      </div>
    )

    if( isLoading ) return (  
      <div className='flex w-full h-full items-center justify-center'>
        <PuffLoader  color="#32174D" size={50} /> 
      </div>   
    )  

    return (
      <div className='w-full h-full p-4'>
            <div 
                id='projectPanel' 
                className="relative flex flex-col w-full h-full max-h-[840px] overflow-hidden shadow-lg rounded-extra"
                style={{ 
                  backgroundImage: isBackgroundReady ? `url(${projectbg})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                >
                
                <Options uid={uid} project={project} showOptModal={showOptModal} setIsProjectConfigFormOpen={setIsProjectConfigFormOpen} setIsLayerFormOpen={setIsLayerFormOpen} setIsProjectCollaboratorsFormOpen={setIsProjectCollaboratorsFormOpen} />
                { IsLayerFormOpen && <LayerForm isLayerFormOpen={IsLayerFormOpen} setIsLayerFormOpen={setIsLayerFormOpen} showOptModal={showOptModal} setShowOptModal={setShowOptModal}   /> }
                { isProjectConfigFormOpen && <ProjectConfigForm isProjectConfigFormOpen={isProjectConfigFormOpen} setIsProjectConfigFormOpen={setIsProjectConfigFormOpen} showOptModal={showOptModal} setShowOptModal={setShowOptModal} /> }
                { IsProjectCollaboratorsFormOpen && <ProjectCollaboratorsForm isProjectCollaboratorsFormOpen={IsProjectCollaboratorsFormOpen} setIsProjectCollaboratorsFormOpen={setIsProjectCollaboratorsFormOpen} showOptModal={showOptModal} setShowOptModal={setShowOptModal} /> }

                <div className={`flex ${ anotherRoute ? 'justify-between' : 'justify-end'} items-center py-4 px-5`}>
                  {
                    anotherRoute && (
                      <h1 className={`${anotherRoute ? 'text-lg font-bold' : 'text-3xl font-bold'} h-[30px]`}>
                        {project.name}   { !layer || repository ? (<span className='ml-2'>▸</span>) : ''} <span className='ml-1 font-semibold'>{repository ? `${capitalizeFirstLetter(repository.repoName)}` : !layer && `${capitalizeFirstLetter(currentLocation)}`}</span>
                      </h1>
                    )
                  }


                    <div className='flex space-x-4'>
                      <button onClick={ () => {
                          setRender('Info')
                          navigate('.', { state: { project: { ID: project.pid, name } } } )
                        } }  className={`${ render === 'Info' ? 'glassi-hover' : 'glassi' } hover:glassi-hover text-black border-1 border-gray-400 py-1 px-4 rounded transition-all duration-150 ease-in-out transform active:translate-y-[2px]`}>
                        Info
                      </button>
                      <button onClick={ () => {
                        setRender('Tree')
                        navigate('tree', { state: { project: { ID: project.pid, name } } } )
                        } } className={`${ render === 'Tree' ? 'glassi-hover' : 'glassi' } hover:glassi-hover text-black border-1 border-gray-400 py-1 px-4 rounded transition-all duration-150 ease-in-out transform active:translate-y-[2px]`}>
                        Tree
                      </button>

                      <button 
                          onClick={ () => {
                              setRender('Activity')
                              navigate('activity', { state: { project: { ID: project.pid, name } } } )
                            }}
                        className={`${ render === 'Activity' ? 'glassi-hover' : 'glassi' } hover:glassi-hover text-black border-1 border-gray-400 py-1 px-4 rounded transition-all duration-150 ease-in-out transform active:translate-y-[2px]`}>
                        Activity
                      </button>

                      <button 
                          onClick={ () => {
                              setRender('Comments')
                              navigate('comments', { state: { project: { ID: project.pid, name } } } )
                            }}
                        className={`${ render === 'Comments' ? 'glassi-hover' : 'glassi' } hover:glassi-hover text-black border-1 border-gray-400 py-1 px-4 rounded transition-all duration-150 ease-in-out transform active:translate-y-[2px]`}>
                        Comments
                      </button>
                      {
                        tierS(uid, project) 
                        && (
                          <button 
                            onClick={ () => setShowOptModal(!showOptModal) }              
                            className='glassi hover:glassi-hover text-black border-1 border-gray-400 py-1 px-4 rounded transition-all duration-150 ease-in-out transform active:translate-y-[2px]'
                            
                            >    
                            <Icon>
                                <DonutLargeTwotone/>
                            </Icon>
                          </button>
                        )
                      }

                    </div>
                </div>
      
              { renderComponent(location.state) }

            </div>
      </div>
    )
  }