import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { Icon } from '@ricons/utils';
import { Activity as ActivityIcon } from '@ricons/carbon'
import { useRenderActivity } from './hooks/useRenderActivity';

export const Activity = () => {

  const location = useLocation()
  const { RenderTasks, RenderCommits } = useRenderActivity()
  

  const [statusFilter, setStatusFilter] = useState('');
  const [layerFilter, setLayerFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');


  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    // Aquí puedes implementar la lógica de filtrado basado en el estado
  };

  const handleLayerChange = (event) => {
    setLayerFilter(event.target.value);
    // Implementar lógica de filtrado basado en las capas
  };

  const handleUserChange = (event) => {
    setUserFilter(event.target.value);
    // Implementar lógica de filtrado basado en el usuario
  };

  // Ejemplo de cómo podrías implementar la lógica de filtrado
  // Esto es simplemente ilustrativo, necesitarás ajustar según tus necesidades
  const applyFilters = () => {
    let filtered = tasksCompleted;

    if (statusFilter) {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    if (layerFilter) {
      filtered = filtered.filter(task => task.layer_related === layerFilter);
    }
    if (userFilter) {
      filtered = filtered.filter(task => task.completedBy.includes(userFilter));
    }

    setFilteredTasks(filtered);
  };

  const [render, setRender] = useState('tasks')
  const [allActivity, setAllActivity] = useState([])
  const [commits, setCommits] = useState([
    {
      layer_related_id: '65465f6830a6a05ecabd677a',
      repository_related_id: '65e3aeae281b46641aa69640',
      commit_id: '65e3aeae281b46641aa69640',
      commit_hash: '6621be5f-fba4-48e4-9dbe-7b9192463493',
      commit_message: 'Algorithm search component created',
      commit_author: '653fbc5a9d7eb4eccc744315',
      associated_task: '',
      createdAt : '2021-10-15'
    },
    {
      layer_related_id: '6554cd04a968cc787a0f502c',
      repository_related_id: '65e3aeae281b46641aa69640',
      commit_id: '65e3aeae281b46641aa69640',
      commit_hash: '01f249f5-0436-4038-aee9-08c7ea754306',
      commit_message: 'Dynamyc charts component created',
      commit_author: '64fb7b7df63cb10dbb6c3af3',
      associated_task: '',
      createdAt : '2021-10-15'
    },
    {
      layer_related_id: '654bf5051ac302282df36efb',
      repository_related_id: '65e3b133487bd409607b0098',
      commit_id: '65e3b133487bd409607b0098',
      commit_hash: 'e7cf846c-66a2-461f-91f8-46f41a10d6ae',
      commit_message: 'User authentication component created',
      commit_author: '64ef1d3651c283627adfc677',
      associated_task: '',
      createdAt: '2021-10-20'
    },
  ])
  const [tasksCompleted, setTasksCompleted] = useState([
      {
          type: 'T',
          task_id: '24892394012',
          layer_number_task: '302',
          task_name: 'inventory-management',
          task_description: 'Develop the inventory management module.',
          commits_hashes: ['84fb7a7bc63ad10ebb6c3bf4'],
          collaboratorsIds: ['64ef8b4cc46bf3948cc92cc8', '64fb7b7df63cb10dbb6c3af3', '64ef20048a7f31596819acf9', '65b18c371f6958cd48f7ddfc', '64ef1d3651c283627adfc677', '64ef1beb51c283627adfc674', '653fbc5a9d7eb4eccc744315'],
          completedBy: [],
          layer_related_id: '65465f6830a6a05ecabd677a',
          repository_related_id: '65e3aeae281b46641aa69640',
          status: 'completed',
          conclusion_date: '2021-10-15',
          additional_info: {
            estimated_hours: 20,
            actual_hours: 22,
            notes: [    
            'Include batch processing', 
            'Support for perishable goods and other good things like that one time that we went to america and we bought a lot of things',
            'Implement a barcode scanner for faster input of products',
            'Optimize the database for faster queries',
            'Implement a notification system for low stock',
          ],
            priority: 'Critical'
          }
      },
      {
        type: 'T',
        task_id: '24892394013',
        layer_number_task: '303',
        task_name: 'order-processing-system',
        task_description: 'Improve the order processing system for better efficiency.',
        commits_hashes: ['94fb7b7bc63ad10ebb6c3bf5', '85fb7a7bc63ad10ebb6c3bf4'],
        collaboratorsIds: ['64ef8b4cc46bf3948cc92cc8', '65b18c371f6958cd48f7ddfc'],
        completedBy: [],
        layer_related_id: '6554cd04a968cc787a0f502c',
        repository_related_id: '65e3af011582d400c3862f3d',
        status: 'completed',
        conclusion_date: '2021-10-15',
        additional_info: {
          estimated_hours: 15,
          actual_hours: 18,
          notes: [
            'Review current processing bottlenecks',
            'Design a more streamlined workflow',
            'Automate order validation and fulfillment steps'
          ],
          priority: 'High'
        }
      },
      {
        type: 'T',
        task_id: '24892394014',
        layer_number_task: '304',
        task_name: 'customer-feedback-system',
        task_description: 'Create a system to gather and analyze customer feedback.',
        commits_hashes: ['95fb8c8dc64be21fcc92dd7', '96fb7a8ec75cf32bdd93ee5'],
        collaboratorsIds: ['64ef8b4cc46bf3948cc92cc8', '65b18c371f6958cd48f7ddfc'],
        completedBy: [],
        layer_related_id: '654bf5051ac302282df36efb',
        repository_related_id: '65e3af7961b804d71c09ad92',
        status: 'completed',
        additional_info: {
          estimated_hours: 25,
          actual_hours: 20,
          notes: [
            'Integrate feedback form into main app interface',
            'Develop analytics dashboard for feedback trends',
            'Implement sentiment analysis on feedback texts'
          ],
          priority: 'Medium'
        }
      }
      
  ])
  const [wFApprovalTasks, setWFApprovalTasks] = useState([
    {
      type: 'T',
      task_id: '7832490235701',
      layer_number_task: '299',
      task_name: 'dynamic-charts',
      task_description: 'Design the dynamic charts for the dashboard.',
      commits_hashes: ['65ae9b0ed023d97c7eec12c1'],
      collaboratorsIds: ['64fb7b7df63cb10dbb6c3af3'],
      completedBy: [],
      layer_related_id: '65c8e274f3a8bceb10923a2b',
      repository_related_id: '65e3b133487bd409607b0098',
      status: 'waiting-approval',
      additional_info: {
        estimated_hours: 20,
        actual_hours: 22,
        notes: ['Ensure compliance with financial regulations', 'Implement fraud detection mechanisms'],
        priority: 'High'
      }
    },
    {
      type: 'T',
      task_id: '7832490235702',
      layer_number_task: '300',
      task_name: 'user-authentication',
      task_description: 'Implement user authentication and authorization.',
      commits_hashes: ['65ae9b0ed023d97c7eec12c1'],
      collaboratorsIds: ['653fbc5a9d7eb4eccc744315'],
      completedBy: [],
      layer_related_id: '6554cbf0a968cc787a0f4fd0',
      repository_related_id: '65e3af011582d400c3862f3d',
      status: 'waiting-approval',
      additional_info: {
        estimated_hours: 20,
        actual_hours: 22,
        notes: ['Ensure compliance with financial regulations', 'Implement fraud detection mechanisms'],
        priority: 'High'
      }
    }
  ])


  const renderActivityType = () => {
      switch (render) {
        case 'tasks':
          return <RenderTasks tasksCompletedData={tasksCompleted} wFApprovalTasksData={wFApprovalTasks} setRender={setRender} render={render} />
        case 'commits':
          return <RenderCommits commitsData={commits} setRender={setRender} render={render} />
        default:
          return <RenderTasks tasksCompletedData={tasksCompleted} wFApprovalTasksData={wFApprovalTasks} setRender={setRender} render={render} /> 
      }
  };

  return (
    <div className='flex flex-col  w-full h-full'>
        <div className='flex pl-7 pr-5 justify-between space-x-3'>
              <h3 className='text-3xl  font-bold'>Activity</h3>              
        </div>       
        { renderActivityType() }
    </div>
  )
};
