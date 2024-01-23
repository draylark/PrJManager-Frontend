import  { useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { RootState } from '../../../../store/store';
import { ArrowBackUp } from '@ricons/tabler'
import { ReloadSharp } from '@ricons/ionicons5'
import { Icon } from '@ricons/utils';
import { loadFolderContents, loadFileContent } from '../helpers/repos-fn'
import { FileTree } from './FileTree';
import LoadingCircle from '../../../../auth/helpers/Loading';

import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const Repository = () => {


  const navigate = useNavigate();
  const location = useLocation();
  const { repositories } = useSelector((state: RootState) => state.platypus);

  const [files, setFiles] = useState<[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFileContent, setSelectedFileContent] = useState('');

  const projectId = location.state?.projectId;
  const layerId = location.state?.layerId;
  const repoId = location.state?.repoId;
  const repo = repositories.find((repo) => repo._id === repoId);




  const loadRepoFiles = async() => {
    setLoadingFiles(true);
    try {
      const response = await axios.get(`${backendUrl}/gitlab/loadRepoFiles/${repo.gitlabId}`)

      if( response.status !== 200 ) console.log("Error", response)     
      setFiles(response.data.files)

    } catch (error) {      
      console.log(error)
      

    } finally {
      setLoadingFiles(false);
    }             
  }

  useEffect(() => {
    loadRepoFiles()
  }, [repo.gitlabId])
        

  const gitInstructions = `
    ${repo.name} Repository Instructions

    Create a new repository

    git clone ${repo.gitUrl}
    cd ${repo.name}
    git switch --create main
    touch README.md
    git add README.md
    git commit -m "add README"
    git push --set-upstream origin main

    Push an existing folder

    cd existing_folder
    git init --initial-branch=main
    git remote add origin ${repo.gitUrl}
    git add .
    git commit -m "Initial commit"
    git push --set-upstream origin main

    Push an existing Git repository

    cd existing_repo
    git remote rename origin old-origin
    git remote add origin ${repo.gitUrl}
    git push --set-upstream origin --all
    git push --set-upstream origin --tags
        `
  ;



    if (!repo) return <div>Repository not found</div>;
    if( loadingFiles ) return <LoadingCircle/>

    return (
      <div className="flex h-full">
          {
              files.length === 0 ?
              (
                <div className="flex flex-col w-full h-full">
                  <div className="flex items-center justify-between mb-3">
                    <button className="flex items-center space-x-2" onClick={() => navigate(-1)}>
                      <Icon size={20}>
                        <ArrowBackUp />
                      </Icon>
        
                    </button>
                    <button className="flex items-center space-x-2" onClick={() => loadRepoFiles()}>
                      <Icon size={18}>
                        <ReloadSharp />
                      </Icon>
                    </button>
                  </div>
                  <div>

                  </div>

                  <div className='overflow-y-auto'>
                      <SyntaxHighlighter  language="bash" style={dracula}>
                        {gitInstructions}
                      </SyntaxHighlighter>
                  </div>

                </div>
              )
              :
              (
                
                <>                   
                    <div className="w-1/3 overflow-y-auto overflow-x-auto p-5 glass2 border-1 border-gray-400">
                      <div className="flex items-center justify-between mb-3">
                        <button className="flex items-center space-x-2" onClick={() => navigate(-1)}>
                          <Icon size={20}>
                            <ArrowBackUp />
                          </Icon>
            
                        </button>
                        <button className="flex items-center space-x-2" onClick={() => loadRepoFiles()}>
                          <Icon size={18}>
                            <ReloadSharp />
                          </Icon>
                        </button>
                      </div>

                      <h1 className='font-bold text-xl mb-5' >{ repo.name } Repository Files</h1>                         
                        <FileTree files={files} repo={repo} setFiles={setFiles} setSelectedFileContent={setSelectedFileContent} setSelectedFileName={setSelectedFileName} onFileClick={loadFileContent} onFolderClick={loadFolderContents}  />
                    </div>
    
                      {/* File content */}
                      <div className="w-2/3 p-5 overflow-y-auto">
                        {
                          selectedFileName ? 
                          (
                            <div className='flex flex-col'>
                              <h2 className="text-xl font-semibold mb-2">{selectedFileName}</h2>
                              <div className="bg-white text-black rounded p-4 h-full ">
                                <SyntaxHighlighter language="javascript" style={dracula}>
                                  {selectedFileContent}
                                </SyntaxHighlighter>
                              </div>
                            </div>
                          )
                          : 
                          (
                            <div className="flex flex-col items-center justify-center h-full">
                              <h2 className="text-xl font-semibold mb-2">Select a file to see its content</h2>
                              <p className="text-gray-500">Click on a file in the list on the left</p>
                            </div>
                          )      
                        }
                      </div>                             
                </>

              )

          }   
      </div>
    );
};