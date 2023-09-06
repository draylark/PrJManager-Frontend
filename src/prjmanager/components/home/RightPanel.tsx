import { Radial } from '../charts/Radial'
import { Icon } from '@ricons/utils'
import Euro from '@ricons/tabler/CurrencyEuro'
import '../styles/rightPanel.css'
import 'animate.css'



export const RightPanel = () => {

  return (
    <div className='flex justify-center xl:justify-normal space-y-9 h-full w-full mb-5 rounded-extra '>

        <div className='Panel flex w-[93%] h-[80%] mt-5 xl:mt-[120px] rounded-extra'>
            <div className="h h-full w-full">

                    <div className='container w-full ml-auto mr-auto xl:ml-0 border-2'>
                        <p className='ml-12 mt-10 text-2xl w-[75%]'>
                            2345.00
                            <Icon  size={22}>
                                <Euro/>
                            </Icon>
                        </p>

                        <div className='ml-12 mt-10 text-2xl h-[30%] w-[75%] p-4'>
                            <div className='l w-full  mt-5 '>
                            <h4 className='text-xs'>Monthly</h4>
                            </div>
                            <div className='l w-full  mt-10'>
                            <h4 className='text-xs'>Weekly</h4>
                            </div>
                            <div className='l w-full  mt-10 '>
                            <h4 className='text-xs'>Today</h4>
                            </div>
                        </div>


                        <div className='ml-7 mt-10 h-[40%] w-[88%]'>
                                <Radial/>
                        </div>

                    </div>
            </div>
        </div>

</div>
  )
}
