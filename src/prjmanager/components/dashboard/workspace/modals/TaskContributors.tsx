import { useState, useEffect } from 'react'
import { ImCancelCircle } from 'react-icons/im';
import { ScaleLoader } from 'react-spinners';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from 'axios'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UserX from '@ricons/tabler/UserX'
import UserFollow from '@ricons/carbon/UserFollow'
import { AddContributorsModal } from './AddContributorsModal';
import Swal from 'sweetalert2';

export const TaskContributors = ({ setIsTaskCOpen, isTaskCOpen, repoID, taskId, task, uid }) => {

    const [open, setOpen] = useState(false)
    const [repoContributors, setRepoContributors] = useState(false)
    const [taskContributors, setTaskContributors] = useState(null);
    const [expanded, setExpanded] = useState(null);
    const [isLoading, setIsLoading] = useState(false)

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleClose = () => {
        const modal = document.getElementById('contributorsModal');
        if (modal) {
            modal.classList.replace('opacity-100', 'opacity-0');
            setTimeout(() => {
                setIsTaskCOpen(false);
            }, 300);
        }
    };

    const getAvatar = (photoUrl, username) => {
        if (photoUrl) return photoUrl;
        // Aquí podrías generar un avatar con las iniciales si no hay foto
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`;
    };

    const fetchContributorsData = () => {
        setIsLoading(true)
        axios.get(`${backendUrl}/tasks/get-task-contributors/${taskId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('x-token')
            }
        })
        .then(res => {
            console.log(res)
            setTaskContributors(res.data.contributorsData);
            setIsLoading(false)
        })
        .catch(err => {
            setIsLoading(false)
            console.error(err);
        });
    };

    const fetchRepositoryCollaborators = () => {
        axios.get(`${backendUrl}/repos/get-repo-collaborators/${repoID}`, {
            params: {
                add: true
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('x-token')
            }
        })
        .then(res => {
            // console.log(res)
            setRepoContributors(res.data.collaborators);
            setIsLoading(false)
        })
        .catch(err => {
            setIsLoading(false)
            console.error(err);
        });
    };

    const handleDeleteContributor = (contributorId) => {

        axios.put(`${backendUrl}/tasks/delete-task-contributor/${taskId}`, { contributorId }, {
            params: {
                uid
            },
            headers: {
                Authorization: localStorage.getItem('x-token')
            }
        }).then( res => {
            Swal.fire({
                title: 'Contributor removed',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            setIsTaskCOpen(false);
        }).catch(error => {
            console.error(error);     
            Swal.fire({
                title: 'Error removing contributor',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false
            });
        })

    };

    useEffect(() => {
        if (isTaskCOpen) {
            setTimeout(() => {
                document.getElementById('contributorsModal').classList.add('opacity-100');
            }, 20);
        }
    }, [isTaskCOpen]);

    useEffect(() => {
        if(task && task.type === "assigned" && task.assigned_to === uid) {
            fetchRepositoryCollaborators()
        }
    }, [task]);

    useEffect(() => {
        fetchContributorsData()
    }, []);

    return (
        <div className='fixed flex w-screen h-full top-0 right-0 justify-center items-center bg-black/30 z-50 transition-opacity duration-500 ease-in-out'>
            <div id="contributorsModal" className='bg-white overflow-hidden flex flex-col min-w-[500px] min-h-[300px] rounded-2xl border-[1px] border-gray-400 transition-all transform scale-95 opacity-0'>
                <div className='flex justify-between w-full p-5'>
                    <h2 className='text-xl font-semibold'>
                        { open ? 'Add Contributors' : 'Task Contributors' }
                    </h2>
                    <div className='flex space-x-2'>
                        {
                            !open && task.type === "assigned" && task.assigned_to === uid && (
                                <button onClick={() => setOpen(true)} className='text-xl p-1 hover:text-green-500 transition-colors duration-300'>
                                    <UserFollow className="w-5 h-5" />
                                </button> 
                            )
                        }
                        <button onClick={handleClose} className='text-xl p-1 hover:text-red-500 transition-colors duration-300'>
                            <ImCancelCircle size={18} />
                        </button>
                    </div>

                </div>

                {
                    isLoading 
                    ? (
                        <div className='flex flex-grow items-center justify-center'>
                            <ScaleLoader color="#32174D" />
                        </div>
                    )
                    :                      
                    open 
                    ? (
                        <AddContributorsModal 
                            setIsTaskCOpen={setIsTaskCOpen}
                            setOpen={setOpen} 
                            taskId={taskId}
                            repoID={repoID}
                            currentTaskContributors={taskContributors}
                            uid={uid}
                        />
                    )
                    :
                        <div className='flex flex-col items-center p-4 max-h-[556px] overflow-y-auto'>
                            {taskContributors && Object.values(taskContributors).map((contributor, index) => (
                                <div className='w-full p-3 flex flex-col bg-gray-100 rounded-lg shadow mb-4 min-w-[300px]'>
                                    <div className='flex items-center p-2'>
                                        <img src={getAvatar(contributor.photoUrl, contributor.username)} alt={contributor.username} className='w-12 h-12 rounded-full mr-4' />
                                        <div className='w-full'>
                                            <div className='flex justify-between  w-full'>
                                                <h3 className='font-bold'>{contributor.username}</h3>
                                                {
                                                    task.type === "assigned" && task.assigned_to === uid && (
                                                        <button onClick={() => handleDeleteContributor(contributor.id)}>
                                                            <UserX className='h-5 w-5 text-red-500 cursor-pointer' />
                                                        </button>
                                                          
                                                    )
                                                }
                                            </div>
                                            
                                            <p>Commits: {contributor.commits}</p>
                                        </div>
                                    </div>

                                    {                        
                                        contributor.firstCommit && contributor.lastCommit && (
                                            <Accordion 
                                                expanded={expanded === `panel${index}`} 
                                                onChange={handleAccordionChange(`panel${index}`)}>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <p className='font-semibold'>More Details</p>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <div className='flex flex-col'>    
                                                        <p className='text-green-600'>First Commit</p>      
                                                        <div className='mt-2 ml-2 p-2 shadow'>
                                                            <p className='text-[13px] font-semibold'>Date: {new Date(contributor.firstCommit.createdAt).toLocaleString()}</p>
                                                            <p className='text-[13px] font-semibold'>Hash: {contributor.firstCommit.uuid}</p>
                                                        </div>                                       
                                                    </div>
                                                    
                                                    <div className='flex flex-col mt-4'>    
                                                        <p className='text-green-600'>Last Commit</p>      
                                                        <div className='mt-2 ml-2 p-2 shadow'>
                                                            <p className='text-[13px] font-semibold'>Date:  <span>{new Date(contributor.lastCommit.createdAt).toLocaleString()}</span> </p>
                                                            <p className='text-[13px] font-semibold'>Hash: <span>{contributor.lastCommit.uuid}</span> </p>
                                                        </div>
                                                    </div>
                                                </AccordionDetails>
                                            </Accordion>
                                        )
                                    }

                                </div>

                            ))}
                        </div>
                    
                }
            </div>
        </div>
    );
};

