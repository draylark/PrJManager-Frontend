import { Radial } from '../charts/Radial'
import { Icon } from '@ricons/utils'
import Euro from '@ricons/tabler/CurrencyEuro'
import Noti from '@ricons/material/NotificationsNoneOutlined'
import Chat from '@ricons/tabler/Messages'
import { Profile } from '../Profile'
import { ModalNotis } from '../modals/ModalNotis'
import { useState } from 'react'
import '../styles/rightPanel.css'
import 'animate.css'

export const RightPanel = () => {


    const [isPopoverVisible, setIsPopoverVisible] = useState(false);

    const handleMouseEnter = () => {
        setIsPopoverVisible(true);
      };


  return (
    <div className='flex flex-col space-y-9 h-[100%] w-[100%] rounded-extra'>

        <div className='h-16 w-9/12  mt-5 ml-14  flex justify-end'>
            
            <button 
                className='flex items-center justify-center glass mr-5 w-8 h-8 rounded-full transition-transform duration-150 ease-in-out transform active:translate-y-[2px]'
                onClick={ handleMouseEnter }>
                <Icon size={18}>
                <Chat/>
                </Icon>
            </button>

            { isPopoverVisible && (<ModalNotis setIsOpen={ setIsPopoverVisible }/>) }

            <button 
                className='flex items-center justify-center glass mr-5 w-8 h-8 rounded-full transition-transform duration-150 ease-in-out transform active:translate-y-[2px]'
                onClick={ handleMouseEnter }
            >   
                <Icon size={18}>
                <Noti/>
                </Icon>
                
            </button>

            <Profile/>
        </div>

        <div className='Panel rounded-extra animate__bounceInDown'>
            <div className="h">
            <div className='container'>
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
