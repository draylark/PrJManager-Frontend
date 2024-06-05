import { useState, useEffect } from "react";
import { useSelector } from "react-redux"
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";

interface TreeNode {
  name: string;
  type: "user" | "project" | "task" | "commit";
  id?: string;
  children?: TreeNode[];
}

// Hook para obtener datos y transformarlos para un treechart de D3
export const useTreeChartData = () => {

  const { uid, username } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<TreeNode | null>(null); 

  const [errorMessage, setErrorMessage] = useState(null);  
  const [errorWhileFetching, setErrorWhileFetching] = useState(false);

  const [noData, setNoData] = useState(false)
  const [noDataMessage, setnoDataMessage] = useState("You haven't set any project as 'Top Project', highlight one in the 'Top Projects' panel to track it.")



  const removeDuplicates = (arr, key) => {
    const uniqueItems = {};
    arr.forEach((item) => {
      if (!uniqueItems[item[key]]) {
        uniqueItems[item[key]] = item;
      }
    });
    return Object.values(uniqueItems);
  };

  const transformTaskLevel = (task) => {  
    return {
      name: `task-${task.task_name}`,
      type: 'task',
      id: task._id,
      description: task.task_description,
      deadline: task.deadline,
      assigned_to: task.assigned_to,
      status: task.status,
      priority: task.priority,
      additional_info: task.additional_info,
      contributorsIds: task.contributorsIds
    };
  };

  const transformRepoLevel = (tasks, layerId) => {
    const repos = {};

    const layerRepos = tasks.filter( (task) => task.repository_related_id.layerID === layerId)

    layerRepos.forEach((task) => {
      const repoId = task.repository_related_id._id;
      if (!repos[repoId]) {
        repos[repoId] = {
          name: `repo-${task.repository_related_id.name}`,
          type: 'repo',
          children: [],
          id: repoId,
          description: task.repository_related_id.description
        };
      }

      const taskNode = transformTaskLevel(task, repoId);
      repos[repoId].children.push(taskNode);
    });

    return removeDuplicates(Object.values(repos), 'id'); // Asegúrate de que cada repositorio sea único
  };

  const transformLayerLevel = (tasks, projectId) => {
    const layers = {};

    const projectLayers = tasks.filter(
      (task) => task.layer_related_id.project === projectId
    );

    projectLayers.forEach((task) => {
      const layerId = task.layer_related_id._id;
      if (!layers[layerId]) {
        layers[layerId] = {
          name: `layer-${task.layer_related_id.name}`,
          type: 'layer',
          children: [],
          id: layerId,
          description: task.layer_related_id.description,
          updatedAt: task.layer_related_id.updatedAt,
        };
      }

      const repoNodes = transformRepoLevel(tasks, layerId);
      layers[layerId].children = repoNodes; // Agrega repositorios únicos a las capas
    });

    return removeDuplicates(Object.values(layers), 'id'); // Elimina duplicados de capas
  };

  const transformProjects = (tasks) => {
    const projects = {};

    tasks.forEach((task) => {
      const projectId = task.project._id;
      if (!projects[projectId]) {
        projects[projectId] = {
          name: `project-${task.project.name}`,
          type: 'project',
          children: [],
          id: projectId,
          description: task.project.description,
          startDate: task.project.startDate,
          endDate: task.project.endDate,
          tags: task.project.tags,
        };
      }

      const layerNodes = transformLayerLevel(tasks, projectId);
      projects[projectId].children = layerNodes; // Agrega capas únicas a los proyectos
    });

    return removeDuplicates(Object.values(projects), 'id'); // Elimina duplicados de proyectos
  };

  const transformData = (tasks) => {
    const rootNode = {
      name: username || 'user',
      id: uid,
      type: 'user',
      children: [],
    };

    const projectNodes = transformProjects(tasks);
    rootNode.children = projectNodes;

    return rootNode;
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/tasks/top-projects-tasks/${uid}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('x-token'),
          },
        }
      );

      const tasks = response.data.tasks;
      const transformedData = transformData(tasks);
      setData(transformedData); // Establece el estado con la estructura jerárquica sin duplicados
      setIsLoading(false); // Indica que la carga ha terminado

    } catch (error) {
      setIsLoading(false);
      if(error.response.data.type === 'no-top-projects') {
        setNoData(true)
        setnoDataMessage(error.response.data.message)
        return
      } else {
        setErrorMessage(error.response.data.message || 'An error occurred while fetching data');
        setErrorWhileFetching(true);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Ejecutar fetchData al montar el hook
  }, []);


  // console.log(data)

  return {
    data,
    isLoading,
    errorMessage,
    errorWhileFetching,
    noData,
    noDataMessage
  };
};