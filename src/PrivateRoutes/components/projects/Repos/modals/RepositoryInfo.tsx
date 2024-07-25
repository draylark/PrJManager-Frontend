import React, { useState, useEffect } from 'react'
import { ImCancelCircle } from "react-icons/im";
import formbg from '../../../../assets/imgs/formbg.jpg'
import { PuffLoader  } from 'react-spinners';
import { TaskComplete, TaskView, TaskRemove,} from '@ricons/carbon'
import GitCompare from '@ricons/tabler/GitCompare';
import { Locked } from '@ricons/carbon'
import { TfiWorld } from "react-icons/tfi";
import { GoIssueOpened } from "react-icons/go";
import { RepoHeatMap } from '../RepoHeatMap';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { RepositoryBase } from '../../../../../interfaces/models/repository';
import { capitalizeFirstLetter } from '../../../../helpers/helpers';


interface RepositoryInfoProps {
    uid: string;
    repo: RepositoryBase;
    instructions: string;
    isRepoInfoOpen: boolean;
    setRepoInfoOpen: React.Dispatch<React.SetStateAction<boolean>>;

}

export const RepositoryInfo: React.FC<RepositoryInfoProps> = ({ uid, repo, instructions, isRepoInfoOpen, setRepoInfoOpen }) => {
    const [modalOpacity, setModalOpacity] = useState(0);
    const [isBackgroundReady, setIsBackgroundReady] = useState(false);      
    const [areInstructionsOpen, setAreInstructionsOpen] = useState(false)

  
    const handleClose = () => {
      if (isRepoInfoOpen) {
        setModalOpacity(0);
        setTimeout(() => {
          setRepoInfoOpen(false);
        }, 700);
      }
    };

    useEffect(() => {
        const preloadImage = new Image(); // Crea una nueva instancia para cargar la imagen
        preloadImage.src = formbg;
    
        preloadImage.onload = () => {
          setIsBackgroundReady(true); // Indica que la imagen ha cargado
        };
    }, []);

    useEffect(() => {
      if (isRepoInfoOpen) {
        const timer = setTimeout(() => setModalOpacity(1), 20);
        return () => clearTimeout(timer);
      } else {
        setModalOpacity(0);
      }
    }, [isRepoInfoOpen]);

    return (
      <div className="fixed flex w-screen h-full top-0 right-0 justify-center items-center bg-black/30 z-50">
        <div
          style={{
            opacity: modalOpacity,
            transition: 'opacity 300ms ease-in-out, height 300ms ease-in-out, background 300ms ease-in-out',
            backgroundImage: isBackgroundReady ? `url(${formbg})` : 'none',
            backgroundPosition: 'center center'
          }}
          className="flex flex-col w-[65%] min-h-[700px] max-h-[700px] rounded-extra glass2 border-[1px] border-gray-400"
        >
          {

            !isBackgroundReady ? (
              <div className="flex flex-grow justify-center items-center">
                <PuffLoader color="#ffffff" size={50} />
              </div>
            ) : (

              <>
                  <div className={`flex justify-between w-[95%] h-12 ml-auto mr-auto mt-2 p-2 ${ !areInstructionsOpen ? 'border-b-2 border-b-gray-500' : ''}`}>
                    <h1 className="text-xl font-bold text-black">{repo.name}</h1>

                    <div className='flex space-x-8 items-center'>
                        <button 
                            onClick={() => setAreInstructionsOpen(!areInstructionsOpen)}
                            className='hover:text-blue-500 trasition-colors duration-100'>
                                { areInstructionsOpen ? 'Close Instructions' : 'How to use PrJConsole?' }
                            </button>
                        <p className={`flex glassi items-center px-4 text-[12px] py-1  rounded-extra border-[1px] border-gray-400 ${repo.visibility === 'restricted' ? 'bg-[#00BFFF]/40' : repo.visibility === 'internal' ? 'bg-[#FFEF00]/40' : 'bg-[#ED2939]/40' } `}>
                          <span className='mr-1'>
                            {
                                repo.visibility === 'restricted' ? 
                                    <Locked className='w-4 h-4' onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}/>
                                :
                                repo.visibility === 'internal' ?
                                    <GoIssueOpened/>
                                :
                                <TfiWorld className='w-4 h-4'/>
                            }
                            </span> {capitalizeFirstLetter(repo.visibility)}
                        </p>
                    <button onClick={handleClose}>
                      <ImCancelCircle />
                    </button>
                    </div>
                  </div>
        
                  {
                    !areInstructionsOpen 
                    ? (
                          <>           
                              <div>
                                  <div className="flex flex-wrap  mt-4 text-gray-700  px-4 pl-5">
                                      <p className='px-4 py-1 rounded-extra glassi text-[13px] border-[1px] border-gray-400 mr-4 mt-2'>
                                      <strong>Default Branch:</strong> {capitalizeFirstLetter(repo.defaultBranch)}
                                      </p>
                                      <p className='px-4 py-1 rounded-extra glassi bg-green-300/60  text-[13px] border-[1px] border-gray-400 mr-4 mt-2'>
                                      Branches {repo.branches.length}
                                      </p>
                                      <div className='flex px-4 py-1 rounded-extra glassi bg-yellow-400/60 text-[13px] border-[1px] border-gray-400 mr-4 mt-2'>
                                      <GitCompare className='w-5 h-5 mr-2' onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}/>  57 Commits
                                      </div>
                                      <div className='flex px-4 py-1 rounded-extra glassi  bg-blue-400/60 text-[13px] text-white border-[1px] border-gray-400 mr-4 mt-2'>
                                      <TaskComplete className='w-5 h-5 mr-2' onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}/>  20 Completed
                                      </div>
                                      <div className='flex px-4 py-1 rounded-extra glassi  bg-yellow-200/60 text-[13px] border-[1px] border-gray-400 mr-4 mt-2'>
                                      <TaskView className='w-5 h-5 mr-2' onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}/>  5 Waiting For Approval
                                      </div>
                                      <div className='flex px-4 py-1 rounded-extra glassi  bg-red-400/60 text-[13px] text-white border-[1px] border-gray-400 mr-4 mt-2'>
                                      <TaskRemove className='w-5 h-5 mr-2' onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}/>  17 Pending
                                      </div>
                                  </div>

                                  <div className="flex flex-col w-[95%] text-5xl ml-auto mr-auto mt-4 text-gray-700">
                                      <p className='font-semibold line-clamp-3' style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                                          {capitalizeFirstLetter(repo.description)}
                                      </p>
                                  </div>
                              </div>


                              <div className='flex flex-grow justify-center items-end pb-6'>
                                  <RepoHeatMap uid={uid} repository={repo}/>
                              </div>
                          </>
                      ) 
                      : (
                          <div className='flex flex-grow overflow-y-auto rounded-b-extra'>
                              <SyntaxHighlighter
                                  language="javascript"
                                  style={dracula}
                                  customStyle={{
                                      marginBottom: '0px',
                                      padding: '15px',
                                      borderRadius: '0px', // Establece el borderRadius a 0 para eliminar el borde redondeado
                                      height: '100%',
                                      fontSize: '12px',
                                      width: '100%'
                                  }}
                                  
                              >
                                  {instructions}                               
                              </SyntaxHighlighter>  

                          </div>
                      )
                  }           
              </>
            )
          }

        </div>
      </div>
    );
  };
