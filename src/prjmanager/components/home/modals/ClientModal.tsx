import { FC } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { TextField } from '@mui/material'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FormNames } from '../formFields/clients/FormNames';

// import { postNewProject } from '../../helpers/formHelpers';
import { FormContact } from '../formFields/clients/FormContact';


import Swal from 'sweetalert2';
import LoadingCircle from '../../../../auth/helpers/Loading';
import * as Yup from 'yup';
import '../../styles/styles.css';
import { FormNotes } from '../formFields/clients/FormNotes';
import { postNewClient } from '../../../helpers/formHelpers';
import { startSavingNewClient } from '../../../../store/clients/thunks';



export interface ClientValues {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    address: {
        street: string,
        city: string,
        state: string,
        zipCode: string
    },
    notes: string[]
}

// Validation schema
const ProjectSchema = Yup.object().shape({
    firstName: Yup.string().required('Name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().required('Email is required'),
    phoneNumber: Yup.string().required('Number is required'),
    address: Yup.object(),
    notes: Yup.array(),
});



interface ClientModalProps {
    setIsClientModalOpen: (value: boolean) => void;
}

export const ClientModal: FC<ClientModalProps> = ({ setIsClientModalOpen }) => {

    const dispatch = useDispatch()
    const [IsLoading, setIsLoading] = useState(false)

    const handleSubmit = async(values: ClientValues, { setSubmitting, resetForm }: FormikHelpers<ClientValues>) => {

        setIsLoading(true)
        setSubmitting(true);  // Desactivar el botón de envío mientras se envía el formulario
        const resp = await postNewClient(values)


        if( resp.status === 200 ) { 
            console.log(resp)
            setTimeout(() => {
                console.log("Formulario enviado", values);
                setSubmitting(false);  // Reactivar el botón de envío y detener el indicador de carga
                setIsLoading(false)
                resetForm()
                console.log(resp.data)
                dispatch( startSavingNewClient( resp.data.client ) )
                Swal.fire(
                    'Done!',
                    'Client created succesfully',
                    'success'
                )
            }, 2000);
        } else {
            console.log(resp)
            setSubmitting(false);
            setIsLoading(false)
            Swal.fire(
                'Error',
                resp.response.data.msg || resp.response.data.errors[0].msg || resp.response.data.errors[1].msg,
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
                                    <p className='text-xl text-black'>Create a new Client</p>
                                </div>

                                <Formik
                                    initialValues={{
                                        firstName: '',
                                        lastName: '',
                                        email: '',                                       
                                        phoneNumber: '',
                                        address: {
                                            street: "",
                                            city: "",
                                            state: "",
                                            zipCode: ""
                                        },
                                        notes: [],                                   
                                    } as ClientValues }
                                    validationSchema={ProjectSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ isSubmitting, values, handleChange }) => (
                                                    
                                    
                                        <Form className='flex flex-col ml-auto mr-auto w-[95%] mt-5'>

                                            {/* {console.log(values)} */}
                                           <FormNames/>

                                           <FormContact/>

                                            <div className='flex flex-wrap space-y-2 w-full ml-auto mr-auto mt-12 '>

                                                <h3>Address ( Optional )</h3>

                                                <div className='flex w-full rounded-extra space-x-2'>
                                                    <TextField 
                                                        name='address.street'
                                                        value={values.address.street}
                                                        className='w-[50%]' 
                                                        type='street'
                                                        label='Street'
                                                        variant='standard'
                                                        onChange={handleChange}
                                                    />
                                                    <TextField 
                                                        className='w-[50%]'
                                                        name='address.city' 
                                                        value={values.address.city}
                                                        type='city'
                                                        label='City'
                                                        variant='standard'
                                                        onChange={ handleChange}
                                                    />
                                                </div>

                                                <div className='flex w-full rounded-extra space-x-2'>
                                                    <TextField 
                                                        className='w-[50%]' 
                                                        name='address.state'
                                                        value={values.address.state}
                                                        type='state'
                                                        label='State'
                                                        variant='standard'
                                                        onChange={ handleChange}
                                                    />
                                                    <TextField 
                                                        className='w-[50%]' 
                                                        name='address.zipCode'
                                                        value={values.address.zipCode}
                                                        type='zipCode'
                                                        label='Zip Code'
                                                        variant='standard'
                                                        onChange={ handleChange }
                                                    />
                                                </div>
                                            </div>

                                            <div className=' w-full mt-3'>
                                               <FormNotes name='notes'/>
                                            </div>

                                        

                                            <div className='flex w-full h-10  rounded-extra space-x-2 mt-8'>
                                                <button 
                                                    className='w-[50%] h-full rounded-extra p-2 glass2 border-1 border-gray-400 transition-transform duration-150 ease-in-out transform active:translate-y-[2px]' 
                                                    type='submit' disabled={isSubmitting}>Create Client</button>
                                                <button 
                                                    onClick={ () => setIsClientModalOpen( false ) }
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
