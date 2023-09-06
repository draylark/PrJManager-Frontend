import { AreaBumpChart } from "../charts/AreaBumpChart"
import { TasksNetwork } from "../charts/TasksNetwork"
import { Calendar } from "../charts/Calendar"

export const InfoCharts = () => {
  return ( 
        <div className="flex flex-wrap w-full  justify-center"> 
            <div className='flex flex-wrap w-full justify-center  xl:space-x-12 space-y-5 xl:space-y-0'>
                <AreaBumpChart/>
                <TasksNetwork/>
            </div>
                

            <div className='glass rounded-extra h-[200px] w-[95%] xl:w-[750px] mt-5'>
                <Calendar/>
            </div>
        
        </div>
  )
}
