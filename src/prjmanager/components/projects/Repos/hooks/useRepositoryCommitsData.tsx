import { useState, useRef, useEffect, useMemo } from 'react'
import { Icon } from '@ricons/utils';
import ArrowCircleDown48Regular from '@ricons/fluent/ArrowCircleDown48Regular'
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { TaskComplete, TaskView } from '@ricons/carbon'
import { TextField, Autocomplete, Select, MenuItem } from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Avatar, ListItemAvatar } from '@mui/material';
import { MdLayers } from 'react-icons/md';
import { FaGitAlt, FaExternalLinkAlt  } from 'react-icons/fa';
import { set } from 'date-fns'
import LoadingCircle from '../../../../../auth/helpers/Loading';
import moment from 'moment';
import { DiffOutlined } from '@ricons/antd'
import { useNavigate, useParams } from 'react-router-dom';


export const useRepositoryCommitsData = ( repository: string, layer, project, commitstate ) => {

  const navigate = useNavigate();

  const [cHash, setCHash] = useState(null)
  const [commits, setCommits] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  

  const fetchCommits = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/commits/${repository.repoID}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('x-token')
        }
      });
      const commits = response.data.commits;
      setIsLoading(false)
      setCommits(commits);  
    } catch (error) {
      setIsLoading(false)
      console.error("Error fetching commits:", error);
    }
  }


  const RenderCommits = ({ commits }) => {

    const [expanded, setExpanded] = useState(false);

    return (   
      <div className='flex flex-col w-[96%] max-h-[690px] overflow-y-auto space-y-4 h-full py-4 border-t-[1px] border-black'>
        {  
          commits.map((commit, index) => {
            return (
              <Accordion 
              key={commit.uuid} 
              expanded={expanded === commit.uuid}
              onChange={() => setExpanded(expanded === commit.uuid ? false : commit.uuid)}
              // ref={(el) => accordionRefs.current[commit.commit_hash] = el}
            >
                <div className="flex w-full p-4 rounded shadow-lg  bg-white hover:bg-gray-100 transition-colors border-[1px] border-yellow-300">
                    <div className="flex flex-col justify-between w-full">
                        {/* Encabezado con hash y mensaje del commit */}
                        <div className='flex flex-col'>
                          <div className='flex justify-between'>
                            <h3 className="text-sm font-semibold text-yellow-600 truncate" title={commit.uuid}>{commit.uuid}</h3>
                            <span className='text-gray-600 text-sm'>Committed on {new Date(commit.date).toLocaleDateString()}</span>
                          </div>

                          <h2 className="text-lg font-bold text-gray-800">{commit.message}</h2>
                        </div>
                        
                        {/* Información del autor del commit */}
                        <div className="flex justify-between">
                            <div className='flex items-center mt-2'>
                              <Avatar alt={commit.author.name} src={commit.author.photoUrl || commit.author.name} sx={{ width: 24, height: 24 }} />
                              <span className="ml-2 text-sm text-gray-600">{commit.author.name}</span>
                            </div>

                            <div className='flex space-x-3 items-center'>                    
                                  <DiffOutlined 
                                      className='w-[22px] h-[22px] ml-4 cursor-pointer hover:text-green-600 transition-colors duration-500'
                                      onClick={() => navigate(
                                        `${commit.uuid}`, 
                                        { state: { 
                                          project, 
                                          layer, 
                                          repository, 
                                          commits: commitstate, 
                                          commitHash: commit.uuid,
                                          branch: commit.branch }
                                        })}                                                             
                                  />       
                                                                                                      
                                  <ArrowCircleDown48Regular 
                                      className='w-[22px] h-[22px] ml-4 cursor-pointer hover:text-green-600 transition-colors duration-500' 
                                      onClick={() => setExpanded(expanded ? false : commit.uuid)} 
                                  />                                                 
                            </div>
                        </div>
                    </div>
                </div>
                <AccordionDetails >
                {                                                      
                  isLoading 
                  ? <LoadingCircle />
                  :                                     
                    <div className='flex p-6 justify-between rounded-lg'>
                      {/* Detalle de Commit */}

                        <div className='flex flex-col space-y-2'>
                          <h4 className="font-semibold text-md">Time since then</h4>
                          <p className="text-sm text-center text-gray-800">
                            {moment(commit.date).fromNow()}
                          </p>
                        </div>
                        
                        
                        <div className='flex flex-col space-y-2'>
                            <h4 className="text-md font-semibold">Commit Message</h4>
                            <p className="text-sm max-w-[300px] max-h-[40px] overflow-y-auto break-words text-gray-800">"{commit.message}"</p>
                        </div>
                       
                        <div className="flex flex-col">
                          <h5 className="text-md font-semibold">Associated Task</h5>
                          <p className="text-sm truncate w-[170px] text-blue-500">{commit?.associated_task?.task_name || 'No associated Task'}</p>
                          <p className="text-sm">{commit?.associated_task?._id || null}</p>
                          {/* Aquí puedes añadir más detalles sobre la tarea si están disponibles */}
                        </div>  

                        <div className="flex flex-col space-y-2">
                          <h5 className="text-md font-semibold">Committed By</h5>
                          <div className="flex items-center">
                            <Avatar alt={commit.author.username} src={commit.author.photoUrl || commit.author.name} sx={{ width: 24, height: 24 }} />
                            <span className="ml-2 text-sm text-gray-700">{commit.author.name}</span>
                          </div>
                        </div>

                    </div>
                }
                </AccordionDetails>
            </Accordion>
            )
          })      
        }
      </div>
    )  
  }

  useEffect(() => {
    setIsLoading(true)
    fetchCommits()
  }, [])


  return {
    isLoading,
    commitsData: commits,
    fetchCommits,
    RenderCommits,
    cHash

  }

}
