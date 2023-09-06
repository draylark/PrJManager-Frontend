import './styles/styles.css'
import './styles/rightPanel.css'
import { ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
}

const Panel = ({ children } : PanelProps ) => {
  return (
    // <div className="relative bg-blue-100 backdrop-blur-md rounded-lg mt-10 mb-4 ml-auto mr-10 w-1/2 h-[calc(100vh-15px)]">
    <div className="flex main-panel rounded-extra mt-5 mb-5 lg:mt-10 ml-auto mr-auto xl:mr-10 xl:w-4/5 w-[95%] h-auto xl:h-[770px] lg:flex-nowrap  backdrop-blur-md">  
        { children }
    </div>
  );
}

export default Panel;
