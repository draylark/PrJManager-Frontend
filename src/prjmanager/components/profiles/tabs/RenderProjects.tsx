import { useNavigate } from "react-router-dom";
import { cleanUrl } from "../../projects/helpers/helpers";
import { Typography } from "@mui/material";
import { FaLayerGroup, FaGitAlt } from 'react-icons/fa';
import TaskComplete from '@ricons/carbon/TaskComplete';
import GitCompare from '@ricons/tabler/GitCompare';

export const RenderProjects = ({ projects }) => {

  const navigate = useNavigate()

    return (
      <div className="flex items-end h-[80%] w-[95%] mx-auto overflow-hidden rounded-2xl p-2 text-xl md:text-4xl font-bold text-black bg-blue-50">
        
        <div className="flex flex-col flex-grow max-h-[680px] min-h-[680px] w-[95%] mx-auto space-y-4 py-2">
            {
              projects.length === 0 
              ? 
                  (
                      <div className='p-4 rounded-lg border-[1px] border-gray-400 treechart-container'>                             
                              <h2 className="text-sm font-bold line-clamp-1">No projects to show yet.</h2>                                        
                      </div>
                  )
              :  
                  projects.map(project => (
                      <div 
                          key={project.pid} 
                          className='flex min-h-[100px] p-4 rounded-lg border-[1px] border-gray-400 treechart-container hover:bg-blue-100 transition-colors duration-200 cursor-pointer'
                          onClick={() => navigate(`/projects/${cleanUrl(project.name)}`, {
                              state: {
                                project: {
                                    ID: project.pid,
                                    name: project.name
                                }
                              }
                          })}  
                      >
                        <div className="flex flex-col w-1/2">
                          <div className="flex justify-between items-center">
                              <h2 className="text-lg font-bold line-clamp-1">{project.name}</h2>
                          </div>
                          <Typography className='line-clamp-2 ' variant="body2">{project.description}</Typography>
                        </div>

                        <div className="flex w-1/2 justify-between px-[80px]">
                            <div className='flex space-x-1 items-center'>
                              <FaLayerGroup className='w-5 h-5 text-pink-400 mr-3'/>                  
                              <span className='font-semibold text-[15px] text-pink-400 mr-3'>{project.layers}</span>        
                            </div>

                            <div className='flex space-x-1 items-center'>
                              <FaGitAlt className='w-5 h-5 text-green-400 mr-3'/>                  
                              <span className='font-semibold text-[15px] text-green-400 mr-3'>{project.repositories}</span>
                            </div>

                            <div className='flex space-x-1 items-center'>
                              <GitCompare className='w-5 h-5 text-yellow-500 mr-3'/>                  
                              <span className='font-semibold text-[15px] text-yellow-500 mr-3'>{project.commits}</span>
                            </div>

                            <div className='flex space-x-1 items-center'>
                              <TaskComplete className='w-5 h-5 text-blue-500 mr-3'/>                  
                              <span className='font-semibold text-[15px] text-blue-500 mr-3'>{project.completedTasks}</span>
                            </div>
                        </div>
                      </div>
                  )
              )

            }
        </div>

      </div>
    );
};
