import { useSelector } from 'react-redux'
import { FolderOpen } from '@ricons/fa'
import { Add16Filled } from '@ricons/fluent'
import { Icon } from '@ricons/utils'
import { RootState } from '../../../../store/store';
import { useState } from 'react';
import { Repository } from '../Repos/Repository';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';


export const Repositories = () => {

  const location = useLocation();
  const repoId = location.state?.repoId;
  const navigate = useNavigate()
  const { repos } = useSelector( (state: RootState) => state.repos)
  const [isRepoOpen, setIsRepoOpen] = useState({
    repo: {},
    isOpen: false
  })

  const cleanUrl = (name: string) => {
    return name.replace(/\./g, '').replace(/\s+/g, '-');
  }

  console.log( isRepoOpen )

  return (
    <>
      <div className="flex flex-col w-full mb-4 rounded-extra">
        {
            repoId
            ? ( <Outlet/> )
            : (
                  <div className='flex items-center w-full space-x-24 px-16 mt-10'>
                    {
                      repos.map( repo => (
                        <div key={repo._id} className='flex flex-col'>
                          <h1 className="text-lg font-bold">{repo.name}</h1>
                          <button onClick={ () => navigate(`${cleanUrl(repo.name)}`, { state: { repoId: repo._id }}) }>                   
                            <Icon size={120}>
                              <FolderOpen/>
                            </Icon>
                          </button>
                        </div>
                      ))
                    }

                      <div className="w-20 h-20">
                          <button className="flex flex-col justify-center items-center w-full h-full">
                              <Icon size={50}>
                                <Add16Filled/>
                              </Icon>
                              <p className="text-xs">Add</p>
                          </button> 
                      </div>
                  </div>
              )
        }
      </div>
    </>
  )
}
