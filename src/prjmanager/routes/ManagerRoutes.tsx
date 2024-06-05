import { Routes, Route } from 'react-router-dom'
import PrJManager from '../views/PrJManager'
import { Projects, Dashboard, Project, Layer, Repository, Comments, Searcher, TreeChart, Activity, Commits, Commit, Workspace, Resources, TaskSetDetails, PersonalArea, Profile } from '../components'

const ManagerRoutes = () => {

  return (
    <PrJManager>
        <Routes>

            <Route path='dashboard' element={ <Dashboard/> }>
                <Route path='workspace' element={ <Workspace/> }>
                    <Route path=':taskName' element={ <TaskSetDetails/> } />
                </Route>

                <Route path='resources' element={ <Resources/> }>
                
                </Route>
            </Route>

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
                </Route>             
            </Route>

            <Route path='personal-area/:username' element={ <PersonalArea/> }/>    
            <Route path='profile/:username' element={ <Profile/> }/>
            <Route path='searcher' element={ <Searcher/> }/>
        </Routes>
    </PrJManager>
  )
}


export default ManagerRoutes
