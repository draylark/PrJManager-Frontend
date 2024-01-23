import { FC } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { TextField } from '@mui/material'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { addNewLayer } from '../../../../store/gitlab/gitlabSlice';
import { loadNewLayer } from '../../../../store/gitlab/thunks';
import axios from 'axios';

import Swal from 'sweetalert2';
import LoadingCircle from '../../../../auth/helpers/Loading';

import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';

// Validation schema
const LayerSchema = Yup.object().shape({
  name: Yup.string().required('Group name is required'),
  description: Yup.string(),
  visibility: Yup.string().required('Visibility is required'),
});

interface LayerValues {
    name: string,
    description: string,
    visibility: string,
    project: string,
    parent_id: string,

}

interface LayerProps {
    setIsLayerModalOpen: (value: boolean) => void;
}

export const LayerForm: FC<LayerProps> = ({ setIsLayerModalOpen }) => {


    const location = useLocation();
    const dispatch = useDispatch();
    const { uid } = useSelector( (selector: RootState) => selector.auth);
    const [IsLoading, setIsLoading] = useState(false);

    const projectId = location.state?.projectId;


    const handleSubmit = async(values: LayerValues, { setSubmitting, resetForm }: FormikHelpers<LayerValues>) => {
        setIsLoading(true);
        setSubmitting(true);  // Desactivar el botón de envío mientras se envía el formulario

        try {
            const response = await axios.post('http://localhost:3000/api/gitlab/create-group', values, {
                withCredentials: true
            });

            if(response.status === 200) {
                // console.log(response);
                setTimeout(() => {
                    // console.log("Formulario enviado", values);
                    setSubmitting(false);  // Reactivar el botón de envío y detener el indicador de carga
                    setIsLoading(false);
                    resetForm();
                    Swal.fire(
                        'Done!',
                        'Group created succesfully',
                        'success'
                    );
                    dispatch( loadNewLayer( response.data.newLayer ) );
                    setIsLayerModalOpen(false);  // Cierra el modal después de crear el grupo
                }, 2000);
            }
        } catch (error) {
            console.log(error);
            setSubmitting(false);
            setIsLoading(false);
            Swal.fire(
                'Error',
                'Failed to create group',
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
                                <p className='text-xl text-black'>Create a new Layer</p>
                            </div>

                            <Formik
                                initialValues={{
                                    name: '',
                                    description: '',
                                    visibility: 'public',
                                    project: projectId,
                                    parent_id: '77174976',
                                    owner: uid                                   
                                } as LayerValues }
                                validationSchema={LayerSchema}
                                onSubmit={handleSubmit}
                            >
                         
                                {({ isSubmitting, values, handleChange, handleBlur }) => (

                                 
                                    
                                    <Form className='flex flex-col ml-auto mr-auto w-[95%] mt-5'>
                                        
                                        {/* {console.log(values)} */}

                                        <TextField                                      
                                            name="name"
                                            label="Layer Name"
                                            variant="filled"
                                            fullWidth
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />

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

                                        <TextField
                                            select
                                            label="Visibility"
                                            name="visibility"
                                            value={values.visibility}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            variant="filled"
                                            fullWidth
                                            SelectProps={{
                                                native: true,
                                            }}
                                        >
                                            <option value="private">Private</option>
                                            <option value="public">Public</option>
                                            <option value="internal">Internal</option>
                                        </TextField>

                                        <div className='flex w-full h-10 rounded-extra space-x-2 mt-5'>
                                            <button 
                                                className='w-[50%] h-full rounded-extra p-2 glass2 border-1 border-gray-400 transition-transform duration-150 ease-in-out transform active:translate-y-[2px]' 
                                                type='submit' disabled={isSubmitting}>Create Layer</button>
                                            <button 
                                                onClick={ () => setIsLayerModalOpen( false ) }
                                                className='w-[50%] h-full rounded-extra p-2 glass3 border-1 border-gray-400 transition-transform duration-150 ease-in-out transform active:translate-y-[2px]'>Cancel</button>
                                        </div>

                                    </Form>
                                )}
                            </Formik>
                        </>
                    )
                }             
            </div>
        </div>
    );
}