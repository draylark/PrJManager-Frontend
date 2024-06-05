import { useState, useEffect } from 'react'
import axios from 'axios';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { PuffLoader  } from 'react-spinners';
import { useLocation } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Formik, Form } from 'formik';
import { useGlobalUsersSearcher } from '../../../forms/hooks/useGlobalUsersSearcher';
import { styled } from '@mui/system';
import { TextField, Select, MenuItem, FormControl, InputLabel, InputAdornment , Chip, Box, Accordion, AccordionSummary, AccordionDetails, Typography, Tooltip, Autocomplete, ListItemAvatar, Avatar, Popover, Popper } from '@mui/material';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const CustomPopper = styled(Popper)({
    maxHeight: '200px', // Limita la altura del menú desplegable
    overflowY: 'auto', // Habilita el desplazamiento vertical
});
  
const TaskSchema = Yup.object().shape({
    task_name: Yup.string().required('Task name is required'),
    task_description: Yup.string().required('Task description is required'),
    goals: Yup.array().min(1, 'Provide at least 1 goal for the task'),
    priority: Yup.string().oneOf(['Low', 'Medium', 'High', 'Critical']).required('Priority is required'),
    type: Yup.string().oneOf(['open', 'assigned']).required('Type is required'),
    deadline: Yup.date().required('Deadline is required'),
    additional_info: Yup.object({
    estimated_hours: Yup.number()
        .min(1, 'Estimated hours must be at least 1')
        .required('Estimated hours are required'),
    }),
    assigned_to: Yup.string().when('type', (type, schema) => {
    if (type.includes('assigned')) {
        return schema.required('Assigned to is required');
    }
    return schema.nullable();
    }),
});


export const TaskForm = ({ uid, setTaskFormOpen, setGoalsExpanded, goalsExpanded, isAssigned, setIsAssigned }) => {
    // Asumiendo que tienes las siguientes constantes de estado para controlar el diálogo
    const location = useLocation()

    const [isLoading, setIsLoading] = useState(false)
    const [buttonDisabled, setButtonDisabled] = useState(true)
    const [goalDescription, setGoalDescription] = useState('')
    const { users, setSearch } = useGlobalUsersSearcher()

    const { ID } = location.state.project;
    const { layerID } = location.state.layer;
    const { repoID } = location.state.repository;

    const MAX_CHARACTERS = 20; 

    const handleTypeChange = (e, handleChange) => {
        // Lógica personalizada basada en el valor seleccionado
        const selectedValue = e.target.value;

        if (selectedValue === "open") {
            setIsAssigned(false);
        // Ejecuta cualquier lógica específica aquí
        } else if (selectedValue === "assigned") {
            setIsAssigned(true);
        // Ejecuta cualquier lógica específica aquí
        }

        // Llama a handleChange de Formik para asegurarte de que el estado del formulario se actualice
        handleChange(e); 
    };

    const handleDeleteGoal = (goalIndex, setFieldValue, goals) => () => {
        // Elimina el objetivo basado en su índice
        setFieldValue('goals', goals.filter((_, index) => index !== goalIndex));
    };

    const handleKeyDown = (event, setFieldValue, goals) => {
    // Captura solo el evento de Enter y verifica que la descripción no esté vacía
    if (event.key === 'Enter' && goalDescription.trim() !== '') {
        event.preventDefault(); // Previene la acción por defecto para no enviar el formulario

        // Agrega el nuevo objetivo basado en su descripción
        setFieldValue('goals', [...goals, goalDescription])

        // Resetea el campo de descripción para agregar un nuevo objetivo
        setGoalDescription('');
    }
    };

    const IsTheButtonDisabled = ({values}) => {

        useEffect(() => {
            const isDisabled = values.goals.length === 0 && values.task_name === '' && values.task_description === '' && values.priority === '' && values.type === '';
            setButtonDisabled(isDisabled);
        }, [values]);
        
        // Utiliza buttonDisabled para cualquier lógica relacionada aquí, o retorna este estado si es necesario
        return null; // Este componente no necesita renderizar nada por sí mismo
    };

    const handleNameChange = (value, setFieldValue) => {
        const inputValue = value
        const formattedValue = inputValue.replace(/\s+/g, '-'); // Reemplaza espacios por guiones
        setFieldValue('task_name', formattedValue);
    };

    const handleEstimatedHoursChange = (value, setFieldValue) => {
        const inputValue = value;

        // Permitir solo números, puntos decimales y signo negativo (para valores negativos)
        const validValue = inputValue.replace(/[^0-9.-]/g, ''); // Elimina cualquier carácter no numérico
        setFieldValue('additional_info.estimated_hours', validValue ? parseFloat(validValue) : 0);
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setIsLoading(true);
        setSubmitting(true);
        console.log('valores del formulario',values)

        try {
            const response = await axios.post(`${backendUrl}/tasks/${ID}/${layerID}/${repoID}`, values, 
            { 
                params: {
                     uid
                },
                headers: { 
                    'Authorization': localStorage.getItem('x-token') 
                } 
            } )

            // resetForm();
            setSubmitting(false);         
            setIsLoading(false);

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: response.data.message
            });

        } catch (error) {
            console.log(error)
            setSubmitting(false);
            setIsLoading(false);
            
            if(  error.response.data?.type === 'collaborator-validation' ){
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

    return (
        isLoading 
        ? ( 
            <div className='flex flex-grow items-center justify-center'>
                <PuffLoader  color="#32174D" size={50} /> 
            </div>                         
          )
        : 
          (
            <Formik
                initialValues={{
                project: ID,
                layer_related_id: layerID,
                repository_related_id: repoID,
                task_name: '',
                task_description: '',
                goals: [],
                additional_info: {
                    estimated_hours: 0,
                    actual_hours: 0,
                    notes: []
                },
                priority: '', // Valor por defecto
                type: '', // Valor por defecto
                deadline: null,
                assigned_to: null,
                creator: uid
                }}
                validationSchema={TaskSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, handleChange, handleBlur, isSubmitting, errors, touched }) => (
                <Form 
                    className="flex flex-col h-full space-y-7 mx-auto w-[95%] pt-5 pb-4 overflow-y-auto">
                    {console.log(values)}
                    <IsTheButtonDisabled values={values} />
                    
                    <div className='flex space-x-2'>
                        <TextField       
                            InputLabelProps={{ shrink: errors.task_name && touched.task_name }}
                            name="task_name"
                            label={ errors.task_name && touched.task_name ? 'Task name is required' : 'Task Name' }
                            fullWidth
                            value={values.task_name}
                            onChange={(e) => handleNameChange(e.target.value, setFieldValue)}
                            onBlur={handleBlur}
                            
                            error={!!errors.task_name && touched.task_name} // Muestra error si hay error y el campo fue tocado
                        />            


                        <TextField
                            name="deadline"
                            label={ errors.deadline && touched.deadline ? 'Deadline is required' : 'Deadline'}
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={values.deadline ? values.deadline : ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={!!errors.deadline && touched.deadline} // Muestra error si hay error y el campo fue tocado
                        />
                    </div>

                    <div className='flex space-x-2'>
                        <FormControl  fullWidth error={!!errors.priority && touched.priority} >          
                            <InputLabel 
                                id="priority-label" 
                                style={{ color: 'black' }}
                                >{ errors.priority && touched.priority ? 'Priority is required' : 'Priority' }</InputLabel>
                            <Select
                                labelId="priority-label"
                                id="priority"
                                name="priority"
                                value={values.priority}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                label={errors.priority && touched.priority ? 'Priority is required' : 'Priority'}
                            >
                                <MenuItem value="Low">Low</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="High">High</MenuItem>
                                <MenuItem value="Critical">Critical</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth error={!!errors.type && touched.type}>
                            <InputLabel 
                                id="type-label" 
                                style={{ color: 'black' }}>{ errors.type && touched.type ? 'Type is required' : 'Type' }</InputLabel>
                                
                                
                            <Select                     
                                labelId="type-label"
                                id="type"
                                name="type"
                                value={values.type}
                                onChange={(e) => handleTypeChange(e, handleChange)}
                                onBlur={handleBlur}
                                label={errors.type && touched.type ? 'Type is required' : 'Type'}
                            >
                                <MenuItem value="open">Open</MenuItem>
                                <MenuItem value="assigned">Assigned</MenuItem>
                            </Select>
                        </FormControl>

                    </div>


                    {
                        values.type === 'assigned'  && (
                            <Autocomplete
                                options={users}
                                value={values.assigned_to ? users.find((collaborator) => collaborator.id === values.assigned_to) : null}
                                onChange={(e, newValue) => setFieldValue('assigned_to', newValue.id)}                
                                id="collaborator-select"   
                                PopperComponent={CustomPopper}                   
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                    <TextField 
                                        {...params} 
                                        InputLabelProps={{ shrink: errors.assigned_to && touched.assigned_to }}
                                        label={ errors.assigned_to && touched.assigned_to ? 'Assigned to is required' : 'Assigned to' } 
                                        name="assigned_to"
                                        placeholder="Search by name" 
                                        error={!!errors.assigned_to && touched.assigned_to} // Muestra error si hay error y el campo fue tocado
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id} className='flex py-3 px-5 cursor-pointer hover:bg-gray-200 transition-colors duration-100'>                                       
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
                                    </li>
                                )}
                                renderTags={(value, getTagProps) =>
                                    value ? <Chip label={value.name} {...getTagProps()} /> : null
                                }
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                fullWidth
                            />
                        )
                    }
          

                    <TextField
                            name="additional_info.estimated_hours"
                            label={ errors.additional_info?.estimated_hours && touched.additional_info?.estimated_hours ? 'Estimated hours are required' : 'Estimated Hours'}
                            type="text"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={values.additional_info.estimated_hours}
                            onChange={(e) => handleEstimatedHoursChange(e.target.value, setFieldValue)}
                            onBlur={handleBlur}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" >h</InputAdornment> // Adorno con mínimo espacio
                                  )
                            }}
                            error={!!errors.additional_info?.estimated_hours && touched.additional_info?.estimated_hours} // Muestra error si hay error y el campo fue tocado
                        />




                    <Accordion 
                        expanded={goalsExpanded}
                        onChange={() => setGoalsExpanded(!goalsExpanded)}          
                        sx={{
                            border: errors.goals && touched.goals ? '1px solid red' : '1px solid black',
                        }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography >{ errors.goals && touched.goals ? 'Provide at leats 1 Goal for the Task' : 'Task Goals' }</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <TextField
                            sx={{ backgroundColor: 'white', mb: 2 }}
                            label="Describe a goal and press enter..."
                            value={goalDescription}
                            onChange={(e) => setGoalDescription(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, setFieldValue, values.goals)}
                            multiline
                            rows={2}
                            fullWidth
                        />
                        <Box className="flex-wrap py-4 max-h-[65px] overflow-y-auto">
                            {values.goals.length === 0 ? (
                            <Typography className='text-center pt-2 my-auto'>No goals added yet</Typography>
                            ) : (
                            values.goals.map((goal, index) => (
                                <Tooltip key={index} title={goal} placement="top" arrow>
                                <Chip
                                variant='outlined'
                                label={goal.length > MAX_CHARACTERS ? `${goal.substring(0, MAX_CHARACTERS)}...` : goal}
                                onDelete={handleDeleteGoal(index, setFieldValue, values.goals)}           
                                sx={{ 
                                    cursor: 'pointer',
                                    m: 1,
                                    border: '1px solid black',
                                }}
                                />
                            </Tooltip>
                            ))
                            )}
                        </Box>
                        </AccordionDetails>
                    </Accordion>

                    <TextField           
                        InputLabelProps={{ shrink: errors.task_description && touched.task_description }}
                        name="task_description"
                        label={ errors.task_description && touched.task_description ? 'Task description is required' : 'Task Description' }
                        multiline
                        rows={4}
                        fullWidth
                        value={values.task_description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!errors.task_description && touched.task_description} // Muestra error si hay error y el campo fue tocado
                    />


                    {/* Aquí podrías incluir los demás campos según necesites */}
                    <div className='flex w-full space-x-2 justify-center items-center'>                           
                        <button 
                            className={`w-[95%] h-[55px] rounded-extra p-2 ${ buttonDisabled ? 'backdrop-blur-sm' : 'backdrop-blur-sm bg-green-500/20 shadow-sm ' } border-[1px] border-gray-400 transition-colors duration-300 ease-in-out transform active:translate-y-[2px]`} 
                            type="submit" disabled={ buttonDisabled || isSubmitting }>Create Task
                        </button>
                    </div>
                </Form>
                )}
            </Formik>
          )
    );
  };