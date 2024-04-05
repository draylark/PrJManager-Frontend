import { useState, useEffect, useRef, useMemo } from 'react'
import axios from 'axios'
import { Accordion, AccordionSummary, AccordionDetails, Avatar, ListItemAvatar, Select, MenuItem  } from '@mui/material';
import { TaskComplete, TaskView, TaskRemove } from '@ricons/carbon'
import { Settings20Regular } from '@ricons/fluent'
import { Icon } from '@ricons/utils';
import { MdLayers } from 'react-icons/md';
import { FaGitAlt  } from 'react-icons/fa';
import ArrowCircleDown48Regular from '@ricons/fluent/ArrowCircleDown48Regular'
const backendUrl = import.meta.env.VITE_BACKEND_URL
import LoadingCircle from '../../../../../auth/helpers/Loading';

export const useRepositoryTasksData = ( repoID: string ) => {


    const accordionRefs = useRef([]);
    const [expanded, setExpanded] = useState(false);

    const [layerInfo, setLayerInfo] = useState({});
    const [repoInfo, setRepoInfo] = useState({});
    // Estados para almacenar los datos ya procesados
    const [tasksCompleted, setTasksCompleted] = useState([]);
    const [wFApprovalTasks, setWFApprovalTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    
    const TaskCollaborators = ({ collaborators }) => {
    
        const totalCollaborators = collaborators.length;
        const startFadeIndex = 0; // Comenzar a difuminar desde el segundo elemento (índice 1)
        const fadeCount = totalCollaborators - startFadeIndex;
      
        return (
          <div className='flex space-x-1 items-center'>
            {collaborators.map((collaborator, index) => (
              <Avatar 
                key={index} 
                alt={collaborator.username} 
                src={collaborator.photoUrl || collaborator.username}
                sx={{
                  
                  width: 15, 
                  height: 15,
                  opacity: index >= startFadeIndex ? 1 - ((index - startFadeIndex) / fadeCount) : 1,
                }}
              />
            ))}
            {collaborators.length > 3 && (
              <span>...</span> // Asegúrate de ajustar el estilo de este elemento para que coincida con el diseño.
            )}
          </div>
        );
    };
    
    const fetchCollaborators = async ( collaborators ) => {
        try {
          const response = await axios.post(`http://localhost:3000/api/users?limit=${collaborators.length}`, { IDS: collaborators });
          return response.data.users 
        } catch (error) {
          console.error("Error fetching collaborators:", error);
        }
    };

    const fetchAndSetData = async (tasks) => {
        setIsLoading(true);
        try {
        const tasksWithCollaborators = await Promise.all(tasks.map(async (task) => {
            const collaborators = await fetchCollaborators(task.contributorsIds);
            return { ...task, contributors: collaborators };
        }));
        
        // const wFTasksWithCollaborators = await Promise.all(wFApprovalTasksData.map(async (task) => {
        //   const collaborators = await fetchCollaborators(task.collaboratorsIds);
        //   const { completedBy, ...rest } = task;
        //   return { ...rest, completedBy: collaborators };
        // }));

        // console.log(wFTasksWithCollaborators)

        setTasksCompleted(tasksWithCollaborators);
        setIsLoading(false)
        } catch (error) {
        console.error("Error fetching data:", error);
        }
        setIsLoading(false);
    };

    
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setIsLoading(true)
                const { data: { tasks }} = await axios.get(`${backendUrl}/tasks/${repoID}`, {        
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('x-token')
                    }
                });
                // setPendingTasks(response.data.pendingTasks)
                fetchAndSetData(tasks)
                // setWForApprovalTasks(response.data.wForApprovalTasks)
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setIsLoading(false)
            }
        }
        fetchTasks()
    }, [])
    

    const RenderTasks = ({ tasks, render, nameFilter }) => {

        const accordionRefs = useRef([]);
        const [expanded, setExpanded] = useState(false);
        const [userFilter, setUserFilter] = useState(null);
  
  
        const handleExpandClick = (taskId) => {
          const isExpanded = expanded === taskId;
          setExpanded(isExpanded ? false : taskId);
      
          if (!isExpanded) {
            // Esperar al próximo ciclo del evento para asegurar que la expansión se ha completado antes de desplazarse
            setTimeout(() => {
              const accordionElement = accordionRefs.current[taskId];
              if (accordionElement) {
                const container = document.querySelector('#container-scroll'); // Asegúrate de que este selector coincida con tu contenedor
                const containerRect = container.getBoundingClientRect();
                const accordionRect = accordionElement.getBoundingClientRect();
        
                // Calcular la posición relativa del acordeón respecto al contenedor y ajustar el scrollTop del contenedor
                const scrollTop = accordionRect.top - containerRect.top + container.scrollTop;
                container.scrollTo({ top: scrollTop, behavior: 'smooth' });
              }
            }, 0);
          }
        };
  
        // useMemo para filtrar datos basados en los filtros sin llamar a la API
        const filteredTasks = useMemo(() => {
          // Implementa tu lógica de filtrado aquí, basada en los estados de filtros
          // Por ejemplo:
          const filterTasks = (tasks) => tasks.filter(task => {
              const userPasses = userFilter ? task.collaboratorsIds.includes(userFilter) : true;
              const namePasses = nameFilter ? task.task_name.toLowerCase().includes(nameFilter.toLowerCase()) : true;
            // Añade otras condiciones de filtrado aquí
            return userPasses && namePasses; 
          });
  
          switch ( render ) {
            case 'completed':
              return filterTasks(tasks.filter( task => task.status === 'completed'));
            case 'approval':
              return filterTasks(tasks.filter( task => task.status === 'approval'));
            case 'pending':
              return filterTasks(tasks.filter( task => task.status === 'pending'));
            default:
              return [...tasks];
          }
        }, [tasks, userFilter, render, nameFilter]); 
  
  
        return (
              <div className="flex flex-col flex-grow space-y-3 items-center max-h-[650px] h-full overflow-y-auto">
                    {    

                        filteredTasks.length === 0
                        ? <div className='flex items-center justify-centerw-full h-full text-[15px] font-bold text-gray-400'>
                              {
                                  render === 'completed'
                                  ? 'No tasks completed yet'
                                  : render === 'approval'
                                  ? 'No tasks waiting for approval'
                                  : 'No pending tasks'
                              }
                          </div>
                        : filteredTasks.map((task, index) => (
                            
                            <Accordion 
                              sx={{
                                width: '93%'
                              }}
                              key={task.task_id} 
                              expanded={expanded === task.task_id}
                              onChange={() => handleExpandClick(task.task_id)}
                              ref={(el) => accordionRefs.current[task.task_id] = el}
                            >   
                                <div key={index} className="w-full p-4 rounded shadow-lg bg-white hover:bg-gray-100 transition-colors border-[1px] border-blue-400">
                                        <div className='flex justify-between w-full '>
                                            <h3 className="text-[15px] font-bold text-blue-600">{task.task_name}</h3>
                                            <div className={`${ 
                                                  task.status === 'completed' 
                                                  ? 'bg-blue-400' 
                                                  : task.status === 'approval' 
                                                  ? 'bg-yellow-200'
                                                  : 'bg-red-200' 
                                                  } rounded-full px-3 py-1  text-sm font-semibold text-black ml-2`}> 
                                                <Icon 
                                                  size={15} 
                                                  color={`
                                                    ${ 
                                                      task.status === 'completed' 
                                                      ? 'white' 
                                                      : task.status === 'approval' 
                                                      ? 'black'
                                                      : 'black' 
                                                    }`
                                                  }
                                                  >
                                                    {
                                                        task.status === 'completed' 
                                                        ? <TaskComplete />
                                                        : task.status === 'approval' 
                                                        ? <TaskView />
                                                        : <TaskRemove />
                                                    }
                                                </Icon>
                                            </div>
                                        </div>
                                            
                                        <p className="text-[14px] text-gray-700 ">{task.task_description}</p>

                                        <div className=" mt-1 ">
                                              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-[10px] font-semibold text-gray-700 mr-2">#{task.layer_number_task}</span>  
                                              <span className={`inline-block ${ task.type === 'open' ? 'bg-pink-100 text-gray-700' : 'bg-black text-white'} rounded-full  px-3 py-1 text-[10px] font-semibold mr-2`}>{task.type}</span>                                                                           
                                              <span className="inline-block bg-green-200 rounded-full px-3 py-1 text-[10px] font-semibold text-green-700 mr-2">Commits: { task.commits_hashes.length }</span>
                                              <span className={`inline-block text-[10px] ${ 
                                                    task.status === 'completed' 
                                                    ? 'bg-blue-400' 
                                                    : task.status === 'approval' 
                                                    ? 'bg-yellow-200'
                                                    : 'bg-red-200' 
                                                    }
                                                    ${ 
                                                      task.status === 'completed' 
                                                      ? 'text-white' 
                                                      :  'text-black'                                        
                                                    } rounded-full px-3 py-1  font-semibold mr-2`}
                                              > 
                                                {
                                                    task.status === 'completed' 
                                                    ? 'Completed'
                                                    : task.status === 'approval' 
                                                    ? 'Waiting for Approval'  
                                                    : 'Pending'          
                                                } 
                                              </span>
                                        </div>

                                        <div className="flex justify-between mt-1 ">
                                            <div className='flex space-x-2'>
                                              {
                                                task.assigned_to && (
                                                  task.contributors.filter( contributor => contributor.uid === task.assigned_to).map((collaborator, index) => (
                                                    <div key={index} className="flex items-center space-x-2">
                                                      <Avatar alt={collaborator.username} src={collaborator.photoUrl || collaborator.username} sx={{ width: 15, height: 15 }} />
                                                      <span className='text-[12px]'>{collaborator.username}</span>
                                                      <span className='text-[20px] text-black'>·</span>
                                                    </div>                                                    
                                                  ))                                                
                                                )
                                              }
                                              <div className='flex space-x-2 items-center'>
                                                <span className='text-[12px]'>Contributors:</span>
                                                <TaskCollaborators collaborators={task.contributors} />
                                              </div>

                                            </div>
                                            <button 
                                                onClick={() => {
                                                handleExpandClick(task.task_id)
                                                }}
                                                className="mr-2">
                                                <Icon size={20}><ArrowCircleDown48Regular /></Icon>
                                            </button>
                                        </div>
                                </div>
                                
                                <AccordionDetails >
                                    <div className="flex justify-between  w-full h-[250px]">
                                        <div className='flex justify-between w-full p-1 h-full overflow-hidden'>
                                            {/*   <!-- Tarjeta de Detalles de Tarea --> */}                            

                                            <div className='flex space-x-3'>

                                                {/* <!-- Tarjeta de Comentarios --> */}
                                                <div className="flex flex-col bg-gray-50 shadow-lg p-4 rounded-lg space-y-3 border-[1px] border-gray-400">
                                                    <div className="text-sm font-semibold flex items-center"> Commits:</div>
                                                    <ul className="list-disc pl-5 max-h-[180px] overflow-y-auto">
                                                    {task.commits_hashes.map((comment, index) => (
                                                        <li key={index}>
                                                            <button className='text-[12px] hover:text-green-500 transition-colors duration-150'>
                                                                {comment}
                                                            </button>                                                           
                                                        </li>
                                                    ))}
                                                    </ul>
                                                </div>

                                                {/* <!-- Tarjeta de Comentarios --> */}
                                                <div className="flex flex-col bg-gray-50 shadow-lg p-4 rounded-lg space-y-3 border-[1px] border-gray-400">
                                                    <div className="text-sm font-semibold flex items-center"> Notes:</div>
                                                    <ul className="list-disc pl-5 max-h-[180px] overflow-y-auto">
                                                    {task.additional_info.notes.map((note, index) => (
                                                        <li key={index} className="text-[12px] break-words max-w-[200px]">{note}</li>
                                                    ))}
                                                    </ul>
                                                </div>

                                                {/* <!-- Tarjeta de Horas y Avatares --> */}
                                                <div className='flex flex-row space-x-4 '>
                                                    <div className="bg-gray-50 shadow-lg p-4 rounded-lg border-[1px] border-gray-400">
                                                    <div className="text-[13px] font-semibold">Estimated Hours:</div>
                                                    <div className="text-[12px]">{task.additional_info.estimated_hours}h</div>
                                                    <div className="text-[13px] font-semibold mt-2">Actual Hours:</div>
                                                    <div className="text-[12px]">{task.additional_info.actual_hours}h</div>
                                                    </div>

                                                    <div className='flex flex-col bg-gray-50 shadow-lg p-4 rounded-lg border-[1px] border-gray-400'>

                                      
                                                        <div className="text-sm font-semibold">Contributors:</div>
                                                        <div className="flex flex-wrap gap-1 max-w-[104px] max-h-[180px] overflow-y-auto mt-2">
                                                            {task.contributors.map((collaborator, index) => (
                                                            <Avatar key={index} alt={ collaborator.username } src={ collaborator.photoUrl || collaborator.username } sx={{ width: 15, height: 15 }} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>                                            
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                         ))


                    }
              </div>
  
        );
      };

    




  return {
    isLoading,
    tasksCompleted,
    TaskCollaborators,
    RenderTasks
  }
}
