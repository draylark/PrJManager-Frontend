import { FC } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material'
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';

import { AccordionReposForm } from './sub-components/AccordionReposForm';

import axios from 'axios';

import Swal from 'sweetalert2';
import LoadingCircle from '../../../../auth/helpers/Loading';

import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';
import { ResponsiveBar } from '@nivo/bar';


const LayerSchema = Yup.object().shape({
  name: Yup.string().required('Group name is required'),
  description: Yup.string(),
  visibility: Yup.string().required('Visibility is required'),
});

interface EditLayerValues {
    layerId: string,
    name: string,
    description: string,
    visibility: string,
    project: string,
    parent_id: string,
    modifiedRepos: object[]

}

interface EditLayerProps {
    setIsEditLayerOpen: (value: boolean) => void;
}

export const EditLayerForm: FC<EditLayerProps> = ({ setIsEditLayerOpen }) => {


    const location = useLocation();
    const dispatch = useDispatch();
    const { uid } = useSelector( (selector: RootState) => selector.auth);
    const { layers, repositories } = useSelector((state: RootState) => state.platypus);

    const [isCollaboratorsOpen, setIsCollaboratorsOpen] = useState(false)
    const [layerRepos, setlayerRepos] = useState([])
    const [IsLoading, setIsLoading] = useState(false);
    const [selectedRepo, setSelectedRepo] = useState('');

    const layerId = location.state?.layerId;
    const projectId = location.state?.projectId;
    const layer = layers.find((layer) => layer._id === layerId);


    const [accordionExpanded, setAccordionExpanded] = useState(false);
    const handleAccordionChange = (event, isExpanded) => {
        setAccordionExpanded(isExpanded);
        if (!isExpanded) {
            setIsCollaboratorsOpen(false);
        }
    };

    const handleRepoChange = (event) => {
        // Actualizar el repositorio seleccionado
        setSelectedRepo(event.target.value);
        // Aquí se podría cargar la información de colaboradores del repo
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setIsLoading(true);
        setSubmitting(true);
    
        const layerUrl = `http://localhost:3000/api/gitlab/update-layer/${values.layerId}`;
        const repoUrl = `http://localhost:3000/api/repos/updateRepos`;
    
        try {
            const [layerResponse, repoResponse] = await Promise.all([
                axios.post(layerUrl, values, { withCredentials: true }),
                axios.post(repoUrl, { modifiedRepos: values.modifiedRepos }, { withCredentials: true })
            ]);
    
            // Verificar el estado de cada respuesta
            if (layerResponse.status === 200 && repoResponse.status === 200) {
                Swal.fire('Success', 'Layer and repositories have been updated successfully!', 'success');
            } else if (layerResponse.status === 200) {
                Swal.fire('Partial Success', 'Layer updated successfully, but there was an error updating repositories.', 'warning');
            } else if (repoResponse.status === 200) {
                Swal.fire('Partial Success', 'Repositories updated successfully, but there was an error updating the layer.', 'warning');
            } else {
                Swal.fire('Error', 'Failed to update both layer and repositories.', 'error');
            }
            
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'A network error occurred while updating.', 'error');
        } finally {
            setSubmitting(false);
            setIsLoading(false);
            resetForm();
            setIsEditLayerOpen(false);
        }
    };


    useEffect(() => {
        const newLayerRepos = repositories.filter(repo => repo.layer === layerId);
        setlayerRepos(newLayerRepos);
    }, [layer, repositories])


    return (
        <div className='fixed flex w-screen h-screen pb-5 top-0 right-0 justify-center items-center z-10 '>
            <div className='flex flex-col space-y-3 w-[70%] glass md:w-[500px] max-h-[560px]  pb-5 overflow-y-auto '>
                { 
                    IsLoading 
                    ? ( <LoadingCircle/> )    
                    : ( 
                        <>    
                            <div className=' w-[95%] h-12 ml-auto mr-auto mt-2 p-2 border-b-2 border-b-gray-500'>
                                <p className='text-xl text-black'>Edit Layer</p>
                            </div>

                            <Formik
                                initialValues={{
                                    layerId,
                                    name: layer.name,
                                    description: layer.description,
                                    visibility: layer.visibility,
                                    project: projectId,
                                    parent_id: '77174976',
                                    modifiedRepos: []                              
                                } as EditLayerValues }
                                validationSchema={LayerSchema}
                                onSubmit={handleSubmit}
                            >
                         
                                {({ isSubmitting, values, handleChange, handleBlur }) => (

                                 
                                    
                                    <Form className='flex flex-col space-y-4 ml-auto mr-auto w-[95%] mt-5 '>
                                        
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

                                        {/* <InputLabel id="select-repository-label">Select Repository</InputLabel> */}
                                        <FormControl fullWidth>
                                            <InputLabel id="select-repository-label">Select Repository</InputLabel>
                                            <Select
                                                labelId="select-repository-label"
                                                value={selectedRepo}
                                                onChange={handleRepoChange}
                                                label="Select Repository" // Esto es para propósitos de accesibilidad
                                            >
                                                {layerRepos.map(repo => (
                                                    <MenuItem key={repo._id} value={repo._id}>{repo.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>


                                        { selectedRepo && (                                                              
                                            <AccordionReposForm repoId={selectedRepo} isCollaboratorsOpen={isCollaboratorsOpen} setIsCollaboratorsOpen={setIsCollaboratorsOpen}/>
                                        )}
                                                

                                        <div className='flex w-full h-10 rounded-extra space-x-2 mt-5'>
                                            <button 
                                                className='w-[50%] h-full rounded-extra p-2 glass2 border-1 border-gray-400 transition-transform duration-150 ease-in-out transform active:translate-y-[2px]' 
                                                type='submit' disabled={isSubmitting}>Update Layer</button>
                                            <button 
                                                onClick={ () => setIsEditLayerOpen( false ) }
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