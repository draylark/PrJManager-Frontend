import { useState } from 'react';
import { useSelector } from 'react-redux';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { FaLayerGroup, FaTasks, FaCheck, FaUserCheck } from 'react-icons/fa';
import { ScaleLoader } from 'react-spinners';
import { usePersonalData } from './hooks/usePersonalData';
import { RenderProjects } from './RenderProjects';
import { IosLink, LogoLinkedin } from '@ricons/ionicons4';
import Github from '@ricons/fa/Github';
import { FaXTwitter } from "react-icons/fa6";
import { PiGitCommitLight } from "react-icons/pi";
import { FaGitAlt } from "react-icons/fa6";
import { VscRepoPush } from "react-icons/vsc";
import { TbFolderPlus } from "react-icons/tb";
import { TaskAdd } from '@ricons/carbon'
import { LayersSharp } from '@ricons/material'
import { Tooltip } from '@mui/material';
import { PiGitCommitBold } from "react-icons/pi";
import { ArrowLeftFilled, ArrowRightFilled } from '@ricons/material'
import { ArrowCounterclockwise16Regular } from '@ricons/fluent'
import { Icon } from '@ricons/utils';
import { Followers } from './modals/Followers';
import { MyLinks } from './modals/MyLinks';

const eventIcons = {
  project_created: <TbFolderPlus />,
  layer_created: <FaLayerGroup />,
  repo_created: <FaGitAlt />,
  task_created: <TaskAdd />,
  task_review_submission: <FaTasks />,
  task_completed: <FaCheck />,
  task_contributor_review_submission: <FaUserCheck />,
  task_contributor_completed: <FaUserCheck />,
  task_contributor_marked_ready: <FaUserCheck />,
  commit: <PiGitCommitBold />,
  commit_with_task: <VscRepoPush />
};

const getIconStyle = (type) => {
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

const getEventTitle = (type, data) => {
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

const getEventDescription = (type, data) => {
  switch (type) {
    case 'project_created':
      return (
        <div className=' nav-button text-[14px] mt-2'>
          You have created a new project: <span className='font-semibold text-[#6492ff] text-[14px]'>{data.name}.</span>
        </div>
      );
    case 'layer_created':
      return (
        <div className='nav-button text-[14px] mt-2'>
          You have created a new layer: <span className='font-semibold text-[#ff3f6c] text-[14px]'>{data.name}.</span>
          <h4 className='text-semibold text-[12px] text-[#6492ff] mt-2'>Project: <span className='font-bold text-black'>{data.project.name}</span></h4>
        </div>    
      );
    case 'repo_created':
      return (
        <div className='nav-button text-[14px] mt-2'>
          You have created a new repository: <span className='font-semibold text-green-600 text-[14px]'>{data.name}.</span> 

          <h4 className="mt-1 text-[12px] text-pink-400">Layer: <span className='font-bold text-black'>{data.layerID.name}</span> </h4> 
          <h4 className="text-semibold text-[12px] text-[#6492ff]">Project: <span className='font-bold text-black'>{data.projectID.name}</span> </h4> 
        </div>   
      );
    case 'task_created':
      return (
        <div className='nav-button text-[14px] mt-2'>
          You have created a new task: <span className='font-semibold text-blue-500 text-[14px]'>{data.task_name}</span> on  <span className="font-semibold text-green-600 text-[14px]">{data.repository_related_id.name}</span> repository.      
        </div>
      );
    case 'task_review_submission':
      return (
        <div className='nav-button text-[14px] mt-2'>
          You submitted the assigned task: <span className='font-semibold text-[#007bff] text-[14px]'>{data.task_name}</span> on the repository <span className='font-semibold text-green-600 text-[14px]'>{data.repository_related_id.name}</span> for review.
        </div>
      );
    case 'task_completed':
      return (
        <div className='nav-button text-[14px] mt-2'>
          Your assigned task: <span className='font-semibold text-blue-500 text-[14px]'>{data.task_name}</span> on the repository <span className='font-semibold text-green-600 text-[14px]'>{data.repository_related_id.name}</span>, has been approved.
        </div>
      
      );
    case 'task_contributor_review_submission':
      return (
        <div className='nav-button text-[14px] mt-2'>
          The task you participated in: <span className='font-semibold text-blue-500 text-[14px]'>{data.task_name}</span> on the repository <span className='font-semibold text-green-600 text-[14px]'>{data.repository_related_id.name}</span>, has been submitted for review.
        </div>
      );
    case 'task_contributor_completed':
      return (
        <div className='nav-button text-[14px] mt-2'>
          The task you participated in: <span className='font-semibold text-blue-500 text-[14px]'>{data.task_name}</span> on the repository <span className='font-semibold text-green-600 text-[14px]'>{data.repository_related_id.name}</span>, has been approved.
        </div>
      );
    case 'task_contributor_marked_ready':
      return (
        <div className='nav-button text-[14px] mt-2'>
           You have marked your contributions ready at the task: <span className='font-semibold text-blue-500 text-[14px]'>{data.task_name}</span> on the repository <span className='font-semibold text-green-600 text-[14px]'>{data.repository_related_id.name}</span>.
        </div>
      
      );
    case 'commit':
      return (
        <div className='nav-button text-[14px] mt-2'>
          You committed on repository: <span className='font-semibold text-green-600'>{data.repository.name}.</span>
          <h4 className='text-sm mt-2'>Hash:  <span className='text-[12px]'>{data.uuid}</span> </h4>
        </div>
      
      );
    case 'commit_with_task':
      return (
        <div className='nav-button text-[14px] mt-2'>
          you committed on task: <span className='font-semibold text-blue-500 text-[14px]'>{data.associated_task?.task_name || 'No task'}</span>, repository: <span className='font-semibold text-green-600 text-[14px]'>{data.repository.name}.</span>
          <h4 className='text-sm mt-2'>Hash:  <span className='text-[12px]'>{data.uuid}</span> </h4>
        </div>
      );
    default:
      return '';
  }
};

export const PersonalArea = () => {


  const { uid, username, photoUrl, email, site, followers, following } = useSelector(state => state.auth);
  const { projects, timelineData, selected, setSelected, 
    timelineErrorMessage, timelineErrorWhileFetching, projectsErrorMessage, projectsErrorWhileFetching,
    endDate, startDate, fetchingProjects, fetchingTimelineData, handleNext, handlePrevious } = usePersonalData(uid);


  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false)
  const [isMyLinksModalOpen, setIsMyLinksModalOpen] = useState(false)


  const getInitialsAvatar = (name) => {
    let initials = name?.match(/\b\w/g) || [];
    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    return `data:image/svg+xml;base64,${btoa(
      `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <rect width="100%" height="100%" fill="#2c3e50"/>
        <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-size="30px" font-family="Arial, sans-serif">${initials}</text>
      </svg>`
    )}`;
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long' };
    return new Date(date).toLocaleDateString('en-US', options);
  };




  return (
    <div className="flex h-full w-full shadow-lg rounded-lg p-6">

      { isMyLinksModalOpen && <MyLinks isMyLinksModalOpen={isMyLinksModalOpen} setIsMyLinksModalOpen={setIsMyLinksModalOpen} /> }
      { isFollowersModalOpen && <Followers isFollowersModalOpen={isFollowersModalOpen} setIsFollowersModalOpen={setIsFollowersModalOpen} /> }

      <div className="flex flex-col w-1/2 space-y-3 ">
        <div className='flex space-x-4 items-center'>
          <img src={photoUrl || getInitialsAvatar(username || "N A")} alt={username || "Avatar"} className="rounded-lg w-[100px] h-[100px] object-cover" />
          <div className='flex flex-col'>
            <h1 className="text-2xl font-semibold">@{username || "Unknown User"}</h1>
            <p className="text-black text-sm">{email || "No email"}</p>
            <p className="text-black text-sm">{followers} <span className='font-bold'>345 <span onClick={() => setIsFollowersModalOpen(true)} className='font-normal cursor-pointer hover:text-gray-700 transition-colors duration-200'>followers</span> </span></p>
            <p onClick={() => setIsMyLinksModalOpen(true)} className="ttext-black text-sm cursor-pointer hover:text-gray-700 transition-colors duration-200r">My Links</p>
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
                            <ArrowCounterclockwise16Regular className='w-3 h-3 mr-2 hover:text-slate-500 transition-colors duration-200'/>                          
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
                        <ArrowLeftFilled/>
                      </Icon>
                    </button>

                    <div className='dates text-sm h-8 w-[75%] flex items-center justify-center nav-button'>
                      {formatDate(startDate)} - {formatDate(endDate)}
                    </div>

                    <button 
                      onClick={ handleNext } 
                      className='dashboard-buttons hover:bg-[#1f26870e] rounded-r-extra flex items-center justify-center w-[10%] h-8 transition-all duration-300 ease-in-out transform active:translate-y-[2px]'>
                      <Icon size={22}>
                        <ArrowRightFilled/>
                      </Icon>
                    </button>
              </div>
          </div>


          <div className='flex flex-grow border-gray-400 glassi rounded-2xl overflow-y-auto overflow-x-hidden'>

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
                          {getEventTitle(event.type, event.data)}
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

              {/* <div id='links' className='flex space-x-4 items-center'>
                <div className="flex space-x-2 items-center mb-2">
                  <IosLink className='w-5 h-5' />
                  {site ? <a href="#" className="text-blue-600 dark:text-blue-500 hover:underline">{site}</a>
                    : <a href="#" className="text-[12px] text-blue-600 dark:text-blue-500 hover:underline">Add your personal website</a>}
                </div>
                <div className="flex space-x-2 items-center mb-2">
                  <Github className='w-5 h-5' />
                  <a href="#" className="text-sm text-blue-600 dark:text-blue-500 hover:underline">@itzhack</a>
                </div>
                <div className="flex space-x-2 items-center mb-2">
                  <LogoLinkedin className='w-6 h-6' />
                  <a href="#" className="text-sm text-blue-600 dark:text-blue-500 hover:underline">@itzhack</a>
                </div>
                <div className="flex space-x-2 items-center mb-2">
                  <FaXTwitter size={20} />
                  <a href="#" className="text-sm text-blue-600 dark:text-blue-500 hover:underline">@itzhack</a>
                </div>
              </div> */}
          {/* <div className="flex space-x-6 pt-3 pr-4">
            <div className="flex mb-2">
              <span className="mr-2 font-semibold text-gray-400">
                <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                  <path d="M17.947 2.053a5.209 5.209 0 0 0-3.793-1.53A6.414 6.414 0 0 0 10 2.311 6.482 6.482 0 0 0 5.824.5a5.2 5.2 0 0 0-3.8 1.521c-1.915 1.916-2.315 5.392.625 8.333l7 7a.5.5 0 0 0 .708 0l7-7a6.6 6.6 0 0 0 2.123-4.508 5.179 5.179 0 0 0-1.533-3.793Z" />
                </svg>
              </span>
              <span className="text-sky-950 -mt-1">4,567,346 <span className='ml-2 text-gray-500 text-sm'>Followers</span> </span>
            </div>
            <div className="flex mb-2">
              <span className="text-sky-950 -mt-1">{following ?? 0}<span className='ml-2 text-gray-500 text-sm'>Following</span> </span>
            </div>
          </div> */}