
import { useState, useRef, useEffect, useMemo } from 'react'
import { Icon } from '@ricons/utils';
import ArrowCircleDown48Regular from '@ricons/fluent/ArrowCircleDown48Regular'
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { TaskComplete, TaskView } from '@ricons/carbon'
import { TextField, Autocomplete, Select, MenuItem } from '@mui/material';
import LoadingCircle from '../../../../../auth/helpers/Loading';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Avatar, ListItemAvatar } from '@mui/material';
import { MdLayers } from 'react-icons/md';
import { FaGitAlt, FaExternalLinkAlt  } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { set } from 'date-fns';

export const useRenderActivity = () => {

    const { layers, repositories } = useSelector((state) => state.platypus )
    const location = useLocation()
    const projectID = location.state?.projectId

    const [projectLayers, setProjectLayers] = useState([])
    const [projectRepositories, setProjectRepositories] = useState([])
  
    useEffect(() => {
        setProjectLayers(layers.filter(layer => layer.project === projectID).map(layer => ({
          label: layer.name,
          value: layer._id
        })));
      
        setProjectRepositories(repositories.filter(repo => repo.projectID === projectID).map(repo => ({
          label: repo.name,
          value: repo._id
        })));
    }, [ layers, repositories, projectID ])
    

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
                width: 20, 
                height: 20,
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

    const RenderTasks = ({ tasksCompletedData, wFApprovalTasksData, setRender, render }) => {
      const accordionRefs = useRef([]);
      const [expanded, setExpanded] = useState(false);

      const [layerInfo, setLayerInfo] = useState({});
      const [repoInfo, setRepoInfo] = useState({});
      // Estados para almacenar los datos ya procesados
      const [tasksCompleted, setTasksCompleted] = useState([]);
      const [wFApprovalTasks, setWFApprovalTasks] = useState([]);
      const [isLoading, setIsLoading] = useState(true);

      // Suponiendo que estos estados vienen de algún contexto o prop
      const [layerFilter, setLayerFilter] = useState(null);
      const [repoFilter, setRepoFilter] = useState(null);
      const [userFilter, setUserFilter] = useState(null);
      const [statusTerm, setStatusTerm] = useState('completed');
      const [layerTerm, setLayerTerm] = useState(null);
      const [repoTerm, setRepoTerm] = useState(null);


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

      const handleLayerAndRepoInformation = ( layerID, repoID ) => {
        setIsLoading(true)

        const layer = layers.filter( layer => layer._id === layerID )
        const repo = repositories.filter( repo => repo._id === repoID )

        setLayerInfo(layer[0])
        setRepoInfo(repo[0])
        setIsLoading(false)
      };

      const fetchCollaborators = async ( collaborators ) => {
        try {
          const response = await axios.post(`http://localhost:3000/api/users?limit=${collaborators.length}`, { IDS: collaborators });
          console.log(response)
          return response.data.users 
        } catch (error) {
          console.error("Error fetching collaborators:", error);
        }
      };

  // useMemo para filtrar datos basados en los filtros sin llamar a la API
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
        const fetchAndSetData = async () => {
          setIsLoading(true);
          try {
            const tasksWithCollaborators = await Promise.all(tasksCompletedData.map(async (task) => {
              const collaborators = await fetchCollaborators(task.collaboratorsIds);
              const { completedBy, ...rest } = task;
              return { ...rest, completedBy: collaborators };
            }));
            
            const wFTasksWithCollaborators = await Promise.all(wFApprovalTasksData.map(async (task) => {
              const collaborators = await fetchCollaborators(task.collaboratorsIds);
              const { completedBy, ...rest } = task;
              return { ...rest, completedBy: collaborators };
            }));

            console.log(tasksWithCollaborators)
            console.log(wFTasksWithCollaborators)

            setTasksCompleted(tasksWithCollaborators);
            setWFApprovalTasks(wFTasksWithCollaborators);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
          setIsLoading(false);
        };

        fetchAndSetData();
      }, []); // Dependencias vacías para asegurar que solo se ejecute en el montaje

      if( isLoading ) return <LoadingCircle />;

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

              <div  id='container-scroll' className='flex flex-col space-y-4 pb-6 flex-grow  max-h-[575px] overflow-y-auto'>
                  {             
                    filteredTasks.length === 0 
                    ?
                      <div className="flex flex-col items-center mt-7 border-t-[1px]  border-gray-400  w-full h-full">
                           <h1 className="text-xl mt-[22%] text-gray-400">No matches found</h1>                  
                      </div>
                    :
                      filteredTasks.map((task, index) => (
                          <Accordion 
                            key={task.task_id} 
                            expanded={expanded === task.task_id}
                            onChange={() => handleExpandClick(task.task_id)}
                            ref={(el) => accordionRefs.current[task.task_id] = el}
                          >
                              <div className='flex w-full'>
                                  <div key={index} className="w-full p-4 rounded shadow-lg bg-white hover:bg-gray-100 transition-colors border-[1px] border-blue-500">
                                        <div className='flex justify-between w-full'>
                                            <h3 className="text-lg font-bold text-blue-600">{task.task_name}</h3>
                                            <div className={`${ task.status === 'completed' ? 'bg-green-200' : 'bg-yellow-200'} rounded-full px-3 py-1 text-sm font-semibold text-black ml-2`}> 
                                                <Icon size={24}>
                                                  {
                                                    task.status === 'completed' 
                                                    ? <TaskComplete />
                                                    : <TaskView />
                                                  }
                                                </Icon>
                                            </div>
                                        </div>
                                            
                                        <p className="text-sm text-gray-700">{task.task_description}</p>

                                        <div className="mt-2">
                                          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#{task.layer_number_task}</span>                 
                                          <span className="inline-block bg-yellow-200 rounded-full px-3 py-1 text-sm font-semibold text-black mr-2">Commits: { task.commits_hashes.length }</span>
                                          <span className={`inline-block ${ task.status ==='completed' ? 'bg-blue-400 text-white' : 'bg-yellow-200 text-black' } rounded-full px-3 py-1 text-sm font-semibold  mr-2`}> {
                                            task.status === 'completed' 
                                            ? 'Completed'
                                            : 'Waiting for Approval'            
                                          } </span>
                                        </div>

                                        <div className="flex justify-between mt-2">
                                          <div className='flex space-x-2'>
                                              <span>Completed By:</span>
                                              <TaskCollaborators collaborators={task.completedBy} />
                                          </div>
                                          <button 
                                            onClick={() => {
                                              handleExpandClick(task.task_id)
                                              handleLayerAndRepoInformation(task.layer_related_id, task.repository_related_id)
                                            }}
                                            className="mr-3">
                                            <Icon size={24}><ArrowCircleDown48Regular /></Icon>
                                          </button>
                                        </div>
                                  </div>
                              </div>
                            <AccordionDetails >
                              <div className="flex justify-between mt-2 w-full h-[250px]">
                                  {
                                      isLoading 
                                      ? <LoadingCircle />
                                      : 
                                        <div className='flex justify-between w-full p-2 h-full overflow-hidden'>
                                            {/*   <!-- Tarjeta de Detalles de Tarea --> */}
                                        
                                            <div className='flex flex-col  p-2 rounded-lg space-y-6'>
                                              <div className='flex flex-col'>
                                                <h2 className='font-bold text-2xl text-blue-600 flex items-center'> Task Details</h2>
                                                <h3 className='text-sm ml-1'>{task.task_id}</h3>
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


                                            <div className='flex space-x-3'>

                                                {/* <!-- Tarjeta de Comentarios --> */}
                                                <div className="flex flex-col bg-gray-50 shadow-lg p-4 rounded-lg space-y-3 border-[1px] border-gray-400">
                                                  <div className="text-sm font-semibold flex items-center"> Commits:</div>
                                                  <ul className="list-disc pl-5 max-h-[180px] overflow-y-auto">
                                                    {task.commits_hashes.map((comment, index) => (
                                                      <li key={index} className="text-sm">{comment}</li>
                                                    ))}
                                                  </ul>
                                                </div>

                                                {/* <!-- Tarjeta de Comentarios --> */}
                                                <div className="flex flex-col bg-gray-50 shadow-lg p-4 rounded-lg space-y-3 border-[1px] border-gray-400">
                                                  <div className="text-sm font-semibold flex items-center"> Notes:</div>
                                                  <ul className="list-disc pl-5 max-h-[180px] overflow-y-auto">
                                                    {task.additional_info.notes.map((note, index) => (
                                                      <li key={index} className="text-sm break-words max-w-[200px]">{note}</li>
                                                    ))}
                                                  </ul>
                                                </div>

                                                {/* <!-- Tarjeta de Horas y Avatares --> */}
                                                <div className='flex flex-row space-x-4 '>
                                                  <div className="bg-gray-50 shadow-lg p-4 rounded-lg border-[1px] border-gray-400">
                                                    <div className="text-sm font-semibold">Estimated Hours:</div>
                                                    <div className="text-md">{task.additional_info.estimated_hours}h</div>
                                                    <div className="text-sm font-semibold mt-2">Actual Hours:</div>
                                                    <div className="text-md">{task.additional_info.actual_hours}h</div>
                                                  </div>

                                                  <div className='bg-gray-50 shadow-lg p-4 rounded-lg flex flex-col border-[1px] border-gray-400'>
                                                    <div className="text-sm font-semibold">Completed By:</div>
                                                    <div className="flex flex-wrap gap-1 max-w-[104px] max-h-[180px] overflow-y-auto mt-2">
                                                      {task.completedBy.map((collaborator, index) => (
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

    const RenderCommits = ({ commitsData, setRender, render }) => {
      const accordionRefs = useRef([]);
      const [expanded, setExpanded] = useState(false);

      const [layerInfo, setLayerInfo] = useState({});
      const [repoInfo, setRepoInfo] = useState({});
      // Estados para almacenar los datos ya procesados
      const [tasksCompleted, setTasksCompleted] = useState([]);
      const [wFApprovalTasks, setWFApprovalTasks] = useState([]);
      const [isLoading, setIsLoading] = useState(true);

      // Suponiendo que estos estados vienen de algún contexto o prop
      const [hashFilter, setHashFilter] = useState(null)
      const [layerFilter, setLayerFilter] = useState(null);
      const [repoFilter, setRepoFilter] = useState('');
      const [userFilter, setUserFilter] = useState(null);
      const [statusTerm, setStatusTerm] = useState('completed');
      const [layerTerm, setLayerTerm] = useState(null);
      const [repoTerm, setRepoTerm] = useState(null);


      const [commits, setCommits] = useState(null)

      const handleExpandClick = (commitHash) => {
        const isExpanded = expanded === commitHash;
        setExpanded(isExpanded ? false : commitHash);
    
        if (!isExpanded) {
          // Esperar al próximo ciclo del evento para asegurar que la expansión se ha completado antes de desplazarse
          setTimeout(() => {
            const accordionElement = accordionRefs.current[commitHash];
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

        setLayerInfo(layer[0])
        setRepoInfo(repo[0])
        setIsLoading(false)
      };


      const fetchAuthorData = async (authorID) => {
          try {
            const response = await axios.get(`http://localhost:3000/api/users/${authorID}`);
            return response.data.user;
          } catch (error) {
            console.error("Error fetching author data:", error);
          }  
      }

      const filteredCommits = useMemo(() => {

        if (!commits) return [];

        const filterCommits = (commits) => commits.filter(commit => {
          // Verificar filtro de capa
          const layerPasses = layerFilter ? commit.layer_related_id === layerFilter : true;
          // Verificar filtro de repositorio
          const repoPasses = repoFilter ? commit.repository_related_id === repoFilter : true;
          // Verificar filtro de usuario
          const userPasses = userFilter ? commit.commit_author._id === userFilter : true;

          const hashPasses = hashFilter ? commit.commit_hash === hashFilter : true;
          // Añade otras condiciones de filtrado aquí
          return layerPasses && repoPasses && userPasses && hashPasses;
        });

        return filterCommits(commits);

      }, [commits, layerFilter, repoFilter, userFilter, statusTerm, layerTerm, repoTerm, hashFilter]);

      useEffect(() => {
        const reorganizeCommitData = async () => {
          const commits = await Promise.all(commitsData.map(async (commit) => {
            const { commit_author, ...rest } = commit
            const authorData = await fetchAuthorData(commit_author);
            return { 
                ...rest, 
                commit_author: { 
                  _id: authorData.uid,
                  photoUrl: authorData.photoUrl,
                  username: authorData.username 
                } 
            };
          }));
          setCommits(commits);
          setIsLoading(false)
        };

        setIsLoading(true)
        reorganizeCommitData();
      }, [])


      if( isLoading ) return <LoadingCircle />;
      
      return (
            <div className="flex flex-col  flex-grow px-7 h-full overflow-y-auto">
                <div className='flex justify-between h-[70px]'>
                    <div className='flex space-x-4 items-center h-full'>

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

                        <TextField
                          size="small" // Ajusta el tamaño
                          label="Hash"         
                          value={hashFilter}
                          onChange={(e) => setHashFilter(e.target.value)}                     
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


                <div  id='container-scroll' className='flex flex-col space-y-4 pb-6 flex-grow  max-h-[575px] overflow-y-auto'>
                      {
                        filteredCommits.length === 0 
                        ?
                          <div className="flex flex-col items-center mt-7 border-t-[1px]  border-gray-400  w-full h-full">
                              <h1 className="text-xl mt-[22%] text-gray-400">No matches found</h1>                  
                          </div>
                        :
                          filteredCommits.map((commit, index) => (
                            <Accordion 
                            key={commit.commit_hash} 
                            expanded={expanded === commit.commit_hash}
                            onChange={() => setExpanded(expanded === commit.commit_hash ? false : commit.commit_hash)}
                            ref={(el) => accordionRefs.current[commit.commit_hash] = el}
                          >
                              <div className="flex w-full p-4 rounded shadow-lg  bg-white hover:bg-gray-100 transition-colors border-[1px] border-yellow-300">
                                  <div className="flex flex-col justify-between w-full">
                                      {/* Encabezado con hash y mensaje del commit */}
                                      <div className='flex flex-col'>
                                        <div className='flex justify-between'>
                                          <h3 className="text-sm font-semibold text-yellow-600 truncate" title={commit.commit_hash}>{commit.commit_hash}</h3>
                                          <span className='text-gray-600 text-sm'>Committed on {new Date(commit.createdAt).toLocaleDateString()}</span>
                                        </div>

                                        <h2 className="text-lg font-bold text-gray-800">{commit.commit_message}</h2>
                                      </div>
                                      
                                      {/* Información del autor del commit */}
                                      <div className="flex justify-between">
                                        <div className='flex items-center mt-2'>
                                          <Avatar alt={commit.commit_author.username} src={commit.commit_author.photoUrl || commit.commit_author.username} sx={{ width: 24, height: 24 }} />
                                          <span className="ml-2 text-sm text-gray-600">{commit.commit_author.username}</span>
                                        </div>

                                        <button 
                                          onClick={() => {
                                            handleExpandClick(commit.commit_hash)
                                            handleLayerAndRepoInformation(commit.layer_related_id, commit.repository_related_id)
                                          }}
                                          className="mr-3">
                                          <Icon size={24}><ArrowCircleDown48Regular /></Icon>
                                        </button>

                                      </div>
                                  </div>
                              </div>
                              <AccordionDetails >
                              {                                                      
                                isLoading 
                                ? <LoadingCircle />
                                :                                     
                                  <div className='flex p-4 justify-between rounded-lg'>
                                    {/* Detalle de Commit */}
         
                                      <div className='flex flex-col space-y-4 '>
                                        <div className='flex flex-col'>
                                            <h4 className="font-bold text-xl text-yellow-600">Commit Details</h4>
                                            <p className="text-sm text-gray-800">{commit.commit_hash}</p>
                                        </div>
                                        <div className='flex flex-col'>
                                            <h4 className="text-sm font-bold">Commit Message</h4>
                                            <p className="text-sm max-w-[300px] max-h-[40px] overflow-y-auto break-words text-gray-800">"{commit.commit_message}"</p>
                                        </div>
                                      </div>
                  

                                    {/* Información de la Capa y el Repositorio */}
                
                                      <div className="flex flex-col">
                                        <h5 className="text-md font-semibold">Layer Information</h5>
                                        <p className="text-sm">{layerInfo?.name || 'Layer name not available'}</p>
                                        <p className="text-xs text-gray-600">{layerInfo?._id || 'ID not available'}</p>
                                      </div>

                                      
                                      <div className="flex flex-col">
                                        <h5 className="text-md font-semibold">Repository Information</h5>
                                        <p className="text-sm">{repoInfo?.name || 'Repository name not available'}</p>
                                        <p className="text-xs text-gray-600">{repoInfo?._id || 'ID not available'}</p>
                                      </div>


                                    {/* Información del Autor del Commit */}
                                    <div className="flex flex-col space-y-2">
                                      <h5 className="text-md font-semibold">Committed By</h5>
                                      <div className="flex items-center">
                                        <Avatar alt={commit.commit_author.username} src={commit.commit_author.photoUrl || commit.commit_author.username} sx={{ width: 24, height: 24 }} />
                                        <span className="ml-2 text-sm text-gray-700">{commit.commit_author.username}</span>
                                      </div>
                                    </div>

                                    {/* Sección para Tarea Asociada, si aplica */} 
                                      <div className="flex flex-col space-y-2">
                                        <h5 className="text-md font-semibold">Associated Task</h5>
                                        <p className="text-sm">{commit?.task_id || 'No associated Task'}</p>
                                        {/* Aquí puedes añadir más detalles sobre la tarea si están disponibles */}
                                      </div>                         
                                  </div>
                              }
                              </AccordionDetails>
                          </Accordion>
                        ))
                      }
                </div>

            </div>
      )

    }


  return {
    RenderTasks,
    RenderCommits
  }

}
