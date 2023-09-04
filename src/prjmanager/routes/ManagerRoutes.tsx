import { Routes, Route } from 'react-router-dom'
import { Home } from '../components/home/Home'
import PrJManager from '../views/PrJManager'
import { Projects, Teams, Tasks, Dashboard } from '../components'


const ManagerRoutes = () => {

  return (

    <PrJManager>
            <Routes>
              <Route path='home' element={ <Home/> }/>
              <Route path='dashboard' element={ <Dashboard/> }/>
              <Route path='projects' element={ <Projects/> }/>
              <Route path='teams' element={ <Teams/> }/>
              <Route path='tasks' element={ <Tasks/> }/>
           </Routes>
    </PrJManager>



  )

}


export default ManagerRoutes
