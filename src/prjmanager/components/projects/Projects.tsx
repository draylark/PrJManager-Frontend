import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect } from "react"
import { RootState } from "../../../store/store"
import { TextField } from "@mui/material"
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import LoadingCircle from "../../../auth/helpers/Loading"
import projectbg from '../../assets/imgs/projectbg.jpg'
import { cleanUrl } from "./helpers/cleanUrl";
import { VscNewFolder } from "react-icons/vsc";

export const Projects = () => {


  const navigate = useNavigate()
  const location = useLocation();
  const layerID = location.state?.layer?.layerID;
  const projectID = location.state?.project.ID;
  const [isLoading, setIsLoading] = useState(false)
  const { projects } = useSelector((state: RootState) => state.projects)


  console.log('projectID',projectID)
  console.log('layerID',layerID)

  return (

    <div id="projectsMainDiv" className="flex flex-col w-full h-full ">
        <div id="projects" className="flex flex-col flex-grow w-full overflow-y-auto">
            {
              projectID 
              ?  <Outlet/> 
              : (     
                
                  <div className="flex flex-col w-full h-full">
                      <div className="flex p-4 justify-between w-full h-24">
                          <div className="flex space-x-5 w-1/2 h-full ">
                              <h1 className="text-sky-950 font-bold mt-3 text-2xl ml-7">Projects</h1>
                          </div>


                          <div className="flex space-x-6 h-full mr-7">   
                              {
                                projects.length !== 0 && (
                                  
                                    <TextField
                                      id="outlined-basic"
                                      label="Search Project"
                                      variant="outlined"
                                      className="w-96"
                                    />
                                  
                                )
                              }

                              <div className="flex space-x-5  h-full justify-end">
                                  <button 
                                    onClick={() => navigate('new-project')} 
                                    className="glassi flex justify-center items-center px-4 h-14 rounded-2xl border-1 border-gray-400  transition-all duration-300 ease-in-out transform active:translate-y-[5px]"
                                  >
                                      <VscNewFolder className="text-2xl text-sky-950"/>
                                  </button>
                              </div>
                          </div> 

                      </div>

                      {

                        projects.length === 0
                        ?  <div className="flex flex-col w-full h-full space-y-4 items-center justify-center">
                              <h1 className="text-sky-950 font-bold text-2xl">You do not own or are part of any project yet</h1>
                              <p className="text-sky-950 ">Start Creating a new project or join an existing one!</p>
                            </div> 
                        :
                        <div className="grid grid-cols-3  h-full mt-2 overflow-y-auto pl-6"> 
                          {                      
                            projects.map( project => ( 
                              <div 
                                    key={project.pid} 
                                    className="relative flex flex-col w-[380px] h-[350px]  mb-12 rounded-extra border-[1px] border-gray-400 overflow-hidden"
                                    style={{
                                      backgroundImage: `url(${projectbg})`,
                                      backgroundSize: 'cover',
                                      backgroundPosition: 'center'      
                                    }}
                                    
                              >
                                    <div className="w-full flex flex-col space-y-4">
                                      <h1 className="font-bold text-sky-950 text-2xl ml-7 mt-7">{project.name}</h1>
                                      <p className="break-words  text-sky-950 ml-7 mt-7">{project.description}</p>
                                    </div>


                                    <div className="flex ">
                                      <span className="flex space-x-2 w-[50%] ml-7 mt-4">
                                        {
                                          project.tags.map( (tag, index) => (
                                            <span key={index} className="text-sky-950">
                                              { tag } 
                                            </span>
                                          ))    
                                        }                     
                                      </span>   
                                    </div>

                                    <div className="absolute flex justify-center items-center w-full h-full top-[120px]">
                                        <button 
                                          onClick={() => navigate(`${cleanUrl(project.name)}`, { 
                                            state: { 
                                              project: { ID: project.pid, name: project.name, accessLevel: project?.accessLevel || null } } } )}  

                                          className="glass3 flex justify-center items-center w-[90%] h-14 rounded-2xl border-1 border-gray-400  transition-all duration-300 ease-in-out transform active:translate-y-[2px]"
                                        >
                                            <p className="text-sky-950 text-lg">Open</p>
                                        </button>
                                    </div>
                              </div>                      
                              ))
                          }  
                      </div>
                      }

                  </div>

                )
            }
        </div>

    </div>


  )
}
