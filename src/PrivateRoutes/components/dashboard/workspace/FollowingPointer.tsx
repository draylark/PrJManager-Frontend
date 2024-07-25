import figures from '../../../assets/imgs/formbg.jpg'
import { cleanUrl } from "../../projects/helpers/helpers";
import { GiLaurelsTrophy } from "react-icons/gi";
import { Tooltip } from "@mui/material";
import { NavigateOptions } from 'react-router-dom';

interface TaskSet {
    _id: string;
    task_name: string;
    task_description: string;
    type: string;
    status: string;
    priority: string;
    deadline: string;
    goals: string[];
    repository_number_task: string;
    assigned_to: string;
}

interface TaskSetProps {
    navigate: (to: string, state: NavigateOptions) => void;
    taskSet: TaskSet;
    uid: string;
}

export function TaskSet({ navigate, taskSet, uid }: TaskSetProps) {

  const formatDate = (date: string) => {
    const formattedDate = new Date(date).toLocaleDateString();
    return formattedDate;
};

  return (
    <div className="min-w-80 max-w-80 h-full">
        <div 
          className="relative h-full rounded-b-2xl transition duration-200 group bg-white hover:shadow-x border-[1px] border-gray-400"
          style={{
            background: `url(${figures})`,
            backgroundSize: 'cover',
            backgroundPosition: 'bottom center',
            backgroundRepeat: 'no-repeat'
          }}  
        >
          <div className="p-4">
          <div className="flex justify-between">
            <h2 className="font-bold text-[12px] text-zinc-700">
              #{taskSet.repository_number_task || 0}
            </h2>
            {
              taskSet.type === 'assigned' && taskSet.assigned_to === uid ? (
                <Tooltip 
                  title="Assigned to you" 
                  placement="bottom"
                  arrow={true} 
                  enterTouchDelay={50} 
                  leaveTouchDelay={400} 
                  leaveDelay={200} 
                  enterDelay={100}
                  >
                    <span>
                      <GiLaurelsTrophy className="text-2xl text-black" />
                    </span>                  
                </Tooltip>
              ) : null
            }
          </div>


            <h2 className="font-bold mb-2 text-lg text-zinc-700 truncate w-[285px]">
              {taskSet.task_name}
            </h2>

          
            <div className="flex flex-row space-x-2">
                <div className={`${ taskSet.type === 'open' ? 'bg-pink-300 text-black' : 'bg-black text-white'} max-h-6 flex flex-row space-x-2 items-center border-[1px] border-gray-400 px-3 py-1 rounded-2xl`}>
                    <p className={"text-[11px]"}>{taskSet.type}</p>
                </div>
                <div className={`${ 
                  taskSet.status === 'pending'
                  ? 'bg-red-400'
                  : taskSet.status === 'approval'
                  ? 'bg-yellow-600'
                  : taskSet.status === 'completed'
                  ? 'bg-blue-500 text-white'
                  : ''
                  } max-h-6  flex flex-row space-x-2 items-center border-[1px] border-gray-400 px-3 py-1 rounded-2xl`}>
                    <p className={"text-[11px]"}>{taskSet.status}</p>
                </div>
                <div className={`${ 
                  taskSet.priority === 'Critical'
                  ? 'bg-red-400'
                  : taskSet.priority === 'High'
                  ? 'bg-orange-400'
                  : taskSet.priority === 'Medium'
                  ? 'bg-yellow-400'
                  : 'bg-green-400 '
                  } max-h-6  flex flex-row space-x-2 items-center border-[1px] border-gray-400 px-3 py-1 rounded-2xl`}>
                    <p className="text-[11px]">{taskSet.priority}</p>
                </div>
                <div className="max-h-6  bg-white flex flex-row space-x-2 items-center border-[1px] border-gray-400 px-3 py-1 rounded-2xl">
                    <p className="text-[11px] text-black">G: {taskSet.goals.length}</p>
                </div>
            </div>
            
            <p className="font-normal my-4 text-sm text-black glassi p-2">
              {taskSet.task_description}
            </p>

            <div className="absolute left-0 bottom-5 w-full flex flex-row justify-between items-center px-4">
              <span className="text-sm text-black">{formatDate(taskSet.deadline)}</span>
              <button 
                onClick={() => navigate(`${cleanUrl(taskSet.task_name)}`, {
                    state: { task: { taskId: taskSet._id } }                   
                })}
                className="relative z-10 px-6 py-2 bg-black text-white font-bold rounded-xl block text-xs transition-all duration-150 ease-in-out transform hover:translate-y-[-2px] active:translate-y-[2px]">
                Full Details
              </button>
            </div>
          </div>

        </div>
    </div>
  );
}



