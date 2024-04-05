import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { ImCancelCircle } from "react-icons/im";
import { ArrowHookUpLeft16Regular } from '@ricons/fluent'
import { useRepositoryTasksData } from '../hooks/useRepositoryTasksData';
import { Accordion, AccordionSummary, AccordionDetails, Avatar, ListItemAvatar, Select, MenuItem, TextField  } from '@mui/material';
import LoadingCircle from '../../../../../auth/helpers/Loading';
import { TaskAdd } from '@ricons/carbon'
import { Add } from '@ricons/ionicons5'
import { Icon } from '@ricons/utils';
import { MdLayers } from 'react-icons/md';
import { FaGitAlt  } from 'react-icons/fa';
import { useRenderActivity } from '../../activity/hooks/useRenderActivity';
import { BiLogoTypescript } from "react-icons/bi";
import { TaskForm } from './forms/TaskForm';

export const RepositoryTasksModal = ({ isTasksModalOpen, setIsTasksModalOpen }) => {


  const location = useLocation()
  const { repoID } = location.state.repository;
  
  const [isAssigned, setIsAssigned] = useState(false)
  const [goalsExpanded, setGoalsExpanded] = useState(false)
  const [modalOpacity, setModalOpacity] = useState(0);
  const [render, setRender] = useState('completed')
  const [taskFormOpen, setTaskFormOpen] = useState(false)
  const [ taskNameFilter, setTaskNameFilter ] = useState('')
  const { RenderTasks, TaskCollaborators, tasksCompleted, isLoading } = useRepositoryTasksData(repoID)
  const [expanded, setExpanded] = useState(false);


    const handleClose = () => {
      if( isTasksModalOpen ) {
        setModalOpacity(0);
        setTimeout(() => {
          setIsTasksModalOpen(false);
        }, 700);
      }
    };

    useEffect(() => {
      if (isTasksModalOpen) {
        // Retraso mínimo para iniciar la transición después de abrir el modal
        const timer = setTimeout(() => setModalOpacity(1), 20); // Ajusta la opacidad a 1 (visible)
        return () => clearTimeout(timer);
      } else {
        setModalOpacity(0); // Ajusta la opacidad a 0 (invisible) inmediatamente al cerrar
      }
    }, [isTasksModalOpen]);
    
    // console.log(tasksCompleted)

  return ( 
    <div className='fixed flex w-screen h-screen top-0 right-0 justify-center items-center z-50'>
        <div
          id="repositoryTaskModal"
          style={{ opacity: modalOpacity, transition: 'opacity 300ms ease-in-out, height 300ms ease-in-out, background 300ms ease-in-out' }}
          className={`flex flex-col space-y-2 w-[90%] overflow-hidden md:w-[50%] transition-colors duration-300 ${taskFormOpen && goalsExpanded ? 'md:h-[740px] md:min-h-[740px] bg-white' : taskFormOpen && isAssigned ? 'md:h-[625px] md:min-h-[625px] bg-white' :  taskFormOpen ? 'md:h-[65%] md:min-h-[545px] bg-white  border-[1px] border-black' : 'md:h-[95%] glassi border-1 border-gray-400'} rounded-2xl ${isTasksModalOpen ? '' : 'pointer-events-none'}`}
        >
            
          <div className='flex justify-between w-[95%] h-12 ml-auto mr-auto mt-2 p-2 border-b-2 border-b-gray-500'>

              <p className='text-xl text-black'>
                {
                  taskFormOpen && (
                    <button className='mr-2' onClick={() => {
                        setTaskFormOpen(false)
                        setIsAssigned(false)
                      }}>
                      <Icon>
                        <ArrowHookUpLeft16Regular/>
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
              ? <TaskForm setTaskFormOpen={setTaskFormOpen} setGoalsExpanded={setGoalsExpanded} goalsExpanded={goalsExpanded}  isAssigned={isAssigned} setIsAssigned={setIsAssigned} />
              :
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
                        },
                        getContentAnchorEl: null, // Evita que MUI establezca la posición basándose en el contenido seleccionado
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
                  <button 
                    onClick={() => setTaskFormOpen(true)}
                    className='mr-2'>
                    <Icon size={30}>
                      <TaskAdd 
                          style={{
                            fill: 'currentColor', // Usa 'currentColor' para que el color se pueda controlar con 'color'
                            transition: 'color 0.3s ease', // Transición suave
                            color: 'black', // Color inicial
                          }}
                          onMouseOver={(e) => e.currentTarget.style.color = 'white'} // Cambia a blanco al pasar el mouse
                          onMouseOut={(e) => e.currentTarget.style.color = 'black'} // Vuelve al color original al quitar el mouse/>
                      />
                    </Icon>
                  </button>
                  </div>
                    
                    { 
                      isLoading 
                      ? <LoadingCircle />            
                      : <RenderTasks  tasks={tasksCompleted} render={render} nameFilter={taskNameFilter}/>       
                    }               
              </div>
          }
        </div>
    </div>
  )
}
