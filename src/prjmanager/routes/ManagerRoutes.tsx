import { Routes, Route } from 'react-router-dom'
import { Home } from '../components/home/Home'
import PrJManager from '../views/PrJManager'
import { Projects, Teams, Tasks, Dashboard, Project, Layer, Repository, Comments, Searcher, TreeChart, Activity, Commits, Commit } from '../components'
// import ExtAuth from '../../auth/components/ExtAuth'


const ManagerRoutes = () => {

  return (

    <PrJManager>
            <Routes>
              <Route path='home' element={ <Home/> }/>
              <Route path='dashboard' element={ <Dashboard/> }/>

              <Route path='projects' element={ <Projects/> }>                
                  <Route path=':projectName' element={ <Project/> }>  
                      <Route path=':layerName' element={ <Layer/> }>                            
                            <Route path=':repoName' element={ <Repository/> } >
                                <Route path=':commits' element={ <Commits/> } >
                                    <Route path=':commitHash' element={ <Commit/> } />
                                </Route>                           
                            </Route>                                            
                      </Route>
                      

                      <Route path='activity' element={ <Activity/> }/>
                      <Route path='tree' element={ <TreeChart/> }/>
                      <Route path='comments' element={ <Comments/> }/>
                      {/* <Route path='configurations' element={ <ProjectConfig/> }/> */}
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
