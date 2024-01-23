import React from 'react';
import { List, ListItem, ListItemText, IconButton, Select, MenuItem, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

export const ColaboradoresList = ({ colaborators, onAccessLevelChange }) => {
    
    return (
        <div className='h-[250px] overflow-y-auto'>
                <List>
                    <h2 className='text-sm ml-4'>
                        Collaborators
                    </h2>
                    {colaborators.map((colaborador) => (
                        <ListItem key={colaborador.id}>
                            <ListItemText primary={colaborador.nombre} secondary={`Access Level: ${colaborador.accessLevel}`} />
                            <Select
                                value={colaborador.accessLevel}
                                onChange={(e) => onAccessLevelChange(colaborador.id, e.target.value)}
                            >
                                <MenuItem value="Reader">Reader</MenuItem>
                                <MenuItem value="Editor">Editor</MenuItem>
                                <MenuItem value="Admin">Admin</MenuItem>
                            </Select>
                            <IconButton edge="end" aria-label="edit">
                                <EditIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>

        </div>

    );
};
