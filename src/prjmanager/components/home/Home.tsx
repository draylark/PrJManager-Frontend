import { InfoBoxes } from "./InfoBoxes"
import { InfoCharts } from "./InfoCharts"
import { RightPanel } from './RightPanel';
import 'animate.css'

export const Home = () => {
  return (
    <>
        <div className='flex flex-col space-y-10 animate__zoomIn'> 
            <h1 className="text-4xl font-bold text-sky-950 ml-10 mt-10">Home</h1>
            <InfoBoxes/>
            <InfoCharts/>
        </div>

        <RightPanel/>
    </>

  )
}

