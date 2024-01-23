import { useState, useEffect } from 'react'
import { TextField, Accordion, AccordionSummary, AccordionDetails, Button, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ColaboradoresList } from './ColaboratosList';
import { AddColaboratorsForm } from './AddColaboratorsForm';
import { useFormikContext } from 'formik';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store/store';
import axios from 'axios';

export const AccordionReposForm = ({ isCollaboratorsOpen, setIsCollaboratorsOpen, repoId  }) => {


    const { values, setFieldValue, resetForm } = useFormikContext();
    const { friends } = useSelector((state: RootState) => state.auth);

    const [otherFriends, setOtherFriends] = useState([])
    const [filtroBusqueda, setFiltroBusqueda] = useState('');
    const [repoCollaborators, setRepoCollaborators] = useState([]);

    
    const colaboradoresFiltrados = repoCollaborators.filter(colaborador =>
        colaborador.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase())
    );

    const [accordionExpanded, setAccordionExpanded] = useState(false);
    const handleAccordionChange = (event, isExpanded) => {
        setAccordionExpanded(isExpanded);
        if (!isExpanded) {
            setIsCollaboratorsOpen(false);
        }
    }

    const handleSaveChanges = () => {

            const modifiedRepo = values.modifiedRepos.find(repo => repo.repoId === repoId);

            if(modifiedRepo) {
                const newRepoCollaborators = [...values.modifiedRepos];
                const repoIndex = newRepoCollaborators.findIndex(repo => repo.repoId === repoId);
                newRepoCollaborators[repoIndex] = {
                    repoId: repoId,
                    collaborators: repoCollaborators
                };
                setFieldValue('modifiedRepos', newRepoCollaborators);
                return;
            }

            const newRepoCollaborators = [...values.modifiedRepos, {
                repoId: repoId,
                collaborators: repoCollaborators
            }];
            
            setFieldValue('modifiedRepos', newRepoCollaborators);

    };
    
    const onAddColaborador = (nuevoColaborador) => {
        if( !repoCollaborators.find(colaborador => colaborador.id === nuevoColaborador.id) ) {
            setRepoCollaborators(prevRepoCollaborators => [...prevRepoCollaborators, nuevoColaborador]);
        }
    };

    const handleCancel = () => {
        // Aquí puedes revertir cambios no guardados, cerrar un modal, etc.
        // Por ejemplo, restablecer el estado a su valor original si se han realizado cambios temporales
        // setColaboradores(colaboradoresOriginales);
    };

    const onAccessLevelChange = (id, nuevoNivelAcceso) => {
        // Actualiza el estado con el nuevo nivel de acceso para el colaborador específico
        const colaborador = repoCollaborators.findIndex(colaborador => colaborador.id === id);
        const colaboradoresActualizados = [...repoCollaborators];
        colaboradoresActualizados[colaborador].accessLevel = nuevoNivelAcceso;
        setRepoCollaborators(colaboradoresActualizados);

    };

    console.log(repoCollaborators)


    useEffect(() => {
        const getRepoCollaborators = async () => {
            const res = await axios.get(`http://localhost:3000/api/repos/getCollaborators/${repoId}`)
            const currentRepoCollaborators = await Promise.all(res.data.collaborators.map(async ( collaborator ) => {
                const response = await axios.get(`http://localhost:3000/api/users/${collaborator.user}`);
                const collaboratorInfo = response.data.user
                return { id: collaboratorInfo.uid, nombre: collaboratorInfo.username, accessLevel: collaborator.accessLevel };
              }));

            setRepoCollaborators(currentRepoCollaborators)
        }

        getRepoCollaborators()
    }, [repoId])
    


   useEffect(() => {
        const fetchFriendsRequests = async () => {
          const requests = await Promise.all(friends.map(async ( friendId ) => {
            const response = await axios.get(`http://localhost:3000/api/users/${friendId}`);
            return response.data.user;
          }));
          
          const possibleCollaborators = requests.map( (request) => {
            return { id: request.uid, nombre: request.username };
          });

            setOtherFriends(possibleCollaborators);
        };
      
        if (friends.length > 0) {
          fetchFriendsRequests();
        }
      }, [friends]);

  return (
        <Accordion expanded={accordionExpanded} onChange={handleAccordionChange}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="repo-options-content"
                id="repo-options-header"
            >
                <Typography>Repository Options</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <Button onClick={() => setIsCollaboratorsOpen(true)}>Add Collaborator</Button>
                    <TextField
                        label="Search Collaborator"
                        variant="outlined"
                        size="small"
                        value={filtroBusqueda}
                        onChange={(e) => setFiltroBusqueda(e.target.value)}
                    />
                </div>
            <ColaboradoresList  colaborators={colaboradoresFiltrados} onAccessLevelChange={onAccessLevelChange} setRepoCollaborators={setRepoCollaborators}/>

            {isCollaboratorsOpen && accordionExpanded && ( 
                    <AddColaboratorsForm onAddColaborador={onAddColaborador} usuarios={otherFriends} setIsCollaboratorsOpen={setIsCollaboratorsOpen}/>
                )}

                <Button onClick={handleSaveChanges}>Save Changes</Button>
                <Button onClick={handleCancel}>Cancel</Button>
            </AccordionDetails>
        </Accordion>    
  )
}
