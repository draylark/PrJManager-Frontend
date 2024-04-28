import { useState, useEffect } from 'react';
import { useFormik, Formik, Form, Field, FieldArray, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, List, ListItem, ListItemText, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete, Typography, Tooltip } from '@mui/material';
import { LiaHandsHelpingSolid } from "react-icons/lia";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ImCancelCircle } from "react-icons/im";
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar'
import { LiaQuestionCircleSolid } from "react-icons/lia";
import LoadingCircle from '../../../../../../../auth/helpers/Loading';
import axios from 'axios';
import { useGlobalUsersSearcher } from '../../../../forms/hooks/useGlobalUsersSearcher';




export const RepoNewCollaborators = ({ setFieldValue, values, setCurrentOrNew, currentOrNew }) => {



    const [selectedUser, setSelectedUser] = useState({
        name: '',
        id: '',
        accessLevel: ''
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [accessLevel, setAccessLevel] = useState('');
    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipOpen, setTooltipOpen] = useState('');
    const { users, setSearch } = useGlobalUsersSearcher()



    
    const handleMouseEnter = (text, type) => {
        setTooltipContent(text);
        setTooltipOpen(type);
    };
  
    const handleMouseLeave = () => {
        setTooltipOpen('');
    };


    const addUserAsCollaborator = (values, setFieldValue) => {
        const newCollaborator = { ...selectedUser, accessLevel };
      
        // Filtrar cualquier posible duplicado basado en el 'id'.
        const noDuplicates = values.newCollaborators.filter(collaborator => collaborator.id !== newCollaborator.id);
      
        // Añadir el nuevo colaborador a la lista filtrada.
        const updatedCollaborators = [newCollaborator, ...noDuplicates];
      
        setFieldValue('newCollaborators', updatedCollaborators);
      
        setOpenDialog(false);
        setAccessLevel('');
    };
  
    const handleAddNewCollaborators = (values, setFieldValue) => {
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
  
    const handleDeleteNewCollaborator = (values, setFieldValue, id) => {
      const updateProjectCollaborators = values.collaborators.filter(collaborator => collaborator.id !== id);
      const updatedNewCollaborators = values.newCollaborators.filter(collaborator => collaborator.id !== id);

      setFieldValue('newCollaborators', updatedNewCollaborators);
      setFieldValue('collaborators', updateProjectCollaborators);
    }


  return (
        <div id='newCollaborators' className='flex flex-col w-full h-full'>
            <div className='flex flex-col w-full px-5 space-y-2'>
                <Autocomplete
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
                    fullWidth
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
                    onChange={(e, newValue) => {
                        // Verificar si el elemento seleccionado ya es un colaborador o ha sido añadido
                        const isACollaboratorAlready = values.collaborators.some(collab => collab.id === newValue?.id);
                        const isAdded = values.newCollaborators.some(collab => collab.id === newValue?.id);

                        // Si alguna de las condiciones se cumple, no hacer nada (o prevenir el comportamiento por defecto si es necesario)
                        if (isACollaboratorAlready || isAdded) {
                            console.log("Este usuario ya ha sido añadido o es un colaborador existente. No se puede añadir de nuevo.");
                            // Aquí podrías también llamar a event.preventDefault() si fuera un evento que lo requiera
                            return;
                        }

                        if (newValue !== null && !values.newCollaborators.some(collab => collab.id === newValue.id)) {
                        setSelectedUser(newValue);
                        setOpenDialog(true);
                        }
                    }}
                />

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Set Access Level</DialogTitle>
                <DialogContent>
                    <Select
                    value={accessLevel}
                    onChange={(e) => setAccessLevel(e.target.value)}
                    fullWidth
                    >                                                                     
                    <MenuItem value="reader">
                        <div className='flex flex-grow justify-between'>
                        <Typography>Reader</Typography>
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
                            onMouseEnter={() => handleMouseEnter('The Reader can clone the repository by having access to the "Clone" command on PrJConsole, view the activity of the repository, such as commits history and tasks.', 'contributor')} 
                            onMouseLeave={handleMouseLeave}
                            >
                            <LiaQuestionCircleSolid />
                            </div>
                        </Tooltip> 
                        </div>
                    </MenuItem>                                       

                    <MenuItem value="editor">
                        <div className='flex flex-grow justify-between'>
                        <Typography>Editor</Typography>
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
                            onMouseEnter={() => handleMouseEnter('The Editor has all the capabilities of the Reader with extra access to the "Push" and "Pull" commands on PrjConsole to contribute to the repository, he can contribute to open and assigned tasks of the repository.', 'coordinator')} 
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
                            onMouseEnter={() => handleMouseEnter('The Administrator has all the capabilities of the Editor, including the ability to modify settings, manage all aspects and collaborators within the repository.', 'administrator')} 
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
                    setSelectedUser({ name: '', accessLevel: '', id: '' })
                    }}
                    >Cancel</Button>
                    
                    <Button onClick={() => addUserAsCollaborator( values, setFieldValue )} disabled={!accessLevel}>Add</Button>            
                </DialogActions>
                </Dialog>

                <div className='flex-grow overflow-y-auto px-3 h-[320px]'>
                { values.newCollaborators.length === 0 
                    ?
                        <div className='flex h-full items-center justify-center'>
                        <span className='text-sm'>There are no new collaborators currently</span>
                        </div> 
                    :  
                        <List>
                        {values.newCollaborators.map((friend, index) => (
                            <ListItem className='border-b-[1px] border-gray-400' key={index} secondaryAction={
                            <button 
                                className='mr-3' 
                                onClick={() => handleDeleteNewCollaborator(values, setFieldValue, friend.id)}  
                            >
                                <ImCancelCircle size={18} color="#ef233c"/>
                            </button>
                            }>
                            <ListItemAvatar>
                                <Avatar
                                alt={friend.name}
                                src="/path/to/your/image.jpg" // Suponiendo que tienes una URL de imagen para cada amigo
                                // Si no hay imagen, podrías mostrar la primera letra del nombre como fallback
                                // {friend.avatar || friend.name[0]}
                                />
                            </ListItemAvatar>
                            <ListItemText 
                                primary={friend.name} 
                                secondary={
                                <>
                                    <Typography component="span" variant="body2" color="textPrimary">
                                    Access Level: {friend.accessLevel}
                                    </Typography>
                                    {/* Aquí puedes agregar otro Typography para el tercer texto */}
                                    <Typography component="div" variant="body2" color="textSecondary">
                                    ID: {friend.id}
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
                Update Collaborators
                </button>
            </div>
        </div>
  )
}
