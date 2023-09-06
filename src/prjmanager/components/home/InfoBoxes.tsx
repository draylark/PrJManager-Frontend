import Pencil from '@ricons/fluent/EditArrowBack20Filled'
import { Icon } from '@ricons/utils'
import 'animate.css'

export const InfoBoxes = () => {
  return (

        <div className="flex space-y-4 sm:space-x-4 flex-wrap lg:flex-nowrap w-full justify-center">
          
            <div className="info-box-shadow mt-4 info-box bg-[#ffffff26] text-white rounded-extra p-5 h-20 sm:w-60 w-[90%] flex justify-center flex-col ">
            
                <div className='flex space-x-2'>
                    <h2 className="text-xl text-sky-950 w-3/2 h-10">Projects</h2>
                        <button className='mb-2 transition-transform duration-300 ease-in-out transform hover:translate-y-[-2px]'>
                            <Icon color='black' size={14}>
                                <Pencil/>
                            </Icon>
                        </button>
                </div>

                <p className="text-2xl text-sky-950">12</p>
            </div>   

            <div className="info-box-shadow info-box  bg-[#0455b19a] text-white rounded-extra p-5 h-20 sm:w-60 w-[90%] flex justify-center flex-col">
                <div className='flex space-x-2'>
                    <h2 className="text-xl text-white w-3/2 h-10">Tasks</h2>
                        <button className='mb-2 transition-transform duration-300 ease-in-out transform hover:translate-y-[-2px]'>
                            <Icon color='white' size={14}>
                                <Pencil/>
                            </Icon>
                        </button>
                    </div>
                    <p className="text-2xl">8</p>
            </div>



            <div className="info-box-shadow  info-box bg-[#491ab526] text-white rounded-extra p-5 h-20 sm:w-60 w-[90%] flex justify-center flex-col">
                <div className='flex space-x-2'>
                    <h2 className="text-xl text-black w-3/2 h-10">Clients</h2>
                        <button className='mb-2 transition-transform duration-300 ease-in-out transform hover:translate-y-[-2px]'>
                            <Icon color='black' size={14}>
                                <Pencil/>
                            </Icon>
                        </button>
                    </div>
                    <p className="text-2xl text-black">20</p>
            </div>

         </div>

    )
}

