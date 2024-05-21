import { useState, useEffect } from 'react'
import { Autocomplete, TextField, Chip, Tooltip, Button } from '@mui/material';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import Swal from 'sweetalert2';
import axios from 'axios';


export const AddContributorsModal = ({  setIsTaskCOpen, setOpen, taskId, repoID, currentTaskContributors, uid }) => {

    const [selectedContributors, setSelectedContributors] = useState([]);
    const [options, setOptions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [cTaskContributors, setCTaskContributors] = useState(Object.keys(currentTaskContributors));

    const handleAddContributor = (contributor) => {
        if (!selectedContributors.some(c => c.uid === contributor.uid)) {
            setSelectedContributors([...selectedContributors, contributor]);
        }
    };

    const handleDeleteContributor = (contributorUid) => {
        setSelectedContributors(selectedContributors.filter(c => c.uid !== contributorUid));
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleAddContributors = (newContributorsUids) => {
        const ids = newContributorsUids.map( c => c.uid );
        axios.put(`${backendUrl}/tasks/update-task-contributors/${taskId}`, { contributorsIds: ids }, {
            params: {
                uid
            },
            headers: {
                Authorization: localStorage.getItem('x-token')
            }
        }).then( res => {
            Swal.fire({
                title: res.data.message || 'Invitation(s) sent successfully!',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            setIsTaskCOpen(false);
        }).catch(error => {
            console.error(error);     
            Swal.fire({
                title: error.response.data.message || 'Error adding contributors',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false
            });
            setOpen(false);
        })
    };

    useEffect(() => {
        if (searchQuery.length > 0) {
            axios.get(`${backendUrl}/repos/get-repo-collaborators/${repoID}`, {
                params: {
                    add: true,
                    searchQuery
                },
                headers: {
                    Authorization: localStorage.getItem('x-token')
                }
            }).then(response => {
                setOptions(response.data.collaborators);
            }).catch(error => {
                console.error(error);
            });
        }
    }, [searchQuery]);

    return (
        <div className='flex flex-grow flex-col px-5'>
            <Autocomplete
                id="tags-outlined"
                options={options}
                getOptionLabel={(option) => option.name}
                getOptionDisabled={(option) => cTaskContributors.includes(option.uid) || selectedContributors.map(c => c.uid).includes(option.uid) }
                filterSelectedOptions
                onChange={(event, newValue) => {
                    if (newValue) {
                        handleAddContributor(newValue);
                    }
                }}
                renderInput={(params) => (
                    <TextField {...params} 
                        label="Search collaborators" 
                        placeholder="Contributors" 
                        onChange={handleSearchChange}
                        />
                )}
                renderOption={( props, option ) => (
                    <li className='flex p-4 w-full' {...props}>
                        <img className='rounded-extra h-10 w-10' src={option.photoUrl} alt="" />
                        <div className='flex flex-col space-y-1'>
                            <div className='flex justify-between w-full'>
                                <p className='ml-2'>{option.name}</p> 
                                {cTaskContributors.includes(option.uid) && <p className='ml-2 text-[11px] text-green-500'>Already in the task</p>}
                            </div>
                            
                            <p className='ml-2 text-[12px]'>{option.uid}</p>
                        </div>                         
                    </li>
                )}
            />
            <div className='flex flex-wrap min-h-[180px] max-h-[180px] min-w-[475px] max-w-[475px] p-2 overflow-y-auto'>
                {                
                    selectedContributors.length > 0 
                    ? selectedContributors.map((contributor, index) => (
                            <Chip
                                key={index}
                                label={contributor.name}
                                onDelete={() => handleDeleteContributor(contributor.uid)}
                                style={{ margin: '5px' }}
                            />
                        ))
                    : (
                        <div className='flex flex-grow justify-center items-center text-gray-500 text-center'>
                            <p>Choose a collaborator from the repository to which this task belongs</p>
                        </div>
                      )           
                }
            </div>
            <div className='flex flex-grow justify-between py-5'>
                <Button variant="text" onClick={() => setOpen(false)}>Cancel</Button>
                <Button disabled={ selectedContributors.length === 0 } variant="contained" color="primary" onClick={() => handleAddContributors(selectedContributors)}>Add</Button>   
            </div>
        </div>
    );
};
