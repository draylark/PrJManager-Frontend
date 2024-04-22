import { useState, useEffect } from 'react'

import axios from 'axios';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { PuffLoader  } from 'react-spinners';
import { useLocation } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LoadingCircle from '../../../../../../auth/helpers/Loading';
import { Formik, Form, FormikHelpers, useFormikContext } from 'formik';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Chip, Box, Accordion, AccordionSummary, AccordionDetails, Typography, Tooltip, Autocomplete } from '@mui/material';


export const TaskForm = ({ uid, setTaskFormOpen, setGoalsExpanded, goalsExpanded, isAssigned, setIsAssigned }) => {
    // Asumiendo que tienes las siguientes constantes de estado para controlar el diálogo
    const location = useLocation()

    console.log(location.state)

    const [isLoading, setIsLoading] = useState(false)
    const [buttonDisabled, setButtonDisabled] = useState(true)
    const [goalDescription, setGoalDescription] = useState('')

    const { ID } = location.state.project;
    const { layerID } = location.state.layer;
    const { repoID } = location.state.repository;
  
    const TaskSchema = Yup.object().shape({
      task_name: Yup.string().required('Task name is required'),
      task_description: Yup.string().required('Task description is required'),
      status: Yup.string().oneOf(['pending', 'approval', 'completed']).required('Status is required'),
      goals: Yup.array().of(Yup.string()).required('At least one goal is required'),
      priority: Yup.string().oneOf(['Low', 'Medium', 'High', 'Critical']).required('Priority is required'),
      type: Yup.string().oneOf(['open', 'assigned']).required('Type is required'),
      deadline: Yup.date().nullable(),
    });

    // Límite de caracteres para la visualización en el Chip
    const MAX_CHARACTERS = 20;

    const repoCollaborators = [
        { id: '124', name: 'John Doe' },
        { id: '245', name: 'Jane Doe' },
        { id: '378', name: 'Jim Doe' },
        { id: '434', name: 'Jill Doe' },
    ]

    
    const handleTypeChange = (e, handleChange) => {
 // Lógica personalizada basada en el valor seleccionado
        const selectedValue = e.target.value;
        console.log("Valor seleccionado:", selectedValue);

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

  

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setIsLoading(true);
        setSubmitting(true);

        try {
            const response = await axios.post(`http://localhost:3000/api/tasks/${ID}/${layerID}/${repoID}`, values, 
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

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: response.data.message
            });

        } catch (error) {
            resetForm();
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
                project_related_id: ID,
                layer_related_id: layerID,
                repository_related_id: repoID,
                task_name: '',
                task_description: '',
                status: 'completed', // Por defecto, según el esquema
                goals: [],
                priority: '', // Valor por defecto
                type: '', // Valor por defecto
                deadline: null,
                assigned_to: ''
                }}
                validationSchema={TaskSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, handleChange, handleBlur, isSubmitting }) => (
                <Form 
                    className="flex flex-col h-full space-y-6 mx-auto w-[95%] pt-5 pb-4 overflow-y-auto">
                    <IsTheButtonDisabled values={values} />
                    
                    <div className='flex space-x-2'>
                        <TextField       
                            InputLabelProps={{
                                style: { color: 'black' } // Hace el texto de la etiqueta más oscuro
                            }}
                            name="task_name"
                            label="Task Name"
                            fullWidth
                            value={values.task_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />            
                        <FormControl fullWidth>
                            <InputLabel id="type-label" style={{ color: 'black' }}>Type</InputLabel>
                            <Select                     
                                labelId="type-label"
                                id="type"
                                name="type"
                                value={values.type}
                                onChange={(e) => handleTypeChange(e, handleChange)}
                                onBlur={handleBlur}
                                label="Type"
                            >
                                <MenuItem value="open">Open</MenuItem>
                                <MenuItem value="assigned">Assigned</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <div className='flex space-x-2'>
                        <FormControl fullWidth>
                        <InputLabel id="priority-label" style={{ color: 'black' }}>Priority</InputLabel>
                        <Select
                            
                            // sx={{ backgroundColor: '#cae9ff' }}
                            labelId="priority-label"
                            id="priority"
                            name="priority"
                            value={values.priority}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Priority"
                        >
                            <MenuItem value="Low">Low</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="High">High</MenuItem>
                            <MenuItem value="Critical">Critical</MenuItem>
                        </Select>
                        </FormControl>

                        <TextField
                            // sx={{ backgroundColor: '#cae9ff' }}
                            name="deadline"
                            label="Deadline"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={values.deadline ? values.deadline : ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </div>

                    {
                        values.type === 'assigned'  && (
                            <Autocomplete
                                // sx={{ backgroundColor: '#cae9ff' }}
                                value={values.assigned_to ? repoCollaborators.find((collaborator) => collaborator.id === values.assigned_to) : null}
                                onChange={(event, newValue) => {
                                    setFieldValue('assigned_to', newValue.id);
                                }}
                                id="collaborator-select"
                                options={repoCollaborators}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => <TextField {...params} label="Assign to" placeholder="Search by name" />}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id}>
                                    {option.name}
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



                    <Accordion 
                        expanded={goalsExpanded}
                        onChange={() => setGoalsExpanded(!goalsExpanded)}          
                        sx={{
                            // backgroundColor: '#cae9ff',
                            border: '1px solid gray'
                        }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography >Task Goals</Typography>
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
                        InputLabelProps={{
                            style: { color: 'black' } // Hace el texto de la etiqueta más oscuro
                        }}
                        name="task_description"
                        label="Task Description"
                        multiline
                        rows={4}
                        fullWidth
                        value={values.task_description}
                        onChange={handleChange}
                        onBlur={handleBlur}
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