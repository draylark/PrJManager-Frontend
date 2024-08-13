import axios from 'axios';
import  { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { RootState } from '../../../../store/store';
import { ArrowBackUp } from '@ricons/tabler'
import { ReloadSharp } from '@ricons/ionicons5'
import { Icon } from '@ricons/utils';
import { loadFolderContents, loadFileContent, getLanguageFromFileName } from './helpers/repos-fn'
import { FileTree } from './FileTree';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CodeOnBigScreen } from './modals/CodeOnBigScreen';
import { ExpandSharp } from '@ricons/ionicons5'
import { TaskSettings, CloudSatelliteConfig } from '@ricons/carbon'
import { CommitSharp } from '@ricons/material'
import { RepositoryTasksModal } from './modals/RepositoryTasksModal';
import { ArrowDropDownOutlined } from '@ricons/material'
import { RepositoryConfigForm } from './modals/forms/RepositoryConfigForm';
import 'github-markdown-css/github-markdown.css';
import './styles/markdown.css'
import ReactMarkdown from 'react-markdown';
import { InformationOutline } from '@ricons/ionicons5'
import { tierS } from '../../../helpers/accessLevels-validator';
import { RepositoryInfo } from './modals/RepositoryInfo';
import { PuffLoader  } from 'react-spinners';
import './styles/repository.css'
const backendUrl = import.meta.env.VITE_BACKEND_URL
import { RepositoryBase, LayerBase, ProjectBase } from '../../../../interfaces/models';


export type File = {
  id: string;
  mode: string;
  name: string;
  path: string;
  type: string;
  files? : File[];
}

export const Repository = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { repositories } = useSelector( (state: RootState) => state.platypus );
  const { uid } = useSelector((state: RootState) => state.auth );
  const { currentProject: project, layers } = useSelector((state: RootState) => state.platypus );

  const [repo, setRepo] = useState<RepositoryBase | null>(null);
  const [layer, setlayer] = useState<LayerBase | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBranch, setCurrentBranch] = useState('');
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [openBranches, setOpenBranches] = useState(false);
  const [isRepoFormOpen, setIsRepoFormOpen] = useState(false);
  const [isRepoInfoOpen, setIsRepoInfoOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [selectedFileContent, setSelectedFileContent ] = useState('');
  const [isCodeOnBigScreenOpen, setIsCodeOnBigScreenOpen] = useState(false);

  const [errorType, setErrorType] = useState(null);    
  const [errorMessage, seterrorMessage] = useState(null);
  const [errorWhileFetching, setErrorWhileFetching] = useState(false);

  const commits = location.state.commits;
  const { ID, name } = location.state.project;
  const { layerID, layerName } = location.state.layer;
  const { repoID, repoName } = location.state.repository;


  const handleLoadNewBranch = (branch: string) => {
    setLoadingFiles(true)
    setOpenBranches(false)
    setSelectedFileContent('')
    setSelectedFileName('')
    setFiles([])
    setCurrentBranch(branch) 
    loadRepoFiles(branch)
  };

  const loadRepoFiles = async(branch?: string ) => {
      await axios.get(`${backendUrl}/gitlab/loadRepoFiles/${repoID}/${ branch ? branch : currentBranch }`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('x-token')
        }
      })
      .then( res => {
        setFiles(res.data.files)
        setCurrentBranch(res.data.branch)
        setLoadingFiles(false)
      })
      .catch( error => {
        console.log(error)
        setLoadingFiles(false)
        setErrorWhileFetching(true)
        setErrorType(error.response.data.type || 'Error')
        seterrorMessage(error.response.data.message || 'An error occurred while fetching data')
      });        
  };

  const getExtension = (fileName?: string) => {
    const nameToSplit = fileName !== undefined ? fileName : selectedFileName;
    const extension = nameToSplit.split('.').pop()?.toLowerCase() || '';
    return extension === 'md' ? true : false
  };

  const handleRepoData = (repository: RepositoryBase) => {
    setRepo(repository);
    // Encuentra la rama por defecto o usa 'null' si no existe ninguna
    const defaultBranchInfo = repository.branches?.find(branch => branch.default === true);
    const defaultBranchName = defaultBranchInfo ? defaultBranchInfo.name : 'main';
    setCurrentBranch(defaultBranchName);
    loadRepoFiles(defaultBranchName);
          
    const layerFromRState = layers.find((layer) => layer._id === layerID);
    // Manejo seguro al suponer que layerFromRState puede ser undefined
    if (layerFromRState) {
        setlayer(layerFromRState as LayerBase);
    } else {
      setlayer(null);
    }
    setIsLoading(false);
  };


  const fetchRepositoryData =  async() => {
    axios.get(`${backendUrl}/repos/${repoID}`, {
      params: {
        projectID: ID
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('x-token')
      }
    })
    .then( res => {
      handleRepoData(res.data.repo)
    })
    .catch( error => {
      setIsLoading(false)
      setErrorWhileFetching(true)
      setErrorType(error.response.data.type || 'Error')
      seterrorMessage(error.response.data.message || 'An error occurred while fetching data')
    });
  };


  useEffect(() => {  
    if( repoID ) {
      const repository = repositories.find((repo) => repo._id === repoID)
        if( repository && repository !== undefined  ){
          handleRepoData(repository)
        } else {
          fetchRepositoryData() 
        }
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repoID, repositories]);


  const gitInstructions = `
    PrJConsole Instructions for ${repo?.name}
    Remote URL: ${'https://prjmanager.com/' + repo?.layerID + '/' + repoID + '.git'}
    

    Disclaimer: 
    - Usage is only limited to the VSCODE editor for now.
    - The following instructions are for the PrJConsole interactive console only.
    - You need to have the interactive console and extension provided by the PrJManager team installed to be able to execute commands. 
      if this is your first time, follow the instructions in this article: https://prjmanager.com/docs/getting-started/installation
    - Please note that the extension and console are still in development, possible errors may occur when used, 
      we appreciate your understanding and if they occur, report them to PrJ Team Support.


      Initialize a new repository:
        1. Run the command: "init"        
        2. Run the commando: "commit" to commit the changes to the repository, provide a commit message when prompted by the console.

      Set the remote repository URL:
        1. Run the command: "remote"        
        2. Choose the option "Add Remote URL"
        3. Provide the name for the remote repository URL when prompted by the console (e.g. origin)
        4. Copy and paste the remote URL when prompted by the console

    
        
      Push:
        1. Run the command: "push", it will push the changes by the default "origin" remote repository setted        
        2. (Optional) You can enter a second argument by pressing space after the "push" command, 
            which is supported as a different remote setted ( in case it exists and you want to push 
                                                            that specific remote repository instead of the default "origin" remote repository )
                                                             
        3. If you want to push to a specific branch, you need to change the branch by running the command "branch" before, and change to 
           the branch you want to push to, then run the "push" command.


      Pull:
        1. Run the command: "pull", it will pull the changes by the default "origin" remote repository setted        
        2. (Optional) You can enter a second argument by pressing space after the "pull" command, 
            which is supported as a different remote setted (in case it exists and you want to pull that specific remote)
        
        3. If you want to pull from a specific branch, you need to change the branch by running the command "branch" before, and change to
           the branch you want to pull from, then run the "pull" command.


      Clone:
        1. Run the command: "clone"        
        2. Copy and paste the repository URL when prompted by the console
        3. (Optional) You can enter a second argument by pressing space after pasting the URL of the repository, 
            which is supported as a branch of the repository (in case it exists and you want to clone that specific branch)



      If you need more information about the commands, run the command: "help" to see the list of available commands and their descriptions.
      You can also read the documentation in the PrJManager website: https://prjmanager.com/docs/getting-started/prjconsole-commands

  `;
 
  if( isLoading ) return ( 
    <div className='flex flex-grow items-center justify-center'>
        <PuffLoader  color="#32174D" size={50} /> 
    </div>                         
  );
  if( loadingFiles ) return ( 
    <div className='flex flex-grow items-center justify-center'>
        <PuffLoader  color="#32174D" size={50} /> 
    </div>                         
  );
  if( errorWhileFetching ) return (
    <div className='flex flex-col flex-grow items-center justify-center'>
      <h1 className='text-xl text-red-500'>{errorMessage}</h1>
      {
          errorType !== 'collaborator-validation' && errorType !== 'token-validation' ? (
            <button
              onClick={() => {
                setErrorWhileFetching(false)
                setIsLoading(true)
                fetchRepositoryData()
              }}
              className='hover:text-blue-500 transition-colors duration-100'
            >
              Try Again
            </button>
          ) : null
        }
    </div>
  );

  return (
    <div className="flex flex-grow w-full h-full">
        
      { isRepoInfoOpen && <RepositoryInfo uid={uid as string} repo={repo as RepositoryBase} instructions={gitInstructions} isRepoInfoOpen={isRepoInfoOpen} setRepoInfoOpen={setIsRepoInfoOpen} /> }
      { isRepoFormOpen && <RepositoryConfigForm isRepoFormOpen={isRepoFormOpen} setIsRepoFormOpen={setIsRepoFormOpen} repo={repo as RepositoryBase} /> }  
      { isTasksModalOpen && <RepositoryTasksModal project={project as ProjectBase} layer={layer as LayerBase} repo={repo as RepositoryBase} isTasksModalOpen={isTasksModalOpen} setIsTasksModalOpen={setIsTasksModalOpen} /> }
      { isCodeOnBigScreenOpen && <CodeOnBigScreen  getExtension={getExtension}  isCodeOnBigScreenOpen={isCodeOnBigScreenOpen} setIsCodeOnBigScreenOpen={setIsCodeOnBigScreenOpen} fileName={selectedFileName} fileContent={selectedFileContent} /> } 

      {

        commits
        ? <Outlet />
        : files.length === 0 
        ?               
            (
              <div className="flex flex-col w-full h-full overflow-x-auto space-y-3 bg-[#282a36]">
                  <div className="flex items-center justify-between px-5 pt-5">
                    <button className="flex items-center space-x-2" onClick={() => navigate(-1)}>
                      <Icon size={20}>
                        <ArrowBackUp className='text-white' onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                      </Icon>      
                    </button>
                    <button className="flex items-center space-x-2" onClick={() => loadRepoFiles()}>
                      <Icon size={18}>
                        <ReloadSharp className='text-white' onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                      </Icon>
                    </button>
                  </div>

                  <div className='overflow-y-auto  bg-[#282a36] max-h-[86vh]'>
                      <SyntaxHighlighter  language="bash" style={dracula} customStyle={{ fontSize: '13px' }}>
                        {gitInstructions}
                      </SyntaxHighlighter>
                  </div>
              </div>
            )
            :
            (     
              <div className='flex h-full w-full'>                   
                  <div className="z-10 min-w-[340px] h-full glassi rounded-bl-3xl">

                    <div className="flex items-center justify-between h-[39px] mt-2 pr-3 pl-4">
                        <button className="flex items-center" onClick={() => navigate(-1)}>
                          <Icon size={20}>
                            <ArrowBackUp onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                          </Icon>             
                        </button>

                        <div className='relative flex  items-center'>
                              <CommitSharp 
                                className='w-5 h-5 cursor-pointer hover:text-yellow-600 duration-150 ease-in-out transition-all transform active:translate-y-[2px] mr-3'
                                onClick={() => navigate(
                                  `commits`,
                                  {
                                    state: {
                                      project: { ID, name },
                                      layer: { layerID, layerName },
                                      repository: { repoID, repoName },
                                      commits: true
                                    }
                                  })} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                              />

                              <TaskSettings 
                                className='w-[17px] h-[17px] cursor-pointer hover:text-blue-500 duration-150 ease-in-out transition-all transform active:translate-y-[2px] mr-3'
                                onClick={() => setIsTasksModalOpen(true)} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                              />

                              {
                                tierS(uid as string, project, layer, repo) && 
                                  (
                                    <CloudSatelliteConfig
                                    className='w-[17px] h-[17px] cursor-pointer hover:text-slate-600 duration-150 ease-in-out transition-all transform active:translate-y-[2px] mr-2'
                                    onClick={() => setIsRepoFormOpen(true)} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                      />                              
                                  )                           
                              }

                              <InformationOutline 
                                className='w-[19px] h-[19px] cursor-pointer hover:text-green-500 duration-150 ease-in-out transition-all transform active:translate-y-[2px] mr-2'
                                onClick={() => setIsRepoInfoOpen(true)} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                              />

                              <button 
                                className='flex items-center justify-center w-[60px] h-[25px] text-[13px] hover:bg-blue-200 rounded-lg transition-all glassi border-[1px] border-gray-400  duration-150 ease-in-out transform active:translate-y-[2px]'
                                onClick={() => setOpenBranches(!openBranches)}>
                                
                                {currentBranch} <ArrowDropDownOutlined className='w-[17px] h-[17px]' onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                              </button> 
                              {
                                openBranches && (
                                  <div className='absolute z-10 flex flex-col min-w-[150px] bg-white border-[1px] border-black top-8 left-[55px] rounded-md p-1 '>
                                    
                                    <div className='text-center w-full py-2 text-sm font-semibold'>Branches</div>

                                    <div className='flex flex-col max-h-60 overflow-y-auto'>
                                      {repo?.branches.map(branch => (
                                        <button 
                                          key={branch?._id}
                                          className={`flex justify-center items-center py-2  text-sm hover:bg-blue-200 transition-colors duration-100 ${branch.name === currentBranch ? 'bg-blue-100' : ''} `}
                                          onClick={() => handleLoadNewBranch(branch.name)}
                                        >
                                          {branch.name} {branch.default && <span className="w-[50px] text-[9px] px-1 ml-2 bg-green-100 rounded-extra border-[1px] h-[19px] border-black">default</span>}
                                        </button>
                                      ))}
                                    </div>

                                  </div>
                                )
                              }                        
                        </div>
                    </div> 

                    <FileTree 
                        branch={currentBranch} 
                        files={files} 
                        repo={repo as RepositoryBase} 
                        setFiles={setFiles} 
                        setSelectedFileContent={setSelectedFileContent} 
                        setSelectedFileName={setSelectedFileName} 
                        selectedFileName={selectedFileName}
                        onFileClick={loadFileContent} 
                        onFolderClick={loadFolderContents}  
                      />
                  </div>
  
                    {/* File content */}
                    <div id='fileContent' className={`flex flex-grow relative h-full max-h-[92.6vh] overflow-x-auto ${ getExtension() ? 'bg-white' : 'bg-[#282a36]' }`}>
                        {

                          selectedFileName && getExtension(selectedFileName) 
                          ? (
                              <div className="markdown-body custom-markdown border-2 w-full p-10 max-h-[750px] overflow-y-auto">
                                  <ReactMarkdown children={selectedFileContent}  />
                                </div>
                            )

                          : selectedFileName ?           
                          (                    
                            <SyntaxHighlighter
                              language={getLanguageFromFileName(selectedFileName)}
                              style={dracula}
                              customStyle={{
                                marginTop: '0px',
                                padding: '15px',
                                borderRadius: '0px', // Establece el borderRadius a 0 para eliminar el borde redondeado
                                // height: '100%',
                                fontSize: '12px',
                                width: '100%'
                              }}
                              
                            >
                              {selectedFileContent === '' ? 'This file is empty.' :  `${selectedFileName}\n \n${selectedFileContent}`}                               
                            </SyntaxHighlighter>                        
                          )
                          : 
                          (
                            <div className="flex flex-col flex-grow items-center justify-center">
                              <h2 className="text-xl font-semibold mb-2 text-white">Select a file to see its content</h2>
                              <p className="text-white">Click on a file in the list on the left</p>
                            </div>
                          )      
                        }

                        {
                          selectedFileContent !== '' && (
                            <button className='absolute z-10 text-white bottom-5 right-6'>
                                <Icon>
                                  <ExpandSharp onClick={() => setIsCodeOnBigScreenOpen(!isCodeOnBigScreenOpen)} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                </Icon>
                            </button>
                          )
                        }
                    </div>                             
              </div>

            )
      }
    </div>
  );
};