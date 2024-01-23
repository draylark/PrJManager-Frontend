import { useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux"
import { RootState } from "../../store/store";
import { ProjectType, TaskType } from "../../store/types/stateTypes";


interface TreeNode {
  name: string;
  type: "user" | "project" | "task" | "commit";
  id?: string;
  children?: TreeNode[];
}

export const useTreeChartData = (): TreeNode => {

  const { projects } = useSelector((selector: RootState) => selector.projects, shallowEqual);
  const { tasks } = useSelector((selector: RootState) => selector.task, shallowEqual);


  const transformedData = useMemo(() => {

    const addTaskChildren = (task: TaskType, allTasks: TaskType[]): TreeNode => {
      const taskNode: TreeNode = { name: `task-${task.name}`, type: "task", id: task.tid };
      const childTasks = allTasks.filter(t => t.parentId === task.tid);
      if (childTasks.length > 0) {
        taskNode.children = childTasks.map(childTask => addTaskChildren(childTask, allTasks));
      }
      return taskNode;

    };


    const transformData = (projects: ProjectType[], tasks: TaskType[]): TreeNode => {
      
      const rootNode: TreeNode = { name: "user", type: "user", children: [] };

      projects.forEach(project => {
        const projectNode: TreeNode = { name: `project-${project.name}`, type: "project", children: [], id: project.pid };
        const projectTasks = tasks.filter(task => task.projectId === project.pid && !task.parentId);

        projectTasks.forEach(task => {
          const taskNode = addTaskChildren(task, tasks);
          projectNode.children!.push(taskNode);
        });

        rootNode.children!.push(projectNode);
      });

      return rootNode;
    };

    return transformData(projects, tasks);
  }, [projects, tasks]);

  return transformedData;
};
