import React, { useState, useEffect } from 'react'
import { Formik, Form } from 'formik';
import { TextField, Select, MenuItem, InputLabel, FormControl, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, SelectChangeEvent } from '@mui/material'
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store/store';
import { ImCancelCircle } from "react-icons/im";
import axios, { AxiosError } from 'axios';
import bgform from '../../../../assets/imgs/formbg.jpg'
import { PuffLoader  } from 'react-spinners';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { LayerBase } from '../../../../../interfaces/models';



const LayerSchema = Yup.object().shape({
    name: Yup.string().required('Group name is required'),
    description: Yup.string(),
    visibility: Yup.string().required('Visibility is required'),
});

interface LayerConfigFormProps {
    layer: LayerBase;
    setIsLayerConfigFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isLayerConfigFormOpen: boolean;
}

interface ApiResponse {
    message: string;
    type: string;
}

interface FormValues {
    name: string;
    description: string;
    visibility: string;
}


export const LayerConfigForm: React.FC<LayerConfigFormProps> = ({ layer, setIsLayerConfigFormOpen, isLayerConfigFormOpen }) => {

    // const dispatch = useDispatch();
    const location = useLocation();
    const { uid } = useSelector( (selector: RootState) => selector.auth);

    const { ID } = location.state.project;
    const { layerID } = location.state.layer;

    const [IsLoading, setIsLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [tempVisibility, setTempVisibility] = useState<string>(''); 
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [isBackgroundReady, setIsBackgroundReady] = useState(false);  


    const renderDialogContentText = () => {
        switch (tempVisibility) {
          case 'open':
            return (
              <DialogContentText>
                Are you sure you want to change the visibility type? The "Open" type will allow all project collaborators to access the layer, if the project is open, it will allow all users in prjmanager to access it as well.
              </DialogContentText>
            );
          case 'internal':
            return (
              <DialogContentText>
                Are you sure you want to change the visibility type? The "Internal" type will allow access to the layer only to the collaborators of the project.
              </DialogContentText>
            );
          case 'restricted':
            return (
              <DialogContentText>
                Are you sure you want to change the visibility type? The "Restricted" type will allow access to the layer only to the collaborators invited exclusively.
              </DialogContentText>
            );
          default:
            return null; // o algún otro componente JSX por defecto
        }
    };

    const handleVisibilityChange = (
        event: SelectChangeEvent<string>, 
        setFieldValue: (field: string, value: unknown) => void
    ) => {
        const selectedVisibility = event.target.value as string;
        if (selectedVisibility !== layer?.visibility) {
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
        const modal = document.getElementById('layerConfigModal');
        if (modal) {
            // Inicia la transición de opacidad a 0
            modal.classList.replace('opacity-100', 'opacity-0');

            // Espera a que la animación termine antes de ocultar el modal completamente
            setTimeout(() => {
                setIsLayerConfigFormOpen(false);
            }, 500); // Asume que la duración de tu transición es de 500ms
        }
    };

    const IsTheButtonDisabled = ({values}: {values: FormValues}) => {
        useEffect(() => {
            const isDisabled = values.name === layer.name && values.description === layer.description && values.visibility === layer.visibility;
            setButtonDisabled(isDisabled);
        }, [values]);
        
        // Utiliza buttonDisabled para cualquier lógica relacionada aquí, o retorna este estado si es necesario
        return null; // Este componente no necesita renderizar nada por sí mismo
    };

    const handleSubmit = async (
        values: FormValues, 
        { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void, resetForm: () => void }
    ) => {
        setIsLoading(true);
        setSubmitting(true);

        try {
            const response = await axios.put(`${backendUrl}/layer/update-layer/${ID}/${layerID}`, values, 
            { 
                params: {
                    uid
                },
                headers: { 
                    'Authorization': localStorage.getItem('x-token') 
                } 
            } )

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
                      text: axiosError.response.data.message || 'Access Validation'
                  });
                } else {
                  Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: axiosError.response.data.message || 'An unexpected error occurred',
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
        preloadImage.src = bgform;
    
        preloadImage.onload = () => {
          setIsBackgroundReady(true); // Indica que la imagen ha cargado
        };
    }, []);

    useEffect(() => {
        if (isLayerConfigFormOpen) {
          const timer = setTimeout(() => {
            document.getElementById('layerConfigModal')?.classList.remove('opacity-0');
            document.getElementById('layerConfigModal')?.classList.add('opacity-100');
          }, 20); // Un retraso de 20ms suele ser suficiente
          return () => clearTimeout(timer);
        }
    }, [isLayerConfigFormOpen]);

  return (

    <div className='fixed flex w-screen h-full top-0 right-0 justify-center items-center bg-black/30 z-50'>
        <div 
            id="layerConfigModal" 
            style={{ 
                backgroundImage: isBackgroundReady ? `url(${bgform})` : 'none',
                backgroundPosition: 'bottom center'

            }}
            className={`flex flex-col space-y-7 w-[70%] glass2 border-[1px] border-gray-400 md:w-[40%] md:h-[450px] max-h-[560px] rounded-2xl pb-4 overflow-y-auto  transition-opacity duration-500 ease-in-out opacity-0 ${isLayerConfigFormOpen ? '' : 'pointer-events-none'}`}>
            
            <div className='flex justify-between w-[95%] h-12 ml-auto mr-auto mt-2 p-2 border-b-2 border-b-gray-500'>
                <p className='text-xl text-black'>Layer Configuration</p>
                <button onClick={handleClose}>
                        <ImCancelCircle/>
                </button>       
            </div>
            
            { 
                IsLoading || !isBackgroundReady
                ? ( 
                    <div className='flex flex-grow items-center justify-center'>
                        <PuffLoader  color={ !isBackgroundReady ? "#ffffff" : "#32174D" } size={50} /> 
                    </div>                         
                  )   
                : ( 
                        <Formik
                            initialValues={{
                                name: layer.name,
                                description: layer.description,
                                visibility: layer.visibility                                                    
                            } as FormValues }
                            validationSchema={LayerSchema}                     
                            onSubmit={handleSubmit}
                        >
                    
                            {({ isSubmitting, values, setFieldValue, handleChange, handleBlur }) => (                   
                                <Form className='flex flex-col h-full space-y-4 mx-auto w-[95%]'>
                                    <IsTheButtonDisabled values={values} />

                                    <TextField                                      
                                        name="name"
                                        label="Layer Name"                             
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
                                        onChange={ (e) => handleVisibilityChange( e, setFieldValue ) }
                                        onBlur={handleBlur}
                                        label="Visibility" // Esto establece la etiqueta para el Select
                                    >
                                        <MenuItem value="open">Open</MenuItem>
                                        <MenuItem value="internal">Internal</MenuItem>
                                        <MenuItem value="restricted">Restricted</MenuItem>
                                    </Select>
                                    </FormControl>

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

                                                                           

                                    <div className='flex w-full h-full space-x-2 justify-center items-center'>                           
                                        <button 
                                            className={`w-[95%] h-[55px] rounded-extra p-2 ${ buttonDisabled ? 'backdrop-blur-sm' : 'backdrop-blur-sm bg-green-400/20 shadow-sm' } border-[1px] border-gray-400 transition-colors duration-300 ease-in-out transform active:translate-y-[2px]`} 
                                            type="submit" disabled={ buttonDisabled || isSubmitting }>Update Layer
                                        </button>
                                    </div>

                                </Form>
                            )}
                        </Formik>
                )
            }             
        </div>
    </div>


  )
}
