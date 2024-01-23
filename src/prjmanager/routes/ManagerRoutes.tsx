import { Routes, Route } from 'react-router-dom'
import { Home } from '../components/home/Home'
import PrJManager from '../views/PrJManager'
import { Projects, Teams, Tasks, Dashboard, Project, Layers, Layer, Repository, Comments, ProjectConfig, Searcher } from '../components'


const ManagerRoutes = () => {

  return (

    <PrJManager>
            <Routes>
              <Route path='home' element={ <Home/> }/>
              <Route path='dashboard' element={ <Dashboard/> }/>

              <Route path='projects' element={ <Projects/> }>
                
                  <Route path=':projectName' element={ <Project/> }>
                      <Route path='layers' element={ <Layers/> }>
                          <Route path=':layerName' element={ <Layer/> }>                            
                                <Route path=':repoName' element={ <Repository/> }/>                                             
                          </Route>
                      </Route>

                      <Route path='comments' element={ <Comments/> }/>
                      <Route path='configurations' element={ <ProjectConfig/> }/>
                  </Route>
              </Route>
              
              <Route path='teams' element={ <Teams/> }/>
              <Route path='tasks' element={ <Tasks/> }/>
              <Route path='searcher' element={ <Searcher/> }/>
           </Routes>
    </PrJManager>



  )

}


export default ManagerRoutes
