import React, { useState, ComponentType } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@ricons/utils'
import './styles/fonts.css'

interface NavButtonProps {
    icon: ComponentType;
    label: string;
    link: string;
    className?: string;
}


export const NavButton: React.FC<NavButtonProps> = ({ icon: IconComponent, label, link, className }) => {

    const location = useLocation();
    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    
    // console.log(location)
  
    return (
      <Link to={link}>
        <button
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`${className} text-white hover:text-[#0c4a6e] nav-button minimal-button hover:rounded-2xl flex items-center mb-4 mt-2 px-8 w-full  hover:bg-white`}
        >
          <div className='mr-3'>
            <Icon color={isHovered ? '#0c4a6e' : '#FFFFFF'} size='35'>
              <IconComponent />
            </Icon>
          </div>
          {label}
        </button>
      </Link>

    );
  };