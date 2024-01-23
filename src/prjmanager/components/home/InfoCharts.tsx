import { useSelector } from "react-redux";
import { AreaBumpChart } from "./charts/AreaBumpChart";
import { TasksNetwork } from "./charts/TasksNetwork";
import { Calendar } from "./charts/Calendar";
import { RootState } from "../../../store/store";
import { useState } from "react";
import { EventModal } from "./modals/EventModal";


export const InfoCharts = () => {
    
  const { current: currentProject } = useSelector((selector: RootState) => selector.projects);
  const { current: currentTask } = useSelector((selector: RootState) => selector.task);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)

//   console.log(currentProject)
//   console.log(currentTask)

  return (

            <div className="flex flex-wrap w-full justify-center">
                <div className="flex flex-wrap w-full justify-center xl:space-x-12 space-y-5 xl:space-y-0">
                    <AreaBumpChart projectIds={ currentProject.length > 0 ? currentProject : [] } />
                    <TasksNetwork projectId={ currentTask[0] ? currentTask[0] : "" } />
                </div>

                <Calendar setIsEventModalOpen={setIsEventModalOpen}/>   

                {  isEventModalOpen && <EventModal setIsEventModalOpen={setIsEventModalOpen}/>  } 
                <div id="tooltip-root" className="fixed glass top-32 z-10 rounded-extra"></div>
            </div>
        );
  };