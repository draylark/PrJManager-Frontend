import React, { useState , useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '../../../../../store/store';
import { Formik, Form, Field } from 'formik';
import { TextField, MenuItem, FormControl, Select, InputLabel, Autocomplete, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, SelectChangeEvent } from '@mui/material';
import { ImCancelCircle } from "react-icons/im";
import axios, { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import formbg from '../../../../assets/imgs/formbg.jpg'
import { PuffLoader  } from 'react-spinners';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface ProjectConfigFormProps {
    isProjectConfigFormOpen: boolean;
    setIsProjectConfigFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
    showOptModal: boolean;
    setShowOptModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormValues {
    name: string;
    description: string;
    endDate: string;
    visibility: string;
    tags: string[];
}

interface ApiResponse {
    message: string;
    type: string;
}

export const ProjectConfigForm: React.FC<ProjectConfigFormProps> = ({ isProjectConfigFormOpen, setIsProjectConfigFormOpen, showOptModal, setShowOptModal }) => {

    const location = useLocation();
    const { uid } = useSelector((state: RootState) => state.auth);
    const { currentProject } = useSelector((state: RootState) => state.platypus);
    const { ID } = location.state.project;

    const [isBackgroundReady, setIsBackgroundReady] = useState(false);  
    const [openDialog, setOpenDialog] = useState(false);
    const [tempVisibility, setTempVisibility] = useState(''); 
    const [isAdvancedSettingOpen, setisAdvancedSettingOpen] = useState(false)
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const allTags = currentProject?.tags.map( tag => tag );
    const tags = currentProject?.tags.map((tag, index) => {
        return { id: index + 1, label: tag };
    });

    const renderDialogContentText = () => {
        switch (tempVisibility) {
          case 'public':
            return (
              <DialogContentText>
                Are you sure you want to change the visibility type? The "Public" type will allow access to everyone.
              </DialogContentText>
            );
          case 'private':
            return (
              <DialogContentText>
                Are you sure you want to change the visibility type? The "Private" type will allow access only to the collaborators invited to the project.
              </DialogContentText>
            );
          default:
            return null; // o algún otro componente JSX por defecto
        }
    };

    const formatDate = (date: string) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleVisibilityChange = (
        event: SelectChangeEvent<string>, 
        setFieldValue: (field: string, value: unknown) => void
    ) => {
        const selectedVisibility = event.target.value;
        if (selectedVisibility !== currentProject?.visibility) {
            setTempVisibility(selectedVisibility); // Almacenar temporalmente la nueva visibilidad seleccionada
            setOpenDialog(true); // Abrir el diálogo para confirmar el cambio
        } else {
            // Si la nueva visibilidad es la misma que la actual, no necesitas hacer nada
            setFieldValue('visibility', selectedVisibility); // Actualizar el valor del campo de formulario
        }
    };

    const handleConfirmChange = (setFieldValue: (field: string, value: unknown) => void) => {
        // Confirmar el cambio de visibilidad
        setFieldValue('visibility', tempVisibility); // Actualizar el valor del campo de formulario
        setOpenDialog(false); // Cerrar el diálogo
    };

    const handleCloseDialog = () => {
        setOpenDialog(false); 
    };


    const handleClose = () => {
        const modal = document.getElementById('projectConfigModal');
        if (modal) {
            // Inicia la transición de opacidad a 0
            modal.classList.replace('opacity-100', 'opacity-0');
  
            // Espera a que la animación termine antes de ocultar el modal completamente
            setTimeout(() => {
                setIsProjectConfigFormOpen(false);
            }, 500); // Asume que la duración de tu transición es de 500ms
        }
    };

    const IsTheButtonDisabled = ({ values }: { values: FormValues }) => {
        useEffect(() => {
            const isDisabled = 
                values.name === currentProject?.name 
                && values.visibility === currentProject?.visibility
                && values.description === currentProject?.description 
                && JSON.stringify(values.tags.sort()) === JSON.stringify(allTags?.sort())
                && values.endDate === formatDate(currentProject?.endDate as string)
            setButtonDisabled(isDisabled);
        }, [ values ]);

        return null; 
    };

    const handleSubmit = async( 
        values: FormValues, 
        { setSubmitting, resetForm } : { setSubmitting: (isSubmitting: boolean) => void, resetForm: () => void }
    ) => {
        setIsLoading(true);
        setSubmitting(true)
        try {
            const response = await axios.put(`${backendUrl}/projects/update-project/${ID}`, values, {
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
        preloadImage.src = formbg;
    
        preloadImage.onload = () => {
          setIsBackgroundReady(true); // Indica que la imagen ha cargado
        };
      }, []);
  
    useEffect(() => {
        if (isProjectConfigFormOpen) {
          // Asegúrate de que el modal existe antes de intentar acceder a él
          // Luego, después de un breve retraso, inicia la transición de opacidad
          const timer = setTimeout(() => {
            document.getElementById('projectConfigModal')?.classList.remove('opacity-0');
            document.getElementById('projectConfigModal')?.classList.add('opacity-100');
          }, 20); // Un retraso de 20ms suele ser suficiente
          return () => clearTimeout(timer);
        }
      }, [isProjectConfigFormOpen]);

    useEffect(() => {
        if (showOptModal) {
            setShowOptModal(false);
        }
    }, [showOptModal, setShowOptModal])
    

    return (
        <div className='fixed flex w-screen h-full pb-5 top-0 right-0 justify-center items-center bg-black/30 z-50'>
        <div id="projectConfigModal" 
            style={{
                backgroundImage: isBackgroundReady ? `url(${formbg})` : 'none',
                backgroundPosition: 'top right', // Muestra la parte superior izquierda de la imagen
            }}
            className={`flex flex-col w-[70%] md:w-[50%] md:max-h-[635px] md:h-[635px] items-center rounded-2xl glass2 border-[1px] border-gray-400 transition-opacity duration-300 ease-in-out opacity-0 ${isProjectConfigFormOpen ? '' : 'pointer-events-none'}`}>

            <div className='flex justify-between w-[95%] h-12 ml-auto mr-auto mt-2 p-2 border-b-2 border-b-gray-500'>
                <p className='text-xl text-black'>Project Configuration</p>
                <button onClick={handleClose}>
                        <ImCancelCircle/>
                </button>                   
            </div>
            {
            isLoading || !isBackgroundReady 
            ? ( 
                <div className='flex flex-grow items-center justify-center'>
                    <PuffLoader  color={ !isBackgroundReady ? "#ffffff" : "#32174D" } size={50} /> 
                </div>                         
                )
            :
            <Formik 
                onSubmit={handleSubmit}                 
                initialValues={{
                    name: currentProject?.name,
                    description: currentProject?.description,
                    endDate: formatDate(currentProject?.endDate as string),
                    visibility: currentProject?.visibility,
                    tags: allTags,
                } as FormValues}
            >
            {({ values, setFieldValue, handleChange, isSubmitting }) => (  
                                         
            <Form className='w-[95%] h-full'>
            <IsTheButtonDisabled values={values} />
            {
            !isAdvancedSettingOpen ?        
            (
                <div className='flex flex-col w-full h-full space-y-7 pt-3 pb-6'>
                        <div className='flex w-full hover:text-blue-400 transition-colors duration-300 justify-end h-[15px] transform active:translate-y-[2px]'>
                            <button onClick={() => setisAdvancedSettingOpen(!isAdvancedSettingOpen)}>
                                Advanced Settings
                            </button>                                      
                        </div>

                        <div className="flex w-full space-x-4">
                            <Field
                                style={{width: '50%'}}
                                as={TextField}
                                label="Name"
                                name="name"
                                value={values.name}
                            />

                            <FormControl style={{width: '50%'}}>
                                <InputLabel>Visibility</InputLabel>
                                <Select
                                    name="visibility"
                                    value={values.visibility}
                                    label="Visibility"
                                    onChange={ (e) => handleVisibilityChange( e, setFieldValue ) }
                                >
                                    <MenuItem value="public">Public</MenuItem>
                                    <MenuItem value="private">Private</MenuItem>
                                </Select>
                            </FormControl>

                            
                            <Dialog open={openDialog} onClose={handleCloseDialog}>
                                <DialogTitle>Confirm Visibility Change</DialogTitle>
                                <DialogContent>
                                    { renderDialogContentText()}                                          
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseDialog}>Cancel</Button>
                                    <Button onClick={ () => handleConfirmChange(setFieldValue) } autoFocus>
                                        Confirm
                                    </Button>
                                </DialogActions>
                            </Dialog>

                        </div>

                        <TextField
                            fullWidth
                            name="endDate"
                            label="End Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={values.endDate}
                            onChange={handleChange}
                        />
                        
                        <Autocomplete
                            multiple
                            options={tags && tags.length > 0 ? tags.map((option) => option.label) : []} // Este es el arreglo completo de tags disponibles
                            freeSolo // Permite agregar etiquetas que no están en las opciones
                            value={values.tags} // Este es el arreglo de tags del proyecto
                            onChange={(_, newValue) => {
                                // Aquí asegúrate de que newValue sea un arreglo
                                setFieldValue('tags', newValue.map(tag => tag.startsWith('#') ? tag : `#${tag}`));
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Tags" placeholder="Add tags" />
                            )}
                        />

                        <Field                
                            as={TextField}
                            label="Description"
                            name="description"
                            multiline
                            rows={6}
                            value={values.description}
                        />


                        <div className='flex w-full justify-center'>                                     
                            <button 
                                type="submit"
                                disabled={ buttonDisabled || isSubmitting }
                                className={`w-[95%] h-[55px] rounded-extra ${buttonDisabled ? 'backdrop-blur-sm' : 'backdrop-blur-sm bg-green-400/20 shadow-sm'} border-[1px] border-gray-400 transition-colors duration-300 ease-in-out transform active:translate-y-[2px]`}
                            >
                                Save Changes
                            </button>                                   
                        </div>
                </div>
            ) 
            : 
            (
                <div id='advanced-settings' className='flex flex-col w-full h-full'>
                    <div className='flex justify-between w-full py-4 px-4'>
                        <p className=''>
                            Advanced Settings 
                        </p>

                        <div className='flex justify-end'>
                            <button 
                                className='hover:text-blue-400 transition-colors duration-300 ease-in-out transform active:translate-y-[2px]'
                                onClick={() => setisAdvancedSettingOpen(!isAdvancedSettingOpen)}>
                                Go Back
                            </button>
                        </div>

                    </div>

                    <div className='flex flex-grow flex-col  pt-4 pb-5 overflow-y-auto'>
    

                        <div className='flex flex-col h-[90%] items-center justify-center space-y-4 p-10'>
                                <p className='text-xl text-semibold text-center'>Deleting the project means that all repositories and layers will be permanently deleted.</p>
                                <p>Are you sure you want to delete this project?</p>
                        </div>


                        <div className='flex w-full justify-center'>                                     
                            <button 
                                type="submit"
                                disabled={ buttonDisabled || isSubmitting }
                                className={`w-[95%] h-[55px] rounded-extra backdrop-blur-sm bg-red-500/20 shadow-sm border-[1px] border-gray-400 transition-colors duration-300 ease-in-out transform active:translate-y-[2px]`}
                            >
                                Delete Project
                            </button>                                   
                        </div>


                    </div> 

                </div>
            )}         
            </Form>
            )}
            </Formik>
            }
        </div>
        </div>
    );
}
