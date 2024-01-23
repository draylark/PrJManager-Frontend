import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { RootState } from '../../../../store/store';
import { Formik, Form, FormikHelpers } from 'formik';
import { TextField } from '@mui/material'
import { FormNames } from '../formFields/tasks/FormNames';
import { DatePickers } from '../formFields/tasks/DatePickers';
import { postNewTask, handleProjectChange } from '../../../helpers/formHelpers';
import { startSavingNewTask } from '../../../../store/tasks/thunks';
import LoadingCircle from '../../../../auth/helpers/Loading';
import Selectors from '../formFields/Selectors';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import '../../styles/styles.css';


export interface TaskValues {
    name: string;
    description: string;
    parentId: string;
    status: string;
    dueDate: string;
    endDate: string;
    projectId: string;
    createdBy: string;
}

interface TaskOption {
    value: string;
    label: string;
  }

const ProjectSchema = Yup.object().shape({
  name: Yup.string().required('Task name is required'),
  description: Yup.string().required('Description is required'),
  parentId: Yup.string(),
  status: Yup.string().required('Status is required'),
  dueDate: Yup.string().required('Due Date is required'),
  projectId: Yup.string().required('Project is required'),
  createdBy: Yup.string()
});


interface TaskModalProps {
    setIsTaskModalOpen: (value: boolean) => void;
}


export const TaskModal: FC<TaskModalProps> = ({ setIsTaskModalOpen }) => {

    const { projects } = useSelector( (selector: RootState) => selector.projects)
    const { tasks } = useSelector( (selector: RootState) => selector.task)
    const { uid } = useSelector( (selector: RootState) => selector.auth)

    const dispatch = useDispatch();
    const [taskOptions, setTaskOptions] = useState<TaskOption[]>([]); 
    const [selectedDate, setSelectedDate] = useState(null);
    const [IsLoading, setIsLoading] = useState(false)

    const options2 = projects.map((project) => ({
        value: project.pid,
        label: project.name,
    }));

    const statusOptions = [
        { value: 'To Do', label: 'Not Started' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Done', label: 'Completed' },
    ];

    const handleSubmit = async(values: TaskValues, { setSubmitting, resetForm }: FormikHelpers<TaskValues>) => {

        setIsLoading(true)
        setSubmitting(true);
        const resp = await postNewTask(values)
        
        if( resp.status === 200 ) { 
            setTimeout(() => {
                console.log(resp)
                // console.log("Formulario enviado", values);
                setSubmitting(false);  // Reactivar el botón de envío y detener el indicador de carga
                setIsLoading(false)
                dispatch( startSavingNewTask( resp.data.task ) )
                resetForm()
                Swal.fire(
                    'Done!',
                    'Task created succesfully',
                    'success'
                )
            }, 2000);
        } else {
            setSubmitting(false);
            setIsLoading(false)
            Swal.fire(
                'Error',
                resp.response?.data.msg || 'Something went wrong',
                'error'
            );
        }
    };

    return (

            <div className='fixed flex w-screen h-screen pb-5 top-0 right-0 justify-center items-center z-10'>
                <div className='flex flex-col w-[70%] glass md:w-[500px] h-[550px]'>
                    { 
                        IsLoading 
                        ? ( <LoadingCircle/> )    
                        : ( 
                            <>    
                                <div className='w-[95%] h-12 ml-auto mr-auto mt-2 p-2 border-b-2 border-b-gray-500'>
                                    <p className='text-xl text-black'>Create a new Task</p>
                                </div>

                                <Formik
                                    initialValues={{
                                        name: '',
                                        description: '',
                                        parentId: '',
                                        status: '',
                                        dueDate: '',
                                        endDate: '',
                                        projectId: '',
                                        createdBy: uid,
                                        // Initialize other fields with default values
                                    }}
                                    validationSchema={ProjectSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ isSubmitting, setFieldValue, values, handleChange, handleBlur }) => (
                 
                                    
                                        <Form className='flex flex-col ml-auto mr-auto w-[95%] mt-5'>

                                             {/* { console.log(values)  } */}
                                           <FormNames/>

                                           <DatePickers 
                                                selectedDate={selectedDate} 
                                                setFieldValue={setFieldValue} 
                                                setSelectedDate={setSelectedDate}
                                            />

                                            <div className='flex w-full h-10 rounded-extra space-x-2 mt-7'>
                                                 <Selectors label="Status" name="status" options={ statusOptions } className="w-[100%]"/>
                                            </div>

                                            <div className="flex w-full h-10 rounded-extra space-x-2 mt-7">
                                                <Selectors label="Project" name="projectId" options={options2} additionalOnChange={ (value: unknown) => handleProjectChange(value, setTaskOptions, projects, tasks)} className="w-[50%]"/>                                                         
                                                <Selectors label="Parent Task" name="parentId" options={taskOptions} className="w-[50%]"/>
                                            </div>


                                            <div className='flex flex-col space-y-3 mt-7'>                                              
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
                                                    type='submit' disabled={isSubmitting}>Create Task</button>
                                                <button 
                                                    onClick={ () => setIsTaskModalOpen( false ) }
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
