import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { FaGitAlt, FaExternalLinkAlt  } from 'react-icons/fa';
import { TextField, Select, MenuItem} from '@mui/material'
import { useDispatch } from 'react-redux';
import { fetchLayerRepositories } from '../../../../store/platypus/thunks';
import { PuffLoader  } from 'react-spinners';

export const Repositories = ({ layer, project, uid }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { ID, name } = location.state.project;
  const { repositories, fetchingResources } = useSelector((state: RootState) => state.platypus);

  const [searchTerm, setSearchTerm] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [layerRepositories, setLayerRepositories] = useState([])

  const filteredRepos = layerRepositories.filter((repo) => {
    return (
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (visibilityFilter === 'all' || repo.visibility === visibilityFilter)
    );
  });

  const cleanUrl = (name: string) => {
    return name.replace(/\./g, '').replace(/\s+/g, '-');
  };

  useEffect(() => {
    const filteredRepos = repositories.filter( repo => repo.layerID === layer._id )
    setLayerRepositories(filteredRepos)
  }, [repositories, layer])

  useEffect(() => {
    if( !repositories.some(repo => repo.layerID === layer._id) ){
      dispatch(fetchLayerRepositories( project?.pid, layer._id, uid))
    }  
  }, [])
  
  if(fetchingResources) return  ( 
    <div className='flex h-full w-full items-center justify-center'>
        <PuffLoader  color="#32174D" size={50} /> 
    </div>                         
  )

  return (
      
        <div className="flex w-full h-full overflow-hidden">        
         {

            layerRepositories.length === 0 
            ? 
              <div className="flex flex-col items-center mt-7 border-t-[1px]  border-gray-400  w-full h-full">
                <h1 className="text-xl mt-[22%] text-gray-400">There are no repositories yet, start creating one!</h1>
              </div>
            :
            <div className='flex flex-col w-full h-full'>
                <div className="flex pl-7 pb-4 justify-between items-center mt-4">
                  <div className='flex space-x-4'>

                    <TextField
                      label="Search by name..."
                      variant="outlined"
                      size="small"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />


                    <Select
                      value={visibilityFilter}
                      onChange={(e) => setVisibilityFilter(e.target.value)}
                      variant="outlined"
                      size="small"
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="open">Open</MenuItem>
                      <MenuItem value="internal">Internal</MenuItem>
                      <MenuItem value="restricted">Restricted</MenuItem>
                    </Select>
                  </div>
              </div>

              <div id='repos-scroll-container' className="flex-col h-full rounded-b-3xl overflow-y-auto p-4">
                  {filteredRepos.map((repo) => (
                    <div 
                      key={repo._id} 
                      className="relative rounded-lg w-full mb-4 p-2 h-auto border-b-2 border-x-2 border-gray-200 bg-white flex flex-col justify-between"
                    >
      
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold">{repo.name}</h2>
                        <FaGitAlt color="#80ed99"  className="text-3xl" />
                      </div>

                      <p className="text-sm text-gray-600">{repo.description}</p>

                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Visibility: {repo.visibility}</span>
                        <button  
                          rel="noopener noreferrer" 
                          className="absolute bottom-3 right-2 inline-flex items-center px-4 py-2 glasspecial border-1 border-gray-400 hover:bg-blue-200 text-black font-bold rounded-lg text-sm transition-colors duration-150 ease-in-out"
                          onClick={() => {
                            navigate(`${cleanUrl(repo.name)}`, { 
                              state: { 
                                project: { ID,  name },
                                layer: { layerID: layer._id, layerName: layer.name }, 
                                repository: { repoID: repo._id, repoName: repo.name}
                              }})
                          }}>
                          Open repository <FaExternalLinkAlt className="ml-2" />
                        </button>
                      </div>

                      <div className="text-sm text-gray-500">
                        <span>Last Update: {new Date(repo.updatedAt).toLocaleDateString()}</span>               
                      </div>

                    </div>
                  ))}
              </div>  
            </div>

         }
    </div>
  );
};