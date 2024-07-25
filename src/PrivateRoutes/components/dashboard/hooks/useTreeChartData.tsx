import { useState, useEffect } from "react";
import { useSelector } from "react-redux"
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios,  { AxiosError } from "axios";
import { RootState } from "../../../../store/store";
import { TaskBase, ProjectBase, LayerBase, RepositoryBase, PopulatedContributorsIds } from "../../../../interfaces/models";

interface ApiResponse {
  message: string;
  type: string;
}
export interface TreeNode {
  name: string;
  type: "user" | "project" | "task" | "layer" | "repo" | 'commit';
  id: string;
  children: TreeNode[];

  //! layer props
  description?: string;
  updatedAt?: string;

  //! project props
  startDate?: string;
  endDate?: string;
  tags?: string[];

  //! task props
  deadline?: string;
  assigned_to?: string | null;
  status?: string;
  priority?: string;
  additional_info?: {
    estimated_hours: number;
    actual_hours: number;
    notes: (string | null)[];
  };
  contributorsIds?: PopulatedContributorsIds[];
}
interface PLRPopulatedTask extends Omit<TaskBase, 'project' | 'layer_related_id' | 'repository_related_id' | 'contributorsIds'> {
  project: Omit<ProjectBase, 'pid'> & { _id: string};
  layer_related_id: LayerBase;
  repository_related_id: RepositoryBase;
  contributorsIds: PopulatedContributorsIds[];
}

export const useTreeChartData = () => {

  const { uid, username } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<TreeNode | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);  
  const [errorWhileFetching, setErrorWhileFetching] = useState(false);
  const [noData, setNoData] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState("You haven't set any project as 'Top Project', highlight one in the 'Top Projects' panel to track it.");

  const removeDuplicates = <T extends { id: string }>(arr: T[]): T[] => {
    const uniqueItems: { [id: string]: T } = {};
    arr.forEach((item) => {
      if (!uniqueItems[item.id]) {
        uniqueItems[item.id] = item;
      }
    });
    return Object.values(uniqueItems);
  };

  const transformTaskLevel = (task: PLRPopulatedTask): TreeNode => {  
    return {
      name: `task-${task.task_name}`,
      type: 'task',
      id: task._id,
      children: [], // Optional children for consistency in the interface
      description: task.task_description,
      deadline: task.deadline as string,
      assigned_to: task.assigned_to ,
      status: task.status,
      priority: task.priority,
      additional_info: task.additional_info,
      contributorsIds: task.contributorsIds
    };
  };

  const transformRepoLevel = (tasks: PLRPopulatedTask[], layerId: string): TreeNode[] => {
    const repos: { [id: string]: TreeNode } = {};

    tasks.filter((task) => task.repository_related_id.layerID === layerId).forEach((task) => {
      const repoId = task.repository_related_id._id as string;
      if (!repos[repoId]) {
        repos[repoId] = {
          name: `repo-${task.repository_related_id.name}`,
          type: 'repo',
          children: [],
          id: repoId,
          description: task.repository_related_id.description
        };
      }
      repos[repoId].children.push(transformTaskLevel(task));
    });

    return removeDuplicates(Object.values(repos)); // Ensure each repository is unique
  };

  const transformLayerLevel = (tasks: PLRPopulatedTask[], projectId: string): TreeNode[] => {
    const layers: { [id: string]: TreeNode } = {};

    tasks.filter((task) => task.layer_related_id.project === projectId).forEach((task) => {
      const layerId = task.layer_related_id._id;
      if (!layers[layerId]) {
        layers[layerId] = {
          name: `layer-${task.layer_related_id.name}`,
          type: 'layer',
          children: [],
          id: layerId,
          description: task.layer_related_id.description,
          updatedAt: task.layer_related_id.updatedAt as string,
        };
      }
      layers[layerId].children = transformRepoLevel(tasks, layerId); // Add unique repositories to layers
    });

    return removeDuplicates(Object.values(layers)); // Remove duplicates from layers
  };

  const transformProjects = (tasks: PLRPopulatedTask[]): TreeNode[] => {
    const projects: { [id: string]: TreeNode } = {};

    tasks.forEach((task) => {
      const projectId = task.project._id;
      if (!projects[projectId]) {
        projects[projectId] = {
          name: `project-${task.project.name}`,
          type: 'project',
          children: [],
          id: projectId,
          description: task.project.description,
          startDate: task.project.startDate as string,
          endDate: task.project.endDate as string,
          tags: task.project.tags,
        };
      }
      projects[projectId].children = transformLayerLevel(tasks, projectId); // Add unique layers to projects
    });

    return removeDuplicates(Object.values(projects)); // Remove duplicates from projects
  };

  const transformData = (tasks: PLRPopulatedTask[]): TreeNode => {
    const rootNode: TreeNode = {
      name: username || 'user',
      id: uid as string,
      type: 'user',
      children: transformProjects(tasks),
    };

    return rootNode;
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/tasks/top-projects-tasks/${uid}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('x-token'),
        },
      });

      const tasks: PLRPopulatedTask[] = response.data.tasks;
      const transformedData = transformData(tasks);
      setData(transformedData); // Set state with the hierarchical structure without duplicates
      setIsLoading(false); // Indicate that loading has ended

    } catch (error) {
      setIsLoading(false);
        // console.error('Error fetching heatmap data:', error);
        const axiosError = error as AxiosError<ApiResponse>
        if (axiosError.response) {
          if (axiosError.response.data.type === 'no-top-projects') {
            setNoData(true);
            setNoDataMessage(axiosError.response.data.message);
            return;
          } else {
            setErrorMessage(axiosError.response.data.message || 'An error occurred while fetching data');
            setErrorWhileFetching(true);
          }
        } else {
          setErrorMessage('An error occurred while fetching data');
          setErrorWhileFetching(true);
        }
    }
  };

  useEffect(() => {
    fetchData(); // Execute fetchData on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    isLoading,
    errorMessage,
    errorWhileFetching,
    noData,
    noDataMessage
  };
};

