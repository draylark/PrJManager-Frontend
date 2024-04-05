import './styles/styles.css'
import './styles/rightPanel.css'
import { ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
}

const Panel = ({ children } : PanelProps ) => {
  return (

    <div id='panel' className="flex flex-grow main-panel w-[95%] min-h-[840px] xl:w-4/5 lg:flex-nowrap">  
        { children }
    </div>
  );
}

export default Panel;
