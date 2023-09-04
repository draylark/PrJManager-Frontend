import './styles/logout.css'
import Dashboard  from '@ricons/carbon/DashboardReference'
import Door  from '@ricons/carbon/Logout'
import Folder from '@ricons/fluent/FolderOpen24Filled'
import Team from '@ricons/fluent/PeopleTeam24Filled'
import Home from '@ricons/fluent/HomePerson24Regular'
import Tasks from '@ricons/fa/Tasks'
import { NavButton } from './NavButtons'
import { Icon } from '@ricons/utils'


export const Nav = () => {

    const HandleClick = () => {
        localStorage.clear();
        window.location.reload();
    }

  return (

 
        <div className="absolute top-10 left-0 h-9/10 w-[calc(100%-83%)] bg-transparent z-0 flex flex-col items-center">

            <div>
                <h1 className='text-sky-950 text-3xl'>PrJManager</h1>
            </div>
       

            <div className='flex flex-col space-y-36'>
                <div className='mt-24'>
                    <NavButton icon={ Home } label='home' link='home'/>
                    <NavButton icon={ Dashboard } label='Dashboard' link='dashboard'/>
                    <NavButton icon={ Folder } label='projects' link='projects'/>
                    <NavButton icon={ Team } label='teams' link='teams'/>
                    <NavButton icon={ Tasks } label='tasks' link='tasks'/>        
                </div>

                <div className='btne  mr-8'>
                    <div className="btn">
                        <Icon size={18}>
                            <button className='b' onClick={ HandleClick }>
                                <Door/> <p className='ml-2'>Logout</p>
                            </button>
                        </Icon>    
                    </div>
                </div>
            </div>

         </div>
 
  )
}
