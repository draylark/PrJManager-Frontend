import { useState } from 'react';
import { useSelector } from 'react-redux';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { FaLayerGroup, FaTasks, FaCheck, FaUserCheck } from 'react-icons/fa';
import { ScaleLoader } from 'react-spinners';
import { usePersonalData } from './hooks/usePersonalData';
import { RenderProjects } from './RenderProjects';
import { FaGitAlt } from "react-icons/fa6";
import { VscRepoPush } from "react-icons/vsc";
import { TbFolderPlus } from "react-icons/tb";
import { TaskAdd } from '@ricons/carbon'
import { Tooltip } from '@mui/material';
import { PiGitCommitBold } from "react-icons/pi";
import { ArrowLeftFilled, ArrowRightFilled } from '@ricons/material'
import { ArrowCounterclockwise16Regular } from '@ricons/fluent'
import { Icon } from '@ricons/utils';
import { Followers } from './modals/Followers';
import { MyLinks } from './modals/MyLinks';
import { getInitialsAvatar } from '../projects/helpers/helpers';
import { abbreviateNumber } from '../../helpers/helpers';
import { RootState } from '../../../store/store';
import { ProjectCreated, LayerCreated, RepositoryCreated, NewCommit, NewCommitWTask, TaskCreated, TaskCompleted, TaskContributorCompleted, TaskContributorMarkedReady,
  TaskContributorReviewSubmission, TaskReviewSubmission } from '../../../interfaces/others/timeline';
import { ExtConnections } from './modals/ExtConnections';

type Data = ProjectCreated | LayerCreated | RepositoryCreated | TaskCreated | TaskReviewSubmission | TaskCompleted | TaskContributorReviewSubmission | TaskContributorCompleted | TaskContributorMarkedReady | NewCommit | NewCommitWTask;

const eventIcons: { [key: string]: JSX.Element } = {
  project_created: <TbFolderPlus />,
  layer_created: <FaLayerGroup />,
  repo_created: <FaGitAlt />,
  task_created: <TaskAdd onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
  task_review_submission: <FaTasks />,
  task_completed: <FaCheck />,
  task_contributor_review_submission: <FaUserCheck />,
  task_contributor_completed: <FaUserCheck />,
  task_contributor_marked_ready: <FaUserCheck />,
  commit: <PiGitCommitBold />,
  commit_with_task: <VscRepoPush />
};

const getIconStyle = (type: string) => {
  switch (type) {
    case 'project_created':
      return { background: '#e2eafc', color: '#000000' };
    case 'layer_created':
      return { background: 'rgb(255, 179, 198)', color: '#fff' };
    case 'repo_created':
      return { background: 'rgb(16, 204, 82)', color: '#fff' };
    case 'task_created':
      return { background: 'rgb(33, 150, 243)', color: '#fff' };
    case 'task_review_submission':
      return { background: 'rgb(0, 123, 255)', color: '#fff' };
    case 'task_completed':
      return { background: 'rgb(40, 167, 69)', color: '#fff' };
    case 'task_contributor_review_submission':
      return { background: 'rgb(255, 193, 7)', color: '#fff' };
    case 'task_contributor_completed':
      return { background: 'rgb(23, 162, 184)', color: '#fff' };
    case 'task_contributor_marked_ready':
      return { background: 'rgb(108, 117, 125)', color: '#fff' };
    case 'commit':
      return { background: 'rgb(255, 165, 0)', color: '#fff' };
    case 'commit_with_task':
      return { background: 'rgb(102, 16, 242)', color: '#fff' };
    default:
      return { background: 'rgb(0, 0, 0)', color: '#fff' };
  }
};

const getEventTitle = (type: string) => {
  switch (type) {
    case 'project_created':
      return (
          <h3 className='vertical-timeline-element-title text-[15px] nav-button text-[#6492ff] font-bold'>Project Created</h3>
      );
    case 'layer_created':
      return(
        <h3 className='flex flex-col vertical-timeline-element-title text-[15px] nav-button text-[#ff3f6c] font-bold'>Layer Created</h3>      
      );
    case 'repo_created':
      return (
        <h3 className='flex flex-col vertical-timeline-element-title text-[15px] nav-button text-green-600 font-bold'>Repository Created</h3>   
      );
    case 'task_created':
      return (
        <h3 className='flex flex-col vertical-timeline-element-title text-[15px] nav-button text-blue-500 font-bold'>Task Created</h3>   
      );
    case 'task_review_submission':
      return (
        <h3 className='vertical-timeline-element-title text-[15px] nav-button text-[#007bff] font-bold'>Task Review Submission</h3>
      );
    case 'task_completed':
      return (
        <h3 className='vertical-timeline-element-title text-[15px] nav-button text-[#28a745] font-bold'>Task Approved</h3>
      );
    case 'task_contributor_review_submission':
      return (
        <h3 className='vertical-timeline-element-title text-[15px] nav-button text-yellow-600 font-bold'>Contributions Submitted</h3>        
      );
    case 'task_contributor_completed':
      return (
        <h3 className='vertical-timeline-element-title text-[15px] nav-button text-[#17a2b8] font-bold'>Contributions Approved</h3>    
      );
    case 'task_contributor_marked_ready':
      return (
        <h3 className='vertical-timeline-element-title text-[15px] nav-button text-[#6c757d] font-bold'>Contributions Finished</h3> 
      );
    case 'commit':
      return (
        <h3 className='vertical-timeline-element-title text-[15px] nav-button text-yellow-600 font-bold'>Commit </h3>     
      );
    case 'commit_with_task':
      return (
        <h3 className='vertical-timeline-element-title text-[15px] nav-button text-[#8664ff] font-bold'>Task Commit</h3>
      );
    default:
      return 'Unknown Event';
  }
};

const getEventDescription = (type: string, data: Data) => {
  switch (type) {
    case 'project_created': {
      const project = data as ProjectCreated;
      return (
        <div className=' nav-button text-[14px] mt-2'>
          You have created a new project: <span className='font-semibold text-[#6492ff] text-[14px]'>{project.name}.</span>
        </div>
      )
    }
    case 'layer_created':{
      const layer = data as LayerCreated;
      return (
        <div className='nav-button text-[14px] mt-2'>
          You have created a new layer: <span className='font-semibold text-[#ff3f6c] text-[14px]'>{layer.name}.</span>
          <h4 className='text-semibold text-[12px] text-[#6492ff] mt-2'>Project: <span className='font-bold text-black'>{layer.project.name}</span></h4>
        </div>    
      )
    }
    case 'repo_created':{
      const repository = data as RepositoryCreated;
      return (
        <div className='nav-button text-[14px] mt-2'>
          You have created a new repository: <span className='font-semibold text-green-600 text-[14px]'>{repository.name}.</span> 

          <h4 className="mt-1 text-[12px] text-pink-400">Layer: <span className='font-bold text-black'>{repository.layerID.name}</span> </h4> 
          <h4 className="text-semibold text-[12px] text-[#6492ff]">Project: <span className='font-bold text-black'>{repository.projectID.name}</span> </h4> 
        </div>   
      )
    }
    case 'task_created':{
      const task = data as TaskCreated;
      return (
        <div className='nav-button text-[14px] mt-2'>
          You have created a new task: <span className='font-semibold text-blue-500 text-[14px]'>{task.task_name}</span> on  <span className="font-semibold text-green-600 text-[14px]">{task.repository_related_id.name}</span> repository.      
        </div>
      )
    }
    case 'task_review_submission': {
      const task = data as TaskReviewSubmission;
      return (
        <div className='nav-button text-[14px] mt-2'>
          You submitted the assigned task: <span className='font-semibold text-[#007bff] text-[14px]'>{task.task_name}</span> on the repository <span className='font-semibold text-green-600 text-[14px]'>{task.repository_related_id.name}</span> for review.
        </div>
      )
    }
    case 'task_completed':{
      const task = data as TaskCompleted;
      return (
        <div className='nav-button text-[14px] mt-2'>
          Your assigned task: <span className='font-semibold text-blue-500 text-[14px]'>{task.task_name}</span> on the repository <span className='font-semibold text-green-600 text-[14px]'>{task.repository_related_id.name}</span>, has been approved.
        </div>
      )
    }
    case 'task_contributor_review_submission':{
      const task = data as TaskContributorReviewSubmission;
      return (
        <div className='nav-button text-[14px] mt-2'>
          The task you participated in: <span className='font-semibold text-blue-500 text-[14px]'>{task.task_name}</span> on the repository <span className='font-semibold text-green-600 text-[14px]'>{task.repository_related_id.name}</span>, has been submitted for review.
        </div>
      )
    }
    case 'task_contributor_completed':{
      const task = data as TaskContributorCompleted;
      return (
        <div className='nav-button text-[14px] mt-2'>
          The task you participated in: <span className='font-semibold text-blue-500 text-[14px]'>{task.task_name}</span> on the repository <span className='font-semibold text-green-600 text-[14px]'>{task.repository_related_id.name}</span>, has been approved.
        </div>
      )
    }
    case 'task_contributor_marked_ready':{
      const task = data as TaskContributorMarkedReady;
      return (
        <div className='nav-button text-[14px] mt-2'>
           You have marked your contributions ready at the task: <span className='font-semibold text-blue-500 text-[14px]'>{task.task_name}</span> on the repository <span className='font-semibold text-green-600 text-[14px]'>{task.repository_related_id.name}</span>.
        </div>     
      )
    }
    case 'commit':{
      const commit = data as NewCommit;
      return (
        <div className='nav-button text-[14px] mt-2'>
          You committed on repository: <span className='font-semibold text-green-600'>{commit.repository.name}.</span>
          <h4 className='text-sm mt-2'>Hash:  <span className='text-[12px]'>{commit.uuid}</span> </h4>
        </div>   
      )
    }
    case 'commit_with_task':{
      const commit = data as NewCommitWTask;
      return (
        <div className='nav-button text-[14px] mt-2'>
          you committed on task: <span className='font-semibold text-blue-500 text-[14px]'>{commit.associated_task?.task_name || 'No task'}</span>, repository: <span className='font-semibold text-green-600 text-[14px]'>{commit.repository.name}.</span>
          <h4 className='text-sm mt-2'>Hash:  <span className='text-[12px]'>{commit.uuid}</span> </h4>
        </div>
      )
    }
    default:
      return '';
  }
};

export const PersonalArea = () => {

  const { uid, username, photoUrl, email, followers } = useSelector(( state: RootState ) => state.auth);
  const { followersLength, projects, timelineData, selected, setSelected, 
    timelineErrorMessage, timelineErrorWhileFetching, projectsErrorMessage, projectsErrorWhileFetching,
    endDate, startDate, fetchingProjects, fetchingTimelineData, handleNext, handlePrevious } = usePersonalData(uid as string);

  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false)
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false)
  const [isMyLinksModalOpen, setIsMyLinksModalOpen] = useState(false)


  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',  // 'numeric' o '2-digit'
        month: 'long'     // 'numeric', '2-digit', 'narrow', 'short' o 'long'
    };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  return (
    <div className="flex min-h-screen h-full w-full p-6 bg-blue-50">

      { isConnectionModalOpen && <ExtConnections isConnectionModalOpen={isConnectionModalOpen} setIsConnectionModalOpen={setIsConnectionModalOpen} /> }
      { isMyLinksModalOpen && <MyLinks isMyLinksModalOpen={isMyLinksModalOpen} setIsMyLinksModalOpen={setIsMyLinksModalOpen} /> }
      { isFollowersModalOpen && <Followers isFollowersModalOpen={isFollowersModalOpen} setIsFollowersModalOpen={setIsFollowersModalOpen} /> }

      <div className="flex flex-col w-1/2 space-y-3 ">
        <div className='flex space-x-4 '>
          <img src={photoUrl || getInitialsAvatar(username || "N A")} alt={username || "Avatar"} className="rounded-lg w-[100px] h-[100px] object-cover" />
          <div className='flex flex-col pt-1'>
            <h1 className="text-2xl font-bold nav-button">@{username || "Unknown User"}</h1>
            <p className="text-black text-sm font-semibold">{email || "No email"}</p>
            <div className='flex space-x-2'>
              <p className="text-black text-sm font-semibold">{abbreviateNumber(followersLength || followers)} <span onClick={() => setIsFollowersModalOpen(true)} className='font-normal cursor-pointer hover:text-gray-700 transition-colors duration-200'>followers</span> </p>
              <p onClick={() => setIsMyLinksModalOpen(true)} className="text-black text-sm cursor-pointer hover:text-gray-700 transition-colors duration-200">My Links</p>
            </div>
            <p onClick={() => setIsConnectionModalOpen(true)} className="text-black text-sm cursor-pointer hover:text-gray-700 transition-colors duration-200">Connections</p>
          </div>
        </div>

        <div className='flex flex-col space-y-3 h-full pt-4 '>
          <h2 className="font-bold text-xl text-sky-950">Projects</h2>
          <div className='flex flex-col flex-grow rounded-xl pr-4 overflow-y-auto '>
            {
              fetchingProjects 
              ? (
                <div className='flex h-full w-full justify-center items-center'>
                  <ScaleLoader color='#0c4a6e' />
                </div>
              )           
              : projectsErrorWhileFetching ? (
                <div className='flex h-full w-full justify-center items-center'>
                  <p className='text-red-500 text-lg'>{projectsErrorMessage}</p>
                </div>
              )           
              : projects.length === 0 ? (
                <div className='flex h-full w-full justify-center items-center'>
                  <p className='text-gray-500 text-lg'>You do not participate or own any project yet.</p>
                </div>
              )
              : (<RenderProjects projects={projects} selected={selected} setSelected={setSelected} />)                             
            }
          </div>
        </div>
      </div>


      <div className="flex flex-col space-y-2 w-1/2 ">

          <div className='flex flex-col space-y-2'>
              <h2 className="flex items-center text-center font-bold text-xl text-sky-950 mx-auto">           
                {
                    selected && (
                      <button onClick={() => setSelected(null)}>
                        <Tooltip title="Go back to general activity" arrow> 
                            <ArrowCounterclockwise16Regular className='w-3 h-3 mr-2 hover:text-slate-500 transition-colors duration-200' onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}/>                          
                        </Tooltip>
                      </button>
                      
                    )
                }
                  Timeline 
                {
                  selected && (
                    <span className="ml-1 text-sm text-gray-500 font-semibold"> - {selected.name}</span>
                  )
                }
                {
                  !selected && (
                    <span className="ml-1 text-sm text-gray-500 font-semibold"> - General Activity</span>
                  )
                }
              </h2>
              <div id="heatMapOpt" className='flex w-full h-10 space-x-3 justify-between '>
                    <button
                      onClick={ handlePrevious } 
                      className='dashboard-buttons hover:bg-[#1f26870e] rounded-l-extra flex items-center justify-center w-[10%] h-8 transition-all duration-300 ease-in-out transform active:translate-y-[2px]'>
                      <Icon size={22}>
                        <ArrowLeftFilled onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}/>
                      </Icon>
                    </button>

                    <div className='dates text-sm h-8 w-[75%] flex items-center justify-center nav-button'>
                      {formatDate(startDate)} - {formatDate(endDate)}
                    </div>

                    <button 
                      onClick={ handleNext } 
                      className='dashboard-buttons hover:bg-[#1f26870e] rounded-r-extra flex items-center justify-center w-[10%] h-8 transition-all duration-300 ease-in-out transform active:translate-y-[2px]'>
                      <Icon size={22}>
                        <ArrowRightFilled onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}/>
                      </Icon>
                    </button>
              </div>
          </div>


          <div className='flex flex-grow border-gray-400 glassi max-h-[800px] rounded-2xl overflow-y-auto overflow-x-hidden'>

            {
              fetchingTimelineData 
              ? (
                  <div className='flex h-full w-full justify-center items-center'>
                    <ScaleLoader color='#0c4a6e' />
                  </div>
                ) 
              : timelineErrorWhileFetching ? 
                (    
                  <div className='flex h-full w-full justify-center items-center'>
                    <p className='text-red-500 text-lg'>{timelineErrorMessage}</p>
                  </div>
                )           
              : timelineData.length === 0 
              ? (
                  <div className='flex h-full w-full justify-center items-center'>
                    <p className='text-gray-500 text-lg'>No activity was found between the dates.</p>
                  </div>
                ) 
              :
                (
                  <div className='w-full min-h-[100vh]'>
                    <VerticalTimeline>
                      {timelineData.map((event, index) => (
                        <VerticalTimelineElement
                          key={index}
                          date={new Date(event.date).toLocaleString()}
                          icon={eventIcons[event.type]}
                          iconStyle={getIconStyle(event.type)}
                          // className='vertical-timeline-element-date'
                        >
                          {getEventTitle(event.type)}
                          {getEventDescription(event.type, event.data)}
                        </VerticalTimelineElement>
                      ))}
                    </VerticalTimeline>
                  </div>
                )
              }
          </div>
        
      </div>


     


    </div>
  );
};
