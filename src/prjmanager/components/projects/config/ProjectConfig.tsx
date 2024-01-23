import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '../../../../store/store';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, MenuItem, FormControl, Select, InputLabel, Autocomplete } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Swal from 'sweetalert2';
import LoadingCircle from '../../../../auth/helpers/Loading';
import axios from 'axios';

export const ProjectConfig = () => {

    const location = useLocation();
    const { projects } = useSelector((state: RootState) => state.projects);
    const projectId = location.state?.projectId;
    const project = projects.find(project => project.pid === projectId);

    const [loading, setLoading] = useState(false)

    const allTags = project?.tags.map( tag => tag );
    const tags = project.tags.map((tag, index) => {
        return { id: index + 1, label: tag };
    });
    
    if (loading) {
        return <LoadingCircle />;
    }

    return (
        <div className="flex flex-col h-[92%] overflow-y-auto rounded-extra space-y-8 py-2  pt-6">


            {project && (
                <Formik
                    initialValues={{
                        name: project.name,
                        description: project.description,
                        startDate: new Date(project.startDate),
                        endDate: new Date(project.endDate),
                        status: project.status,
                        priority: project.priority,
                        tags: allTags
                    }}
                    onSubmit={ async (values, { setSubmitting }) => {
                        setLoading(true);
                        setSubmitting(true);

                        const response = await axios.put(`http://localhost:3000/api/projects/update-project/${projectId}`, values);
                        if (response.status === 200) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Project updated successfully',
                                showConfirmButton: false,
                                timer: 1500
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Something went wrong!',
                            });

                            setSubmitting(false);
                            setLoading(false);
                        }
                        setSubmitting(false);
                        setLoading(false);
                    }}
                >
                    {({ values, setFieldValue, handleChange, handleBlur, handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <div className='flex mb-6'>
                                <h1 className="font-bold text-lg ml-6 w-[50%]">Project Configuration</h1>
                                <div className='flex space-x-4 w-[50%] justify-end pr-28 '>
                                    <button className="glass2 rounded-extra w-24 border-1 border-gray-400">
                                        Private
                                    </button>
                                    <button className="glass3 rounded-extra w-20 border-1 border-gray-400">
                                        Public
                                    </button>
                                    <Button type="submit" variant="contained" color="primary">
                                        Save Changes
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-8 w-[80%] ml-auto mr-auto">
                                <div className='flex w-full space-x-4'>
                                    <Field
                                        style={{width: '50%'}}
                                        as={TextField}
                                        label="Name"
                                        name="name"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
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

                                <div className='flex w-full space-x-4'>
                                    <FormControl style={{width: '50%'}}>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            name="status"
                                            value={values.status}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            label="Status"
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
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            label="Priority"
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
                                    rows={5}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.description}
                                />

                            </div>
                        </Form>
                    )}
                </Formik>
            )}
        </div>
    );
};