import { useState, useEffect, useRef } from 'react'
import { ImCancelCircle } from "react-icons/im";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getLanguageFromFileName } from '../../../projects/Repos/helpers/repos-fn';
import { ScaleLoader } from 'react-spinners';
import { IoIosArrowForward, IoIosArrowBack  } from "react-icons/io";
const backendUrl = import.meta.env.VITE_BACKEND_URL
import { CommitForWTask } from '../../../../../interfaces/models';
import { getInitialsAvatar } from '../../../projects/helpers/helpers';

interface Diff {
  uuid1: string;
  uuid2: string;
  diffData: {
    diffs: {
      new_path: string;
      old_path: string;
      diff: string;
    }[]
  }

}
interface DiffData {
  hash: string;
  diffs: {
    new_path: string;
    old_path: string;
    diff: string;
  }[]
}
interface DiffReference {
  hash: string; 
  new: boolean | undefined
}
interface DiffModalProps {
  isDiffModalOpen: boolean;
  setIsDiffModalOpen: (isOpen: boolean) => void;
  commits: CommitForWTask[];
  selecteDiffData: DiffReference;
}

export const DiffModal: React.FC<DiffModalProps> = ({ isDiffModalOpen, setIsDiffModalOpen, commits, selecteDiffData }) => {

  const [errorMessage, setErrorMessage] = useState(null)
  const [errorWhileFetching, setErrorWhileFetching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [leftWidth, setLeftWidth] = useState(70);  
  const [diff1, setDiff1] = useState<DiffReference>({ hash: selecteDiffData.hash || '', new: selecteDiffData.new || undefined })
  const [diff2, setDiff2] = useState<DiffReference>({ hash: '', new: undefined })

  const [diff, setDiff] = useState<Diff | null>(null)
  const [diffData1, setDiffData1] = useState<DiffData | null>(null)
  const [diffData2, setDiffData2] = useState<DiffData | null>(null)

  const [diffIndex, setDiffIndex] = useState(0)
  const [diff1Index, setDiff1Index] = useState(0)
  const [diff2Index, setDiff2Index] = useState(0)

  const [buttonWidth, setButtonWidth] = useState<number | undefined | null>(null);
  const ref = useRef<HTMLButtonElement | null>(null);
    

  const formatDate = (date: string) => {
      const formattedDate = new Date(date).toLocaleDateString();
      return formattedDate;
  };

  const handleClose = () => {
      const modal = document.getElementById('diffModal');
      if (modal) {
          modal.classList.replace('opacity-100', 'opacity-0');
          setTimeout(() => {
              setIsDiffModalOpen(false);
          }, 500);
      }
  };

  const diffToFetch = (hash: string) => {
    if( diff1.hash === hash) {
      setDiff1({ hash: '', new: undefined })
    } else if( diff2.hash === hash) {
      setDiff2({ hash: '', new: undefined })
    } else if ( diff1.new === undefined ) {
      setDiff1({ hash, new: true })
    } else if (!diff1.new) {
      setDiff1({ hash, new: true })
    } else {
      setDiff2({ hash, new: true })
    }
  };

  const fetchDiffs = () => {
    setDiffData1(null)
    setDiffData2(null)
    setDiff(null)
    if( diff1.hash || diff2.hash ) {
      setIsLoading(true)
      axios.get(`${backendUrl}/gitlab/diff`, {
        params: {
          uuid1: diff1.hash || '',
          uuid2: diff2.hash || ''
        }
      })
      .then((res) => {
        console.log( res )

        if( res.data.type === 'one-diff'){
          const { commit1 } = res.data
          setDiffData1({ hash: commit1.hash, diffs: commit1.diffs })
          setLeftWidth(100)
        }
        else if (res.data.type == 'no-diff') {
          const { commit1, commit2 } = res.data
          setDiffData1({ hash: commit1.hash, diffs: commit1.diffs })
          setDiffData2({ hash: commit2.hash, diffs: commit2.diffs })
          setLeftWidth(95)
        } else {
          setDiff(res.data)
        }

        setDiff1( prev => {
          return { ...prev, new: false }
        })
        setDiff2( prev => {
          return { ...prev, new: false }
        })
        setIsLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setIsLoading(false)
        setErrorWhileFetching(true)
        setErrorMessage(err.response.data.message || 'There was an error while fetching repository tasks.')
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Select at least 1 commit.'
      })
    }
  };


  useEffect(() => {
    if(ref.current){
      setButtonWidth(ref.current.offsetWidth);
      const handleResize = () => setButtonWidth(ref?.current?.offsetWidth);

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [leftWidth]);
  
  useEffect(() => {
      if (isDiffModalOpen) {
        const timer = setTimeout(() => {
          document.getElementById('diffModal')?.classList.remove('opacity-0');
          document.getElementById('diffModal')?.classList.add('opacity-100');
        }, 20);
        return () => clearTimeout(timer);
      }
  }, [isDiffModalOpen]);

  useEffect(() => {

    const resizer: HTMLElement | null = document.getElementById('resizer');
    const container: HTMLElement | null = resizer?.parentNode as HTMLElement | null;

    let startX = 0;
    let startWidth = leftWidth;

    const startResizing = (
      mouseDownEvent: MouseEvent
    ) => {
        startX = mouseDownEvent.clientX;
        startWidth = leftWidth;
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResizing);
        mouseDownEvent.preventDefault();
    };

    const resize = ( mouseMoveEvent: MouseEvent) => {
      if(!container) return
        const delta = mouseMoveEvent.clientX - startX;
        const maxWidthRight = 365; // Máximo ancho para el panel derecho
        const minWidthLeft = 853; // Mínimo ancho para el panel izquierdo
        let newLeftWidth = startWidth + (delta / container.offsetWidth) * 100;
        const rightWidth = 100 - newLeftWidth;

        if (container.offsetWidth * (rightWidth / 100) > maxWidthRight) {
            newLeftWidth = 100 - (maxWidthRight / container.offsetWidth * 100);
        } else if (container.offsetWidth * (newLeftWidth / 100) < minWidthLeft) {
            newLeftWidth = minWidthLeft / container.offsetWidth * 100;
        }

        setLeftWidth(newLeftWidth);
        mouseMoveEvent.preventDefault();
    };

    const stopResizing = () => {
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResizing);
    };

    resizer?.addEventListener('mousedown', startResizing);

    return () => {
        resizer?.removeEventListener('mousedown', startResizing);
    };
  }, [leftWidth]);


  useEffect(() => {
    if(selecteDiffData.hash !== ''){
      fetchDiffs()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selecteDiffData])
  

  return (
      <div className='fixed flex w-screen h-full pb-5 top-0 right-0 justify-center items-center bg-black/30 z-50'>
          <div id="diffModal"
              className={`overflow-hidden flex flex-col w-[70%] md:w-[80%] md:max-h-[735px] md:h-[735px] items-center rounded-2xl glassi bg-white border-[1px] border-gray-400 transition-opacity duration-300 ease-in-out opacity-0 ${isDiffModalOpen ? '' : 'pointer-events-none'}`}
          >
              <div className='flex justify-between w-[95%] h-12 ml-auto mr-auto mt-2 p-2'>
                  <p className='text-xl text-black'>Hashes Reviewer</p>
                  <button onClick={handleClose}>
                        <ImCancelCircle/>
                  </button>
              </div>
              <div className='flex w-full h-full relative'>
                  <div id="left-panel" style={{ width: `${leftWidth}%` }} className="flex bg-[#282a36]">

                    {
                      isLoading 
                      ? 
                        ( <div className='flex flex-grow items-center justify-center'>
                            <ScaleLoader  color="#FFFFFF" /> 
                          </div> 
                        ) 
                      :
                      errorWhileFetching 
                      ? 
                        (
                          <div className='flex w-full h-full items-center justify-center'>
                            <h1 className='text-red-500'>{errorMessage}</h1>
                          </div>
                        )
                      :
                      diff 
                      ? (
                        <div className='relative flex flex-col flex-grow overflow-x-auto'>
                            <div className='flex flex-col pl-4 py-2'>
                              <h2 className="flex items-center font-mono text-yellow-200 text-[14px] rounded">
                                 Differences found between the hashes:
                                 <p className='font-bold text-white text-[12px] truncate w-[120px] ml-2 mr-2'>{diff.uuid1}</p> 
                                 - 
                                 <p className='font-bold text-white text-[12px] truncate w-[120px] ml-2'>{diff.uuid2}</p> 
                              </h2>
                              <h2 className="text-green-400 text-lg font-semibold">
                                {
                                  diff.diffData.diffs[diffIndex].new_path === diff.diffData.diffs[diffIndex].old_path 
                                  ? `${diff.diffData.diffs[diffIndex].new_path}` 
                                  : `${diff.diffData.diffs[diffIndex].old_path} => ${diff.diffData.diffs[diffIndex].new_path}`
                                }
                              </h2>
                            </div>
                            <div className='flex flex-grow max-h-[623px] overflow-y-auto pl-2'>
                              <SyntaxHighlighter 
                                language={getLanguageFromFileName(diff.diffData.diffs[diffIndex].new_path)} 
                                style={dracula}
                                customStyle={{
                                  marginTop: '0px',
                                  padding: '15px',
                                  borderRadius: '0px', // Establece el borderRadius a 0 para eliminar el borde redondeado
                                  height: '100%',
                                  fontSize: '12px',
                                  width: '100%'
                                }}                              
                                >
                                {`${diff.diffData.diffs[diffIndex].diff}`}
                              </SyntaxHighlighter>
                            </div>

                            {
                              diff.diffData.diffs.length > 0 && (
                                <div className={`absolute flex ${ diffIndex > 0 ? 'justify-between' : 'justify-end'} bottom-0 w-full px-5 py-5`}>
                                  {
                                    diffIndex > 0 && (
                                      <button 
                                        onClick={() => setDiffIndex( diffIndex - 1 )}>
                                        <IoIosArrowBack size={25} className='text-white hover:text-blue-200 transition-all duration-150 ease-in-out transform active:translate-y-[2px]'/>
                                      </button>   
                                    )
                                  }
                                  {
                                    diffIndex !== diff.diffData.diffs.length - 1 && (
                                      <button 
                                        onClick={() => setDiffIndex( diffIndex + 1 )}>
                                      <IoIosArrowForward size={25} className='text-white hover:text-blue-200 transition-all duration-150 ease-in-out transform active:translate-y-[2px]'/>
                                    </button>   
                                    )
                                  }                  
                                </div>
                              )
                            }

                        </div>
                        )
                      :
                      diffData1 && !diffData2 
                      ? (
                        <div className='relative flex flex-col flex-grow overflow-x-auto'>
                            <div className='flex flex-col pl-4 py-2'>
                              <h2 className="font-bold text-white text-[12px]">{diffData1.hash}</h2>
                              <h2 className="text-green-400 text-lg font-semibold">
                                {
                                  diffData1.diffs[diff1Index].new_path === diffData1.diffs[diff1Index].old_path 
                                  ? `${diffData1.diffs[diff1Index].new_path}` 
                                  : `${diffData1.diffs[diff1Index].old_path} => ${diffData1.diffs[diff1Index].new_path}`
                                }
                              </h2>
                            </div>
                            <div className='flex flex-grow pl-2 max-h-[618px] overflow-y-auto'>
                              <SyntaxHighlighter 
                                language={getLanguageFromFileName(diffData1.diffs[diff1Index].new_path)} 
                                style={dracula}
                                customStyle={{
                                  marginTop: '0px',
                                  padding: '15px',
                                  borderRadius: '0px', // Establece el borderRadius a 0 para eliminar el borde redondeado
                                  height: '100%',
                                  fontSize: '12px',
                                  width: '100%'
                                }}                              
                                >
                                {`${diffData1.diffs[diff1Index].diff}`}
                              </SyntaxHighlighter>
                            </div>

                            {
                              diffData1.diffs.length > 1 && (
                                <div className={`absolute flex ${ diff1Index > 0 ? 'justify-between' : 'justify-end'} bottom-0 w-full px-5 py-5`}>
                                  {
                                    diff1Index > 0 && (
                                      <button 
                                        onClick={() => setDiff1Index( diff1Index - 1 )}>
                                        <IoIosArrowBack size={25} className='text-white hover:text-blue-200 transition-all duration-150 ease-in-out transform active:translate-y-[2px]'/>
                                      </button>   
                                    )
                                  }
                                  {
                                    diff1Index !== diffData1.diffs.length - 1 && (
                                      <button 
                                        onClick={() => setDiff1Index( diff1Index + 1 )}>
                                      <IoIosArrowForward size={25} className='text-white hover:text-blue-200 transition-all duration-150 ease-in-out transform active:translate-y-[2px]'/>
                                    </button>   
                                    )
                                  }                  
                                </div>
                              )
                            }
                        </div>
                        )
                      :
                        diffData1 && diffData2  
                      ? ( 
                          <div className='flex flex-grow'>

                            <div className='relative flex flex-col w-1/2 border-r-[1px] border-white'>
                              <div className='flex flex-col pl-4 py-2'>
                                <h2 className="font-bold text-white text-[12px]">{diffData1.hash}</h2>
                                <h2 className="text-green-400 text-lg font-semibold">
                                  {
                                    diffData1.diffs[0].new_path === diffData1.diffs[0].old_path 
                                    ? `${diffData1.diffs[0].new_path}` 
                                    : `${diffData1.diffs[0].old_path} => ${diffData1.diffs[0].new_path}`
                                  }
                                </h2>
                              </div>
                              <div className='h-full pl-2 overflow-auto max-h-[623px]'>
                                <SyntaxHighlighter 
                                  language={getLanguageFromFileName(diffData1.diffs[0].new_path)} 
                                  style={dracula}
                                  customStyle={{
                                    marginTop: '0px',
                                    padding: '15px',
                                    borderRadius: '0px', // Establece el borderRadius a 0 para eliminar el borde redondeado
                                    height: '100%',
                                    fontSize: '12px',
                                    width: '100%'
                                  }}                              
                                  >
                                  {`${diffData1.diffs[0].diff}`}
                                </SyntaxHighlighter>
                              </div>

                              {
                                diffData1.diffs.length > 1 && (
                                  <div className={`absolute flex ${ diff1Index > 0 ? 'justify-between' : 'justify-end'} bottom-0 w-full px-5 py-5`}>
                                    {
                                      diff1Index > 0 && (
                                        <button 
                                          onClick={() => setDiff1Index( diff1Index - 1 )}>
                                          <IoIosArrowBack size={25} className='text-white hover:text-blue-200 transition-all duration-150 ease-in-out transform active:translate-y-[2px]'/>
                                        </button>   
                                      )
                                    }
                                    {
                                      diff1Index !== diffData1.diffs.length - 1 && (
                                        <button 
                                          onClick={() => setDiff1Index( diff1Index + 1 )}>
                                        <IoIosArrowForward size={25} className='text-white hover:text-blue-200 transition-all duration-150 ease-in-out transform active:translate-y-[2px]'/>
                                      </button>   
                                      )
                                    }                  
                                  </div>
                                )
                              }
                            </div>

                            <div className='relative flex flex-col w-1/2'>
                              <div className='flex flex-col pl-4 py-2'>
                                <h2 className="font-bold text-white text-[12px]">{diffData2.hash}</h2>
                                <h2 className="text-green-400 text-lg font-semibold">
                                  {
                                    diffData2.diffs[0].new_path === diffData2.diffs[0].old_path 
                                    ? `${diffData2.diffs[0].new_path}` 
                                    : `${diffData2.diffs[0].old_path} => ${diffData2.diffs[0].new_path}`
                                  }
                                </h2>
                              </div>
                              <div className='h-full pl-2 overflow-auto max-h-[623px]'>
                                <SyntaxHighlighter 
                                  language={getLanguageFromFileName(diffData2.diffs[0].new_path)} 
                                  style={dracula}
                                  customStyle={{
                                    marginTop: '0px',
                                    padding: '15px',
                                    borderRadius: '0px', // Establece el borderRadius a 0 para eliminar el borde redondeado
                                    height: '100%',
                                    fontSize: '12px',
                                    width: '100%'
                                  }}                              
                                  >
                                  {`${diffData2.diffs[0].diff}`}
                                </SyntaxHighlighter>
                              </div>

                              {
                                diffData2.diffs.length > 1 && (
                                  <div className={`absolute flex ${ diff2Index > 0 ? 'justify-between' : 'justify-end'} bottom-0 w-full px-5 py-5`}>
                                    {
                                      diff2Index > 0 && (
                                        <button 
                                          onClick={() => setDiff2Index( diff2Index - 1 )}>
                                          <IoIosArrowBack size={25} className='text-white hover:text-blue-200 transition-all duration-150 ease-in-out transform active:translate-y-[2px]'/>
                                        </button>   
                                      )
                                    }
                                    {
                                      diff2Index !== diffData2.diffs.length - 1 && (
                                        <button 
                                          onClick={() => setDiff2Index( diff2Index + 1 )}>
                                        <IoIosArrowForward size={25} className='text-white hover:text-blue-200 transition-all duration-150 ease-in-out transform active:translate-y-[2px]'/>
                                      </button>   
                                      )
                                    }                  
                                  </div>
                                )
                              }

                            </div>

                          </div>
                        )
                      : 
                        ( 
                          <div className="flex flex-col flex-grow items-center justify-center">
                            <h2 className="text-xl font-semibold mb-2 text-white">Select 1 or 2 hashes in the right panel to compare them or see their code.</h2>
                          </div>
                        )
                    }
  
                      
                  </div>

                  <div id="resizer" className="bg-gray-400 cursor-col-resize min-w-2"></div>

                  <div id="right-panel" style={{ width: `${100 - leftWidth}%` }} className="flex flex-col glassi">
                    {
                      commits.length > 0 
                      ? 
                      <div className='flex h-full flex-col'>
                          <div className='h-[580px] max-h-[580px] overflow-y-auto overflow-x-hidden mt-2'>
                              {commits.map((commit, index) => (
                                <div key={index} 
                                    onClick={() => diffToFetch(commit.uuid)}
                                    className={`${diff1.hash === commit.uuid || diff2.hash === commit.uuid ? 'border-2 border-blue-500' : null } flex w-full min-w-0 mx-auto items-center p-2 bg-white rounded shadow mb-2 pl-4 hover:bg-gray-300 transition-colors duration-200 cursor-pointer`}>
                                    <img 
                                      src={commit.author.photoUrl || getInitialsAvatar(commit.author.name)}  
                                      alt={commit.author.name} 
                                      className="w-9 h-9 rounded-full mr-3" 
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null; // Previene bucles infinitos en caso de que la imagen de las iniciales también falle
                                        target.src = getInitialsAvatar(commit.author.name); // Establece la imagen de las iniciales si la imagen principal falla
                                      }}
                                    />
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <div className='flex justify-between items-center pr-2'>
                                            <span className="text-[14px] font-semibold overflow-hidden whitespace-nowrap text-overflow-ellipsis">{commit.author.name}</span>
                                            <span className="text-[12px] font-semibold">{formatDate(commit.createdAt)}</span>
                                        </div>
                                        <span className="text-[14px] text-gray-600 overflow-hidden line-clamp-2  text-overflow-ellipsis">committed with hash <span className="font-mono bg-gray-100 rounded px-1">{commit.uuid}</span></span>
                                    </div>
                                </div>
                            ))}
                          </div>

                          <div className='flex flex-grow items-center justify-center w-full'>
                            <button 
                              ref={ref}
                              onClick={fetchDiffs} 
                              className={`w-[80%] transition-opacity duration-500 ${buttonWidth as number <= 100 ? 'opacity-0' : 'opacity-100'} ease-in-out transform active:translate-y-[2px] inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50`}
                            >
                              Find
                            </button>
                          </div>
                      </div>
                      :
                        <div className="flex flex-col flex-grow items-center justify-center">
                            <h2 className="text-xl font-semibold mb-2 text-slate-500">No hashes to see yet.</h2>
                        </div>
                    }


                </div>
              </div>
          </div>
      </div>
  )
}