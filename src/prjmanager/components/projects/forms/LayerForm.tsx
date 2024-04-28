import { FC, useEffect, useState } from 'react';
import { Formik, Form, FormikHelpers,  } from 'formik';
import { TextField, FormControl, Select, InputLabel, MenuItem, Tooltip, Typography } from '@mui/material'

import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { addNewLayer } from '../../../../store/gitlab/gitlabSlice';
import { loadNewLayer } from '../../../../store/gitlab/thunks';
import { LiaQuestionCircleSolid } from "react-icons/lia";
import bgform from './assets/formbg.jpg'
import axios from 'axios';

import Swal from 'sweetalert2';
import LoadingCircle from '../../../../auth/helpers/Loading';
import { ImCancelCircle } from "react-icons/im";
import { PuffLoader  } from 'react-spinners';

import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';

// Validation schema
const LayerSchema = Yup.object().shape({
  name: Yup.string().required('Layer name is required'),
  description: Yup.string().required('Description is required'),
  visibility: Yup.string().required('Visibility is required'),
});

interface LayerValues {
    name: string,
    description: string,
    visibility: string,
    creator: string

}

interface LayerProps {
    setIsLayerModalOpen: (value: boolean) => void;
}

export const LayerForm: FC<LayerProps> = ({ isLayerFormOpen, setIsLayerFormOpen, showOptModal, setShowOptModal }) => {

    const dispatch = useDispatch();
    const location = useLocation();
    const { uid } = useSelector( (selector: RootState) => selector.auth);
    const [IsLoading, setIsLoading] = useState(false);

    const { ID } = location.state?.project;


    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [tooltipOpen, setTooltipOpen] = useState('');
    const [tooltipContent, setTooltipContent] = useState('');

    const handleSubmit = async(values: LayerValues, { setSubmitting, resetForm }: FormikHelpers<LayerValues>) => {
        setIsLoading(true);
        setSubmitting(true);  

        try {
            const response = await axios.post(`http://localhost:3000/api/layer/create-layer/${ID}`, values, {
                withCredentials: true,
                params: {
                    uid
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('x-token')
                }
            });


            resetForm();
            setSubmitting(false);         
            setIsLoading(false);

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: response.data.message
            });
            
            dispatch( loadNewLayer( response.data.newLayer ) )

        } catch (error) {
            setSubmitting(false);
            setIsLoading(false);

            if(  error.response.data?.type === 'layers-limit' ){
                handleClose();
                Swal.fire({
                    icon: 'info',
                    title: 'Project layers limit reached\n ( 3 layers )',
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

    const handleClose = () => {
        const modal = document.getElementById('layerFormModal');
        if (modal) {
            // Inicia la transición de opacidad a 0
            modal.classList.replace('opacity-100', 'opacity-0');
  
            // Espera a que la animación termine antes de ocultar el modal completamente
            setTimeout(() => {
                setIsLayerFormOpen(false);
            }, 500); // Asume que la duración de tu transición es de 500ms
        }
    }


    const IsTheButtonDisabled = ({ values }) => {
        useEffect(() => {
            const isDisabled = values.name === '' && values.description === '' && values.visibility === '';
            setButtonDisabled(isDisabled);
        }, [values]);
        
        // Utiliza buttonDisabled para cualquier lógica relacionada aquí, o retorna este estado si es necesario
        return null; // Este componente no necesita renderizar nada por sí mismo
    };
    const handleMouseEnter = (text, type) => {
        setTooltipContent(text);
        setTooltipOpen(type);
    };
     const handleMouseLeave = () => {
        setTooltipOpen('');
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
        if (isLayerFormOpen) {
          // Asegúrate de que el modal existe antes de intentar acceder a él
          // Luego, después de un breve retraso, inicia la transición de opacidad
          const timer = setTimeout(() => {
            document.getElementById('layerFormModal').classList.remove('opacity-0');
            document.getElementById('layerFormModal').classList.add('opacity-100');
          }, 20); // Un retraso de 20ms suele ser suficiente
          return () => clearTimeout(timer);
        }
      }, [isLayerFormOpen]);

    useEffect(() => {
    if(showOptModal){
        setShowOptModal(false);
    }
    }, [showOptModal])


    return (
        <div className='fixed flex w-screen h-screen top-0 right-0 justify-center items-center bg-black/30 z-50'>
            <div 
                id='layerFormModal' 
                style={{ 
                    backgroundImage: isBackgroundReady ? `url(${bgform})` : 'none',
                    backgroundPosition: 'top center'
                }}
                className={`flex flex-col w-[70%]  md:w-[580px] md:h-[455px] pb-5 rounded-2xl glass2 border-[1px] border-gray-400 transition-opacity duration-300 ease-in-out opacity-0 ${isLayerFormOpen ? '' : 'pointer-events-none'}`}>

                <div className='flex justify-between w-[95%] h-12 ml-auto mr-auto mt-2 p-2 border-b-2 border-b-gray-500'>
                    <p className='text-xl text-black'>Create a new Layer</p>
                    <button onClick={handleClose}>
                          <ImCancelCircle/>
                    </button>                   
                </div>
                { 
                    IsLoading || !isBackgroundReady
                    ? (  
                        <div className='flex flex-grow items-center justify-center'>
                          <PuffLoader  color="#32174D" size={50} /> 
                        </div>   
                      )    
                    : ( 

                        <Formik
                            initialValues={{
                                name: '',
                                description: '',
                                visibility: '',
                                parent_id: '80502948',
                                creator: uid                                   
                            } as LayerValues }
                            validationSchema={LayerSchema}
                            onSubmit={handleSubmit}
                        >
                        
                            {({ isSubmitting, values, handleChange, handleBlur, errors, touched }) => (                              
                                
                                <Form className='flex flex-col ml-auto mr-auto w-[95%] h-full mt-5 '>
                                    <IsTheButtonDisabled values={values} />

                                    <div className='flex flex-col pt-2 space-y-4 w-full h-[300px] '>
                                        <TextField        
                                            InputLabelProps={{ shrink: errors.name && touched.name }}                              
                                            name="name"
                                            label={ errors.name && touched.name ? errors.name : 'Layer Name' }
                                            fullWidth
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={!!errors.name && touched.name}
                                        />

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

                                        <FormControl 
                                            fullWidth
                                            error={!!errors.visibility && touched.visibility}
                                            >                      
                                            <InputLabel id="visibility">{errors.visibility && touched.visibility ? errors.visibility : 'Visibility'}</InputLabel>                                          
                                            <Select
                                                labelId="visibility-label"
                                                label={ errors.visibility && touched.visibility ? errors.visibility : 'Visibility'}
                                                id="visibility"
                                                name="visibility"
                                                value={values.visibility}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            >
                                                <MenuItem value="open">
                                                    <div className='flex flex-grow justify-between'>
                                                        <Typography>Open</Typography>
                                                        <Tooltip 
                                                            title={tooltipContent} 
                                                            open={tooltipOpen === 'open'} 
                                                            arrow={true} 
                                                            placement="right" 
                                                            enterTouchDelay={50} 
                                                            leaveTouchDelay={400} 
                                                            leaveDelay={200} 
                                                            enterDelay={100}
                                                        >   
                                                            <div 
                                                            onMouseEnter={() => handleMouseEnter('The open layer allows access to all users in PrJManager.', 'open')} 
                                                            onMouseLeave={handleMouseLeave}
                                                            >
                                                            <LiaQuestionCircleSolid />
                                                            </div>
                                                        </Tooltip> 
                                                    </div>
                                                </MenuItem>   
                                                <MenuItem value="internal">
                                                    <div className='flex flex-grow justify-between'>
                                                        <Typography>Internal</Typography>
                                                        <Tooltip 
                                                            title={tooltipContent} 
                                                            open={tooltipOpen === 'internal'} 
                                                            arrow={true} 
                                                            placement="right" 
                                                            enterTouchDelay={50} 
                                                            leaveTouchDelay={400} 
                                                            leaveDelay={200} 
                                                            enterDelay={100}
                                                        >   
                                                            <div 
                                                            onMouseEnter={() => handleMouseEnter('The internal layer only allows access to all collaborators in the project.', 'internal')} 
                                                            onMouseLeave={handleMouseLeave}
                                                            >
                                                            <LiaQuestionCircleSolid />
                                                            </div>
                                                        </Tooltip> 
                                                    </div>
                                                </MenuItem>   
                                                <MenuItem value="restricted">
                                                    <div className='flex flex-grow justify-between'>
                                                        <Typography>Restricted</Typography>
                                                        <Tooltip 
                                                            title={tooltipContent} 
                                                            open={tooltipOpen === 'restricted'} 
                                                            arrow={true} 
                                                            placement="right" 
                                                            enterTouchDelay={50} 
                                                            leaveTouchDelay={400} 
                                                            leaveDelay={200} 
                                                            enterDelay={100}
                                                        >   
                                                            <div 
                                                            onMouseEnter={() => handleMouseEnter('The restricted layer only allows access to users who are supported as collaborators on the layer.', 'restricted')} 
                                                            onMouseLeave={handleMouseLeave}
                                                            >
                                                            <LiaQuestionCircleSolid />
                                                            </div>
                                                        </Tooltip> 
                                                    </div>
                                                </MenuItem>   

                                            </Select>
                                        </FormControl>

                                    </div>


                                    <div className='flex flex-grow space-x-2 px-4'>
                                        <button 
                                            className={`w-full h-[55px] rounded-extra p-2 ${ buttonDisabled ? 'backdrop-blur-sm' : 'backdrop-blur-sm bg-green-400/20 shadow-sm' } border-[1px] border-gray-400 transition-colors duration-300 ease-in-out transform active:translate-y-[2px]`}
                                            type='submit' disabled={ buttonDisabled || isSubmitting }>Create Layer</button>
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