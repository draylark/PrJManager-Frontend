import { useState, useRef, useEffect, useMemo, memo } from 'react'
import { Icon } from '@ricons/utils';
import ArrowCircleDown48Regular from '@ricons/fluent/ArrowCircleDown48Regular'
import { CheckTwotone } from '@ricons/material'
import { TaskComplete, TaskView } from '@ricons/carbon'
import { IosClose } from '@ricons/ionicons4'
import { TextField, Autocomplete, Select, MenuItem, Accordion,  AccordionDetails, Dialog, DialogContent, DialogTitle, DialogActions, Button, Tooltip, Paper, ListItem, ListItemText, List } from '@mui/material';
import LoadingCircle from '../../../../auth/helpers/Loading';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Avatar } from '@mui/material';
import { MdLayers } from 'react-icons/md';
import { FaGitAlt  } from 'react-icons/fa';
import { tierS, tierA } from '../../../helpers/accessLevels-validator';
import { BeatLoader } from 'react-spinners';
import { InformationOutline } from '@ricons/ionicons5'
import { Copy20Regular } from '@ricons/fluent'


import { TaskCollaborators } from './TaskCollaborators';
import { set } from 'date-fns';


  export const RenderTasks = ({ projectLayers, projectRepositories, tasksCompleted, setTasksCompleted, wFApprovalTasks, setWFApprovalTasks, setRender, render }) => {

    const accordionRefs = useRef([]);
    const [expanded, setExpanded] = useState(null);


    const [layerInfo, setLayerInfo] = useState({});
    const [repoInfo, setRepoInfo] = useState({});
    const [layerID, setLayerID] = useState(null)
    const [repoID, setRepoID] = useState(null)

    const [response, setResponse] = useState([])
    const [taskHandled, setTaskHandled] = useState(false)
    const [taskToHandle, setTaskToHandle] = useState('')
    const [handlingTask, setHandlingTask] = useState(false)
    const [reasonsTextField, setReasonsTextField] = useState('')
    const [openDialog, setOpenDialog] = useState(false)

    const [openDialogs, setOpenDialogs] = useState({});

    const [isLoading, setIsLoading] = useState(true)
    const [layerFilter, setLayerFilter] = useState(null);
    const [repoFilter, setRepoFilter] = useState(null);
    const [userFilter, setUserFilter] = useState(null);
    const [statusTerm, setStatusTerm] = useState('completed');
    const [layerTerm, setLayerTerm] = useState(null);
    const [repoTerm, setRepoTerm] = useState(null);

    const { layers, repositories } = useSelector((state) => state.platypus );
    const { uid } = useSelector((state) => state.auth);


    const handleExpandClick = (taskId, layerID, repoID) => {
      const isExpanded = expanded === taskId;
      setExpanded(isExpanded ? null : taskId);
      setLayerID(isExpanded ? null : layerID)
      setRepoID(isExpanded ? null : repoID)

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


    const handleLayerAndRepoInformation = ( layerID, repoID ) => {

      setIsLoading(true)
      const layer = layers.filter( layer => layer._id === layerID )
      const repo = repositories.filter( repo => repo._id === repoID )
      const repoUrl = `http://localhost:3000/api/repos/${repoID}`
      const layerUrl = `http://localhost:3000/api/layer/get-layer/${layerID}`

      if( !layer[0] && !repo[0] ) {
        axios.all([
          axios.get( repoUrl, {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': localStorage.getItem('x-token')
              }
          }),
          axios.get( layerUrl, {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': localStorage.getItem('x-token')
              }
          })
        ])
        .then( axios.spread( ( repo, layer ) => {
            // console.log('Respuesta desde el thunk R:', repo)
            // console.log('Respuesta desde el thunk L:', layer)
            setRepoInfo(repo.data.repo)
            setLayerInfo(layer.data.layer)
            setIsLoading(false)
        }))
      } else if( layer[0] && !repo ) {
        axios.get( repoUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('x-token')
            }
        })
        .then( ( repo ) => {
            // console.log('Respuesta desde el thunk R:', repo)
            setRepoInfo(repo.data.repo)
            setLayerInfo(layer[0])
            setIsLoading(false)
        })
      } else if( !layer && repo[0] ) {
        axios.get( layerUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('x-token')
            }
        })
        .then( ( layer ) => {
            setLayerInfo(layer.data.layer)
            setRepoInfo(repo[0])
            setIsLoading(false)
        })
      } else {
        setLayerInfo(layer[0])
        setRepoInfo(repo[0])
        setIsLoading(false)
      } 
    };

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
            <div className='flex space-x-8 p-2'>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoDialogOpen(false)} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      )
    })

    const handleTask = async( taskId, approved, status, reasons ) => {
      const task = wFApprovalTasks.filter( task => task._id === taskId )[0]
      setHandlingTask(taskId)

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
          // console.log(res)
          setResponse([ res.data.success, res.data.message ])
          setTaskToHandle('')

          setTimeout(() => {
                setHandlingTask('')
                setTaskHandled(taskId) 
          }, 2000);

          setTimeout(() => {
            setWFApprovalTasks(wFApprovalTasks.filter( task => task._id !== taskId))
            if( res.data.type === 'task-approved' ) {
              const { status: oldStatus, ...rest } = task
              setTasksCompleted([ { status, ...rest }, ...tasksCompleted ])
            }
          }, 5000);       
        })
        .catch( err => {
          // console.log(err)     
          setResponse([ err.response.data.success, err.response.data.message ])
          setTaskToHandle('')

          setTimeout(() => {
                setHandlingTask('')
                setTaskHandled(taskId) 
          }, 2000);
        })
    }

    const filteredTasks = useMemo(() => {
      // Implementa tu lógica de filtrado aquí, basada en los estados de filtros
      // Por ejemplo:
      const filterTasks = (tasks) => tasks.filter(task => {
          // Verificar filtro de capa
          const layerPasses = layerFilter ? task.layer_related_id === layerFilter : true;
          // Verificar filtro de repositorio
          const repoPasses = repoFilter ? task.repository_related_id === repoFilter : true;
          // Verificar filtro de usuario
          const userPasses = userFilter ? task.collaboratorsIds.includes(userFilter) : true;
        // Añade otras condiciones de filtrado aquí
        return layerPasses && repoPasses && userPasses;
      });

      switch (statusTerm) {
        case 'completed':
          return filterTasks(tasksCompleted);
        case 'approval':
          return filterTasks(wFApprovalTasks);
        default:
          return [...tasksCompleted, ...wFApprovalTasks];
      }
    }, [tasksCompleted, wFApprovalTasks, layerFilter, repoFilter, userFilter, statusTerm]); // Dependencias para re-calcular cuando sea necesario


    useEffect(() => {
      if (expanded) {
        handleLayerAndRepoInformation(layerID, repoID)
      }
    }, [expanded, layerID, repoID ])
    

    return (
          <div className="flex flex-col  flex-grow px-7 h-full overflow-y-auto">
            <div className='flex justify-between h-[70px]'>
                <div className='flex space-x-4 items-center h-full'>
                    <Select       
                      size="small" // Ajusta el tamaño
                      value={statusTerm}
                      onChange={(event) => setStatusTerm(event.target.value)}
                      sx={{ width: 140 }} // Ajusta el ancho mediante estilos
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
                      <MenuItem value="approval">Waiting for approval</MenuItem>
                    </Select>


                    <Autocomplete
                      size="small" // Ajusta el tamaño
                      options={projectLayers}
                      getOptionLabel={(option) => option.label}
                      onChange={(event, value) => {
                        setLayerFilter(value?.value || value)
                        setLayerTerm(value?.label || value)
                      }}
                      renderInput={(params) => <TextField {...params} label="Layer" />}
                      onInputChange={(event, newInputValue, reason) => {
                        if (reason !== 'reset') {
                          setLayerFilter(newInputValue);
                          setLayerTerm(newInputValue);
                        }
                      }}
                      inputValue={ layerTerm || '' }
                      sx={{ width: 120 }} // Ajusta el ancho mediante estilos
                    />

                    {/* Filtro por usuario */}
                    <Autocomplete
                      size="small" // Ajusta el tamaño
                      options={projectRepositories}
                      getOptionLabel={(option) => option.label}
                      onChange={(event, value) => {
                        setRepoFilter(value?.value || value)
                        setRepoTerm(value?.label || value)
                      
                      }}
                      onInputChange={(event, newInputValue, reason) => {
                        if (reason !== 'reset') {
                          setRepoFilter(newInputValue);
                          setRepoTerm(newInputValue);
                        }
                      }}
                      inputValue={ repoTerm || '' }
                      renderInput={(params) => <TextField {...params} label="Repository" />}
                      sx={{ width: 140 }} // Ajusta el ancho mediante estilos
                    />

                    <TextField
                      size="small" // Ajusta el tamaño
                      label="User ID"         
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value)}                     
                      sx={{ width: 120 }} // Ajusta el ancho mediante estilos
                    />

    
                </div>

                  <div className='flex h-full items-center'>
                    <Select       
                      size="small" // Ajusta el tamaño
                      value={render}
                      onChange={(event) => setRender(event.target.value)}
                      sx={{ width: 140 }} // Ajusta el ancho mediante estilos
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
                      <MenuItem value="tasks">Tasks</MenuItem>
                      <MenuItem value="commits">Commits</MenuItem>
                    </Select>
                  </div>
            </div>

            <div  id='container-scroll' className='flex flex-col space-y-4 pb-6 flex-grow  max-h-[625px] overflow-y-auto '>
                {             
                  filteredTasks.length === 0 
                  ?
                    <div className="flex flex-col items-center mt-2 border-t-[1px]  border-gray-400  w-full h-full">
                         <h1 className="text-xl mt-[22%] text-gray-400">No Data Available</h1>                  
                    </div>
                  :
                    filteredTasks.map((task, index) => (
                      
                        <Accordion 
                          key={task._id} 
                          expanded={expanded === task._id}                                                             
                          ref={(el) => accordionRefs.current[task._id] = el}
                        >
                            <div className='flex w-full'>
                                <div key={index} className="w-full p-4 rounded shadow-lg bg-white hover:bg-gray-100 transition-colors border-[1px] border-blue-500">
                                      <div className='flex justify-between w-full'>
                                          <h3 className="text-lg font-bold text-blue-600">{task.task_name}</h3>  

                                          <div className='flex space-x-4'>

                                                {
                                                  task.status === 'approval' 
                                                  && (
                                                    <div className='flex items-center justify-center space-x-1 rounded-extra'>
                                                      {
                                                        handlingTask === task._id 
                                                        ?     <div className='sweet-loading'>
                                                                <BeatLoader color="#bbdefb" loading={true} size={10} />
                                                              </div>
                                                        : 
                                                        taskHandled === task._id
                                                        ? <span className={`${response[0] === true ? 'text-green-500' : 'text-red-500'} text-sm font-semibold`}>{response[1]}</span>
                                                        : (
                                                            <>
                                                              <button 
                                                                onClick={() => {
                                                                  setOpenDialog(true)
                                                                  setTaskToHandle(task._id)
                                                                }}
                                                                className='flex justify-center items-center w-[55px] bg-red-300 hover:bg-red-500 transition-colors duration-100 h-full rounded-l-extra font-semibold border-[1px] border-black'>
                                                                <IosClose className="w-7 h-7" />
                                                                
                                                              </button>
                                                              <button
                                                                onClick={() => handleTask(task._id, true, 'completed')} 
                                                                className='flex justify-center items-center w-[55px] bg-blue-300 hover:bg-blue-500 transition-colors duration-100 h-full rounded-r-extra font-semibold border-[1px] border-black'>                                                   
                                                                <CheckTwotone className="w-5 h-5" />
                                                              </button>
                                                            </>
                                                          )
                                                      }
                                                    </div>
                                                  )
                                                }

                                                <div className={`${ task.status === 'completed' ? 'bg-blue-500 text-white' : 'bg-yellow-200'} rounded-full px-3 py-1 text-sm font-semibold text-black ml-2`}> 
                                                    <Icon size={24}>
                                                      {
                                                        task.status === 'completed' 
                                                        ? <TaskComplete />
                                                        : <TaskView />
                                                      }
                                                    </Icon>
                                                </div>

                                            </div>                                            
                                      </div>


                                      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                                        <DialogTitle>Provide at least one reason to reject the task</DialogTitle>
                                        <DialogContent>
                                          <div className='p-4'>
                                            <TextField
                                              size="small"
                                              label="Reason"
                                              variant="outlined"
                                              value={reasonsTextField}
                                              onChange={(e) => setReasonsTextField(e.target.value)}                                                              
                                              fullWidth
                                              multiline
                                              rows={4}
                                              placeholder="Provide at least one reason to reject the task"
                                            />
                                          </div>
                                        </DialogContent>
                                        <DialogActions>
                                          <Button onClick={() => {
                                            setOpenDialog(false)
                                          }}
                                          >Cancel</Button>
                                          
                                          <Button onClick={() =>{
                                            setOpenDialog(false)
                                            handleTask(taskToHandle, false, 'pending', [ reasonsTextField ])                                              
                                          }} disabled={ reasonsTextField.length === 0 }>Send</Button>            
                                        </DialogActions>
                                      </Dialog>
                                          
                                      <p className="text-[14px] text-gray-700 line-clamp-2 w-[82%]">{task.task_description}</p>

                                      <div className="mt-2">
                                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#{task.layer_number_task}</span>  
                                        <span className={`inline-block ${ task.type === 'open' ? 'bg-pink-100 text-gray-700' : 'bg-black text-white'} rounded-full  px-3 py-1 text-[13px] font-semibold mr-2`}>{task.type}</span>                   
                                        <span className="inline-block bg-yellow-300 rounded-full px-3 py-1 text-sm font-semibold text-black mr-2">Commits: { task.commits_hashes.length }</span>
                                        <span className={`inline-block ${ task.status ==='completed' ? 'bg-blue-500 text-white' : 'bg-yellow-200 text-black' } rounded-full px-3 py-1 text-sm font-semibold  mr-2`}> {
                                          task.status === 'completed' 
                                          ? 'Completed'
                                          : 'Waiting for Approval'            
                                        } </span>
                                      </div>

                                      <div className="flex justify-between mt-2">
                                            <div className='flex space-x-2'>
                                                {
                                                    task.assigned_to && (
                                                    task.contributors.filter( contributor => contributor.uid === task.assigned_to).map((collaborator, index) => (
                                                        <div key={index} className="flex items-center space-x-2 mt-[1px]">
                                                        <Avatar alt={collaborator.username} src={collaborator.photoUrl || collaborator.username} sx={{ width: 20, height: 20 }} />
                                                        <span className='text-[14px]'>{collaborator.username}</span>
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
                                                        { task.assigned_to && <span className='text-[15px] text-black'>·</span> }                                                  
                                                        {
                                                          !task.assigned_to && (
                                                            <span className='text-sm'>Contributors:</span>
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
                                                  onClick={() => handleExpandClick(task._id, task.layer_related_id, task.repository_related_id)}                                                                        
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
                            </div>
                          <AccordionDetails >
                            <div className="flex justify-between mt-2 w-full h-[250px]">  
                                {
                                    isLoading 
                                    ? <LoadingCircle /> 
                                    :   <div className='flex justify-between w-full p-2 h-full overflow-hidden'>
                                            {/*   <!-- Tarjeta de Detalles de Tarea --> */}
                                        
                                            <div className='flex flex-col p-2 px-8 rounded-lg space-y-6 '>
                                                <div className='flex flex-col'>
                                                    <h2 className='font-bold text-2xl text-blue-600 flex items-center'> Task Details</h2>
                                                    <h3 className='text-sm ml-1'>{task._id}</h3>
                                                </div>

                                                <div className="flex flex-col ">
                                                    <div className="flex space-x-2 items-center "><MdLayers /> <span className='text-lg font-semibold'>{ layerInfo.name}</span> </div>
                                                    <div className="text-[13px] ml-6">{layerInfo._id} </div>
                                                    <div> </div>
                                                </div>

                                                <div className="flex flex-col ">
                                                    <div className="flex space-x-2 items-center "><FaGitAlt /> <span className='text-lg font-semibold'>{repoInfo.name }</span> </div>
                                                    <div className="text-[13px] ml-6">{repoInfo._id}</div>
                                                </div>
                                            </div>


                                            <div className='flex flex-grow space-x-6 justify-center'>

                                                {/* <!-- Tarjeta de Comentarios --> */}
                                                <div className="flex flex-col bg-gray-50 shadow-lg p-4 w-[200px] rounded-lg space-y-3 border-[1px] border-gray-400">
                                                    <div className="text-sm font-semibold flex items-center"> Commits:</div>
                                                    <ul className="list-disc pl-5 max-h-[180px] overflow-y-auto">
                                                      {                                                
                                                        task.commits_hashes.length === 0
                                                        ? <li className="text-sm">No commits yet</li>
                                                        : task.commits_hashes.map((commit, index) => (
                                                          <li key={index} className="text-sm w-[140px]">
                                                            <span className="truncate block w-full cursor-pointer hover:text-yellow-500 transition-colors duration-100">{commit}</span>
                                                          </li>
                                                        ))                                             
                                                      }
                                                    </ul>
                                                </div>

                                                {/* <!-- Tarjeta de Comentarios --> */}
                                                <div className="flex flex-col bg-gray-50 shadow-lg p-4 w-[200px] rounded-lg space-y-3 border-[1px] border-gray-400">
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
                                                      <li key={index} className="text-sm break-words max-w-[200px]">{goal}</li>
                                                    ))
                                                    : task.additional_info.notes.map((note, index) => (
                                                      <li key={index} className="text-sm break-words max-w-[200px]">{note}</li>
                                                    ))                                              
                                                  }
                                                  </ul>
                                                </div>

                                                {/* <!-- Tarjeta de Horas y Avatares --> */}
                                                <div className='flex flex-row space-x-4 '>
                                                <div className="bg-gray-50 shadow-lg p-4 rounded-lg w-[150px] border-[1px] border-gray-400">
                                                  <div className="text-sm font-semibold">Estimated Hours:</div>
                                                  <h6 className="text-sm">{task.additional_info.estimated_hours}h</h6>                                   
                                                  {
                                                      task.status !== 'pending' && (
                                                      <>
                                                        <div className="text-sm font-semibold mt-2">Actual Hours:</div>
                                                        <h6 className="text-sm">{task.additional_info.actual_hours}h</h6>
                                                      </>                                  
                                                      )           
                                                  }
                                                </div>

                                                <div className='bg-gray-50 shadow-lg p-4  pr-8 w-[150px] rounded-lg flex flex-col border-[1px] border-gray-400'>
                                                    <div className="text-sm font-semibold">Contributors:</div>
                                                    <div className="flex flex-wrap gap-1 max-w-[104px] max-h-[180px] overflow-y-auto mt-2">
                                                    {task.contributors.map((collaborator, index) => (
                                                        <Avatar key={index} alt={ collaborator.username } src={ collaborator.photoUrl || collaborator.username } sx={{ width: 20, height: 20 }} />
                                                    ))}
                                                    </div>
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                }                                                
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      ))
                }
            </div>
          </div>

    );
  };