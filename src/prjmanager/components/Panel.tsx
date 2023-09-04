import './styles/styles.css'
import './styles/rightPanel.css'
import { ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
}

const Panel = ({ children } : PanelProps ) => {
  return (
    // <div className="relative bg-blue-100 backdrop-blur-md rounded-lg mt-10 mb-4 ml-auto mr-10 w-1/2 h-[calc(100vh-15px)]">
    <div className="main-panel rounded-extra mt-10 ml-auto mr-10 w-4/5 h-9/10 backdrop-blur-md flex space-x-3">  
        { children }
    </div>
  );
}

export default Panel;
