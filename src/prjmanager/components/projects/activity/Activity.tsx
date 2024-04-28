import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { useActivityData } from './hooks/useActivityData';
import { useSelector } from 'react-redux';
import { RenderTasks } from './RenderTasks';
import { RenderCommits } from './RenderCommits';
import { PuffLoader  } from 'react-spinners';


export const Activity = () => {

  const location = useLocation()
  const projectID = location.state?.projectId
  const { uid  } = useSelector((state) => state.auth)
  const { currentProject, repositories, layers  } = useSelector((state) => state.platypus)

  const [render, setRender] = useState('tasks')  
  const [projectLayers, setProjectLayers] = useState([])
  const [projectRepositories, setProjectRepositories] = useState([])

  const { fetchData, isLoading, tasksCompleted, setTasksCompleted, wFApprovalTasks, setWFApprovalTasks, commits,  errorMessage,
    errorWhileFetching, errorType } = useActivityData(currentProject, uid);


  useEffect(() => {
      setProjectLayers(layers.map(layer => ({
        label: layer.name,
        value: layer._id
      })));
    
      setProjectRepositories(repositories.map(repo => ({
        label: repo.name,
        value: repo._id
      })));
  }, [ layers, repositories, projectID ])


  const renderActivityType = () => {
      switch (render) {
        case 'tasks':
          return <RenderTasks projectLayers={projectLayers} projectRepositories={projectRepositories} 
                              tasksCompleted={tasksCompleted} setTasksCompleted={setTasksCompleted} wFApprovalTasks={wFApprovalTasks} setWFApprovalTasks={setWFApprovalTasks} setRender={setRender} render={render} />
        case 'commits':
          return <RenderCommits projectLayers={projectLayers} projectRepositories={projectRepositories} 
                                commits={commits} setRender={setRender} render={render} />
        default:
          return <RenderTasks projectLayers={projectLayers} projectRepositories={projectRepositories}
                              tasksCompleted={tasksCompleted} setTasksCompleted={setTasksCompleted} wFApprovalTasks={wFApprovalTasks} setWFApprovalTasks={setWFApprovalTasks}  setRender={setRender} render={render} />
      }
  };


  if( errorWhileFetching ) return (
    <div className='flex flex-col flex-grow items-center justify-center'>
      <h1 className='text-xl text-red-500'>{errorMessage}</h1>
      {
          errorType !== 'collaborator-validation' && errorType !== 'token-validation' ? (
            <button
              onClick={fetchData}
              className='hover:text-blue-500 transition-colors duration-100'
            >
              Try Again
            </button>
          ) : null
      }
    </div>
  )


  return (
    <div className='flex flex-col  w-full h-full'> 
        { 
          isLoading 
          ? ( 
              <div className='flex flex-grow items-center justify-center'>
                  <PuffLoader  color="#32174D" size={50} /> 
              </div>                         
            )
          : renderActivityType()         
        }
    </div>
  )
};
