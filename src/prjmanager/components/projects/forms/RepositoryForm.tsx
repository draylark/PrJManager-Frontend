import { useState, FC, Fragment, useEffect  } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { TextField, Autocomplete, ListItemAvatar, Avatar, Typography, Chip,  Dialog, DialogTitle, DialogContent, DialogActions, InputLabel, Tooltip, MenuItem, Select, Button, FormControl  } from '@mui/material'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { PuffLoader  } from 'react-spinners';
import { loadNewRepo } from '../../../../store/gitlab/thunks';
import axios from 'axios';

import { ImCancelCircle } from "react-icons/im";
import { LiaQuestionCircleSolid } from "react-icons/lia";

import Swal from 'sweetalert2';

import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';
import { AddColaboratorsForm } from './sub-components/AddColaboratorsForm';
import bgform from './assets/formbg.jpg'


const RepositorySchema = Yup.object().shape({
    name: Yup.string().required('Repository name is required'),
    description: Yup.string().required('Description is required'),
    visibility: Yup.string().required('Visibility is required'),
  });
  
  interface RepositoryValues {
    name: string;
    description: string;
    visibility: string;
    collaborators: Array<{
      id: string;
      name: string;
      accessLevel: string;
      photoUrl?: string;
    }>;
    projectID: string;
    layerID: string;
    uid: string;
  }
  
  interface RepositoryProps {
        setIsRepositoryFormOpen: (value: boolean) => void;
        isRepositoryFormOpen: boolean;
  }
  


export const RepositoryForm: FC<RepositoryProps> = ({ setIsRepositoryFormOpen, isRepositoryFormOpen }) => {


    const location = useLocation();
    const dispatch = useDispatch();
    const { uid } = useSelector( (selector: RootState) => selector.auth);
    const [IsLoading, setIsLoading] = useState(false);

    const { layerID } = location.state.layer;
    const { ID } = location.state.project;

    const [tooltipOpen, setTooltipOpen] = useState('');
    const [tooltipContent, setTooltipContent] = useState('');

    const [accessLevel, setAccessLevel] = useState('');
    const [openDialog, setOpenDialog] = useState(false)
    const [buttonDisabled, setButtonDisabled] = useState(false)

    const [currentCollaboratorForTooltip, setCurrentCollaboratorForTooltip] = useState(null);
    const [selectedFriend, setSelectedFriend] = useState({
        id: '',
        name: '',
        // photoUrl: '',
        accessLevel: ''
    })
    const [friends, setFriends] = useState([
        {
            id: '1',
            name: 'Juan Perez',
            accessLevel: ''
        },
        {
            id: '2',
            name: 'Maria Lopez',
            accessLevel: ''
        },
        {
            id: '3',
            name: 'Maria Lopez3',
            accessLevel: ''
        },
        {
            id: '489',
            name: 'Maria',
            accessLevel: ''
        },
        {
            id: '5',
            name: 'Maria Lopez5',
            accessLevel: ''
        },
        {
            id: '6',
            name: 'Maria Lopez6',
            accessLevel: ''
        },
        {
            id: '7',
            name: 'Maria Lopez7',
            accessLevel: ''
        }
    ])

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

    const handleMouseEnter = (text, type) => {
        setTooltipContent(text);
        setTooltipOpen(type);
      };

    const handleMouseLeave = () => {
      setTooltipOpen('');
    };

    const addFriendAsCollaborator = (values,  setFieldValue) => {
      const newCollaborator = { ...selectedFriend, accessLevel };
    
      // Filtrar cualquier posible duplicado basado en el 'id'.
      const noDuplicates = values.collaborators.filter(collaborator => collaborator.id !== newCollaborator.id);
    
      // Añadir el nuevo colaborador a la lista filtrada.
      const updatedCollaborators = [newCollaborator, ...noDuplicates];
    
      setFieldValue('collaborators', updatedCollaborators);
    
      setOpenDialog(false);
      setAccessLevel('');
    };
  

    const handleClose = () => {
      const modal = document.getElementById('layerRepositoryModal');
      if (modal) {
          // Inicia la transición de opacidad a 0
          modal.classList.replace('opacity-100', 'opacity-0');

          // Espera a que la animación termine antes de ocultar el modal completamente
          setTimeout(() => {
            setIsRepositoryFormOpen(false);
          }, 500); // Asume que la duración de tu transición es de 500ms
      }
    };

    const IsTheButtonDisabled = ({ values }) => {
      useEffect(() => {
          const isDisabled =  values.collaborators.length === 0
                              && values.name === ""
                              && values.visibility === "";   
          setButtonDisabled(isDisabled);
      }, [ values ]);
      
      // Utiliza buttonDisabled para cualquier lógica relacionada aquí, o retorna este estado si es necesario
      return null; // Este componente no necesita renderizar nada por sí mismo
    };

    const handleSubmit = async(values: RepositoryValues, { setSubmitting, resetForm }: FormikHelpers<RepositoryValues>) => {
        setIsLoading(true);
        setSubmitting(true); 

        try {
            const response = await axios.post(`http://localhost:3000/api/repos/create-repository/${ID}/${layerID}`, values, {
                params: {
                  uid
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('x-token')
                }
            })

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

          if( error.response.data?.type === 'repos-limit' ){
            handleClose();
            Swal.fire({
              icon: 'info',
              title: 'Layer repositories limit reached\n ( 3 repositories )',
              text: error.response.data.message
            });
          } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message
            });
          }
        }
    };


    const [isBackgroundReady, setIsBackgroundReady] = useState(false);  

    useEffect(() => {
        const preloadImage = new Image(); // Crea una nueva instancia para cargar la imagen
        preloadImage.src = bgform;
    
        preloadImage.onload = () => {
          setIsBackgroundReady(true); // Indica que la imagen ha cargado
        };
      }, []);

    useEffect(() => {
      if (isRepositoryFormOpen) {
        // Asegúrate de que el modal existe antes de intentar acceder a él
        // Luego, después de un breve retraso, inicia la transición de opacidad
        const timer = setTimeout(() => {
          document.getElementById('layerRepositoryModal').classList.remove('opacity-0');
          document.getElementById('layerRepositoryModal').classList.add('opacity-100');
        }, 20); // Un retraso de 20ms suele ser suficiente
        return () => clearTimeout(timer);
      }
    }, [isRepositoryFormOpen]);




    return (
        <div className='fixed flex w-screen h-screen pb-5 top-0 right-0 justify-center items-center bg-black/30 z-10'>
            <div 
                id="layerRepositoryModal" 
                style={{ 
                    backgroundImage: isBackgroundReady ? `url(${bgform})` : 'none',
                    backgroundPosition: 'right center' 
                  
                  }}
                className={`flex flex-col md:h-[450px] md:w-[700px] glass2 border-[1px] border-gray-400 rounded-2xl transition-opacity duration-300 ease-in-out opacity-0 ${isRepositoryFormOpen ? '' : 'pointer-events-none'}`}>
                <div className='flex justify-between w-[95%] h-12 ml-auto mr-auto mt-2 p-2 border-b-2 border-b-gray-500'>
                    <p className='text-xl text-black'>New Layer Repository</p>
                    <button onClick={handleClose}>
                          <ImCancelCircle/>
                    </button>                   
                </div>

                {

                  IsLoading || !isBackgroundReady
                  ?  (
                        <div className='flex flex-grow items-center justify-center'>
                        <PuffLoader  color={ !isBackgroundReady ? "#ffffff" : "#32174D" } size={50} /> 
                        </div>  
                     )
                  : (
                        <Formik
                              initialValues={{
                                  name: '',
                                  description: '',
                                  visibility: '',
                                  collaborators: [],
                                  uid,                                 
                              } as RepositoryValues }
                              validationSchema={RepositorySchema}
                              onSubmit={handleSubmit}
                          >
                        
                              {({ isSubmitting, values, setFieldValue, handleChange, handleBlur, errors, touched }) => (                                 
                                  
                                  <Form className='flex flex-col h-full ml-auto mr-auto w-[95%] mt-5'>
                                      
                                      <IsTheButtonDisabled values={values} />

                                      <div className='flex space-x-4 w-full'>
                                          <TextField                
                                              InputLabelProps={{ shrink: errors.name && touched.name }}                        
                                              name="name"
                                              label={ errors.name && touched.name ? errors.name : 'Repository Name' }                        
                                              fullWidth
                                              value={values.name}
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              error={!!errors.name && touched.name}
                                          />

                                          <FormControl fullWidth error={!!errors.visibility && touched.visibility}>
                                              <InputLabel 
                                                id="visibility-label" 
                                              >{errors.visibility && touched.visibility ? errors.visibility : 'Visibility'}</InputLabel>
                                              <Select
                                                  labelId="visibility-label"
                                                  id="visibility"
                                                  name="visibility"
                                                  value={values.visibility}
                                                  onChange={(e) => setFieldValue('visibility', e.target.value)}
                                                  onBlur={handleBlur}
                                                  label={ errors.visibility && touched.visibility ? errors.visibility : 'Visibility'} // Esto establece la etiqueta para el Select
                                              >
                                                  <MenuItem value="open">Open</MenuItem>
                                                  <MenuItem value="internal">Internal</MenuItem>
                                                  <MenuItem value="restricted">Restricted</MenuItem>
                                              </Select>
                                          </FormControl>
                                      </div>


                                      <div className='flex flex-col space-y-6 w-full mt-6'>                                       
                                          <Autocomplete
                                              className='max-h-[57px]'
                                              multiple
                                              value={values.collaborators}
                                              options={friends}
                                              isOptionEqualToValue={(option, value) => option.id === value.id}
                                              getOptionLabel={(option) => option.name} 
                                              filterOptions={(options, { inputValue }) => {
                                                return options.filter((option) =>
                                                  option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                                                  option.id.toString().includes(inputValue)
                                                );
                                              }}
                                              renderTags={(value, getTagProps) =>
                                                <div className=" overflow-y-auto  max-h-[41px] w-[90%] ">
                                                  {values.collaborators.map((option, index) => (
                                                    <Tooltip                             
                                                      title={currentCollaboratorForTooltip && currentCollaboratorForTooltip.id === option.id ? handleCollaboratorTooltipContent(option) : ""}
                                                      onMouseEnter={() => setCurrentCollaboratorForTooltip(option)}
                                                      onMouseLeave={() => setCurrentCollaboratorForTooltip(null)}
                                                    >                                                      
                                                        <Chip                                                           
                                                          variant="outlined"
                                                          label={option.name}
                                                          {...getTagProps({ index })}
                                                          onDelete={() => {
                                                            const newCollaborators = values.collaborators.filter((collaborator) => collaborator.id !== option.id);
                                                            setFieldValue('collaborators', newCollaborators);
                                                          }}
                                                          sx={{
                                                            cursor: 'pointer', // Esto cambia el cursor a una mano cuando se pasa el mouse sobre el Chip
                                                          }}
                                                        />
                                                    </Tooltip>

                                                  ))}
                                                </div>
                                              }
                                              renderOption={ (props, option) => {
                                                  return (
                                                      <li {...props} 
                                                          
                                                          onClick={() => {
                                                            setSelectedFriend(option);
                                                            setOpenDialog(true);
                                                          }}
                                                          className={`flex p-4 pl-4 hover:bg-gray-200 transition-colors duration-300 ease-in-out cursor-pointer justify-between`}>
                                                        <div className='flex'>
                                                          <ListItemAvatar>
                                                            <Avatar
                                                              alt={option.name}
                                                              src={ option.photoUrl || option.name } 
                                                            />
                                                          </ListItemAvatar>
                                                          <div className='flex flex-col ml-4'>
                                                            <Typography variant="body1">{option.name}</Typography>
                                                            <span className='text-[11px]'>
                                                              {option.id}
                                                            </span>
                                                          </div>
                                                        </div>
                                                      </li>
                                                    );
                                              }}                                          
                                              renderInput={(params) => (
                                                  <TextField
                                                      className=''
                                                      {...params}
                                                      variant="outlined"
                                                      label="Add Collaborators"
                                                      placeholder="Add"
                                                  />
                                              )}
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
                                                          onMouseEnter={() => handleMouseEnter('The Contributor can view open repositories on the layer and contribute new content or comments.', 'contributor')} 
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
                                                  setOpenDialog(false)
                                                  setSelectedFriend(
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
                                                    onClick={() => addFriendAsCollaborator( values, setFieldValue )}
                                                >
                                                  Add
                                                </Button>            
                                              </DialogActions>
                                          </Dialog>

                                          <TextField         
                                              InputLabelProps={{ shrink: errors.description && touched.description }}                             
                                              name="description"
                                              label={ errors.description && touched.description ? errors.description : 'Description' }
                                              multiline
                                              rows={4}
                                              fullWidth
                                              value={values.description}
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              error={!!errors.description && touched.description}
                                          />
                                      </div>



                                      <div className='flex w-full h-full justify-center items-center'>
                                          <button 
                                              className={`w-[95%] h-[55px] rounded-extra p-2 ${buttonDisabled ? 'backdrop-blur-sm' : 'backdrop-blur-sm bg-green-400/20 shadow-sm'} border-[1px] border-gray-400 transition-colors duration-300 ease-in-out transform active:translate-y-[2px]`}
                                              type='submit' disabled={isSubmitting || buttonDisabled }>Create Repository
                                          </button>
                                      </div>

                                  </Form>
                              )}
                          </Formik>

                    )

                }

 
          
            </div>
        </div>
    );
}

