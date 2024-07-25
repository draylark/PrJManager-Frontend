import React, { useState, useEffect } from 'react'
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { ImCancelCircle } from "react-icons/im";
import { Formik, Form } from 'formik';
import { TextField, Select, MenuItem, Autocomplete,FormControl, InputLabel, Chip } from '@mui/material';
import projectform from '../../../../assets/imgs/projectform.jpg'
import { PuffLoader  } from 'react-spinners';
import { ReadmeEditor } from '../sub-components/ReadmeEditor';
import axios, { AxiosError} from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;


interface ProjectFormProps {
    uid: string;
    isProjectFormOpen: boolean;
    setIsProjectFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
interface FormValues {
    name: string;
    description: string;
    visibility: string;
    tags: string[];
    endDate: Date | null;
    readmeContent: string;
}
interface ApiResponse {
    message: string;
    type: string;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ uid, isProjectFormOpen, setIsProjectFormOpen }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [nextStep, setNextStep] = useState(false);
    const [firstTime, setFirstTime] = useState(true);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [isBackgroundReady, setIsBackgroundReady] = useState(false); 

    const generateReadmeContent = (
        values: FormValues, 
        setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => void
    ) => {
        if(firstTime){
            const content = `
# ${values.name}
${values.description}

## Tags
${values.tags.length > 0 ? values.tags.join(' ') : 'No tags specified'}
            `;
        setFieldValue('readmeContent', content)
        setFirstTime(false)
        }
    };

    const handleClose = () => {
        const modal = document.getElementById('projectFormModal');
        if (modal) {
            // Inicia la transición de opacidad a 0
            modal.classList.replace('opacity-100', 'opacity-0');

            // Espera a que la animación termine antes de ocultar el modal completamente
            setTimeout(() => {
                setIsProjectFormOpen(false);
            }, 500); // Asume que la duración de tu transición es de 500ms
        }
    };

    const IsTheButtonDisabled = ({ values }: { values: FormValues}) => {
        useEffect(() => {
            const isDisabled = 
              values.name.length === 0 
              || values.visibility === ''
              || values.description.length === 0
              || values.endDate === null
            setButtonDisabled(isDisabled);
        }, [ values ]);
        
        // Utiliza buttonDisabled para cualquier lógica relacionada aquí, o retorna este estado si es necesario
        return null; // Este componente no necesita renderizar nada por sí mismo
    };

    const handleSubmit = async( 
            values: FormValues, 
            { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void, resetForm: () => void } 
        ) => {
        setIsLoading(true)
        setSubmitting(true)
        setNextStep(false)

        try {
            const res = await axios.post(`${backendUrl}/projects/create-project`, values, {
                params: {
                    uid
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('x-token')
                }
            })
            resetForm()
            setSubmitting(false)
            handleClose()
            Swal.fire({
                title: 'Project Created',
                text: res.data.message || 'Your project has been created successfully',
                icon: 'success',
                confirmButtonText: 'Ok'
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            setSubmitting(false);
            setIsLoading(false);
    
            if (axiosError.response) {
              if( axiosError?.response.data?.type === 'projects-limit' ){
                Swal.fire({
                    icon: 'error',
                    title: 'User Projects limit reached\n ( 3 projects )',
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
        if (isProjectFormOpen) {
            // Asegúrate de que el modal existe antes de intentar acceder a él
            // Luego, después de un breve retraso, inicia la transición de opacidad
            const timer = setTimeout(() => {
            document.getElementById('projectFormModal')?.classList.remove('opacity-0');
            document.getElementById('projectFormModal')?.classList.add('opacity-100');
            }, 20); // Un retraso de 20ms suele ser suficiente
            return () => clearTimeout(timer);
        }
    }, [isProjectFormOpen]);

    useEffect(() => {
        const preloadImage = new Image(); // Crea una nueva instancia para cargar la imagen
        preloadImage.src = projectform;
    
        preloadImage.onload = () => {
          setIsBackgroundReady(true); // Indica que la imagen ha cargado
        };
    }, []);


  return (
    <div id="projectForm" className='fixed flex w-screen h-full pb-5 top-0 right-0 justify-center items-center bg-black/30 z-50'>
        <div 
            id="projectFormModal"
            className={`flex flex-col space-y-5 w-[70%] md:w-[50%] rounded-2xl pb-4 border-[1px] glass2 border-gray-400 transition-opacity duration-300 ease-in-out opacity-0 ${isProjectFormOpen ? '' : 'pointer-events-none'}`}
            style={{
                backgroundImage: `url(${projectform})`,
                backgroundPosition: 'bottom right'
            }}
        >
        <div className='flex justify-between w-[95%] h-12 ml-auto mr-auto mt-2 p-2 border-b-2 border-b-gray-500'>
            <p className='text-xl text-black'>Create a new Project</p>
            <button onClick={handleClose}>
                    <ImCancelCircle/>
            </button>                   
        </div>

        {
            isLoading || !isBackgroundReady 
            ? (
                <div className="flex h-[468px] items-center justify-center ">
                    <PuffLoader color={'#007BFF'} loading={true} size={150} />
                </div>
                )
            
            :
            <div className='flex flex-col w-[95%] h-[80%] ml-auto mr-auto mt-2 p-2'>
                <Formik
                    initialValues={{
                        name: '',
                        description: '',
                        visibility: '',
                        tags: [],
                        endDate: null,
                        readmeContent: ''
                    } as FormValues}
                    
                    validationSchema={Yup.object({
                        name: Yup.string().required('Required'),
                        description: Yup.string().required('Required'),
                        visibility: Yup.string().required('Required'),
                        endDate: Yup.date().required('Required')
                    })}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, isSubmitting, handleChange, setFieldValue, handleBlur }) => (
                        <Form className='flex flex-col space-y-8'>
                            <IsTheButtonDisabled values={values} />
                            {
                            nextStep 
                            ?  <ReadmeEditor setNextStep={setNextStep} readmeContent={values.readmeContent}  setFieldValue={setFieldValue} /> 
                            :  
                                <>
                                <div className='flex space-x-2'>

                                    <TextField
                                        id="name"
                                        name="name"
                                        value={values.name}
                                        label="Project Name"
                                        variant="outlined"
                                        onChange={handleChange}
                                        fullWidth
                                    />

                                    <FormControl fullWidth>

                                        <InputLabel id="visibility">Project Visibility</InputLabel>
                                        <Select
                                            id="visibility"
                                            name="visibility"
                                            value={values.visibility}
                                            label="Project Visibility"
                                            variant="outlined"
                                            className='w-full'
                                            onChange={handleChange}
                                        >
                                            <MenuItem value=''>Select Project Visibility</MenuItem>
                                            <MenuItem value='public'>Public</MenuItem>
                                            <MenuItem value='private'>Private</MenuItem>
                                        </Select>        
                                    </FormControl>

                                </div>


                                <div className="flex flex-col space-y-6">
                                    <TextField
                                        name="endDate"
                                        label={ errors.endDate && touched.endDate ? 'EndDate is required' : 'End Date'}
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                        value={values.endDate ? values.endDate : ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!errors.endDate && touched.endDate} // Muestra error si hay error y el campo fue tocado
                                    />

                                    <Autocomplete
                                        multiple
                                        id="tags-autocomplete"
                                        options={values.tags} // Opciones actuales
                                        freeSolo
                                        value={values.tags}
                                        onChange={(_, newValue) => {
                                        // Formatear etiquetas para reemplazar espacios por guiones
                                        const formattedTags = newValue.map((tag) => {
                                            const cleanedTag = tag.trim();
                                            const tagWithHyphens = cleanedTag.replace(/\s+/g, '-');
                                            return tagWithHyphens.startsWith('#') ? tagWithHyphens : `#${tagWithHyphens}`;
                                        });

                                        const uniqueTags = Array.from(new Set(formattedTags)); // Elimina duplicados
                                        setFieldValue('tags', uniqueTags); // Actualiza el estado con las etiquetas formateadas
                                        }}
                                        renderTags={(value, getTagProps) => (
                                        <div
                                            className="max-h-[40px] overflow-y-auto" // Limita la altura para el scroll vertical
                                        >
                                            {value.map((option, index) => (
                                            <Chip
                                                variant="outlined"
                                                label={option}
                                                {...getTagProps({ index })}
                                            />
                                            ))}
                                        </div>
                                        )}
                                        renderInput={(params) => (
                                        <TextField {...params} label="Tags" fullWidth />
                                        )}
                                    />
                                </div>


                                <TextField
                                    id="description"
                                    name="description"
                                    label="Description"
                                    value={values.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    multiline
                                    fullWidth
                                    rows={4}
                                />

                                <div className='flex w-full h-full justify-center items-center'>
                                        <button 
                                            onClick={() => {
                                                generateReadmeContent(values, setFieldValue)
                                                setNextStep(true)
                                            }}
                                            className={`w-[95%] h-[55px] rounded-extra p-2 ${buttonDisabled ? 'backdrop-blur-sm' : 'backdrop-blur-sm bg-green-400/20 shadow-sm'} border-[1px] border-gray-400 transition-colors duration-300 ease-in-out transform active:translate-y-[2px]`}
                                            disabled={isSubmitting || buttonDisabled }>Next
                                        </button>
                                </div>                                              
                            </>
                            }
                        </Form>
                    )}
                </Formik>
            </div>
        }
        </div>
    </div>
  )
}
