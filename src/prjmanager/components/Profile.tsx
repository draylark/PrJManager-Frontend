import './styles/profile.css'
import idk  from './img/idk.jpg'
import More from '@ricons/material/ExpandMoreRound'
import Noti from '@ricons/material/NotificationsNoneOutlined'
import Chat from '@ricons/tabler/Messages'
import { ModalNotis } from './home/modals/ModalNotis'
import { Icon } from '@ricons/utils';
import { Modalprofile } from './home/modals/Modalprofile';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
const popModal = document.querySelector('#popover-company-profile')


export const Profile = () => {

  const { photoURL } = useSelector( (selector: RootState) => selector.auth)
  const [isPopoverPrVisible, setIsPopoverPrVisible] = useState(false);
  const [isPopoverNotiVisible, setIsPopoverNotiVisible] = useState(false);

  const handleMouseEnter = () => {
    setIsPopoverPrVisible(true);
    };

  const handleMouseClick = () => {
    setIsPopoverNotiVisible(true);
    };
  

    return (
        <div className='absolute z-10 h-16 right-0 mt-5 flex justify-end mr-10'>
      
            <button 
                className='flex items-center justify-center glass mr-5 w-8 h-8 rounded-full transition-transform duration-150 ease-in-out transform active:translate-y-[2px]'
                onClick={ handleMouseClick }>
                <Icon size={18}>
                <Chat/>
                </Icon>
            </button>

            { isPopoverNotiVisible && (<ModalNotis setIsOpen={ setIsPopoverNotiVisible }/>) }

            <button 
                className='flex items-center justify-center glass mr-5 w-8 h-8 rounded-full transition-transform duration-150 ease-in-out transform active:translate-y-[2px]'
                onClick={ handleMouseClick }
            >   
                <Icon size={18}>
                <Noti/>
                </Icon>
                
            </button>

          <img
            src={ photoURL ? photoURL : idk }
            alt="Foto de perfil"
            id="profile-img"
            className='glass w-12 h-12 rounded-full'
          />


          <button 
            className='h-8 transition-transform duration-300 ease-in-out transform hover:translate-y-[-2px] mr-5'
            data-popover-target={ popModal } 
            onClick={handleMouseEnter}
          >
              <Icon size={24}>
                  <More/>
              </Icon>
          </button>

          { isPopoverPrVisible && ( <Modalprofile setIsOpen={ setIsPopoverPrVisible }/> )}
             
              

        </div>
    );
}
