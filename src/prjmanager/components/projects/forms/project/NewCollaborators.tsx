import React, { useState } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete, Typography, Tooltip } from '@mui/material';
import { ImCancelCircle } from "react-icons/im";
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar'
import { LiaQuestionCircleSolid } from "react-icons/lia";
import Swal from 'sweetalert2';

interface User {
  name: string;
  photoUrl: string | null;
  id: string;
  new: boolean
}
type Values = {
  collaborators: Collaborator[];
  newCollaborators: Collaborator[];
}
interface Collaborator {
  name: string;
  photoUrl: string | null;
  id: string;
  accessLevel: string;
  new?: boolean;
}
interface NewCollaboratorsProps {
  values: Values;
  users: User[];
  setSearch: (value: string) => void;
  setFieldValue: (field: string, value: unknown) => void;
  setCurrentOrNew: (value: boolean) => void;
}

export const NewCollaborators: React.FC<NewCollaboratorsProps> = ({ users, values, setSearch, setFieldValue, setCurrentOrNew }) => {

  const [tooltipOpen, setTooltipOpen] = useState<string>('');
  const [tooltipContent, setTooltipContent] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState('');
  const [selectedUser, setSelectedUser] = useState<User>({
      name: '',
      id: '',
      photoUrl: '',
      new: true
  });

  const handleDeleteNewCollaborator = (
    values: Values, 
    setFieldValue: (field: string, value: unknown) => void, 
    id: string
  ) => {
    const updateProjectCollaborators = values.collaborators.filter(collaborator => collaborator.id !== id);
    const updatedNewCollaborators = values.newCollaborators.filter(collaborator => collaborator.id !== id);

    setFieldValue('newCollaborators', updatedNewCollaborators);
    setFieldValue('collaborators', updateProjectCollaborators);
  };

  const addUserAsCollaborator = (values: Values, setFieldValue: (field: string, value: unknown) => void) => {
    const newCollaborator = { ...selectedUser, accessLevel };

    // Filtrar cualquier posible duplicado basado en el 'id'.
    const noDuplicates = values.newCollaborators.filter(collaborator => collaborator.id !== newCollaborator.id);

    // Añadir el nuevo colaborador a la lista filtrada.
    const updatedCollaborators = [newCollaborator, ...noDuplicates];

    setFieldValue('newCollaborators', updatedCollaborators);

    setOpenDialog(false);
    setAccessLevel('');
  };

  const handleAddNewCollaborators = (values: Values, setFieldValue: (field: string, value: unknown) => void) => {
    // Obtener los IDs de los nuevos colaboradores.
    const newCollaboratorIds = new Set(values.newCollaborators.map(collab => collab.id));

    // Combina los nuevos colaboradores con los existentes, filtrando duplicados.
    let combinedCollaborators = [...values.newCollaborators, ...values.collaborators];

    // Filtrar colaboradores que no estén en la lista de nuevos colaboradores (basado en el ID).
    // Esto asegura que si un colaborador fue añadido y luego eliminado, no aparezca en el arreglo final.
    combinedCollaborators = combinedCollaborators.filter(collab => newCollaboratorIds.has(collab.id) || values.collaborators.some(existingCollab => existingCollab.id === collab.id));

    // Elimina duplicados y mantiene el orden de inserción
    const uniqueCollaborators = Array.from(new Map(combinedCollaborators.map(collab => [collab.id, collab])).values());

    // Actualiza 'layerCollaborators' con la lista combinada y única.
    setFieldValue('collaborators', uniqueCollaborators);

    setCurrentOrNew(false); // Cambia la vista si es necesario.
  };

  const handleSelectedUser = (newValue: User) => {
    // Verificar si el elemento seleccionado ya es un colaborador o ha sido añadido
    const isACollaboratorAlready = values.collaborators.some(collab => collab.id === newValue?.id);
    const isAdded = values.newCollaborators.some(collab => collab.id === newValue?.id);

    // Si alguna de las condiciones se cumple, no hacer nada (o prevenir el comportamiento por defecto si es necesario)
    if (isACollaboratorAlready || isAdded) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'This user is already a collaborator or has been added recently!',
            confirmButtonColor: '#3b82f6'
        });
        return;
    }

    if (newValue !== null && !values.newCollaborators.some(collab => collab.id === newValue.id)) {
        setSelectedUser(newValue);
        setOpenDialog(true);
    }
  };

  const handleMouseEnter = (text: string, type: string): void => {
    setTooltipContent(text);
    setTooltipOpen(type);
  };

  const handleMouseLeave = (): void => {
    setTooltipOpen('');
  };


  return (
    <div id='newCollaborators' className='flex flex-col w-full h-full'>
        <div className='flex flex-col w-full h-5/6 px-5'>
            <Autocomplete
                fullWidth
                options={users}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => {
                  const isACollaboratorAlready = values.collaborators.some(collab => collab.id === option.id);
                  const isAdded = values.newCollaborators.some(collab => collab.id === option.id);
                  return (
                      <div>
                          <li {...props} key={option.id}
                              className={`flex p-3 pl-4 ${ isACollaboratorAlready || isAdded ? null : 'cursor-pointer' } justify-between
                                          ${ isACollaboratorAlready || isAdded ? null : 'hover:bg-gray-200 transition-colors duration-200' }`}>
                              <div className='flex'>
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
                              </div>
                              { (isACollaboratorAlready || isAdded) && (
                                <div className='flex items-center mr-6'>
                                  <span className='text-[11px] text-green-400'>
                                    { isACollaboratorAlready && !isAdded ? 'Already a collaborator' : isACollaboratorAlready && isAdded ? 'Added recently' : null }
                                  </span>
                                </div>
                              )}
                          </li>
                      </div>

                  );
                }}
                renderInput={
                  (params) => 
                  <TextField {...params} 
                  onChange={(e) => setSearch(e.target.value)}
                  label="Search User by Name or ID" />
                }
                filterOptions={(options, { inputValue }) => {
                  return options.filter((option) =>
                    option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                    option.id.toString().includes(inputValue)
                  );
                }}
                onChange={(_, newValue) => handleSelectedUser(newValue as User)}
            />

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
              <DialogTitle>Set Access Level</DialogTitle>
              <DialogContent>
                <Select
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value)}
                  fullWidth
                >                                                                     
                  <MenuItem value="contributor">
                    <div className='flex flex-grow justify-between'>
                      <Typography>Contributor</Typography>
                      <Tooltip 
                        title={tooltipContent} 
                        open={tooltipOpen === 'contributor'} 
                        arrow={true} 
                        placement="right" 
                        enterTouchDelay={50} 
                        leaveTouchDelay={400} 
                        leaveDelay={200} 
                        enterDelay={100}
                      >   
                        <div 
                          onMouseEnter={() => handleMouseEnter('The Contributor at the project level has access to the Open / Internal layers and repositories of the project, participates in the text and voice chats of the layers where they are a collaborator, in addition to being able to clone the repositories by having a "Reader" access level in the repositories.', 'contributor')} 
                          onMouseLeave={handleMouseLeave}
                        >
                          <LiaQuestionCircleSolid />
                        </div>
                      </Tooltip> 
                    </div>
                  </MenuItem>                                       

                  <MenuItem value="coordinator">
                    <div className='flex flex-grow justify-between'>
                      <Typography>Coordinator</Typography>
                      <Tooltip 
                        title={tooltipContent} 
                        open={tooltipOpen === 'coordinator'} 
                        arrow={true} 
                        placement="right" 
                        enterTouchDelay={50} 
                        leaveTouchDelay={400} 
                        leaveDelay={200} 
                        enterDelay={100}
                      >   
                        <div 
                          onMouseEnter={() => handleMouseEnter('The Coordinator at the project level has all the capabilities of the contributor, he can also manage contributions, approve changes and tasks and coordinate activities within the layers, the level provides a "Coordinator" access level in all the layers where he has access, as well as a "Editor" access level in all repositories where he has access. Finally, the Coordinator can add new collaborators with an access level of "Contributor" or "Reader" in the case of repositories.', 'coordinator')} 
                          onMouseLeave={handleMouseLeave}
                        >
                          <LiaQuestionCircleSolid />
                        </div>
                      </Tooltip> 
                    </div>
                  </MenuItem>

                  <MenuItem value="administrator">
                    <div className='flex flex-grow justify-between'>
                      <Typography>Administrator</Typography>
                      <Tooltip 
                        title={tooltipContent} 
                        open={tooltipOpen === 'administrator'} 
                        arrow={true} 
                        placement="right" 
                        enterTouchDelay={50} 
                        leaveTouchDelay={400} 
                        leaveDelay={200} 
                        enterDelay={100}
                      >   
                        <div 
                          onMouseEnter={() => handleMouseEnter('The Administrator at the project level has all the capabilities of the coordinator, the level provides access to restricted layers and repositories, with an "Administrator" access level on all repositories and layers, finally, he can manage the access level of other collaborators below the "Administrator" access level.', 'administrator')} 
                          onMouseLeave={handleMouseLeave}
                        >
                          <LiaQuestionCircleSolid />
                        </div>
                      </Tooltip> 
                    </div>
                  </MenuItem>
                </Select>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => {
                  setOpenDialog(false)
                  setSelectedUser({ name: '', id: '', photoUrl: '', new: true})
                }}
                >Cancel</Button>
                
                <Button onClick={() => addUserAsCollaborator( values, setFieldValue )} disabled={!accessLevel}>Add</Button>            
              </DialogActions>
            </Dialog>

            <div id='newCollabsList' className='flex-grow overflow-y-auto px-3 max-h-[380px]'>
              { values.newCollaborators.length === 0 
                  ?
                    <div className='flex h-full items-center justify-center'>
                      <span className='text-sm'>No recently added collaborators</span>
                    </div> 
                  :  
                    <List>
                      {values.newCollaborators.map((collaborator, index) => (
                        <ListItem className='border-b-[1px] border-gray-400' key={index} secondaryAction={
                          <button 
                            className='mr-3' 
                            onClick={() => handleDeleteNewCollaborator(values, setFieldValue, collaborator.id)}  
                          >
                            <ImCancelCircle size={18} color="#ef233c"/>
                          </button>
                        }>
                          <ListItemAvatar>
                            <Avatar
                              alt={collaborator.name}
                              src={ collaborator.photoUrl || collaborator.name } // Suponiendo que tienes una URL de imagen para cada amigo
                              // Si no hay imagen, podrías mostrar la primera letra del nombre como fallback
                              // {friend.avatar || friend.name[0]}
                            />
                          </ListItemAvatar>
                          <ListItemText 
                            primary={collaborator.name} 
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color="textPrimary">
                                  Access Level: {collaborator.accessLevel}
                                </Typography>
                                {/* Aquí puedes agregar otro Typography para el tercer texto */}
                                <Typography component="div" variant="body2" color="textSecondary">
                                  ID: {collaborator.id}
                                </Typography>
                              </>
                            } 
                          />
                        </ListItem>
                      ))}
                    </List>                         
                }      
            </div>
        </div>

        <div className='flex flex-grow justify-center mx-4  items-center py-4  border-t-[1px] border-gray-400 '>
          <button 
            type='button'
            className='h-[55px] w-[95%] border-1 border-gray-400  rounded-extra glassi transition-transform duration-150 ease-in-out transform active:translate-y-[2px]'
            onClick={ () => handleAddNewCollaborators( values, setFieldValue ) }
          >
            Update new Collaborators
          </button>
        </div>
    </div>
  )
}
