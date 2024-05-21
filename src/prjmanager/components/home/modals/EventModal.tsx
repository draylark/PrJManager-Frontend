import { FC } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { TextField } from '@mui/material'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FormNames } from '../formFields/events/FormNames';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { ParticipantsField } from '../formFields/events/ParticipantsField';

import Swal from 'sweetalert2';
import LoadingCircle from '../../../../auth/helpers/Loading';
import Selectors from '../formFields/Selectors';
import * as Yup from 'yup';
import '../../styles/styles.css';
import { postNewEvent } from '../../../helpers/formHelpers';
import { startSavingNewEvent } from '../../../../store/events/thunks';




export interface EventValues {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    priority: string;
    participants: string[];
    createdBy: string;
}


// Validation schema
const EventSchema = Yup.object().shape({
  title: Yup.string().required('Event title is required'),
  description: Yup.string(),
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date().required('End date is required'),
  createdBy: Yup.string(),
  priority: Yup.string().required('Priority is required'),
  participants: Yup.array().of(Yup.string()),
});


const priorityOptions = [
    { value: 'LOW', label: 'LOW' },
    { value: 'MEDIUM', label: 'MEDIUM' },
    { value: 'HIGH', label: 'HIGH' },
    // ...otros estados
  ];

interface EventModalProps {
    setIsEventModalOpen: (value: boolean) => void;
}

export const EventModal: FC<EventModalProps> = ({ setIsEventModalOpen }) => {

    const dispatch = useDispatch()
    const { uid } = useSelector( (selector: RootState) => selector.auth)
    const [selectedDate, setSelectedDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [IsLoading, setIsLoading] = useState(false)


    // console.log(client)

    const handleSubmit = async(values: EventValues, { setSubmitting, resetForm }: FormikHelpers<EventValues>) => {

        console.log('event created',values)

        setIsLoading(true)
        setSubmitting(true);  // Desactivar el botón de envío mientras se envía el formulario
        const resp = await postNewEvent(values)
        

        if( resp.status === 200 ) { 
            console.log(resp)
            setTimeout(() => {
                // console.log("Formulario enviado", values);
                setSubmitting(false);  // Reactivar el botón de envío y detener el indicador de carga
                setIsLoading(false)
                resetForm()
                dispatch( startSavingNewEvent( resp.data.newEvent ) )
                Swal.fire(
                    'Done!',
                    'Event created succesfully',
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
                                    <p className='text-xl text-black'>Create a new Event</p>
                                </div>

                                <Formik
                                    initialValues={{
                                        title: '',
                                        description: '',
                                        startDate: '',
                                        endDate: '',
                                        priority: '',
                                        participants: [],
                                        createdBy: uid                                   
                                    } as EventValues }
                                    validationSchema={EventSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ isSubmitting, setFieldValue, values, handleChange, handleBlur }) => (
             
                                        
                                    
                                        <Form className='flex flex-col ml-auto mr-auto w-[95%] mt-5'>

                                            {console.log(values)}
                                           <FormNames/>

                                           {/* <DatePickers 
                                                selectedDate={selectedDate} 
                                                setFieldValue={setFieldValue} 
                                                endDate={endDate}
                                                setEndDate={setEndDate}
                                                setSelectedDate={setSelectedDate}
                                            /> */}


                                            <div className="flex w-full h-10 rounded-extra space-x-2 mt-7">
                                                <Selectors label="Priority" name="priority" options={priorityOptions} className="w-full"/>
                                            </div>


                                            <div className='flex flex-col space-y-3'>
                                                <ParticipantsField />                                           
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
                                                    type='submit' disabled={isSubmitting}>Create Event</button>
                                                <button 
                                                    onClick={ () => setIsEventModalOpen( false ) }
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
