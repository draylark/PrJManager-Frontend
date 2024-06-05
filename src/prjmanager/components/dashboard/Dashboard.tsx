import { useState, useEffect } from 'react'
import { Bar } from './Bar'
import { General } from './general/General'
import { useLocation, Outlet, useNavigate } from 'react-router-dom';


export const Dashboard = () => {

  const location = useLocation();
  const [render, setRender] = useState('')
  const currentLocation = location.pathname.split('/').pop();


  const renderComponent = (currentLocation) => {
    switch (render) {
    case 'general':
        return <General/>
      case 'workspace':
        return <Outlet/>
      case 'resources':
        return <Outlet/>
      default:          
        if( currentLocation === 'workspace' ) return setRender('workspace')
        else if( currentLocation === 'resources' ) return setRender('resources')
        else return <General/>
    }
  }

  useEffect(() => {
    if(location?.state?.task && location?.state?.task?.new){
      setRender('workspace')
    }
  }, [location.state])

  if( location?.state?.repository ) return <Outlet/>
  
  return (
    <div className="flex flex-grow flex-col space-y-2 items-center">
        <Bar setRender={setRender} render={render}/>
      
        {renderComponent(currentLocation)}   
    </div>
  )
}
