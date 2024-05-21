import { FC } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { TextField } from '@mui/material'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FormNames } from '../formFields/projects/FormNames';
import { ClientsForm } from '../formFields/projects/ClientsForm';
import { postNewProject } from '../../../helpers/formHelpers';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';

import HashtagAutocompleteField from '../formFields/projects/HashtagAutoCompleteField';
import Swal from 'sweetalert2';
import LoadingCircle from '../../../../auth/helpers/Loading';
import Selectors from '../formFields/Selectors';
import * as Yup from 'yup';
import '../../styles/styles.css';
import { startSavingNewProject } from '../../../../store/projects/thunks';





export interface ProjectValues {
    name: string,
    description: string,
    startDate: string,
    endDate: string,
    status: string,
    owner: string,
    priority: string,
    tags: string[],
    clients: string[]
}

// Validation schema
const ProjectSchema = Yup.object().shape({
  name: Yup.string().required('Project name is required'),
  description: Yup.string(),
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date().required('End date is required'),
  status: Yup.string().required('Status is required'),
  owner: Yup.string(),
  priority: Yup.string().required('Priority is required'),
  tags: Yup.array().min(1, 'Please select at least one hashtag'),
  clients: Yup.array()
});


const statusOptions = [
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Paused', label: 'Paused' },
    // ...otros estados
  ];

const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    // ...otros estados
  ];

  const hashtagOptions = [
    { value: 'chocolate', label: 'chocolate' },
    { value: 'strawberry', label: 'strawberry' },
    { value: 'vanilla', label: 'vanilla' },
    // ...otros hashtags o etiquetas
  ];

interface ProjectModalProps {
    setIsProjectModalOpen: (value: boolean) => void;
}

export const ProjectModal: FC<ProjectModalProps> = ({ setIsProjectModalOpen }) => {

    const dispatch = useDispatch()
    const { uid } = useSelector( (selector: RootState) => selector.auth)
    const [selectedDate, setSelectedDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [IsLoading, setIsLoading] = useState(false)


    // console.log(client)

    const handleSubmit = async(values: ProjectValues, { setSubmitting, resetForm }: FormikHelpers<ProjectValues>) => {

        setIsLoading(true)
        setSubmitting(true);  // Desactivar el botón de envío mientras se envía el formulario
        const resp = await postNewProject(values)
        

        if( resp.status === 200 ) { 
            console.log(resp)
            setTimeout(() => {
                console.log("Formulario enviado", values);
                setSubmitting(false);  // Reactivar el botón de envío y detener el indicador de carga
                setIsLoading(false)
                resetForm()
                dispatch( startSavingNewProject( resp.data.project ) )
                Swal.fire(
                    'Done!',
                    'Project created succesfully',
                    'success'
                )
            }, 2000);
        } else {
            console.log(resp)
            setSubmitting(false);
            setIsLoading(false)
            Swal.fire(
                'Error',
                resp.response.data.msg,
                'error'
            );
        }
    };

    return (

            <div className='fixed flex w-screen h-screen pb-5 top-0 right-0 justify-center items-center z-10'>
                <div className='flex flex-col w-[70%] glass md:w-[500px] pb-5'>
                    { 
                        IsLoading 
                        ? ( <LoadingCircle/> )    
                        : ( 
                            <>    
                                <div className='w-[95%] h-12 ml-auto mr-auto mt-2 p-2 border-b-2 border-b-gray-500'>
                                    <p className='text-xl text-black'>Create a new Project</p>
                                </div>

                                <Formik
                                    initialValues={{
                                        name: '',
                                        description: '',
                                        startDate: '',
                                        endDate: '',
                                        status: '',
                                        owner: uid,
                                        priority: '',
                                        tags: [],
                                        clients: []                                    
                                    } as ProjectValues }
                                    validationSchema={ProjectSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ isSubmitting, setFieldValue, values, handleChange, handleBlur }) => (
             
                                        
                                    
                                        <Form className='flex flex-col ml-auto mr-auto w-[95%] mt-5'>

                                            {/* {console.log(values)} */}
                                           <FormNames/>

                                           {/* <DatePickers 
                                                selectedDate={selectedDate} 
                                                setFieldValue={setFieldValue} 
                                                endDate={endDate}
                                                setEndDate={setEndDate}
                                                setSelectedDate={setSelectedDate}
                                            /> */}


                                            <div className="flex w-full h-10 rounded-extra space-x-2 mt-7">
                                                <Selectors label="Status" name="status" options={statusOptions} className="w-[50%]"/>
                                                <Selectors label="Priority" name="priority" options={priorityOptions} className="w-[50%]"/>
                                            </div>


                                            <div className='flex flex-col space-y-3'>
                                                <ClientsForm />
                                                <HashtagAutocompleteField name="tags" options={hashtagOptions} />                                               
                                                <TextField                                      
                                                    name="description"
                                                    label="Description"
                                                    multiline
                                                    rows={4}
                                                    variant="filled"
                                                    fullWidth
                                                    value={values.description}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                            </div>

                                        

                                            <div className='flex w-full h-10 rounded-extra space-x-2 mt-5'>
                                                <button 
                                                    className='w-[50%] h-full rounded-extra p-2 glass2 border-1 border-gray-400 transition-transform duration-150 ease-in-out transform active:translate-y-[2px]' 
                                                    type='submit' disabled={isSubmitting}>Create Project</button>
                                                <button 
                                                    onClick={ () => setIsProjectModalOpen( false ) }
                                                    className='w-[50%] h-full rounded-extra p-2 glass3 border-1 border-gray-400 transition-transform duration-150 ease-in-out transform active:translate-y-[2px]'>Cancel</button>
                                            </div>

                                        </Form>
                                
                                    )}
                                
                                </Formik>
                            </>
                    )}             
                </div>
            </div>
        
        
    );
}
