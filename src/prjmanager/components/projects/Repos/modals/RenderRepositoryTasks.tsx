import { useState, useEffect, useRef, useMemo, memo } from 'react'
import axios from 'axios'
import { Accordion, AccordionDetails, Avatar,  Dialog, DialogContent, DialogTitle, DialogActions, Button, 
  TextField,  List, ListItem, ListItemText, Paper, Tooltip } from '@mui/material';
import { TaskComplete, TaskView, TaskRemove,} from '@ricons/carbon'
import { IosClose } from '@ricons/ionicons4'
import { InformationOutline } from '@ricons/ionicons5'
import { Copy20Regular } from '@ricons/fluent'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Icon } from '@ricons/utils';
import ArrowCircleDown48Regular from '@ricons/fluent/ArrowCircleDown48Regular'
import { useSelector } from 'react-redux';
const backendUrl = import.meta.env.VITE_BACKEND_URL
import { CheckTwotone } from '@ricons/material'
import { BeatLoader } from 'react-spinners';
import { TaskDialog } from './TextDialog';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export const RenderRepositoryTasks = ({ tasks, setTasks, render, nameFilter, handleClose }) => {

    const accordionRefs = useRef([]);
    const [expanded, setExpanded] = useState(false);
    const [userFilter, setUserFilter] = useState(null);

    const { uid } = useSelector((state) => state.auth)
    const navigate = useNavigate();
    const location = useLocation()

    const { project, layer, repository } = location.state

    const [infoDialogOpen, setInfoDialogOpen] = useState(false)

    const [openDialogs, setOpenDialogs] = useState({});
    const [response, setResponse] = useState([])
    const [taskHandled, setTaskHandled] = useState(false)
    const [taskToHandle, setTaskToHandle] = useState('')
    const [handlingTask, setHandlingTask] = useState(false)
    const [openDialog, setOpenDialog] = useState(false);

    const TaskCollaborators = ({ collaborators }) => {
    
      const totalCollaborators = collaborators.length;
      const startFadeIndex = 0; // Comenzar a difuminar desde el segundo elemento (índice 1)
      const fadeCount = totalCollaborators - startFadeIndex;
    
      return (
        <div className='flex space-x-1 items-center'>
          {collaborators.map((collaborator, index) => (
            <Avatar 
              className='cursor-pointer'
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

    const onSubmit = (reasonsTextField) => {
      setOpenDialog(false)
      handleTask(taskToHandle, false, 'pending', [ reasonsTextField ])    
    }

    const handleTask = async( taskId, approved, status, reasons ) => {
      const task = tasks.filter( task => task._id === taskId )[0]
      setHandlingTask(taskId)
      console.log(task)

      axios.put(`http://localhost:3000/api/tasks/update-task-status/${task.project}/${taskId}`, { approved, status, reasons }, {
        params: {
          uid,
          layerID: task.layer_related_id,
          repositoryID: task.repository_related_id
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('x-token')
        }
      })
      .then( res => {
        console.log(res)
        setResponse([ res.data.success, res.data.message ])
        setTaskToHandle('')

        setTimeout(() => {
              setHandlingTask('')
              setTaskHandled(taskId) 
        }, 2000);

        setTimeout(() => {
            const { status: oldStatus, ...rest } = task
            const newTaskUpdated = {
              ...rest,
              status
            }
            setTasks( prev => {
              const prevTasksFiltered = prev.filter( task => task._id !== taskId)
              return [ newTaskUpdated, ...prevTasksFiltered ]
            })   
        }, 5000);       
      })
      .catch( err => {
        console.log(err)     
        setResponse([ err.response.data.success, err.response.data.message ])
        setTaskToHandle('')

        setTimeout(() => {
              setHandlingTask('')
              setTaskHandled(taskId) 
        }, 2000);
      })
    };


    const gitInstructions = `
    
          How to contribute to this task? 🚀

          1. Copy the task ID.
          2. Before executing a 'Push', paste as a second argument the task ID.
          3. If your second argument has to be the remote name,
             paste the task ID as a third argument.

    `
  ;

  const handleOpenDialog = (taskId) => {
    setOpenDialogs({ ...openDialogs, [taskId]: true });
  };
  
  const handleCloseDialog = (taskId) => {
    const newDialogs = { ...openDialogs };
    delete newDialogs[taskId];
    setOpenDialogs(newDialogs);
  };

  const InfoDialog = memo(({ infoDialogOpen, setInfoDialogOpen, description, goals}) => {
    return (
      <Dialog
      open={infoDialogOpen}
      onClose={() => setInfoDialogOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Task Information and Goals"}</DialogTitle>
      <DialogContent>
          <div className='flex flex-col space-y-2'>
              <div className='flex space-x-8 py-2'>
                  <TextField
                    sx={{
                      width: '600px',
                      '& .Mui-disabled': {
                        color: 'black',
                        'text-fill-color': 'black',
                      }
                    }}
                    label="Task Description"
                    variant="outlined"
                    value={description}
                    fullWidth
                    multiline
                    rows={7}
                    disabled
                  />
          
                  <Paper variant="outlined" sx={{ maxHeight: '194px', overflow: 'auto', width: '400px' }}>
                    <List dense component="ul">
                      {goals.map((goal, index) => (
                        <ListItem key={index} component="li">
                          <ListItemText primary={goal} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>  
              </div>

              <div className='h-[200px]'>
                <SyntaxHighlighter  language="python" style={dracula} customStyle={{ fontSize: '12px', height: '100%', padding: '0px 0px', boxSizing: 'border-box'}}>                                                   
                  {gitInstructions}                                            
                </SyntaxHighlighter>
              </div>
          </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setInfoDialogOpen(false)} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>

    )
  })


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
          <div id='container-scroll' className="flex flex-col flex-grow space-y-3 items-center max-h-[650px] h-full overflow-y-auto">
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
                          key={task._id} 
                          expanded={expanded === task._id}
                          onChange={() => handleExpandClick(task._id)}
                          ref={(el) => accordionRefs.current[task._id] = el}
                        >   
                            <div key={index} className="flex flex-col space-y-1 w-full p-4 rounded shadow-lg bg-white hover:bg-gray-100 transition-colors border-[1px] border-blue-400">
                                    <div className='flex justify-between w-full'>
                                        <h3 className="text-[15px] font-bold text-blue-600">{task.task_name}</h3>


                                        
                                        <div className='flex space-x-4'>
                                          {
                                            task.status === 'approval' 
                                            && (
                                              <div className='flex items-center justify-center space-x-1 rounded-extra'>
                                                {
                                                  handlingTask === task._id 
                                                  ?     <div className='sweet-loading'>
                                                          <BeatLoader color="#bbdefb" loading={true} size={5} />
                                                        </div>
                                                  : 
                                                  taskHandled === task._id
                                                  ? <span className={`${response[0] === true ? 'text-green-500' : 'text-red-500'} text-[12px] font-semibold`}>{response[1]}</span>
                                                  : (
                                                      <>
                                                        <button 
                                                          onClick={() => {
                                                            setOpenDialog(true)
                                                            setTaskToHandle(task._id)
                                                          }}
                                                          className='flex justify-center items-center w-[40px] bg-red-300 hover:bg-red-500 transition-colors duration-100 h-full rounded-l-extra font-semibold border-[1px] border-black'>
                                                          <IosClose className="w-4 h-4" />
                                                          
                                                        </button>
                                                        <button
                                                          onClick={() => handleTask(task._id, true, 'completed')} 
                                                          className='flex justify-center items-center w-[40px] bg-blue-300 hover:bg-blue-500 transition-colors duration-100 h-full rounded-r-extra font-semibold border-[1px] border-black'>                                                   
                                                          <CheckTwotone className="w-3 h-3" />
                                                        </button>
                                                      </>
                                                    )
                                                }
                                              </div>
                                            )
                                          }

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

                                          
                                          <TaskDialog 
                                            open={openDialog} 
                                            onClose={() => setOpenDialog(false)} 
                                            onSubmit={onSubmit} 
                                          />

                                        </div>
                                    </div>

                                        
                                    <p className="text-[14px] text-gray-700 line-clamp-2 w-[600px]">{task.task_description}</p>

                                    <div className=" mt-1 ">
                                          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-[10px] font-semibold text-gray-700 mr-2">#{task?.repository_number_task}</span>  
                                          <span className={`inline-block ${ task.type === 'open' ? 'bg-pink-100 text-gray-700' : 'bg-black text-white'} rounded-full  px-3 py-1 text-[10px] font-semibold mr-2`}>{task.type}</span>                                                                           
                                          <span className="inline-block bg-yellow-300 rounded-full px-3 py-1 text-[10px] font-semibold text-black mr-2">Commits: { task.commits_hashes.length }</span>
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

                                    <div className="flex justify-between mt-1">
                                        <div className='flex space-x-2'>
                                          {
                                            task.assigned_to && (
                                              task.contributors.filter( contributor => contributor.uid === task.assigned_to).map((collaborator, index) => (
                                                <div key={index} className="flex items-center space-x-2 cursor-pointer mt-[1px]">
                                                  <Avatar alt={collaborator.username} src={collaborator.photoUrl || collaborator.username} sx={{ width: 15, height: 15 }} />
                                                  <span className='text-[12px]'>{collaborator.username}</span>
                                                </div>                                                    
                                              ))                                                
                                            )
                                          }
                                          {
                                            task.assigned_to && task.contributors.length === 0 
                                            ? null
                                            : task.assigned_to && !task.contributors.some(contri => contri.uid !== task.assigned_to)
                                            ? null
                                            : !task.assigned_to && task.contributors.length === 0 
                                            ? ( <span className='text-[12px]'>No contributors yet</span> )
                                            : 
                                              (
                                                <div className='flex space-x-2 items-center pt-[2px]'>
                                                  { task.assigned_to && <span className='text-[12px] text-black'>·</span> }    
                                                  {
                                                    !task.assigned_to && (
                                                      <span className='text-[12px]'>Contributors:</span>
                                                    )
                                                  }                                   
                                                  <TaskCollaborators collaborators={task.contributors} />
                                                </div> 
                                              )                       
                                          }
              

                                        </div>
                                        <div className='flex space-x-2'>
                                            <Tooltip 
                                              title="Copy Task ID" 
                                              arrow
                                              placement="left"                                 
                                              >
                                              <Copy20Regular 
                                                onClick={() => navigator.clipboard.writeText(task._id)}                                  
                                                className='w-5 h-5 cursor-pointer hover:text-blue-500 transition-colors duration-200 ease-in-out transform active:translate-y-[2px]'/>
                                            </Tooltip>

                                            <InformationOutline 
                                              onClick={() => handleOpenDialog(task._id)}
                                              className='w-5 h-5 cursor-pointer hover:text-blue-500 transition-colors duration-200 ease-in-out transform active:translate-y-[2px]' />

                                            <ArrowCircleDown48Regular 
                                              onClick={() => handleExpandClick(task._id)}                                          
                                              className='w-5 h-5 cursor-pointer mr-2 hover:text-blue-500 transition-colors duration-200' />                                      
                                        </div>

                                        <InfoDialog
                                              infoDialogOpen={openDialogs[task._id]}
                                              setInfoDialogOpen={() => handleCloseDialog(task._id)}
                                              description={task.task_description}
                                              goals={task.goals}
                                        />
                                    </div>
                            </div>
                            
                            <AccordionDetails >
                                <div className="flex justify-between  w-full h-[250px]">
                                    <div className='flex justify-between w-full p-1 h-full overflow-hidden'>
                                        {/*   <!-- Tarjeta de Detalles de Tarea --> */}                            

                                        <div className='flex space-x-3'>

                                            {/* <!-- Tarjeta de Comentarios --> */}
                                            <div className="flex flex-col bg-gray-50 shadow-lg p-4 rounded-lg space-y-3 border-[1px] border-gray-400">
                                                <h4 className="text-sm font-semibold flex items-center">Commits:</h4>
                                                <ul className="list-disc pl-5 max-h-[180px] overflow-y-auto">
                                                  {                                                
                                                    !task.commits_hashes || task.commits_hashes.length === 0
                                                    ? <li className="text-[12px]">No commits yet</li>
                                                    : task.commits_hashes.map((commit, index) => (
                                                      <li key={index} className="text-[12px] w-[120px]">
                                                        <span 
                                                          onClick={() => {
                                                            handleClose()
                                                            navigate(`commits/${commit}`, {
                                                              state: {
                                                                project,
                                                                layer,
                                                                repository,
                                                                commits: true,
                                                                commitHash: commit
                                                              }                                                        
                                                          })
                                                        }}                                              
                                                          className="truncate block w-full cursor-pointer hover:text-yellow-500 transition-colors duration-100"
                                                        >{commit}</span>
                                                      </li>
                                                    ))                                             
                                                  }
                                                </ul>
                                            </div>

                                            {/* <!-- Tarjeta de Comentarios --> */}
                                            <div className="flex flex-col bg-gray-50 shadow-lg p-4 rounded-lg space-y-3 border-[1px] border-gray-400">
                                                <h4 className="text-sm font-semibold flex items-center">
                                                  {
                                                    task.additional_info.notes.length === 0 
                                                    ? 'Goals:'
                                                    : 'Notes:'
                                                  }
                                                </h4>
                                                <ul className="list-disc pl-5 max-h-[180px] overflow-y-auto">
                                                {
                                                
                                                  task.additional_info.notes.length === 0 || task.status === 'pending'
                                                  ? task.goals.map((goal, index) => (
                                                    <li key={index} className="text-[12px] break-words max-w-[200px]">{goal}</li>
                                                  ))
                                                  : task.additional_info.notes.map((note, index) => (
                                                    <li key={index} className="text-[12px] break-words max-w-[200px]">{note}</li>
                                                  ))                                              
                                                }
                                                </ul>
                                            </div>

                                            {/* <!-- Tarjeta de Horas y Avatares --> */}
                                            <div className='flex flex-row space-x-4 '>
                                                <div className="bg-gray-50 shadow-lg p-4 rounded-lg border-[1px] border-gray-400">
                                                  <div className="text-[12px] font-semibold">Estimated Hours:</div>
                                                  <h6 className="text-[12px]">{task.additional_info.estimated_hours}h</h6>                                   
                                                  {
                                                      task.status !== 'pending' && (
                                                      <>
                                                        <div className="text-[12px] font-semibold mt-2">Actual Hours:</div>
                                                        <h6 className="text-[12px]">{task.additional_info.actual_hours}h</h6>
                                                      </>
                                                        
                                                      )           
                                                  }
                                                </div>

                                                <div className='flex flex-col bg-gray-50 shadow-lg p-4 rounded-lg border-[1px] border-gray-400'>                                 
                                                    <div className="text-sm font-semibold">Contributors:</div>
                                                    <div className="flex flex-wrap gap-1 max-w-[104px] max-h-[180px] overflow-y-auto mt-2">
                                                        {
                                                          task.contributors.length === 0 ?
                                                          <span className='text-[12px]'>No contributors yet</span>
                                                          : task.contributors.map((contributor, index) => (
                                                            <div key={index} className="flex items-center space-x-1">
                                                              <Avatar alt={contributor.username} src={contributor.photoUrl || contributor.username} sx={{ width: 15, height: 15 }} />
                                                            </div>
                                                          ))          
                                                        }
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