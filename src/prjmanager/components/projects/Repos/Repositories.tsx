import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Icon } from '@ricons/utils';
import { FolderOpen } from '@ricons/fa';
import { RootState } from '../../../../store/store';
import LoadingCircle from '../../../../auth/helpers/Loading';


export const Repositories = ({ layerId }) => {


  const navigate = useNavigate();
  const location = useLocation();
  const projectId = location.state?.projectId;
  const { repositories, loading } = useSelector((state: RootState) => state.platypus);


  const [searchTerm, setSearchTerm] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [layerRepositories, setLayerRepositories] = useState([])


  useEffect(() => {
    const filteredRepos = repositories.filter( repo => repo.layer === layerId )
    setLayerRepositories(filteredRepos)
  }, [repositories, loading, layerId])


  const filteredRepos = layerRepositories.filter((repo) => {
    return (
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (visibilityFilter === 'all' || repo.visibility === visibilityFilter)
    );
  });

  const cleanUrl = (name: string) => {
    return name.replace(/\./g, '').replace(/\s+/g, '-');
  };


  if(loading) return <LoadingCircle/>

  return (
        <div className="flex flex-col space-y-12 w-full  h-full">


            <div className="flex w-full justify-between items-center ">
                <h1 className="text-black font-bold text-xl ml-4">Repositories</h1>
                <div className='flex'>
                    <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none mr-2"
                    />
                    <select
                    value={visibilityFilter}
                    onChange={(e) => setVisibilityFilter(e.target.value)}
                    className="border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none"
                    >
                    <option value="all">All</option>
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                    <option value="internal">Internal</option>
                    </select>
                </div>
            </div>


            <div className='flex flex-wrap overflow-y-auto w-full h-full'>
                {filteredRepos.map((repo) => (
                    <div key={repo._id} className=" flex flex-col w-[220px] h-[170px]">
                        <h1 className="text-lg font-bold ml-14">{repo.name}</h1>
                        <button
                        onClick={() =>
                            navigate(`${cleanUrl(repo.name)}`, {
                              state: { projectId, layerId, repoId: repo._id }
                            })
                        }
                        >
                        <Icon size={120}>
                            <FolderOpen />
                        </Icon>
                        </button>
                    </div>
                ))}
            </div>

      
    </div>
  );
};