import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { useRenderActivity } from './hooks/useRenderActivity';
import { useActivityData } from './hooks/useActivityData';
import LoadingCircle from '../../../../auth/helpers/Loading';
import { useSelector } from 'react-redux';
import { RenderTasks } from './RenderTasks';
import { RenderCommits } from './RenderCommits';



export const Activity = () => {

  const location = useLocation()
  const projectID = location.state?.projectId
  const { uid  } = useSelector((state) => state.auth)
  const { currentProject, repositories, layers  } = useSelector((state) => state.platypus)

  const [render, setRender] = useState('tasks')  
  const [projectLayers, setProjectLayers] = useState([])
  const [projectRepositories, setProjectRepositories] = useState([])

  const { isLoading, tasksCompleted, setTasksCompleted, wFApprovalTasks, setWFApprovalTasks, commits } = useActivityData(currentProject, uid);


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


  return (
    <div className='flex flex-col  w-full h-full'> 
        <div className='flex pl-7 pr-5 justify-between space-x-3'>
              <h3 className='text-3xl  font-bold'>Activity</h3>              
        </div>       

        { 
          isLoading 
          ? <LoadingCircle /> 
          : renderActivityType()         
        }
    </div>
  )
};
