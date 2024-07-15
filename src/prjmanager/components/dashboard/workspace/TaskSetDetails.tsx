import { useState, useEffect } from 'react';
import { ScaleLoader } from 'react-spinners';
import { useLocation } from 'react-router-dom';
import { FaFolderClosed } from "react-icons/fa6";
import axios, { AxiosError } from 'axios';
import { useSelector } from 'react-redux';
import { MdLayers } from 'react-icons/md';
import { FaGitAlt } from 'react-icons/fa';
import { TaskHeatmap } from './heatmap/TaskHeatmap';
import { AnimatedTooltip } from './animated=tooltip';
import { AiOutlineDiff } from "react-icons/ai";
import { DiffModal } from './modals/DiffModal';
import { Copy20Regular, CommentCheckmark28Regular, Warning24Regular } from '@ricons/fluent'
import { Tooltip } from '@mui/material';
import Swal from 'sweetalert2';
import { TaskComplete, TaskView, TaskRemove, UserMultiple } from '@ricons/carbon'
import { TaskRejectionReasons } from './modals/TaskRejectionReasons';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { GiLaurelsTrophy } from "react-icons/gi";
import TaskNotesDialog from './modals/TaskNotesDialog';
import { ContributorsNotes } from './modals/ContributorsNotes';
import { TaskContributors } from './modals/TaskContributors';
import img1 from '../../../assets/imgs/formbg.jpg'
import { capitalizeFirstLetter } from '../../../helpers/helpers';
import { RootState } from '../../../../store/store';
import { WorkspaceTask, CommitForWTask, PopulatedReasonForRejection } from '../../../../interfaces/models';
import { getInitialsAvatar } from '../../projects/helpers/helpers';

interface CommitCount {
    date: string;
    count: number;
    commits?: number; // Esta propiedad es opcional
}

interface ApiResponse {
    message: string;
}

interface DiffData {
    hash: string; 
    new: boolean | undefined
}

interface TaskNote {
    _id: string;
    uid: { username: string; photoUrl: string; uid: string },
    task: string;
    text: string;
    createdAt: string;
    updatedAt: string
}

export const TaskSetDetails = () => {


    const location = useLocation();
    const { uid } = useSelector( (state: RootState) => state.auth );

    const [ready, setReady] = useState(false)
    const [commitsDetailsByDay, setCommitsDetailsByDay] = useState(new Map());
    const [heatmapData, setHeatmapData] = useState<CommitCount[] | null>(null)
    const [commits, setCommits] = useState<CommitForWTask[]>([])

    const [ task, setTask ] = useState<WorkspaceTask | null>(null);
    const [taskNotes, setTaskNotes] = useState<TaskNote[]>([])
    const [ isLoading, setIsLoading ] = useState(true);
    const [ errorMessage, setErrorMessage ] = useState<string | null>(null);
    const [ errorWhileFetching, setErrorWhileFetching ] = useState(false);
    const [handlingParticipation, setHandlingParticipation] = useState(false)

    const [selecteDiffData, setSelecteDiffData] = useState<DiffData>({ hash: '', new: undefined })
    const [isDiffModalOpen, setIsDiffModalOpen] = useState(false)
    const [isNotesOpen, setIsNotesOpen] = useState(false)
    const [isTaskCOpen, setIsTaskCOpen] = useState(false)
    const [isTaskReasonsOpen, setIsTaskReasonsOpen] = useState(false)

    const [open, setOpen] = useState(false)
    const [notes, setNotes] = useState<string[]>([])
    const { taskId } = location.state.task
    const locationState = location.state.task


    const formatDate = (date: string) => {
        const formattedDate = new Date(date).toLocaleDateString();
        return formattedDate;
    };

    const processDataForHeatmap = ( commits: CommitForWTask[], createdAt: string, deadline: string ) => {

        const commitCounts: { [date: string]: CommitCount } = {};  // Objeto para almacenar los conteos por fecha
        
        const start = new Date(createdAt)
        const end = new Date(deadline)

        const dateString1 = `${start.getUTCFullYear()}-${String(start.getUTCMonth() + 1).padStart(2, '0')}-${String(start.getUTCDate()).padStart(2, '0')}`;
        const dateString2 = `${end.getUTCFullYear()}-${String(end.getUTCMonth() + 1).padStart(2, '0')}-${String(end.getUTCDate()).padStart(2, '0')}`;

        commitCounts[dateString1] = { date: dateString1, count: 872349287928342, commits: 0}
        commitCounts[dateString2] = { date: dateString2, count: 772349287928342, commits: 0}

        // Iterar sobre cada commit y acumular el conteo de commits por fecha
        commits.forEach(commit => {
            const date = new Date(commit.createdAt);
            const dateString = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
    
            // Si la fecha ya está en el objeto, incrementa el conteo, si no, inicialízalo a 1
    
            if (commitCounts[dateString]) {
                if( commitCounts[dateString].count === 872349287928342 ){
                    commitCounts[dateString].commits! += 1
                } else {
                    commitCounts[dateString].count += 1;
                }     
            } else {
                commitCounts[dateString] = { date: dateString, count: 1 };
            }
        });

        const transformedCommits = Object.values(commitCounts);
        setHeatmapData(transformedCommits)
        setCommitsDetailsByDay(new Map(Object.entries(commitCounts)));
        setIsLoading(false)
    };

    const readySetted = (task: WorkspaceTask) => {
        return task.readyContributors.filter(c => c.uid._id === uid).length > 0;
    };

    const fetchTaskData = async() => {
       
        const url1 = `${backendUrl}/tasks/get-task-commits/${taskId}`
        const url2 = `${backendUrl}/tasks/get-task-notes/${taskId}`

        try {
            const { data: { task, commits } } = await axios.get(url1)
            const { data: { notes }} = await axios.get(url2)
            setTask(task)
            setCommits(commits)
            setTaskNotes(notes)
            setReady(readySetted(task))
            processDataForHeatmap(commits, task.createdAt, task.deadline)

            if( task.reasons_for_rejection.length > 0 && locationState.reasons ) {
                setIsTaskReasonsOpen(true)
            }
        } catch (error) {
            console.log(error)
            const axiosError = error as AxiosError<ApiResponse>

            if (axiosError.response) {
                setErrorWhileFetching(true)
                setErrorMessage(axiosError.response.data.message || 'An error occurred while fetching the task data')
                setIsLoading(false)
            } else {
                setErrorWhileFetching(true)
                setErrorMessage('An error occurred while fetching the task data')
                setIsLoading(false)
            }
        }
    };

    const handleParticipation = () => {
        setHandlingParticipation(true)
        axios.put(`${backendUrl}/tasks/update-participation/${taskId}`, {
            uid,
            notes  
        })
        .then( res => {
            console.log(res)
            setReady(true)
            setHandlingParticipation(false)
            Swal.fire({
                icon: 'success',
                text: res.data.message || 'Your participation was successfully updated.'
            })
        })
        .catch( err => {
            console.log('erriquwhxoniuqwhiuqwdh',err)
            setHandlingParticipation(false)
            Swal.fire({
                icon: 'error',
                text: err.response.data.message || 'There was an error updating your participation.'
            })
        })
    };

    const dialog = () => {
        if( task?.type === 'assigned' && task?.assigned_to === uid ){
            Swal.fire({
                icon: 'info',
                title: 'Do you want to continue?',
                text: 'This task has been assigned to you, if you continue, you will submit the task for review. If you have added other contributors to this task, make sure they have all finished their contributions, otherwise they will not be able to push any more changes once in review.',         
                showCancelButton: true,
                confirmButtonText: 'Continue',
                cancelButtonText: 'Cancel',
                reverseButtons: true // Invierte los botones
                }).then((result) => {
                if (result.isConfirmed) {
                    setOpen(true)
                } 
            });
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Do you want to continue?',
                text: 'If you press continue it establishes that your participation has ended and you will not be able to push any more changes to this task. Once all collaborators on the task finish their participation, the task will be sent for review. This action is irreversible.',         
                showCancelButton: true,
                confirmButtonText: 'Continue',
                cancelButtonText: 'Cancel',
                reverseButtons: true // Invierte los botones
                }).then((result) => {
                if (result.isConfirmed) {
                    setOpen(true)
                } 
            });
        }
    };

    useEffect(() => {
         setIsLoading(true)
         fetchTaskData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskId])

  return (
    <div 
        className='flex flex-col w-[95%] h-[80%] pb-1 rounded-2xl settask-container bg-white/40'
        style={{
            backgroundImage: `url(${img1})`,
            backgroundPosition: 'center bottom',
        
        }}    
    >

        { isTaskCOpen && <TaskContributors setIsTaskCOpen={setIsTaskCOpen} isTaskCOpen={isTaskCOpen} repoID={task?.repository_related_id._id as string} taskId={task?._id as string} task={task as WorkspaceTask} uid={uid as string} /> }
        { isNotesOpen && <ContributorsNotes setIsNotesOpen={setIsNotesOpen} isNotesOpen={isNotesOpen} taskNotes={taskNotes} setTaskNotes={setTaskNotes} /> }
        { isDiffModalOpen && <DiffModal isDiffModalOpen={isDiffModalOpen} setIsDiffModalOpen={setIsDiffModalOpen} commits={commits} selecteDiffData={selecteDiffData} /> }
        { open && <TaskNotesDialog open={open} setOpen={setOpen} notes={notes} setNotes={setNotes} handleParticipation={handleParticipation} /> }
        { isTaskReasonsOpen && <TaskRejectionReasons reasons={task?.reasons_for_rejection as PopulatedReasonForRejection[]} setIsTaskReasonsOpen={setIsTaskReasonsOpen} isTaskReasonsOpen={isTaskReasonsOpen} /> }

        {
            isLoading 
            ? 
               ( <div className='flex flex-grow items-center justify-center'>
                    <ScaleLoader  color="#32174D" /> 
                </div> ) 
          
            : errorWhileFetching 
            ?  ( <div className='flex flex-grow items-center justify-center'>
                   <h1 className='text-red-500'>{errorMessage}</h1>
                </div> )
            :   
            (
                 <div className='flex flex-grow bg-white-900 rounded-2xl glassi border border-gray-100  py-7 pr-7 '>

                    <div id='TleftPanel' className='relative w-[65%] h-full px-6'>
                        <div className='flex flex-col space-y-4'>
                            <div className="flex space-x-2">
                                <div className='flex flex-col'>
                                    {
                                        task?.assigned_to === uid && (
                                            <p className='flex text-[12px] font-semibold text-center'> <GiLaurelsTrophy className="text-xl text-black mr-2" />  This task has been assigned to you</p>
                                        )
                                    }
                                    <h1 className='text-blue-700 text-3xl font-bold'>{task?.task_name}</h1>
                                </div>

                                <button
                                    onClick={() => navigator.clipboard.writeText(task?._id as string)}                                  
                                >

                                    <Tooltip
                                        title="Copy Task ID" 
                                        arrow
                                        placement="top"      
                                    >
                                        <Copy20Regular
                                            onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                                            className='w-5 h-5 cursor-pointer hover:text-blue-500 transition-all duration-200 ease-in-out transform active:translate-y-[2px]'
                                        />
                                    </Tooltip>

                                </button>

                                <button
                                    onClick={() => setIsTaskCOpen(true)}                                  
                                >
                                    <Tooltip
                                        title="Task contributors" 
                                        arrow
                                        placement="top"      
                                    >
                                        <UserMultiple
                                            onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                                            className='w-5 h-5 cursor-pointer hover:text-blue-500 transition-all duration-200 ease-in-out transform active:translate-y-[2px]'
                                        />
                                    </Tooltip>

                                </button>

                            </div>
                            


                            <p className='text-xl'>
                                {task?.task_description}
                            </p>

                            <div className='flex space-x-[30px] w-full pl-2 items-center '>
                                <div className='flex  items-center '>
                                    <FaFolderClosed size={28} color='#6082B6' className='mb-[2px]' />  
                                    <p className='text-[12px] font-semibold ml-4'> {task?.project.name}</p>
                                </div>
                                <div className='flex   items-center  '>
                                    <MdLayers size={38} color='#ffafcc'/>   
                                    <p  className='text-[12px] font-semibold ml-4'>{task?.layer_related_id.name}</p>
                                </div>
                                <div className='flex   items-center  '>
                                    <FaGitAlt size={34} color="#80ed99"/> 
                                    <p  className='text-[12px] font-semibold ml-4'>{task?.repository_related_id.name}</p>
                                </div>
                                <div className='flex   items-center '>
                                    {
                                        task?.status === 'completed' ?
                                        ( 
                                            <>
                                                <TaskComplete  
                                                    onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                                                    className='w-[26px] h-[26px] text-blue-500'
                                                /> 
                                                <p className='text-[12px] font-semibold ml-4'>{capitalizeFirstLetter(task?.status)}</p>
                                            </>
                                        )
                                        : task?.status === 'approval' ?
                                        ( 
                                           <>
                                                <TaskView  
                                                    onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                                                    className='w-[26px] h-[26px] text-yellow-500'/>
                                                <p className='text-[12px] font-semibold ml-4'>Waiting for approval</p>
                                           </>
                                           
                                        )
                                        : 
                                        (            
                                          <>
                                            <TaskRemove  
                                                onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                                                className='w-[26px] h-[26px] text-[#FF0800]'/>
                                            <p className='text-[12px] font-semibold ml-4'>{capitalizeFirstLetter(task?.status)}</p>
                                          </>
                                        )
                                    }
                                </div>

                            </div>                   
                            
                        </div>      

                        

                        <div id='goals' className='flex flex-col flex-grow mt-5'>
                            <h2 className='font-semibold mb-2'>Goals</h2>
                            {task?.goals.map((goal, index) => (
                                <div key={index} className="goal-item p-2 m-2 bg-white rounded shadow">
                                    <p className="text-gray-700 text-sm">{goal}</p>
                                </div>
                            ))}
                        </div>


                        <div className='absolute flex-grow bottom-0 w-[94%]'>               
                            {
                                task?.readyContributors && task?.readyContributors.length > 0 && (
                                    <div className="flex items-center mb-2 w-full max-h-[820px]">
                                        <AnimatedTooltip items={task.readyContributors} commits={commits} />
                                    </div>
                                )
                            }  
                            {
                            
                                task?.status === 'completed' ? (
                                    <div className='flex items-center justify-center w-full p-4'>
                                        <p className='text-xl font-semibold text-blue-500'>Task Completed.</p>
                                    </div>
                                )
                                : task?.status === 'approval' ? (
                                    <div className='flex items-center justify-center w-full p-4'>
                                        <p className='text-xl font-semibold text-yellow-600'>Waiting for approval.</p>
                                    </div>
                                )
                                :      
                                ready ? (
                                    <div className='flex items-center justify-center w-full p-4'>
                                        <p className='text-xl font-semibold text-blue-500'>Contributions Finished.</p>
                                    </div>
                                )
                                :
                                (                      
                                    <button 
                                    onClick={dialog}
                                    className="flex justify-center overflow-y-hidden  p-4 rounded-2xl border-[1px] border-gray-400 w-full  max-h-[57px] overflow-x-auto font-semibold bg-green-400/20 transition-all duration-200 ease-in-out transform active:translate-y-[2px]">
                                      {
                                            handlingParticipation 
                                            ? ( <ScaleLoader height={20} width={3}  color="#32174D" /> )                                                                        
                                            : (
                                                <p className="w-[50%] transition-transform duration-200 ease-in-out hover:scale-110">
                                                    {task?.assigned_to === uid ? 'Send task for revision' : 'Finish contributions'}
                                                </p>
                                            )
                                      }
                                      
                                    </button>
                                )
                            }                                 
                        </div>
                    </div>
                    
                    <div id='TrightPanel' className='flex flex-col flex-grow  border-[1px]  border-gray-400 rounded-2xl glassi'>
                        <div className='flex itesm-center justify-between pt-5 px-7'>
                             <h4 className='font-semibold'>Task Activity</h4> 
                             <div className='flex space-x-2'>
                                {
                                    task?.reasons_for_rejection && task?.reasons_for_rejection.length > 0 && (
                                        <button onClick={() =>  setIsTaskReasonsOpen(true)}>
                                        <Warning24Regular 
                                            onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                                            className='w-5 h-5 hover:text-red-600 transition-colors duration-100'/>
                                    </button>
                                    )
                                }

                                {
                                    taskNotes.length > 0 && (
                                        <button onClick={() =>  setIsNotesOpen(true) }>
                                            <CommentCheckmark28Regular 
                                                onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                                                className='w-5 h-5 hover:text-green-600 transition-colors duration-100'/>
                                        </button>
                                    )
                                }
                                <button onClick={() => {
                                        setSelecteDiffData({ hash: '', new: undefined })
                                        setIsDiffModalOpen(true)
                                    }}>               
                                    <AiOutlineDiff size={20} className='hover:text-yellow-500 transition-colors duration-100'/>
                                </button>
                             </div>
                 
                        </div>
                        
                        <TaskHeatmap 
                            data={heatmapData as CommitCount[]} 
                            commitsDetailsByDay={commitsDetailsByDay} 
                            createdAt={task?.createdAt as string} 
                        />

                        <div id='hashes-users' className='flex flex-grow flex-col min-h-[460px] max-h-[460px] overflow-auto w-[92%] mx-auto border-t-[1px] pt-4 border-gray-400'>
                                {
                                
                                commits && commits.length > 0  ?
                                    commits.map((commit, index) => (
                                        <div key={index} 
                                            onClick={() => {
                                                setSelecteDiffData({ hash: commit.uuid, new: true })
                                                setIsDiffModalOpen(true)
                                            }}
                                            className="flex max-w-[380px] mx-auto items-center p-2 bg-white rounded shadow mb-2 pl-4 hover:bg-gray-300 transition-colors duration-200 cursor-pointer">
                                            <img 
                                                src={commit.author.photoUrl || getInitialsAvatar(commit.author.name)}  
                                                alt={commit.author.name} 
                                                className="w-9 h-9 rounded-full mr-3" 
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement; // Asegura el tipo
                                                    target.onerror = null; // Previene el bucle de error
                                                    target.src = getInitialsAvatar(commit.author.name); // Establece la imagen de las iniciales si la imagen principal falla
                                                }}
                                            />
                                            <div className="flex flex-col">
                                                <div className='flex justify-between pr-2'>
                                                    <span className="text-[14px] font-semibold">{commit.author.name}</span>
                                                    <span className="text-[12px] font-semibold">{formatDate(commit.createdAt)}</span>

                                                </div>
                                                
                                                <span className="text-[14px] text-gray-600">committed with hash <span className="font-mono bg-gray-100 rounded px-1">{commit.uuid}</span></span>
                                            </div>
                                        </div>
                                    ))
                                
                                    :
                                    <div className='flex flex-grow items-center justify-center'>
                                        <h1 className='text-gray-500'>No commits yet on this task</h1>
                                    </div>
                                }
                        </div>                     
                    </div>  

                </div>
            )
        }
    </div>
  )
}
