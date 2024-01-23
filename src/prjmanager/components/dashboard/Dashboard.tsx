import { Bar } from './Bar'
import { General } from './general/General'

export const Dashboard = () => {
  return (
    <div className="flex flex-col w-full h-full rounded-extra">

        <Bar/>
      
        <General/>
    
    </div>
  )
}
