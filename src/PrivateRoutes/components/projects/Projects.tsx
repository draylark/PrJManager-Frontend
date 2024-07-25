import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect, useMemo, useCallback } from "react"
import { RootState } from "../../../store/store"
import { TextField } from "@mui/material"
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { VscNewFolder } from "react-icons/vsc";
import { RenderProjects } from "./RenderProjects";
import { startProjects } from "../../../store/projects/projectSlice";
import { ProjectForm } from "./forms/project/ProjectForm";
import { PuffLoader  } from 'react-spinners';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";


export const Projects = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const projectID = location.state?.project.ID;
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const { uid } = useSelector((state: RootState) => state.auth);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false)
  const { projects } = useSelector((state: RootState) => state.projects);


  const fetchProjects = useCallback(() => {
    axios.get(`${backendUrl}/projects/get-projects/${uid}`)
      .then((res) => {
        dispatch(startProjects(res.data));
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  }, [uid, dispatch]); 
  

  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects;
    return projects.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [projects, searchTerm]);
  
  useEffect(() => {
    fetchProjects()
  }, [fetchProjects]);


  if(isLoading) return (
    <div className="flex flex-col flex-grow items-center justify-center ">
      <PuffLoader color={'#007BFF'} loading={true} size={150} />
    </div>
  )

  return (
        <div id="projects" className="flex flex-col flex-grow overflow-y-auto">            
        
        { isProjectFormOpen && <ProjectForm uid={uid as string} isProjectFormOpen={isProjectFormOpen} setIsProjectFormOpen={setIsProjectFormOpen} /> }
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
                                      onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                  
                                )
                              }

                              <div className="flex space-x-5  h-full justify-end">
                                  <button 
                                    onClick={() => setIsProjectFormOpen(true)}
                                    className="glassi hover:glassi-hover flex justify-center items-center px-4 h-14 rounded-2xl border-1 border-gray-400  transition-all duration-300 ease-in-out transform active:translate-y-[5px]"
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
                        : <RenderProjects items={filteredProjects} navigate={navigate} />
                      }
                  </div>

                )
            }
        </div>

  )
}
