import React, { useState, ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@ricons/utils'


interface NavButtonProps {
    icon: ComponentType;
    label: string;
    link: string;
}


export const NavButton: React.FC<NavButtonProps> = ({ icon: IconComponent, label, link }) => {

    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
  
    return (
      <Link to={link}>
        <button
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="minimal-button hover:rounded-2xl flex items-center mb-4 mt-2 px-8 w-[200px] hover:bg-blue-200 border-b border-b-gray-300"

        >
          
          <div className='mr-3'>
            <Icon color={isHovered ? '#FFFFFF' : '#0c4a6e'} size='35'>
              <IconComponent />
            </Icon>
          </div>
          {label}
        </button>
      </Link>

    );
  };