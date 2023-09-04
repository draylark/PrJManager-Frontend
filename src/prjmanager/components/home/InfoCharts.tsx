import { AreaBumpChart } from "../charts/AreaBumpChart"
import { TasksNetwork } from "../charts/TasksNetwork"
import { Calendar } from "../charts/Calendar"

export const InfoCharts = () => {
  return ( 
        <> 
            <div className='flex space-x-12'>
                <AreaBumpChart/>
                <TasksNetwork/>
            </div>
                

            <div className=' glass rounded-extra h-[200px] w-[750px] ml-10 '>
                <Calendar/>
            </div>
        
        </>
  )
}
