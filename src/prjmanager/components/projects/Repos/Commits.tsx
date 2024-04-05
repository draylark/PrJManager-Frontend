
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useRepositoryCommitsData } from './hooks/useRepositoryCommitsData';
import LoadingCircle from '../../../../auth/helpers/Loading';
import { ArrowHookUpLeft16Regular } from '@ricons/fluent'



export const Commits = () => {


    const location = useLocation();
    const navigate = useNavigate();

    const project = location.state.project;
    const layer = location.state.layer;
    const repository = location.state.repository;

    const commits = location.state.commits;
    const commitHash = location.state.commitHash;
  
    const { isLoading, commitsData, RenderCommits } = useRepositoryCommitsData(repository, layer, project, commits);

    console.log('commitstate:', commits)


    return (   
        <div className='flex flex-col w-full h-full items-center'>

            {
                !commitHash && (
                    <div className='flex w-full pb-3  items-center'>           
                        <ArrowHookUpLeft16Regular className='w-5 h-5 ml-4 cursor-pointer' onClick={() => navigate(-1)} />          
                        <h1 className='text-lg font-bold ml-2'>Commits</h1>           
                    </div>
                )
            }


            {
                commitHash
                ? <Outlet />
                :
                    isLoading 
                    ? <LoadingCircle /> 
                    : <RenderCommits commits={commitsData} />

            }

        </div>
    )
}

// <Breadcrumbs sx={{marginLeft: 2}} aria-label="breadcrumb">               
// <button
//     className='text-[12px] hover:text-pink-300 transition-colors duration-500'                            
//     onClick={() => navigate(`/user/projects/${cleanUrl(project.name)}/${cleanUrl(layer.layerName)}`, {
//         state: {
//             project: project,
//             layer: layer
//         }
//     })}
// >
//     {layer.layerName}
// </button>
// <button
//     className='text-[12px] hover:text-green-500 transition-colors duration-500'                            
//     onClick={() => navigate(-2)}
// >
//     {repository.repoName}
// </button>

// <span 
//     className='text-[12px]'
// >
//     {commitHash.slice(0, 7)} {/* Muestra solo los primeros 7 caracteres del hash */}
// </span>
// </Breadcrumbs>