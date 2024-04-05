import { useState, useEffect, Fragment } from 'react'
import { useLocation } from 'react-router-dom';
import { ImCancelCircle } from "react-icons/im";
import { Formik, Form, FormikHelpers, useFormikContext } from 'formik';
import { TextField, Autocomplete, List, ListItem, ListItemText, Avatar, Typography, Chip,  Dialog, DialogContentText, DialogTitle, DialogContent, DialogActions, InputLabel, Tooltip, MenuItem, Select, Button, FormControl, Accordion, AccordionSummary, AccordionDetails,  } from '@mui/material'
import { Branch } from '@ricons/carbon'
import { useGlobalUsersSearcher } from '../../../forms/hooks/useGlobalUsersSearcher';
import { useSelector } from 'react-redux';
import axios from 'axios';
import LoadingCircle from '../../../../../../auth/helpers/Loading';
import { LiaQuestionCircleSolid } from "react-icons/lia";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { RepoNewCollaborators } from './sub-forms/RepoNewCollaborators';
import Swal from 'sweetalert2';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const RepositoryConfigForm = ({ isRepoFormOpen, setIsRepoFormOpen, repo }) => {

  const location = useLocation()
  const { ID } = location.state.project
  const { layerID } = location.state.layer
  const { repoID } = location.state.repository;
  const { uid } = useSelector(state => state.auth)
  const { layers } = useSelector(state => state.platypus)
  const layer = layers.find(layer => layer._id === layerID)

  const { users, setSearch } = useGlobalUsersSearcher()


  const [cSearchTerm, setCSearchTerm] = useState('')
  const [currentOrNew, setCurrentOrNew] = useState(false)
  const [branchesExpanded, setBranchesExpanded] = useState(false) 
  const [editingCollaborator, setEditingCollaborator] = useState(false)
  const [currentCollaboratorForTooltip, setCurrentCollaboratorForTooltip] = useState(null);

  const [tooltipOpen, setTooltipOpen] = useState('');
  const [tooltipContent, setTooltipContent] = useState('');
  const [deleteCDialog, setDeleteCDialog] = useState(false)
  const [visibilityDialog, setVisibilityDialog] = useState(false)
  const [accessLevelDialog, setAccessLevelDialog] = useState(false)
  const [branchTypeDialogContent, setBranchTypeDialogContent] = useState('')

  const [branchTypeDialog, setBranchTypeDialog] = useState(false)
  const [pendingDefaultBranchIndex, setPendingDefaultBranchIndex] = useState(null);
  const [tempVisibility, setTempVisibility] = useState('')

  const [currentCollaborators, setCurrentCollaborators] = useState([])
  const [modalOpacity, setModalOpacity] = useState(0);

  const [accessLevel, setAccessLevel] = useState('');
  const [selectedUser, setSelectedUser] = useState({
      id: '',
      name: '',
      // photoUrl: '',
      accessLevel: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(false)



    const handleClose = () => {
      if( isRepoFormOpen ) {
        setModalOpacity(0);
        setTimeout(() => {
            setIsRepoFormOpen(false);
        }, 700);
      }
    };

    const handleMouseEnter = (text, type) => {
      setTooltipContent(text);
      setTooltipOpen(type);
    };

    const handleMouseLeave = () => {
      setTooltipOpen('');
    };

    const renderDialogContentText = () => {
      switch (tempVisibility) {
        case 'open':
          return (
            <DialogContentText>
              Are you sure you want to change the visibility type? The "Open" type will allow all project collaborators to access the repository, if the project is open, it will allow all users in prjmanager to access it as well.
            </DialogContentText>
          );
        case 'internal':
          return (
            <DialogContentText>
              Are you sure you want to change the visibility type? The "Internal" type will allow access to the repository only to the collaborators of its layer.
            </DialogContentText>
          );
        case 'restricted':
          return (
            <DialogContentText>
              Are you sure you want to change the visibility type? The "Restricted" type will allow only collaborators of the repository to access the information contained.
            </DialogContentText>
          );
        default:
          return null; // o algún otro componente JSX por defecto
      }
    };

    const editCollaboratorAccessLevel = (collaborator, accessLevel ) => {
      setEditingCollaborator(true);
      setSelectedUser(collaborator);
      setAccessLevel(accessLevel);
      setAccessLevelDialog(true);
    }

    const editCollaboratorNewAccessLevel = (values, setFieldValue) => {

      if( selectedUser?.new ){

        const newCollaborator = { ...selectedUser, accessLevel };
        const noDuplicates = values.newCollaborators.filter(collaborator => collaborator.id !== newCollaborator.id);
        const noDuplicates2 = values.collaborators.filter(collaborator => collaborator.id !== newCollaborator.id);

        // Añadir el nuevo colaborador a la lista filtrada.
        const updatedCollaborators = [newCollaborator, ...noDuplicates];
      
        setFieldValue('newCollaborators', updatedCollaborators);
        setFieldValue('collaborators', [newCollaborator, ...noDuplicates2] )

      
        setAccessLevelDialog(false);
        setEditingCollaborator(false);
        setAccessLevel('');
        setSelectedUser({
          id: '',
          name: '',
          // photoUrl: '',
          accessLevel: ''
        })

      } else {
        const newCollaborator = { ...selectedUser, accessLevel };
      
        // Filtrar cualquier posible duplicado basado en el 'id'.
        const noDuplicates = values.collaborators.filter(collaborator => collaborator.id !== newCollaborator.id);
        const noDuplicates2 = values.modifiedCollaborators.filter(collaborator => collaborator.id !== newCollaborator.id);
      
        // Añadir el nuevo colaborador a la lista filtrada.
        const updatedCollaborators = [newCollaborator, ...noDuplicates];
      
        setFieldValue('collaborators', updatedCollaborators);
        setFieldValue('modifiedCollaborators', [...noDuplicates2, newCollaborator]);
      
        setAccessLevelDialog(false);
        setEditingCollaborator(false);
        setAccessLevel('');
        setSelectedUser({
          id: '',
          name: '',
          // photoUrl: '',
          accessLevel: ''
        })

      }
    }

    const addUserAsCollaborator = (values,  setFieldValue) => {
      const newCollaborator = { ...selectedUser, accessLevel };
    
      // Filtrar cualquier posible duplicado basado en el 'id'.
      const noDuplicates = values.collaborators.filter(collaborator => collaborator.id !== newCollaborator.id);
    
      // Añadir el nuevo colaborador a la lista filtrada.
      const updatedCollaborators = [newCollaborator, ...noDuplicates];
    
      setFieldValue('collaborators', updatedCollaborators);
    
      setOpenDialog(false);
      setAccessLevel('');
      setSelectedUser({
        id: '',
        name: '',
        // photoUrl: '',
        accessLevel: ''
      })
    };

    const handleCollaboratorTooltipContent = (collaborator) => {
      // Retornar JSX en lugar de un string
      return (
        <Fragment>
          <div>ID: {collaborator.id}</div>
          <div className='flex'>
              Access Level: 
              <h5 className='text-green-500 ml-1'>{collaborator.accessLevel.charAt(0).toUpperCase() + collaborator.accessLevel.slice(1)}</h5>
           </div>
        </Fragment>
      );
    };

    const handleCollaboratorsData = (collaborators) => {

      const collaboratorsData = collaborators.map( collaborator => {
        return {
          name: collaborator.name,
          photoUrl: collaborator.photoUrl,
          id: collaborator.uid,
          accessLevel: collaborator.repository.accessLevel
        }
      });

      // console.log('Collaborators:', collaboratorsData)
      setCurrentCollaborators(collaboratorsData)
      setIsLoading(false)

    };



    const IsTheButtonDisabled = ({ values }) => {
      useEffect(() => {
          const isDisabled =  values.newCollaborators.length === 0
                              && values.modifiedCollaborators.length === 0
                              && values.deletedCollaborators.length === 0
                              && values.name === repo.name
                              && values.visibility === repo.visibility   
                              && values.description === repo.description
                              && values.branches.every((branch, index) => branch.default === repo.branches[index].default)
          setButtonDisabled(isDisabled);
      }, [ values ]);
      
      // Utiliza buttonDisabled para cualquier lógica relacionada aquí, o retorna este estado si es necesario
      return null; // Este componente no necesita renderizar nada por sí mismo
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      setIsLoading(true);

        axios.put(`${backendUrl}/repos/update-repository/${ID}/${layerID}/${repoID}`, values, {
          params: {
            uid
          },
            headers: {
                'Authorization': localStorage.getItem('x-token')
            }
        })
        .then( response => {
            console.log(response)
            setIsLoading(false);
            Swal.fire({
                title: 'Successful Update',
                text: `${response.data.message}`,
                icon: 'success',
            })

            setTimeout(() => {
              resetForm();
              handleClose();
            }, 2000);
        })
        .catch( error => {
            setIsLoading(false);
            Swal.fire({
                title: 'Error',
                text: `${error.response.data.message}`,
                icon: 'error',
            })

            setTimeout(() => {
              resetForm();
              handleClose();
            }, 2000);
        })


    }

    useEffect(() => {
      setIsLoading(true)
      axios.get(`http://localhost:3000/api/repos/get-repo-collaborators/${repo._id}`, {
          headers: {
              'Authorization': localStorage.getItem('x-token')
          }
      })
      .then((response) => {

        const { collaborators } = response.data
        console.log('buenisss',collaborators)
        handleCollaboratorsData(collaborators)
      })
      .catch((error) => {
        console.error('Error fetching layer collaborators:', error);
      });
    }, [repo])



    useEffect(() => {
      if (isRepoFormOpen) {
        // Retraso mínimo para iniciar la transición después de abrir el modal
        const timer = setTimeout(() => setModalOpacity(1), 20); // Ajusta la opacidad a 1 (visible)
        return () => clearTimeout(timer);
      } else {
        setModalOpacity(0); // Ajusta la opacidad a 0 (invisible) inmediatamente al cerrar
      }
    }, [isRepoFormOpen]);

  return ( 
    <div className='fixed flex w-screen h-screen top-0 right-0 justify-center items-center z-50'>
        <div
          id="repositoryTaskModal"
          style={{ opacity: modalOpacity, transition: 'opacity 300ms ease-in-out, height 300ms ease-in-out, background 300ms ease-in-out' }}
          className={`flex flex-col space-y-3 w-[90%]  overflow-hidden md:w-[50%] pb-2 md:max-h-[700px] overflow-y-auto transition-colors duration-300  bg-white border-[1px] border-black rounded-2xl ${isRepoFormOpen ? '' : 'pointer-events-none'}`}
        >

              <div className='flex justify-between w-[95%] h-12 ml-auto mr-auto mt-2 p-2 border-b-2 border-b-gray-500'>
                  <p className='text-xl text-black'>Repository Configuration</p>
                  <button onClick={handleClose}>
                        <ImCancelCircle/>
                  </button>                   
              </div>

              {

                isLoading 
                ? <LoadingCircle />
                : (
                      <Formik
                            initialValues={{

                                name: repo.name,
                                description: repo.description,
                                visibility: repo.visibility,
                                collaborators: currentCollaborators,
                                newCollaborators: [],
                                modifiedCollaborators: [],
                                deletedCollaborators: [],

                                branches: repo.branches,
                                newDefaultBranch: null                                
                            }  }
                            // validationSchema={RepositorySchema}
                            onSubmit={handleSubmit}
                        >        
                            {({ isSubmitting, values, setFieldValue, handleChange, handleBlur }) => {
                              {console.log(values)}
                              const filteredCollaborators = values.collaborators.filter(collaborator => {
                                return collaborator.name.toLowerCase().includes(cSearchTerm.toLowerCase()) || collaborator.id.toString().includes(cSearchTerm)
                              });
                              
                              return (                                 
                                
                                <Form className='flex flex-col h-full ml-auto mr-auto w-[95%] space-y-4'>
                                      
                                      <IsTheButtonDisabled values={values} />


                                  {
                                    !currentOrNew && (
                                      <button 
                                        onClick={() => setCurrentOrNew(!currentOrNew)}
                                        className='flex w-full px-2 justify-end hover:text-blue-500 transition-colors duration-200'>
                                        <span className='text-[13px]'>Add Collaborators</span>
                                      </button>
                                    )
                                  }


                                  {
                                    currentOrNew 
                                    ?   <RepoNewCollaborators  setFieldValue={setFieldValue} values={values} setCurrentOrNew={setCurrentOrNew} currentOrNew={currentOrNew} />
                                    : 
                                      <div className='flex flex-col flex-grow space-y-4'>
                                      
                                            <div className='flex space-x-4 w-full'>
                                                <TextField                                      
                                                    name="name"
                                                    label="Repository Name"                        
                                                    fullWidth
                                                    value={values.name}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />

                                                <FormControl fullWidth>
                                                    <InputLabel id="visibility-label">Visibility</InputLabel>
                                                    <Select
                                                        labelId="visibility-label"
                                                        id="visibility"
                                                        name="visibility"
                                                        value={values.visibility}
                                                        onChange={(e) => {
                                                            setTempVisibility(e.target.value);
                                                            setVisibilityDialog(true)
                                                        }}
                                                        onBlur={handleBlur}
                                                        label="Visibility" // Esto establece la etiqueta para el Select
                                                    >
                                                        <MenuItem
                                                          disabled={layer.visibility === 'restricted'}
                                                          value="open"
                                                        >
                                                          Open
                                                        </MenuItem>
                                                        <MenuItem value="internal">Internal</MenuItem>
                                                        <MenuItem value="restricted">Restricted</MenuItem>
                                                    </Select>
                                                </FormControl>

                                                
                                                <Dialog open={visibilityDialog} onClose={() => setVisibilityDialog(false)}>
                                                    <DialogTitle>Confirm Visibility Change</DialogTitle>
                                                    <DialogContent>
                                                        { renderDialogContentText()}                                          
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={() => setVisibilityDialog(false)}>Cancel</Button>
                                                        <Button onClick={ () => {
                                                        setFieldValue('visibility', tempVisibility);
                                                        setVisibilityDialog(false); 
                                                        }} autoFocus>
                                                            Confirm
                                                        </Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </div>


                                            <div className='flex flex-col space-y-6 w-full mt-6'> 

                                              <Accordion 
                                                  expanded={branchesExpanded}
                                                  onChange={() => setBranchesExpanded(!branchesExpanded)}          
                                                  sx={{
                                                      // backgroundColor: '#cae9ff',
                                                      border: '1px solid gray'
                                                  }}
                                              >
                                                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                  <Typography >Branches</Typography>
                                                  </AccordionSummary>
                                                  <AccordionDetails>                                         
                                                    <div className='flex-grow space-y-4 px-4 py-4 overflow-y-auto  max-h-[180px]'>
                                                        {values.branches.map((branch, index) => (                                             
                                                          <ListItem className='flex space-x-4 justify-between border-b-[1px] border-gray-400' key={index}>
                                                                  <Branch className='w-5 h-5' />
                                                                  <ListItemText 
                                                                    primary={branch.name} 
                                                                  />
                                                                                                          
                                                                  <Select
                                                                      name={`branches[${index}].default`}
                                                                      value={branch.default ? 'default' : 'regular'}
                                                                      onChange={e => {
                                                                        if (e.target.value === 'default') {
                                                                          setPendingDefaultBranchIndex(index);
                                                                          setBranchTypeDialog(true);
                                                                          setBranchTypeDialogContent('Are you sure you want to change the default branch? This action will mean that when executing a push, pull or clone, if a different branch is not specified, this will be the one taken as the main reference.')
                                                                        } else {
                                                                          setPendingDefaultBranchIndex(null);
                                                                          setBranchTypeDialog(true);
                                                                          setBranchTypeDialogContent('To downgrade a default branch to regular, you must select another branch as default.')
                                                                        }
                                                                      }}
                                                                    >
                                                                      <MenuItem value="default">Default</MenuItem>
                                                                      <MenuItem value="regular">Regular</MenuItem>
                                                                  </Select>                                           
                                                            </ListItem>
                                                        ))}
                                                    </div>
                                                  </AccordionDetails>
                                              </Accordion>


                                              <Dialog
                                                open={branchTypeDialog}
                                                onClose={() => setBranchTypeDialog(false)}
                                                aria-labelledby="alert-dialog-title"
                                                aria-describedby="alert-dialog-description"
                                              >
                                                <DialogTitle id="alert-dialog-title">{"Change branch status"}</DialogTitle>
                                                <DialogContent>
                                                  <DialogContentText id="alert-dialog-description">
                                                    {branchTypeDialogContent}
                                                  </DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                  <Button onClick={() => setBranchTypeDialog(false)} color="primary">
                                                    Cancel
                                                  </Button>

                                                  {
                                                    pendingDefaultBranchIndex !== null && (
                                                      <Button 
                                                        onClick={() => {
                                                          // Aquí actualizas las ramas basado en la selección guardada
                                                          const newBranches = values.branches.map((b, i) => ({
                                                            ...b,
                                                            default: i === pendingDefaultBranchIndex // Solo la rama seleccionada será por defecto
                                                          }));
                                                          setFieldValue('branches', newBranches);
                                                          setFieldValue('newDefaultBranch', newBranches[pendingDefaultBranchIndex]._id)
                                                          setBranchTypeDialog(false); // Cierra el diálogo
                                                        }} 
                                                        color="primary" autoFocus>
                                                        Ok
                                                      </Button>
                                                    )
                                                  }
                                                </DialogActions>
                                              </Dialog>


                                              <Autocomplete
                                                  open={false}
                                                  className='max-h-[57px]'
                                                  multiple
                                                  value={values.collaborators}
                                                  options={[]}
                                                  isOptionEqualToValue={(option, value) => option.id === value.id}
                                                  getOptionLabel={(option) => option.name} 
                                                  renderTags={(value, getTagProps) =>
                                                    <div className=" overflow-y-auto  max-h-[41px] w-[90%] ">
                                                      {filteredCollaborators.map((option, index) => (
                                                        <Tooltip                             
                                                          title={currentCollaboratorForTooltip && currentCollaboratorForTooltip.id === option.id ? handleCollaboratorTooltipContent(option) : ""}
                                                          onMouseEnter={() => setCurrentCollaboratorForTooltip(option)}
                                                          onMouseLeave={() => setCurrentCollaboratorForTooltip(null)}
                                                        >                                                      
                                                            <Chip                                                           
                                                              variant="outlined"
                                                              label={option.name}
                                                              {...getTagProps({ index })}
                                                              onClick={() => editCollaboratorAccessLevel(option, option.accessLevel, setFieldValue)}
                                                              onDelete={() => {
                                                                setSelectedUser(option)
                                                                setDeleteCDialog(true)
                                                              }}
                                                              sx={{
                                                                cursor: 'pointer', // Esto cambia el cursor a una mano cuando se pasa el mouse sobre el Chip
                                                              }}
                                                            />
                                                        </Tooltip>

                                                      ))}
                                                    </div>
                                                  }       
                                                  onInputChange={(event, newInputValue) => {
                                                    setCSearchTerm(newInputValue);
                                                  }}                                 
                                                  renderInput={(params) => (
                                                    <TextField
                                                      {...params}                                           
                                                      value={cSearchTerm}
                                                      variant="outlined"
                                                      label={values.collaborators.length === 0 ? 'No collaborators added' : 'Collaborators'}
                                                      placeholder="Search"
                                                      onChange={(e) => setCSearchTerm(e.target.value)}
                                                      // Aquí aplicas estilos directamente para ocultar el botón de borrado
                                                      InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                          <Fragment>
                                                            {params.InputProps.endAdornment}
                                                          </Fragment>
                                                        ),
                                                      }}
                                                      sx={{
                                                        '& .MuiAutocomplete-clearIndicator': {
                                                          display: 'none',
                                                        },
                                                        '& .MuiAutocomplete-popupIndicator': {
                                                          display: 'none',
                                                        },
                                                        // Aquí puedes añadir más estilos si es necesario
                                                      }}
                                                    />
                                                  )}
                                              />

                                              <Dialog open={deleteCDialog} onClose={() => setDeleteCDialog(false)}>
                                                    <DialogTitle>Confirm the deletion of the user as a collaborator</DialogTitle>
                                                    <DialogContent>
                                                    <DialogContentText id="alert-dialog-description">
                                                        Are you sure you want to remove this user as a collaborator from the repository? Executing this action means that the user will not be able to access the repository and contribute again in any way.
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
                                              <Dialog open={accessLevelDialog} onClose={() => setAccessLevelDialog(false)}>
                                                    <DialogTitle>Set Access Level</DialogTitle>
                                                    <DialogContent>
                                                      <Select
                                                        value={accessLevel}
                                                        onChange={(e) => setAccessLevel(e.target.value)}
                                                        fullWidth
                                                      >                                                                     
                                                        <MenuItem value="reader">
                                                          <div className='flex flex-grow justify-between'>
                                                            <Typography>Reader</Typography>
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
                                                                onMouseEnter={() => handleMouseEnter('The Contributor can view open repositories on the layer and contribute new content or comments.', 'contributor')} 
                                                                onMouseLeave={handleMouseLeave}
                                                              >
                                                                <LiaQuestionCircleSolid />
                                                              </div>
                                                            </Tooltip> 
                                                          </div>
                                                        </MenuItem>                                       

                                                        <MenuItem value="editor">
                                                          <div className='flex flex-grow justify-between'>
                                                            <Typography>Editor</Typography>
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
                                                                onMouseEnter={() => handleMouseEnter('The Coordinator can manage contributions, approve changes and coordinate activities within the layer. This role allows adding new collaborators with the role of contributors and access to open and internal repositories with editor access level in the layer.', 'coordinator')} 
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
                                                                onMouseEnter={() => handleMouseEnter('The Administrator has full control over the layer and its repositories with administrator level access to them, including the ability to modify settings, manage all aspects and collaborators.', 'administrator')} 
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
                                                      <Button 
                                                        onClick={() => {
                                                        setAccessLevelDialog(false)
                                                        setEditingCollaborator(false)
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
                                                            disabled={!accessLevel} 
                                                            onClick={() =>{
                                                              editingCollaborator 
                                                              ? editCollaboratorNewAccessLevel( values, setFieldValue )                                                       
                                                              : addUserAsCollaborator( values, setFieldValue )                                                   
                                                              }}
                                                        >
                                                          Ok
                                                        </Button>            
                                                    </DialogActions>
                                              </Dialog> 

                                              <TextField                                      
                                                  name="description"
                                                  label="Description"
                                                  multiline
                                                  rows={4}
                                                  fullWidth
                                                  value={values.description}
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                              />
                                            </div>


                                            <div className='flex w-full h-full justify-center items-center pb-3'>
                                                <button 
                                                    className={`w-[95%] h-[55px] rounded-extra p-2 ${buttonDisabled ? 'backdrop-blur-sm' : 'backdrop-blur-sm bg-green-400/20 shadow-sm'} border-[1px] border-gray-400 transition-colors duration-300 ease-in-out transform active:translate-y-[2px]`}
                                                    type='submit' disabled={isSubmitting}>Update Repository
                                                </button>
                                            </div>          
                                      </div>

                                  }

                                </Form>
                            )}
                            }        

                        </Formik>
                            
                )

              }
            
        </div>
    </div>
  )
}
