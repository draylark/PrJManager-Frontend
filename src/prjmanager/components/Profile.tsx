import './styles/profile.css'
import idk  from './img/idk.jpg'
import More from '@ricons/material/ExpandMoreRound'
import { Icon } from '@ricons/utils';
import { Modalprofile } from './modals/Modalprofile';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
const popModal = document.querySelector('#popover-company-profile')


export const Profile = () => {

  const { photoURL } = useSelector( (selector: RootState) => selector.auth)
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  const handleMouseEnter = () => {
      setIsPopoverVisible(true);
    };
  

    return (
        <>
      
          <img
            src={ photoURL ? photoURL : idk }
            alt="Foto de perfil"
            id="profile-img"
            className='glass w-12 h-12 rounded-full'
          />


          <button 
                    className='h-8 transition-transform duration-300 ease-in-out transform hover:translate-y-[-2px]'
                    data-popover-target={ popModal } 
                    onClick={handleMouseEnter}
          >
              <Icon size={24}>
                  <More/>
              </Icon>
          </button>

          { isPopoverVisible && ( <Modalprofile setIsOpen={ setIsPopoverVisible }/> )}
             
              

        </>
    );
}
