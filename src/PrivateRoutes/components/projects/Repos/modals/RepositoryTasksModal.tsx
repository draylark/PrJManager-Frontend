import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { ImCancelCircle } from "react-icons/im";
import { ArrowHookUpLeft16Regular } from '@ricons/fluent'
import { useRepositoryTasksData } from '../hooks/useRepositoryTasksData';
import { Select, MenuItem, TextField  } from '@mui/material';
import { TaskAdd } from '@ricons/carbon'
import { Icon } from '@ricons/utils';
import { TaskForm } from './forms/TaskForm';
import formbg from '../../../../assets/imgs/formbg.jpg'
import { useSelector } from 'react-redux';
import { tierS, tierA } from '../../../../helpers/accessLevels-validator';
import { RenderRepositoryTasks } from './RenderRepositoryTasks';
import { PuffLoader  } from 'react-spinners';
import { RootState } from '../../../../../store/store';
import { ProjectBase, RepositoryBase, LayerBase } from '../../../../../interfaces/models';


interface RepositoryTasksModalProps {
  project: ProjectBase;
  layer: LayerBase;
  repo: RepositoryBase;
  isTasksModalOpen: boolean;
  setIsTasksModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}



export const RepositoryTasksModal: React.FC<RepositoryTasksModalProps> = ({ project, layer, repo, isTasksModalOpen, setIsTasksModalOpen }) => {

  const location = useLocation();
  const { repoID } = location.state.repository;
  const { uid } = useSelector( (state: RootState) => state.auth );
  
  const [goalsExpanded, setGoalsExpanded] = useState(false);
  const [modalOpacity, setModalOpacity] = useState(0);
  const [render, setRender] = useState('completed');
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [ taskNameFilter, setTaskNameFilter ] = useState('');
  const { tasks, setTasks,  isLoading, errorWhileFetching, errorMessage } = useRepositoryTasksData(repoID);
  const [isBackgroundReady, setIsBackgroundReady] = useState(false);  

  const handleClose = () => {
    if( isTasksModalOpen ) {
      setModalOpacity(0);
      setTimeout(() => {
        setIsTasksModalOpen(false);
      }, 700);
    }
  };

  useEffect(() => {
      const preloadImage = new Image(); // Crea una nueva instancia para cargar la imagen
      preloadImage.src = formbg;
  
      preloadImage.onload = () => {
        setIsBackgroundReady(true); // Indica que la imagen ha cargado
      };
  }, []);

  useEffect(() => {
    if (isTasksModalOpen) {
      // Retraso mínimo para iniciar la transición después de abrir el modal
      const timer = setTimeout(() => setModalOpacity(1), 20); // Ajusta la opacidad a 1 (visible)
      return () => clearTimeout(timer);
    } else {
      setModalOpacity(0); // Ajusta la opacidad a 0 (invisible) inmediatamente al cerrar
    }
  }, [isTasksModalOpen]);
    

  return ( 
    <div className='fixed flex w-screen h-full top-0 right-0 justify-center items-center bg-black/30 z-50'>
        <div
          id="repositoryTaskModal"
          style={{ 
              opacity: modalOpacity,      
              transition: 'opacity 300ms ease-in-out, height 300ms ease-in-out, background 300ms ease-in-out',
              backgroundImage: isBackgroundReady ? `url(${formbg})` : 'none',
              backgroundSize: taskFormOpen ? '' : 'cover',
              backgroundPosition: taskFormOpen ? 'center center' : 'center',

          }}
          className={`flex flex-col space-y-2 w-[90%] overflow-hidden md:w-[50%] transition-colors duration-300 glass2 border-[1px] border-gray-400
                      ${taskFormOpen && goalsExpanded ? 'md:h-[750px] md:min-h-[750px]' 
                      :  taskFormOpen ? 'md:h-[640px] md:min-h-[625px]' 
                      : 'md:h-[800px]'} rounded-2xl ${isTasksModalOpen ? '' 
                      : 'pointer-events-none'}`}

        >
          {

            !isBackgroundReady 
            ? ( 
                <div className='flex flex-grow items-center justify-center'>
                    <PuffLoader  color="#ffffff" size={50} /> 
                </div>                         
              )           
            :
            errorWhileFetching 
            ? 
              (
                <div className='flex w-full h-full items-center justify-center'>
                  <h1 className='text-red-500'>{errorMessage}</h1>
                </div>
              )
            :
            <>
              <div className='flex justify-between w-[95%] h-12 ml-auto mr-auto mt-2 p-2 border-b-2 border-b-gray-500'>
                  <p className='text-xl text-black'>
                    {
                      taskFormOpen && (
                        <button className='mr-2' onClick={() => setTaskFormOpen(false)}>
                          <Icon>
                            <ArrowHookUpLeft16Regular onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}/>
                          </Icon>               
                        </button>
                      )
                    }
                    {
                      taskFormOpen
                      ? 'Create a new Task'
                      : 'Repository Tasks'            
                    }
                  </p>
                  <button onClick={handleClose}>
                        <ImCancelCircle/>
                  </button>                   
              </div>

              {
                  taskFormOpen
                  ? <TaskForm 
                        uid={uid as string}          
                        setGoalsExpanded={setGoalsExpanded} 
                        goalsExpanded={goalsExpanded}                   
                      />
                  :
                    (
                      <div className='flex flex-col space-y-2 flex-grow'>
                        <div className='flex justify-between p-2 w-[95%] ml-auto mr-auto'>
                          <div className='flex space-x-3'>
                            <Select       
                              size="small" // Ajusta el tamaño
                              value={render}

                              onChange={(event) => setRender(event.target.value)}
                              sx={{ 
                                width: 170, // Ajusta el ancho mediante estilos
                                backgroundColor: 'white', // Cambia el color de fondo
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'gray', // Opcional: Cambia el color del borde si es necesario
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'primary.main', // Opcional: Cambia el color del borde al pasar el mouse
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'primary.main', // Opcional: Cambia el color del borde al enfocar
                                },
                              }}
                              MenuProps={{
                                anchorOrigin: {
                                  vertical: 'bottom', // Puede ser 'top' o 'bottom'
                                  horizontal: 'left', // Puede ser 'left', 'center' o 'right'
                                },
                                transformOrigin: {
                                  vertical: 'top', // Puede ser 'top' o 'bottom'
                                  horizontal: 'left', // Puede ser 'left', 'center' o 'right'
                                }
                              }}

                            >
                              <MenuItem value="completed">Completed</MenuItem>
                              <MenuItem value="pending">Pending</MenuItem>
                              <MenuItem value="approval">Waiting for Approval</MenuItem>
                            </Select>

                            <TextField
                              size="small"
                              id="outlined-basic"
                              label="Search"
                              variant="outlined"
                              onChange={(event) => setTaskNameFilter(event.target.value)}
                              sx={{ 
                                width: 250,
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'gray', // Opcional: Cambia el color del borde si es necesario
                                }, 
                              }} // Ajusta el ancho mediante estilos
                              InputProps={{
                                style: {
                                  backgroundColor: 'white',
                                },
                              }}
                            />
                          </div>

                          {
                                tierS(uid as string, project, layer, repo) 
                            ||
                                tierA(uid as string, project, layer, repo)
                            ? (   
                                <TaskAdd 
                                  className='w-8 h-8 hover:text-blue-400 transition-colors duration-200 mr-2 cursor-pointer'
                                  onClick={() => setTaskFormOpen(true)} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                />
                  
                              )
                            : null
                          }

                          </div>
                            
                            { 
                              isLoading 
                              ? ( 
                                  <div className='flex flex-grow items-center justify-center'>
                                      <PuffLoader  color="#32174D" size={50} /> 
                                  </div>                         
                                )           
                              : <RenderRepositoryTasks  tasks={tasks} setTasks={setTasks} render={render} nameFilter={taskNameFilter} handleClose={handleClose}/>       
                            }               
                      </div>
                    )
                
              }
            
            </>          
          }
        </div>
    </div>
  )
}
