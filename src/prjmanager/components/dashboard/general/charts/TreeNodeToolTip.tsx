import { FC, useState, useEffect} from 'react';
import { useSelector, shallowEqual } from "react-redux"
import { RootState } from '../../../../../store/store';


interface TooltipProps {
  type?: "user" | "project" | "task" | "commit";
  id: string | undefined;
  position: {
    top: number;
    left: number;
  };
  visible: boolean;
}


interface ToolTipData {

    name: string;
    description: string;

    // task
    dueDate?: string;
    updatedAt?: string;

    // project
    clients?: string[];
    startDate?: string;
    endDate?: string;
    tags: string[];
    members: string[];

    // project & task
    status?: string;

}



export const TreeNodeToolTip: FC<TooltipProps> = ({ id, position, visible, type }) => {
    
    const [toolTipData, setToolTipData] = useState<ToolTipData>();
    const { projects } = useSelector((selector: RootState) => selector.projects, shallowEqual);
    // const { tasks } = useSelector((selector: RootState) => selector.task, shallowEqual);


    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString();  // Retorna, por ejemplo, "9/17/2023"
    }

    useEffect(() => {
        if (type === 'project') {
            const project = projects.filter(project => project.pid === id)
            // console.log(project)
            setToolTipData(project[0])
        }
        // if (type === 'user') {
        // setToolTipData('User')
        // }
        // if (type === 'task') {
        //     const task = tasks.filter(task => task.tid === id)
        //     // console.log(task)
        //     setToolTipData(task[0])
        // }
        // if (type === 'commit') {
        // setToolTipData('Commit')
        // }

        // console.log(toolTipData)
    }, [type, id, projects, toolTipData])


  if (!visible) return null;

  return (
    <div className={`absolute p-3 z-50 rounded-lg shadow-lg glass ${type === 'project' ? 'border-blue-500' : type === 'task' ? 'border-green-500' : 'border-gray-500'}`} style={{ top: position.top + 10, left: position.left + 10 }}>
      
        {type === 'project' && (
            <div>
                <div className="flex justify-between mb-2 text-gray-700 border-b pb-1">
                    <span className="font-semibold text-sm">Project</span>
                    <span className="text-xs">#{id}</span>
                </div>
                <div className="mb-1 font-semibold">{toolTipData?.name}</div>
                <div className="mb-2 text-gray-600 text-xs">{toolTipData?.description}</div>
                <div className="mb-1 text-xs">{formatDate(toolTipData?.startDate)} - {formatDate(toolTipData?.endDate)}</div>
                <div className="mb-1 text-xs font-medium">{toolTipData?.status}</div>
                <div className="mb-1 text-xs">{toolTipData?.clients?.join(', ')}</div>
                <div className="mb-1 text-xs">{toolTipData?.members?.join(', ')}</div>
                <div className="text-xs">{toolTipData?.tags?.join(', ')}</div>
            </div>
        )}

        {type === 'task' && (
            <div>
                <div className="flex justify-between mb-2 text-gray-700 border-b pb-1">
                    <span className="font-semibold text-sm">Task</span>
                    <span className="text-xs">#{id}</span>
                </div>
                <div className="mb-1 font-semibold">{toolTipData?.name}</div>
                <div className="mb-2 text-gray-600 text-xs">{toolTipData?.description}</div>
                <div className="mb-1 text-xs">Due Date: {formatDate(toolTipData?.dueDate)}</div>
                <div className="mb-1 text-xs">Updated: {formatDate(toolTipData?.updatedAt)}</div>
                <div className="mb-1 text-xs font-medium">{toolTipData?.status}</div>
                <div className="text-xs">Tags: {toolTipData?.tags?.join(', ')}</div>
            </div>
        )}


        {type === 'user' && (
            // ... estructura similar para User ...
            <div className="absolute"></div>
        )}
      
    </div>
  );
};


