import { useState, useEffect } from 'react';
import { useFormik, Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, List, ListItem, ListItemText, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Autocomplete, Typography, Tooltip } from '@mui/material';
import { LiaHandsHelpingSolid } from "react-icons/lia";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ImCancelCircle } from "react-icons/im";
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar'
import { LiaQuestionCircleSolid } from "react-icons/lia";
import axios from 'axios';
import LoadingCircle from '../../../../auth/helpers/Loading';
import { useGlobalUsersSearcher } from './hooks/useGlobalUsersSearcher';
import Partnership from '@ricons/carbon/Partnership';
import RemoveCircleOutlineOutlined from '@ricons/material/RemoveCircleOutlineOutlined'
import Swal from 'sweetalert2';
import modalbg from './assets/formbg.jpg'
import { PuffLoader  } from 'react-spinners';

export const LayerCollaboratorsForm = ({ setIsLayerCollaboratorsFormOpen, isLayerCollaboratorsFormOpen }) => {
    
    const location = useLocation();
    const dispatch = useDispatch();
    const { uid } = useSelector((stateU) => stateU.auth); 
    const { layers, repositories } = useSelector((stateP) => stateP.platypus);
    const { users, setSearch} = useGlobalUsersSearcher()

    const { layerID } = location.state.layer;
    const { ID } = location.state.project;


    const [deleteCDialog, setDeleteCDialog] = useState(false)
    const [currentCollaborators, setCurrentCollaborators] = useState([])   

    const [selectedUser, setSelectedUser] = useState({
      name: '',
      accessLevel: '',
      id: ''
    })



    const [accessLevel, setAccessLevel] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    const [fetchingCollaborators, setFetchingCollaborators] = useState(false)
    const [currentOrNew, setCurrentOrNew] = useState(false)
    const [tooltipOpen, setTooltipOpen] = useState('');
    const [tooltipContent, setTooltipContent] = useState('');
    const [openDialog, setOpenDialog] = useState(false)
    const [buttonDisabled, setButtonDisabled] = useState(false)



    const [searchQuery, setSearchQuery] = useState("");



    const handleDeleteNewCollaborator = (values, setFieldValue, id) => {
      const updateLayerCollaborators = values.collaborators.filter(collaborator => collaborator.id !== id);
      const updatedNewCollaborators = values.newCollaborators.filter(collaborator => collaborator.id !== id);

      setFieldValue('newCollaborators', updatedNewCollaborators);
      setFieldValue('collaborators', updateLayerCollaborators);
    };
    const addUserAsCollaborator = (values, setFieldValue) => {
      const newCollaborator = { ...selectedUser, accessLevel };
    
      // Filtrar cualquier posible duplicado basado en el 'id'.
      const noDuplicates = values.newCollaborators.filter(collaborator => collaborator.id !== newCollaborator.id);
    
      // Añadir el nuevo colaborador a la lista filtrada.
      const updatedCollaborators = [newCollaborator, ...noDuplicates];
    
      setFieldValue('newCollaborators', updatedCollaborators);
    
      setOpenDialog(false);
      setAccessLevel('');
    };
    const handleAddNewCollaborators = (values, setFieldValue) => {
      // Obtener los IDs de los nuevos colaboradores.
      const newCollaboratorIds = new Set(values.newCollaborators.map(collab => collab.id));
  
      // Combina los nuevos colaboradores con los existentes, filtrando duplicados.
      let combinedCollaborators = [...values.newCollaborators, ...values.collaborators];
  
      // Filtrar colaboradores que no estén en la lista de nuevos colaboradores (basado en el ID).
      // Esto asegura que si un colaborador fue añadido y luego eliminado, no aparezca en el arreglo final.
      combinedCollaborators = combinedCollaborators.filter(collab => newCollaboratorIds.has(collab.id) || values.collaborators.some(existingCollab => existingCollab.id === collab.id));
  
      // Elimina duplicados y mantiene el orden de inserción
      const uniqueCollaborators = Array.from(new Map(combinedCollaborators.map(collab => [collab.id, collab])).values());
  
      // Actualiza 'layerCollaborators' con la lista combinada y única.
      setFieldValue('collaborators', uniqueCollaborators);
  
      setCurrentOrNew(false); // Cambia la vista si es necesario.
    };

    const handleMouseEnter = (text, type) => {
      setTooltipContent(text);
      setTooltipOpen(type);
    };
    const handleMouseLeave = () => {
      setTooltipOpen('');
    };
    const handleClose = () => {
      const modal = document.getElementById('layerCollaboratorModal');
      if (modal) {
          // Inicia la transición de opacidad a 0
          modal.classList.replace('opacity-100', 'opacity-0');

          // Espera a que la animación termine antes de ocultar el modal completamente
          setTimeout(() => {
            setIsLayerCollaboratorsFormOpen(false);
          }, 500); // Asume que la duración de tu transición es de 500ms
      }
    };
    const IsTheButtonDisabled = ({ values }) => {
      useEffect(() => {
          const isDisabled = 
            values.newCollaborators.length === 0 
            && values.modifiedCollaborators.length === 0
            && values.deletedCollaborators.length === 0;
          setButtonDisabled(isDisabled);
      }, [ values ]);
      
      // Utiliza buttonDisabled para cualquier lógica relacionada aquí, o retorna este estado si es necesario
      return null; // Este componente no necesita renderizar nada por sí mismo
    };

    const handleCollaboratorsData = (collaborators) => {

        const collaboratorsData = collaborators.map( collaborator => {
          return {
            name: collaborator.name,
            photoUrl: collaborator.photoUrl,
            id: collaborator.uid,
            accessLevel: collaborator.layer.accessLevel
          }
        });
        setCurrentCollaborators(collaboratorsData)
        setFetchingCollaborators(false)

    };
    const handleSubmit = async( values,  { setSubmitting, resetForm } ) => {
      setIsLoading(true)
      setSubmitting(true)

      try {
        const response = await axios.put(`http://localhost:3000/api/layer/collaborators/${ID}/${layerID}`, 
          values,
          {
            params: {
              uid
            },
            headers: {
              'Authorization': localStorage.getItem('x-token')
            }
          }
        )

        resetForm();
        setSubmitting(false);         
        setIsLoading(false);
        handleClose();

        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: response.data.message
        });    
      } catch (error) {
        setSubmitting(false);
        setIsLoading(false);

        if(  error.response.data?.type === 'collaborator-validation' ){
            handleClose();
            Swal.fire({
                icon: 'warning',
                title: 'Access Validation',
                text: error.response.data.message,
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response.data.message,
            });
        }
      }
    };


    const [isBackgroundReady, setIsBackgroundReady] = useState(false);  

    useEffect(() => {
        const preloadImage = new Image(); // Crea una nueva instancia para cargar la imagen
        preloadImage.src = modalbg;
    
        preloadImage.onload = () => {
          setIsBackgroundReady(true); // Indica que la imagen ha cargado
        };
    }, []);

    useEffect(() => {
        if (isLayerCollaboratorsFormOpen) {
          // Asegúrate de que el modal existe antes de intentar acceder a él
          // Luego, después de un breve retraso, inicia la transición de opacidad
          const timer = setTimeout(() => {
            document.getElementById('layerCollaboratorModal').classList.remove('opacity-0');
            document.getElementById('layerCollaboratorModal').classList.add('opacity-100');
          }, 20); // Un retraso de 20ms suele ser suficiente
          return () => clearTimeout(timer);
        }
    }, [isLayerCollaboratorsFormOpen]);

    useEffect(() => {
      setFetchingCollaborators(true)
      axios.get(`http://localhost:3000/api/layer/get-layer-collaborators/${layerID}`, {
          headers: {
              'Authorization': localStorage.getItem('x-token')
          }
      })
      .then((response) => {
        console.log(response)
        const { collaborators } = response.data
        handleCollaboratorsData(collaborators)
      })
      .catch((error) => {
        console.error('Error fetching layer collaborators:', error);
      });
    }, [layerID])

    return (
        <div className='fixed flex w-screen h-full top-0 right-0 justify-center items-center bg-black/30 z-50'>
            <div id="layerCollaboratorModal" 
              className={`flex flex-col space-y-5 w-[70%] glass2 border-[1px] border-gray-400 md:w-[50%] md:h-[620px]  rounded-2xl transition-opacity duration-300 ease-in-out opacity-0 ${isLayerCollaboratorsFormOpen ? '' : 'pointer-events-none'}`}
              style={{
                backgroundImage: isBackgroundReady ? `url(${modalbg})` : 'none',
                backgroundPosition: 'bottom right',   
              }}
              >
              {
                  isLoading || !isBackgroundReady
                  ? ( 
                      <div className='flex flex-grow items-center justify-center'>
                          <PuffLoader  color={ !isBackgroundReady ? "#ffffff" : "#32174D" } size={50} /> 
                      </div>                         
                    )
                  :
                  <>              
                      <div className='flex justify-between w-[95%] h-12 ml-auto mr-auto mt-2 p-2 border-b-2 border-b-gray-500'>
                          <p className='text-xl text-black'>Layer Collaborators</p>
                          <button onClick={handleClose}>
                                <ImCancelCircle/>
                          </button>                   
                      </div>
                      {
                          fetchingCollaborators 
                          ?  ( 
                                <div className='flex flex-grow items-center justify-center'>
                                    <PuffLoader  color="#32174D" size={50} /> 
                                </div>                         
                             )
                          :
                            <Formik 
                              initialValues={{
                                collaborators: currentCollaborators,
                                newCollaborators: [],
                                modifiedCollaborators: [],
                                deletedCollaborators: []
                              }}

                              onSubmit={handleSubmit}
                              
                            >
                                {({ values, setFieldValue }) => (
                                  
                                    <Form className='w-full h-full'>
                                        {console.log(values)}
                                        <IsTheButtonDisabled values={values}/>  
                                          {
                                            ! currentOrNew 
                                            ? (                       
                                                <div id='currentCollaborators' className='flex flex-col w-full h-full'>  
                                                                  
                                                    <div className='flex justify-between px-5'>
                                                        <TextField                         
                                                          name="name"
                                                          label="Search Collaborator"
                                                          value={searchQuery}
                                                          onChange={(e) => setSearchQuery(e.target.value)}
                                                        />
                                                        <Partnership                                                  
                                                          onClick={() => setCurrentOrNew(true)}
                                                          className='w-7 h-7 mr-5 mt-5 hover:text-blue-500 transition-colors duration-200 cursor-pointer'
                                                        />
                                                    </div>

                                                    {
                                                        values.collaborators.length === 0 
                                                        ?  <div className='flex flex-col flex-grow space-y-3 items-center justify-center h-[360px] '>
                                                              <LiaHandsHelpingSolid className='w-12 h-12 text-blue-500'/>
                                                              <span className='text-sm'>This Layer has no added collaborators yet.</span>
                                                           </div>
                                                        :

                                                          <FieldArray  name="collaborators">
                                                            {({ form }) => {
                                                              
                                                              const filteredCollaborators = form.values.collaborators.filter((collaborator) =>
                                                                collaborator.name.toLowerCase().includes(searchQuery.toLowerCase())
                                                              );

                                                              return (
                                                                    <div className='flex-grow space-y-4 px-4 py-4 overflow-y-auto h-[380px] max-h-[380px] mt-4'>
                                                                        {filteredCollaborators.map((collaborator, index) => (                                             
                                                                          <ListItem className={`flex justify-between  ${ index === filteredCollaborators.length -1 ? '' : 'border-b-[1px] border-gray-400' } `} key={index}>
                                                                                <ListItemAvatar>
                                                                                    <Avatar
                                                                                      alt={collaborator.name} // Texto alternativo para la imagen
                                                                                      src={collaborator.photoUrl || collaborator.name } // Aquí deberías poner el enlace a la imagen del usuario
                                                                                      // Para un círculo de color si no hay imagen, puedes usar simplemente <Avatar>{friend.name[0]}</Avatar>
                                                                                    />
                                                                                  </ListItemAvatar>
                                                                                  <ListItemText 
                                                                                    primary={collaborator.name} 
                                                                                    secondary={`ID: ${collaborator.id}`}
                                                                                  />

                                                                                  {
                                                                                    !collaborator.new ?
                                                                                        <Select
                                                                                        size='small'
                                                                                            name={`collaborators[${index}].accessLevel`}
                                                                                            value={collaborator.accessLevel}
                                                                                            onChange={e => {
                                                                                              const newAccessLevel = e.target.value;

                                                                                              // Si el nivel de acceso es igual al actual, no hagas nada

                                                                                              if (newAccessLevel === collaborator.accessLevel) return;
                                                                                          
                                                                                              // Actualiza el nivel de acceso en la lista de colaboradores directamente
                                                                                              const updatedLayerCollaborators = form.values.collaborators.map((collaborator, collaboratorIndex) => 
                                                                                                collaboratorIndex === index ? { ...collaborator, accessLevel: newAccessLevel } : collaborator
                                                                                              );
                                                                                          
                                                                                              // Actualiza el estado de Formik para 'layerCollaborators'
                                                                                              form.setFieldValue('collaborators', updatedLayerCollaborators);

                                                                                              // Si el nivel de acceso es igual a el nivel de acceso original, elimina el colaborador modificado de 'modifiedCollaborators'

                                                                                              const originalCollaborator = currentCollaborators.find(collab => collab.id === collaborator.id);
                                                                                              if (newAccessLevel === originalCollaborator.accessLevel) {
                                                                                                const updatedModifiedCollaborators = form.values.modifiedCollaborators.filter(collab => collab.id !== collaborator.id);
                                                                                                form.setFieldValue('modifiedCollaborators', updatedModifiedCollaborators);
                                                                                              }

                                                                                      
                                                                                              // Encuentra el colaborador modificado o lo agrega a 'modifiedCollaborators'
                                                                                              const modifiedCollaboratorIndex = form.values.modifiedCollaborators.findIndex(collab => collab.id === collaborator.id);
                                                                                              if (modifiedCollaboratorIndex > -1) {
                                                                                                // Actualiza el colaborador modificado si ya existe en 'modifiedCollaborators'
                                                                                                form.values.modifiedCollaborators[modifiedCollaboratorIndex].accessLevel = newAccessLevel;
                                                                                              } else {
                                                                                                // Agrega el colaborador modificado si no está en 'modifiedCollaborators'
                                                                                                form.setFieldValue('modifiedCollaborators', [...form.values.modifiedCollaborators, { ...collaborator, accessLevel: newAccessLevel }]);
                                                                                              }
                                                                                            }}
                                                                                          >
                                                                                            <MenuItem value="contributor">Contributor</MenuItem>
                                                                                            <MenuItem value="coordinator">Coordinator</MenuItem>
                                                                                            <MenuItem value="administrator">Administrator</MenuItem>
                                                                                        </Select>
                                                                                    :
                                                                                      <div className='flex flex-col items-center mr-9'>
                                                                                          <span className='text-[11px] text-green-500'>Added as</span>
                                                                                          <span className='text-[11px] font-bold text-green-500'>{collaborator.accessLevel}</span>
                                                                                      </div>
                                                                                  }

                                                                                  {
                                                                                    !collaborator.new && (
                                                                                      <RemoveCircleOutlineOutlined 
                                                                                        onClick={() => {
                                                                                          setSelectedUser(collaborator)
                                                                                          setDeleteCDialog(true)
                                                                                        }}
                                                                                        className="w-5 h-5 ml-4 text-red-300 hover:text-red-500 transition-colors duration-300 cursor-pointer"
                                                                                      />
                                                                                    )
                                                                                  }



                                                                            </ListItem>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            }
                                                          </FieldArray>   

                                                    }
                                                   

                                                  <Dialog open={deleteCDialog} onClose={() => setDeleteCDialog(false)}>
                                                        <DialogTitle>Confirm the deletion of the user as a collaborator</DialogTitle>
                                                        <DialogContent>
                                                        <DialogContentText id="alert-dialog-description">
                                                        Are you sure you want to remove this user as a collaborator from the layer? Executing this action means that the user will not be able to access the layer if it is not open, nor will they be able to access the repositories in which they were a collaborator.
                                                        </DialogContentText>
                                                        </DialogContent>
                                                        <DialogActions>
                                                          <Button 
                                                            onClick={() => {
                                                            setDeleteCDialog(false)
                                                            setSelectedUser(
                                                              {
                                                                id: '',
                                                                name: '',
                                                                accessLevel: ''                                                  
                                                              }
                                                            )}}                            
                                                            >
                                                              Cancel
                                                            </Button>
                                                            <Button                                                        
                                                              onClick={() =>{
                                                                  const newCollaborators = values.collaborators.filter((collaborator) => collaborator.id !== selectedUser.id);
                                                                  setFieldValue('collaborators', newCollaborators);
                                                                  setFieldValue('deletedCollaborators', [...values.deletedCollaborators, selectedUser.id]);                                     
                                                                  setSelectedUser(
                                                                    {
                                                                      id: '',
                                                                      name: '',
                                                                      accessLevel: ''                                                  
                                                                    }
                                                                  ) 
                                                                  setDeleteCDialog(false);                                               
                                                                }}
                                                            >
                                                              Ok
                                                            </Button>            
                                                        </DialogActions>
                                                  </Dialog>   

                                                    <div className="flex flex-grow mx-4 items-center border-t-[1px] border-gray-400  justify-center">
                                                      <button 
                                                        type="submit"
                                                        disabled={buttonDisabled}
                                                        className={`w-[95%] h-[55px] rounded-extra ${buttonDisabled ? 'backdrop-blur-sm' : 'backdrop-blur-sm bg-green-400/20 shadow-sm'} border-[1px] border-gray-400 transition-colors duration-300 ease-in-out transform active:translate-y-[2px]`}
                                                      >
                                                        Update layer collaborators
                                                      </button>
                                                    </div>                       
                                                </div>
                                                  
                                              )
                                            : 
                                              (
                                                <div id='newCollaborators' className='flex flex-col w-full h-full'>
                                                    <div className='flex flex-col w-full h-5/6 px-5 space-y-2'>
                                                        <Autocomplete
                                                          options={users}
                                                          getOptionLabel={(option) => option.name}
                                                          renderOption={(props, option) => {
                                                            const isACollaboratorAlready = values.collaborators.some(collab => collab.id === option.id);
                                                            const isAdded = values.newCollaborators.some(collab => collab.id === option.id);
                                                            return (
                                                                <div>
                                                                    <li {...props} key={option.id}
                                                                        className={`flex p-3 pl-4 ${ isACollaboratorAlready || isAdded ? null : 'cursor-pointer' } justify-between
                                                                                    ${ isACollaboratorAlready || isAdded ? null : 'hover:bg-gray-200 transition-colors duration-200' }`}>
                                                                        <div className='flex'>
                                                                          <ListItemAvatar>
                                                                            <Avatar
                                                                              alt={option.name}
                                                                              src={option.photoUrl || option.name} // Aquí deberías poner el enlace a la imagen del usuario
                                                                            />
                                                                          </ListItemAvatar>
                                                                          <div className='flex flex-col ml-1'>
                                                                            <Typography variant="body2">{option.name}</Typography>
                                                                            <span className='text-[11px]'>
                                                                              {option.id}
                                                                            </span>
                                                                          </div>
                                                                        </div>
                                                                        { (isACollaboratorAlready || isAdded) && (
                                                                          <div className='flex items-center mr-6'>
                                                                            <span className='text-[11px] text-green-400'>
                                                                              { isACollaboratorAlready && !isAdded ? 'Already a collaborator' : isACollaboratorAlready && isAdded ? 'Added recently' : null }
                                                                            </span>
                                                                          </div>
                                                                        )}
                                                                    </li>
                                                                </div>

                                                            );
                                                          }}
                                                          fullWidth
                                                          renderInput={
                                                            (params) => 
                                                            <TextField {...params} 
                                                            onChange={(e) => setSearch(e.target.value)}
                                                            label="Search User by Name or ID" />
                                                          }
                                                          filterOptions={(options, { inputValue }) => {
                                                            return options.filter((option) =>
                                                              option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                                                              option.id.toString().includes(inputValue)
                                                            );
                                                          }}
                                                          onChange={(e, newValue) => {
                                                            // Verificar si el elemento seleccionado ya es un colaborador o ha sido añadido
                                                            const isACollaboratorAlready = values.collaborators.some(collab => collab.id === newValue?.id);
                                                            const isAdded = values.newCollaborators.some(collab => collab.id === newValue?.id);

                                                            // Si alguna de las condiciones se cumple, no hacer nada (o prevenir el comportamiento por defecto si es necesario)
                                                            if (isACollaboratorAlready || isAdded) {
                                                              console.log("Este usuario ya ha sido añadido o es un colaborador existente. No se puede añadir de nuevo.");
                                                              // Aquí podrías también llamar a event.preventDefault() si fuera un evento que lo requiera
                                                              return;
                                                            }

                                                            if (newValue !== null && !values.newCollaborators.some(collab => collab.id === newValue.id)) {
                                                              setSelectedUser(newValue);
                                                              setOpenDialog(true);
                                                            }
                                                          }}
                                                        />

                                                        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                                                          <DialogTitle>Set Access Level</DialogTitle>
                                                          <DialogContent>
                                                            <Select
                                                              value={accessLevel}
                                                              onChange={(e) => setAccessLevel(e.target.value)}
                                                              fullWidth
                                                            >                                                                     
                                                              <MenuItem value="contributor">
                                                                <div className='flex flex-grow justify-between'>
                                                                  <Typography>Contributor</Typography>
                                                                  <Tooltip 
                                                                    title={tooltipContent} 
                                                                    open={tooltipOpen === 'contributor'} 
                                                                    arrow={true} 
                                                                    placement="right" 
                                                                    enterTouchDelay={50} 
                                                                    leaveTouchDelay={400} 
                                                                    leaveDelay={200} 
                                                                    enterDelay={100}
                                                                  >   
                                                                    <div 
                                                                      onMouseEnter={() => handleMouseEnter('The Contributor at the layer level has access to Open / Internal repositories within the layer, participates in the text and voice chats within the layer, in addition to being able to clone the repositories by having a "Reader" access level in the repositories.', 'contributor')} 
                                                                      onMouseLeave={handleMouseLeave}
                                                                    >
                                                                      <LiaQuestionCircleSolid />
                                                                    </div>
                                                                  </Tooltip> 
                                                                </div>
                                                              </MenuItem>                                       

                                                              <MenuItem value="coordinator">
                                                                <div className='flex flex-grow justify-between'>
                                                                  <Typography>Coordinator</Typography>
                                                                  <Tooltip 
                                                                    title={tooltipContent} 
                                                                    open={tooltipOpen === 'coordinator'} 
                                                                    arrow={true} 
                                                                    placement="right" 
                                                                    enterTouchDelay={50} 
                                                                    leaveTouchDelay={400} 
                                                                    leaveDelay={200} 
                                                                    enterDelay={100}
                                                                  >   
                                                                    <div 
                                                                      onMouseEnter={() => handleMouseEnter('The Coordinator at the layer level has all the capabilities of the contributor, he can also manage contributions, approve changes and tasks and coordinate activities within the layer, the level provide a "Editor" access level in all repositories where he has access within the layer. Finally, the Coordinator can add new collaborators with an access level of "Contributor" or "Reader" in the case of repositories within the layer.', 'coordinator')} 
                                                                      onMouseLeave={handleMouseLeave}
                                                                    >
                                                                      <LiaQuestionCircleSolid />
                                                                    </div>
                                                                  </Tooltip> 
                                                                </div>
                                                              </MenuItem>

                                                              <MenuItem value="administrator">
                                                                <div className='flex flex-grow justify-between'>
                                                                  <Typography>Administrator</Typography>
                                                                  <Tooltip 
                                                                    title={tooltipContent} 
                                                                    open={tooltipOpen === 'administrator'} 
                                                                    arrow={true} 
                                                                    placement="right" 
                                                                    enterTouchDelay={50} 
                                                                    leaveTouchDelay={400} 
                                                                    leaveDelay={200} 
                                                                    enterDelay={100}
                                                                  >   
                                                                    <div 
                                                                      onMouseEnter={() => handleMouseEnter('The Administrator at the layer level has all the capabilities of the coordinator, the level provides access to restricted repositories within the layer, with an "Administrator" access level on all repositories, finally, he can manage the access level of other collaborators below of "Administrator" access level.', 'administrator')} 
                                                                      onMouseLeave={handleMouseLeave}
                                                                    >
                                                                      <LiaQuestionCircleSolid />
                                                                    </div>
                                                                  </Tooltip> 
                                                                </div>
                                                              </MenuItem>
                                                            </Select>
                                                          </DialogContent>
                                                          <DialogActions>
                                                            <Button onClick={() => {
                                                              setOpenDialog(false)
                                                              setSelectedUser({ name: '', accessLevel: '', id: '' })
                                                            }}
                                                            >Cancel</Button>
                                                            
                                                            <Button onClick={() => addUserAsCollaborator( values, setFieldValue )} disabled={!accessLevel}>Add</Button>            
                                                          </DialogActions>
                                                        </Dialog>
                      
                                                        <div className='flex-grow overflow-y-auto px-3 max-h-[380px]'>
                                                          { values.newCollaborators.length === 0 
                                                              ?
                                                                <div className='flex h-full items-center justify-center'>
                                                                  <span className='text-sm'>There are no new collaborators currently</span>
                                                                </div> 
                                                              :  
                                                                <List>
                                                                  {values.newCollaborators.map((collaborator, index) => (
                                                                    <ListItem className='border-b-[1px] border-gray-400' key={index} secondaryAction={
                                                                      <button 
                                                                        className='mr-3' 
                                                                        onClick={() => handleDeleteNewCollaborator(values, setFieldValue, collaborator.id)}  
                                                                      >
                                                                        <ImCancelCircle size={18} color="#ef233c"/>
                                                                      </button>
                                                                    }>
                                                                      <ListItemAvatar>
                                                                        <Avatar
                                                                          alt={collaborator.name}
                                                                          src="/path/to/your/image.jpg" // Suponiendo que tienes una URL de imagen para cada amigo
                                                                          // Si no hay imagen, podrías mostrar la primera letra del nombre como fallback
                                                                          // {friend.avatar || friend.name[0]}
                                                                        />
                                                                      </ListItemAvatar>
                                                                      <ListItemText 
                                                                        primary={collaborator.name} 
                                                                        secondary={
                                                                          <>
                                                                            <Typography component="span" variant="body2" color="textPrimary">
                                                                              Access Level: {collaborator.accessLevel}
                                                                            </Typography>
                                                                            {/* Aquí puedes agregar otro Typography para el tercer texto */}
                                                                            <Typography component="div" variant="body2" color="textSecondary">
                                                                              ID: {collaborator.id}
                                                                            </Typography>
                                                                          </>
                                                                        } 
                                                                      />
                                                                    </ListItem>
                                                                  ))}
                                                                </List>                         
                                                            }      
                                                        </div>
                                                    </div>

                                                    <div className='flex flex-grow justify-center mx-4  items-center py-4  border-t-[1px] border-gray-400 '>
                                                        <button 
                                                          type='button'
                                                          className='h-[55px] w-[95%] border-1 border-gray-400  rounded-extra glassi transition-transform duration-150 ease-in-out transform active:translate-y-[2px]'
                                                          onClick={ () => handleAddNewCollaborators( values, setFieldValue ) }
                                                        >
                                                          Update new Collaborators
                                                        </button>
                                                      </div>
                                                </div>
                                              )
                                          }

                                    </Form>

                                )}
                          </Formik>

                      }         
                  </>
              }             
            </div>
        </div>
    );
};