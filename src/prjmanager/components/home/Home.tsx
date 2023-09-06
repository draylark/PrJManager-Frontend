import { InfoBoxes } from "./InfoBoxes"
import { InfoCharts } from "./InfoCharts"
import { RightPanel } from './RightPanel';
import { Profile } from "../Profile";
import 'animate.css'

export const Home = () => {
  return (

    

    <div className="relative flex flex-wrap  xl:flex-nowrap xl:space-x-6 w-full h-full rounded-extra">
      
      <h1 className="text-3xl font-bold text-sky-950 ml-5 mt-5  sn:hidden ">Home</h1>
     
       <Profile/>

        <div className='charts flex flex-col space-y-10  w-full h-full'> 
            <h1 className="text-4xl font-bold text-sky-950 ml-3 mt-10 hidden sn:block ">Home</h1>
            <InfoBoxes/>
            <InfoCharts/>
        </div>

        <RightPanel/>

    </div>

  )
}

