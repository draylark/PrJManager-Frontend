import { useState } from 'react';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Autocomplete } from '@mui/material';
import Swal from 'sweetalert2';

export const AddColaboratorsForm = ({ onAddCollaborator, friends }) => {

    const [colaboradoresSeleccionados, setColaboradoresSeleccionados] = useState([]);
    const [nivelAcceso, setNivelAcceso] = useState('');

    const handleSubmit = (e) => {

        colaboradoresSeleccionados.forEach(colaborador => {
            onAddCollaborator({
                id: colaborador.id, // Asegúrate de que tus objetos de usuarios tienen un campo 'id'
                nombre: colaborador.nombre, 
                accessLevel: nivelAcceso
            });
        });

        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Collaborators added successfully'
        });

        setColaboradoresSeleccionados([]);
        setNivelAcceso('');
    };

    return (
        <div className='flex flex-col justify-center space-y-6 p-3 absolute w-[400px] h-[250px] top-20 left-10 glass2 z-50'>
           <div className='max-h-[100px] pt-2 overflow-y-auto'>
                <Autocomplete
                    multiple
                    options={friends}
                    getOptionLabel={(option) => option.nombre}
                    onChange={(event, newValue) => {
                        setColaboradoresSeleccionados(newValue);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Add Collaborators"
                            placeholder="Add"
                        />
                    )}
                />
           </div>

            <FormControl fullWidth>
                <InputLabel id="select-access-label">Access Level</InputLabel>
                <Select
                    labelId="select-access-label"
                    value={nivelAcceso}
                    onChange={(e) => setNivelAcceso(e.target.value)}
                    label="Access Level"
                    required                    
                >
                    <MenuItem value="Reader">Reader</MenuItem>
                    <MenuItem value="Editor">Editor</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                </Select>
            </FormControl>

            <div className='flex space-x-24 justify-center'>
                <Button onClick={handleSubmit}>Save</Button>
                <Button type="button">Cancel</Button>
            </div>
        </div>
    );

};