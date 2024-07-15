import React, { useState, useEffect } from 'react';
import { Formik, Form,  FieldArray } from 'formik';
import { TextField, Button, ListItem, ListItemText, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material';
import { LiaHandsHelpingSolid } from "react-icons/lia";
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ImCancelCircle } from "react-icons/im";
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar'
import axios from 'axios';
import { useGlobalUsersSearcher } from '../hooks/useGlobalUsersSearcher';
import Partnership from '@ricons/carbon/Partnership';
import RemoveCircleOutlineOutlined from '@ricons/material/RemoveCircleOutlineOutlined'
import Swal from 'sweetalert2';
import modalbg from '../../../../assets/imgs/formbg.jpg'
import { PuffLoader  } from 'react-spinners';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { NewCollaborators } from './NewCollaborators';
import { RootState } from '../../../../../store/store';
import { CollaboratorBase } from '../../../../../interfaces/models';
import { FormikProps } from 'formik';
import { SelectChangeEvent } from '@mui/material';
import { AxiosError } from 'axios';

interface LayerCollaboratorsFormProps {
  setIsLayerCollaboratorsFormOpen: (open: boolean) => void;
  isLayerCollaboratorsFormOpen: boolean;
}
interface CFromServer extends Omit<CollaboratorBase, 'repository' | 'layer'> {
  layer: {
    accessLevel: string;
  };
}
interface Collaborator {
  name: string;
  photoUrl: string | null;
  id: string;
  accessLevel: string;
  new?: boolean;
}
interface FormValues {
  collaborators: Collaborator[];
  newCollaborators: Collaborator[];
  modifiedCollaborators: Collaborator[];
  deletedCollaborators: string[];
}
interface ApiResponse {
  message: string;
  type: string;
}

export const LayerCollaboratorsForm: React.FC<LayerCollaboratorsFormProps> = ({ setIsLayerCollaboratorsFormOpen, isLayerCollaboratorsFormOpen }) => {
    
    const location = useLocation();
    // const dispatch = useDispatch();
    const { uid } = useSelector((stateU: RootState) => stateU.auth); 
    const { users, setSearch } = useGlobalUsersSearcher()

    const { layerID } = location.state.layer;
    const { ID } = location.state.project;

    const [deleteCDialog, setDeleteCDialog] = useState(false);
    const [currentCollaborators, setCurrentCollaborators] = useState<Collaborator[]>([]);   
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isBackgroundReady, setIsBackgroundReady] = useState(false);  
    const [fetchingCollaborators, setFetchingCollaborators] = useState(false);
    const [currentOrNew, setCurrentOrNew] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState({
      name: '',
      accessLevel: '',
      id: ''
    });


    const handleClose = (): void => {
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

    const IsTheButtonDisabled = ({ values }: { values: FormValues }) => {
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

    const handleCollaboratorsData = (collaborators: CFromServer[]) => {

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

    const  handleAccessLevelChange = (
      event: SelectChangeEvent<string>, 
      collaborator: Collaborator, 
      index: number, 
      form: FormikProps<FormValues>, 
      currentCollaborators: Collaborator[]
    ) => {
      const newAccessLevel = event.target.value as string;
  
      // Si el nivel de acceso es igual al actual, no hagas nada
      if (newAccessLevel === collaborator.accessLevel) return;
  
      // Actualiza el nivel de acceso en la lista de colaboradores directamente
      const updatedLayerCollaborators = form.values.collaborators.map((collab, collaboratorIndex) => 
          collaboratorIndex === index ? { ...collab, accessLevel: newAccessLevel } : collab
      );
  
      // Actualiza el estado de Formik para 'layerCollaborators'
      form.setFieldValue('collaborators', updatedLayerCollaborators);
  
      // Si el nivel de acceso es igual al nivel de acceso original, elimina el colaborador modificado de 'modifiedCollaborators'
      const originalCollaborator = currentCollaborators.find(collab => collab.id === collaborator.id);
      if (newAccessLevel === originalCollaborator?.accessLevel) {
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
    };

    const handleSubmit = async( 
      values: FormValues,  
      { setSubmitting, resetForm } : { setSubmitting: (isSubmitting: boolean) => void, resetForm: () => void } 
    ) => {
      setIsLoading(true)
      setSubmitting(true)

      try {
        const response = await axios.put(`${backendUrl}/layer/collaborators/${ID}/${layerID}`, 
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
        const axiosError = error as AxiosError<ApiResponse>

        setSubmitting(false);
        setIsLoading(false);

        if (axiosError.response) {
          if( axiosError?.response.data?.type === 'collaborator-validation' ){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: axiosError.response.data.message
            });
          } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: axiosError.response.data.message,
            });
          }
        } else {
          Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An unexpected error occurred'
          });
        }
      }
    };

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
            document.getElementById('layerCollaboratorModal')?.classList.remove('opacity-0');
            document.getElementById('layerCollaboratorModal')?.classList.add('opacity-100');
          }, 20); // Un retraso de 20ms suele ser suficiente
          return () => clearTimeout(timer);
        }
    }, [isLayerCollaboratorsFormOpen]);

    useEffect(() => {
      setFetchingCollaborators(true)
      axios.get(`${backendUrl}/layer/get-layer-collaborators/${layerID}`, {
          headers: {
              'Authorization': localStorage.getItem('x-token')
          }
      })
      .then((response) => {
        const { collaborators } = response.data
        handleCollaboratorsData(collaborators)
      })
      .catch((error) => {
        console.error('Error fetching layer collaborators:', error);
      });
    }, [layerID]);

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
                    onSubmit={handleSubmit}                    
                    initialValues={{
                      collaborators: currentCollaborators,
                      newCollaborators: [],
                      modifiedCollaborators: [],
                      deletedCollaborators: []
                    } as FormValues }                    
                  >
                    {({ values, setFieldValue }) => (                     
                        <Form className='w-full h-full'>
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
                                        className='w-7 h-7 mr-5 mt-5 hover:text-blue-500 transition-colors duration-200 cursor-pointer' onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                        />
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
                                    const filteredCollaborators: Collaborator[] = form.values.collaborators.filter((collaborator: Collaborator) =>
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
                                                            onChange={e => handleAccessLevelChange(e, collaborator, index, form, currentCollaborators)}                                                             
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
                                                          setSelectedUser(collaborator);
                                                          setDeleteCDialog(true);
                                                        } }
                                                        className="w-5 h-5 ml-4 text-red-300 hover:text-red-500 transition-colors duration-300 cursor-pointer" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                                                    />
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
                              <NewCollaborators
                                values={values}
                                users={users}
                                setSearch={setSearch}
                                setFieldValue={setFieldValue}                                                  
                                setCurrentOrNew={setCurrentOrNew}
                              />
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