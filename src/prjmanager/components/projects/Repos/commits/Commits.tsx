
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useRepositoryCommitsData } from '../hooks/useRepositoryCommitsData';
import { ArrowHookUpLeft16Regular } from '@ricons/fluent'
import { PuffLoader  } from 'react-spinners';
import { RenderCommits } from './RenderCommits';

export const Commits = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const repository = location.state.repository;
    const commitHash = location.state.commitHash;
  
    const { isLoading, commitsData } = useRepositoryCommitsData(repository);

    return (   
        <div className='flex flex-col w-full h-full items-center'>

            {
                !commitHash && (
                    <div className='flex w-full pb-3  items-center'>           
                        <ArrowHookUpLeft16Regular className='w-5 h-5 ml-4 cursor-pointer' onClick={() => navigate(-1)} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />          
                        <h1 className='text-lg font-bold ml-2'>Commits</h1>           
                    </div>
                )
            }


            {
                commitHash
                ? <Outlet />
                :
                    isLoading 
                    ? ( 
                        <div className='flex flex-grow w-full items-center justify-center'>
                            <PuffLoader  color="#32174D" size={50} /> 
                        </div>                         
                      )
                    : <RenderCommits commits={commitsData} isLoading={isLoading} />
            }
        </div>
    )
}
