import { useState , useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '../../../../store/store';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, MenuItem, FormControl, Select, InputLabel, Autocomplete, Switch, FormControlLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MdOutlineDeleteSweep } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import LoadingCircle from '../../../../auth/helpers/Loading';
import { AdvancedSettings } from './sub-components/AdvancedSettings';
import axios from 'axios';
import Swal from 'sweetalert2';

export const ProjectConfigForm = ({ isProjectConfigFormOpen, setIsProjectConfigFormOpen, showOptModal, setShowOptModal }) => {

    const location = useLocation();
    const { uid } = useSelector((state: RootState) => state.auth);
    const { projects } = useSelector((state: RootState) => state.projects);
    const { ID } = location.state.project;
    const project = projects.find(project => project.pid === ID);

    const [isAdvancedSettingOpen, setisAdvancedSettingOpen] = useState(false)
    const [checked, setChecked] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [IsLoading, setIsLoading] = useState(false);
    const [fetchingCollaborators, setFetchingCollaborators] = useState(false)

    const allTags = project?.tags.map( tag => tag );
    const tags = project.tags.map((tag, index) => {
        return { id: index + 1, label: tag };
    });



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
    }

        
    const projectAdvancedSettings = {
        s2: { id: 's2', label: 'Community level Comments', checked: false, isDisabled: false },
        s3: { id: 's3', label: 'Community level Commits', checked: true, isDisabled: false },
        s4: { id: 's4', label: 'Community level Activy', checked: true, isDisabled: false },
    }


    const repositoryAdvancedSettings = {
        s6: { id: 's6', label: 'Community level Pull Requests', checked: false, isDisabled: true },
        s8: { id: 's8', label: 'Community level Deployments', checked: false, isDisabled: true },
        s10: { id: 's10', label: 'Community level Packages', checked: false, isDisabled: true },
    }
    const IsTheButtonDisabled = ({ values }) => {
        useEffect(() => {
            const isDisabled = 
                                values.name === project.name 
                                && values.description === project.description 
                                && JSON.stringify(values.tags.sort()) === JSON.stringify(allTags.sort())
                                && values.endDate.getTime() === new Date(project.endDate).getTime() 
                                && values.status === project.status 
                                && values.priority === project.priority;

            setButtonDisabled(isDisabled);
        }, [ values ]);
        
        // Utiliza buttonDisabled para cualquier lógica relacionada aquí, o retorna este estado si es necesario
        return null; // Este componente no necesita renderizar nada por sí mismo
    };


    const handleSubmit = async( values, { setSubmitting, resetForm } ) => {
        console.log('Values desde el submit',values, uid)

        setSubmitting(true)
        axios.put(`http://localhost:3000/api/projects/update-project/${ID}`, values,
          {
            params: {
                uid
            },
            headers: {
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('x-token')
            }
          }
        )
        .then((response) => {
          console.log('Project Updated:', response.data)
          handleClose()
        })
        .catch((error) => {
          console.error('Error updating the project:', error);
        });
    }
  
    useEffect(() => {
        if (isProjectConfigFormOpen) {
          // Asegúrate de que el modal existe antes de intentar acceder a él
          // Luego, después de un breve retraso, inicia la transición de opacidad
          const timer = setTimeout(() => {
            document.getElementById('projectConfigModal').classList.remove('opacity-0');
            document.getElementById('projectConfigModal').classList.add('opacity-100');
          }, 20); // Un retraso de 20ms suele ser suficiente
          return () => clearTimeout(timer);
        }
      }, [isProjectConfigFormOpen]);

    useEffect(() => {
        if (showOptModal) {
            setShowOptModal(false);
        }
    }, [showOptModal])
    

    
    if (IsLoading) {
        return <LoadingCircle />;
    }

    return (
        <div className='fixed flex w-screen h-screen pb-5 top-0 right-0 justify-center items-center z-50'>
            <div id="projectConfigModal" className={`flex flex-col w-[70%]  md:w-[50%] md:max-h-[635px] items-center  rounded-2xl bg-white border-[1px] border-black transition-opacity duration-300 ease-in-out opacity-0 ${isProjectConfigFormOpen ? '' : 'pointer-events-none'}`}>

                <div className='flex justify-between w-[95%] h-12 ml-auto mr-auto mt-2 p-2 border-b-2 border-b-gray-500'>
                    <p className='text-xl text-black'>Project Configuration</p>
                    <button onClick={handleClose}>
                          <ImCancelCircle/>
                    </button>                   
                </div>
                {
                    fetchingCollaborators 
                    ? ( <LoadingCircle /> )
                    :
                      <Formik 
                        initialValues={{
                            name: project.name,
                            description: project.description,
                            endDate: new Date(project.endDate),
                            status: project.status,
                            priority: project.priority,
                            tags: allTags,
                            // projectAdvancedSettings: projectAdvancedSettings,
                            // repositoryAdvancedSettings: repositoryAdvancedSettings
                        }}

                        onSubmit={handleSubmit}
                        
                      >
                          {({ values, setFieldValue, handleChange, isSubmitting }) => (
                            
                              <Form className='w-[95%] h-full'>
                                  {console.log('Values:', values)}
                                    <IsTheButtonDisabled values={values} />

                                    {

                                        !isAdvancedSettingOpen
                                        ? (
                                            <div className='flex flex-col w-full h-full space-y-7 py-3'>
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
                    
                                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                            <DatePicker  
                                                                sx={{width: '50%'}}                                     
                                                                label="End Date"
                                                                value={values.endDate}
                                                                onChange={(date) => setFieldValue('endDate', date)}
                                                                renderInput={(params) => <TextField {...params} />}
                                                                minDate={values.startDate}
                                                            />
                                                        </LocalizationProvider>
                                                    </div>
                    
                                                    <div className="flex w-full space-x-4">
                                                        <FormControl style={{width: '50%'}}>
                                                            <InputLabel>Status</InputLabel>
                                                            <Select
                                                                name="status"
                                                                value={values.status}
                                                                label="Status"
                                                                onChange={handleChange}
                                                            >
                                                                <MenuItem value="In Progress">In Progress</MenuItem>
                                                                <MenuItem value="Completed">Completed</MenuItem>
                                                                <MenuItem value="Paused">Paused</MenuItem>
                                                            </Select>
                                                        </FormControl>
                    
                                                        <FormControl style={{width: '50%'}}>
                                                            <InputLabel>Priority</InputLabel>
                                                            <Select
                                                                name="priority"
                                                                value={values.priority}
                                                                label="Priority"
                                                                onChange={handleChange}
                                                            >
                                                                <MenuItem value="High">High</MenuItem>
                                                                <MenuItem value="Medium">Medium</MenuItem>
                                                                <MenuItem value="Low">Low</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                    <Autocomplete
                                                        multiple
                                                        options={tags.map((option) => option.label)} // Este es el arreglo completo de tags disponibles
                                                        freeSolo // Permite agregar etiquetas que no están en las opciones
                                                        value={values.tags} // Este es el arreglo de tags del proyecto
                                                        onChange={(event, newValue) => {
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
                                        : (
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

                                               <div className='flex flex-col pl-4 pt-4 pb-8 overflow-y-auto'>
                                

                                                    <div className='flex flex-col items-center justify-center space-y-4 p-10'>
                                                            <p className='text-xl text-semibold text-center'>Deleting the project means that all repositories and layers will be permanently deleted.</p>
                                                            <p>Are you sure you want to delete this project?</p>
                                                    </div>

                                                    <div className='flex flex-grow justify-center items-center'>
                                                            <button 
                                                                type='button'
                                                                className={`w-[95%] h-[55px] rounded-extra backdrop-blur-sm bg-red-500/20 shadow-sm border-[1px] border-gray-400 transition-colors duration-300 ease-in-out transform active:translate-y-[2px]`}>
                                                                Delete Project
                                                            </button>
                                                    </div>


                                                </div> 

                                            </div>
                                          )
                                    }
                              </Form>
                          )}
                    </Formik>
                }
            </div>
        </div>
    );
}
