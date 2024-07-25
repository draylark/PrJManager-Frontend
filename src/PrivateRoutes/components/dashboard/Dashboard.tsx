import { useState, useEffect } from 'react'
import { Bar } from './Bar'
import { General } from './general/General'
import { useLocation, Outlet } from 'react-router-dom';


export const Dashboard = () => {

  const location = useLocation();
  const currentLocation = location.pathname.split('/').pop();  
  const [render, setRender] = useState(currentLocation || 'general')

  const renderComponent = () => {
    switch (render) {
      case 'general':
          return <General/>
        case 'workspace':
          return <Outlet/>
        case 'resources':
          return <Outlet/>
        default: return <General/>
    }
  }

  useEffect(() => {
    if(location?.state?.task && location?.state?.task?.new){
      setRender('workspace')
    } 
  }, [location.state, currentLocation])

  if( location?.state?.repository ) return <Outlet/>
  
  return (
    <div className="flex flex-grow flex-col space-y-2 items-center">  
        <Bar setRender={setRender} render={render}/>
        {renderComponent()}   
    </div>
  )
}
