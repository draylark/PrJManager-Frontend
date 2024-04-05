import { useSelector } from "react-redux"
import { useState } from "react"
import { RootState } from "../../../store/store"
import { Profile } from "../Profile"
import { TextField } from "@mui/material"
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
// import { ProjectModal } from "./forms/GroupForm";

export const Projects = () => {


  const navigate = useNavigate()
  const location = useLocation();
  const projectID = location.state?.project.ID;

  const [ IsProjectModalOpen, setIsProjectModalOpen ] = useState(false)
  const { projects } = useSelector((state: RootState) => state.projects)
  const { gitlabAuth } = useSelector((state: RootState) => state.auth)


  const cleanUrl = (name: string) => {
    return name.replace(/\./g, '').replace(/\s+/g, '-');
  }

  const handleGitLabAuth = () => {
    const clientId = 'e4e88c56cb2a2dac4031bca3db97e05a63b2dcfa73271bd2666443340712af4c'
    const redirectUri = 'http://localhost:3000/api/gitlab/auth'
    const scope = 'api' 
  
    const gitlabAuthUrl = `https://gitlab.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;
    window.location.href = gitlabAuthUrl;
  };


  return (

    <div id="projectsMainDiv" className="flex flex-col w-full h-full ">


      
        <div id="projects" className="flex flex-col flex-grow w-full overflow-y-auto">
            {
              projectID 
              ?  <Outlet/> 
              : (     
                
                <div className="flex flex-col w-full h-full">
                    <div id="profile" className="flex p-4 justify-between w-full h-24">
                        <div className="flex space-x-5 w-1/2 h-full">
                            <h1 className="text-sky-950 font-bold mt-3 text-2xl ml-7">Projects</h1>
                        </div>

                        <div className="flex h-full mr-5">
                          <TextField
                            id="outlined-basic"
                            label="Search Project"
                            variant="outlined"
                            className="w-96"
                          />
                        </div>
                    </div>
                    <div className="flex flex-wrap w-full h-full mt-2 overflow-y-auto"> 
                      { projects.map( project => ( 
                          <div key={project.pid} className="glass2 flex flex-col w-[380px] h-[350px] ml-5 mb-12 rounded-extra border-1 border-gray-400">
                            <div className="w-full flex flex-col space-y-4">
                              <h1 className="font-bold text-sky-950 text-2xl ml-7 mt-7">{project.name}</h1>
                              <p className="w-[20rem] truncate text-sky-950 ml-7 mt-7">"{project.description}"</p>
                            </div>

                            <div className="flex mt-4">
                                  {/* <span className="font-bold text-sky-950 ml-7 mt-7">Languages: </span> */}
                                  <span className="w-[50%] font-bold text-sky-950 ml-7">Collaborators: { project.collaborators }</span>
                            </div>

                            <div className="flex ">
                                  <span className="w-[50%] font-bold text-sky-950 ml-7">Completed tasks: { project.completedTasks }</span>    
                                  <span className="w-[50%] font-bold text-sky-950 ml-7">Commits: { project.commits }</span>    
                            </div>

                            <div className="flex ">
                                  <span className="w-[50%] font-bold text-sky-950 ml-7">Priority: { project.priority }</span>    
                                  <span className="w-[50%] font-bold text-sky-950 ml-7">Status: { project.status }</span>    
                            </div>

                            <div className="flex ">
                              <span className="flex space-x-2 w-[50%] ml-7 mt-4">
                                {
                                  project.tags.map( tags => (
                                    <span key={tags} className="text-sky-950">
                                      { tags } 
                                    </span>
                                  ))    
                                }                     
                              </span>   
                            </div>

                            <div className=" flex justify-center items-center w-full h-full ">
                                <button 
                                  onClick={() => navigate( `${cleanUrl(project.name)}`, { 
                                    state: { 
                                      project: { ID: project.pid, name: project.name } } } )}  

                                  className="glass3 flex justify-center items-center w-[90%] h-14 rounded-2xl border-1 border-gray-400  transition-all duration-300 ease-in-out transform active:translate-y-[2px]"
                                >
                                    <p className="text-sky-950 text-lg">Open</p>
                                </button>
                            </div>
                          </div>                      
                        ))
                      }  
                    </div>
                </div>

                )
            } 
        </div>

    </div>


  )
}
