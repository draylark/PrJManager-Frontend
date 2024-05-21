import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { Typography } from '@mui/material';
import { FileIcon } from 'react-file-icon';
import ArrowCircleDown48Regular from '@ricons/fluent/ArrowCircleDown48Regular'
import { ArrowHookUpLeft16Regular } from '@ricons/fluent'
import { Accordion, AccordionDetails, Breadcrumbs, TextField, Tooltip } from '@mui/material';
import { cleanUrl } from '../helpers/helpers';
import { ArrowDropDownOutlined } from '@ricons/material'
import FileCodeRegular from '@ricons/fa/FileCodeRegular'
import { CodeOnBigScreen } from './modals/CodeOnBigScreen';
import ArrowRightCircle from '@ricons/tabler/ArrowRightCircle'
import FileSearchOutlined from '@ricons/antd/FileSearchOutlined'
import { PuffLoader  } from 'react-spinners';

export const Commit = () => {

    const location = useLocation()
    const navigate = useNavigate()

    const commitHash = location.state.commitHash

    const layer = location.state.layer;
    const project = location.state.project;    
    const repository = location.state.repository;

    const [selectedFileName, setSelectedFileName] = useState('')
    const [selectedFileContent, setSelectedFileContent] = useState('')
    const [isCodeOnBigScreenOpen, setIsCodeOnBigScreenOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [commitBranches, setCommitBranches] = useState([])
    const [commitsDiff, setCommitsDiff] = useState(null)
    const [expanded, setExpanded] = useState(null);

    const [showFileSelector, setShowFileSelector] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [diffFilter, setDiffFilter] = useState('')

    const getExtension = (fileName) => {
        const extension = fileName.split('.').pop()?.toLowerCase() || '';
        return extension === 'md' ? true : false
    };

    const fetchCommitDiff = async () => {
        try {
            const { data: { diff, branches } } = await axios.get(`http://localhost:3000/api/commits/${repository.repoID}/diff/${commitHash}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('x-token')
                }
            })

            setCommitsDiff(diff)
            setCommitBranches(branches)
            setIsLoading(false)
        } catch (error) {
            console.error("Error fetching commit diff:", error)
        } 
    }

    const countChanges = (diffText) => {
        let additions = 0;
        let deletions = 0;
      
        diffText.split('\n').forEach((line) => {
          if (line.startsWith('+') && !line.startsWith('+++')) {
            additions += 1;
          } else if (line.startsWith('-') && !line.startsWith('---')) {
            deletions += 1;
          }
        });
      
        return { additions, deletions };
      };


    const parseAndStyleDiff = (diffText) => {
        return diffText.split('\n').filter(line => !line.startsWith('@@')).map((line, index) => {
            let bgColor = '#f6f8fa'; // Fondo para líneas neutras
            let textColor = '#24292e'; // Texto para líneas neutras
            if (line.startsWith('+')) {
                bgColor = '#e6ffed'; // verde para líneas añadidas
                textColor = '#22863a';
            } else if (line.startsWith('-')) {
                bgColor = '#ffeef0'; // rojo para líneas eliminadas
                textColor = '#cb2431';
            }
            return (
                <Typography key={index} component="span" sx={{ display: 'block', backgroundColor: bgColor, color: textColor, fontFamily: 'monospace', padding: '2px 5px', fontSize: '12px' }}>
                    {line}
                </Typography>
            );
          });

    };

    const cleanDiffContent = (diffText) => {
        return diffText
            .split('\n')
            // Filtrar líneas no deseadas
            .filter(line => !line.startsWith('@@') && !line.endsWith('\ No newline at end of file'))
            .map(line => {
                // Eliminar los símbolos "+" y "-" de las líneas modificadas, pero mantener el texto
                if (line.startsWith('+') || line.startsWith('-')) {
                    return line.substring(1);
                }
                return line;
            })
            .join('\n');
    };

    const filteredDiffs = useMemo(() => {

        if (commitsDiff === null) {
            return [];
        }

        return commitsDiff.filter((diff) => {
            if (diffFilter === '') {
                return true;
            }
            return diff.new_path === diffFilter;
        });

    }, [commitsDiff, diffFilter])


    useEffect(() => {
        fetchCommitDiff()
    }, [commitHash, repository.repoID])

    useEffect(() => {
        if( commitsDiff && commitsDiff.length === 1 ) {
            setExpanded(0)
        }
    }, [commitsDiff])


  return (
    
    <div className='relative flex flex-col space-y-1 items-center  w-full  h-full overflow-y-auto overflow-x-hidden '>
        <div className='flex w-full justify-between px-5'>
            <div className='flex items-center pb-3'>
                <ArrowHookUpLeft16Regular className='w-5 h-5  cursor-pointer' onClick={() => navigate(-1)} />    

                <Breadcrumbs sx={{marginLeft: 1}} aria-label="breadcrumb">               
                    <button
                        className='text-[12px] hover:text-pink-300 transition-colors duration-500'                            
                        onClick={() => navigate(`/projects/${cleanUrl(project.name)}/${cleanUrl(layer.layerName)}`, {
                            state: {
                                project: project,
                                layer: layer
                            }
                        })}
                    >
                        {layer.layerName}
                    </button>
                    <button
                        className='text-[12px] hover:text-green-500 transition-colors duration-500'                            
                        onClick={() => navigate(-2)}
                    >
                        {repository.repoName}
                    </button>

                    <span 
                        className='text-[12px]'
                    >
                        {commitHash.slice(0, 7)} {/* Muestra solo los primeros 7 caracteres del hash */}
                    </span>
                </Breadcrumbs>

                <ArrowRightCircle className='w-5 h-5 ml-3' />

                <span className='text-[13px] ml-3 mb-[2px] font-semibold'>
                    {commitBranches[0]}
                </span>

                {commitBranches.length > 1 && (
                    <Tooltip
                        title={
                            <div className='flex flex-col'>
                                <div>The commit is available on the following branches:</div>
                                <ul className='flex flex-wrap'>
                                    {commitBranches.map((branch, index) => (
                                        <li className='font-semibold ml-2' key={index}>{branch} { index !== commitBranches.length -1 && "-" }</li> 
                                    ))}
                                </ul>
                            </div>
                        }
                        placement="bottom"
                    >
                        <span
                            className='text-[10px] ml-1 text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer'
                        >
                            +{commitBranches.length - 1} more
                        </span>
                    </Tooltip>
                )}
            </div>

            <div>
                <button
                    className="myButtonStyle mr-1 text-[13px] flex items-center py-1 px-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                    onClick={() => {
                        setExpanded(-1)
                        setDiffFilter('')
                        setShowFileSelector(!showFileSelector)
                    }}
                >
                    Changed Files <ArrowDropDownOutlined className='w-5 h-5 ml-2' />
                </button>
                
                    <div id='files-searcher' className={`absolute flex flex-col space-y-3 bg-white border-[1px] border-black z-10 ${ showFileSelector ? 'right-6' : '-right-[350px]'} transition-all duration-300 top-10 p-4 rounded-bl-2xl`}>    
                        <TextField
                            type="text"
                            placeholder="Search modified files.."
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />
                        <div className="flex flex-col filesList max-h-[300px] overflow-y-auto">
                            {
                                commitsDiff === null 
                                ? <Typography variant="h7">No files found</Typography>
                                : commitsDiff 
                                    .filter((diff) => diff.new_path.includes(filterText))                     
                                    .map((diff, index) => {                                
                                        const { additions, deletions } = countChanges(diff.diff);
                                        return (
                                            <button 
                                                key={index} 
                                                className="flex justify-between fileNme mb-2 border-b-[1px] border-gray-400 p-3 items-center hover:bg-blue-100 transition-colors duration-200"
                                                onClick={() => {
                                                    setDiffFilter(diff.new_path)
                                                    setShowFileSelector(false)
                                                }}
                                            > 

                                                <div className='flex items-center'>
                                                    <FileCodeRegular className='w-4 h-4 mr-2' />               
                                                    <span className='text-[13px]'>{diff.new_path}</span>               
                                                </div> 

                                                <div className='flex space-x-3'>
                                                    <span className='text-green-600 text-[13px]'>+{additions}</span> 
                                                    <span className='text-red-600 text-[13px]'>-{deletions}</span>
                                                </div>    
                                            </button>
                                        )}                 
                                    )
                            }
                        </div>
                    </div>
                
            </div>

        </div>

        <div className='flex flex-col flex-grow max-h-[690px] w-[96%] overflow-y-auto py-4 space-y-4 border-t-[1px] border-black'>
            {
                isLoading
                ? ( 
                    <div className='flex flex-grow items-center justify-center'>
                        <PuffLoader  color="#32174D" size={50} /> 
                    </div>                         
                  )
                :  filteredDiffs.map((diff, index) => {             
                    const { additions, deletions } = countChanges(diff.diff);
                    
                    return (
                        <Accordion 
                            key={index} 
                            expanded={expanded === index}
                            onChange={() => setExpanded(expanded === index ? -1 : index)} // Aquí es donde se hace la corrección
                            className={`w-full`}
                            // ref={(el) => accordionRefs.current[commit.commit_hash] = el}
                            >
                            <div className="flex flex-col w-full p-4 rounded shadow-lg  bg-white hover:bg-gray-100 transition-colors border-[1px] border-blue-500">
                            
                            <div className='flex justify-between'>
                                <div className='flex space-x-3 items-center'>
                                    <div className='w-7 h-7'>
                                        <FileIcon  
                                            type="code" 
                                            color="#1254F8"
                                            gradientColor="#00D2FF"
                                            gradientOpacity={1}
                                            fold={false}
                                            radius={6}

                                            glyphColor="rgba(255,255,255,0.6)"
                                        />
                                    </div>
                                    <Typography variant="h7" >{diff.new_path}</Typography>
                                </div>

                                <div className='flex space-x-5 items-center'>                          
                                    <div className='flex space-x-4'>
                                        <span className='text-green-600'>+{additions}</span> 
                                        <spann className='text-red-600'>-{deletions}</spann>
                                    </div>
                              
                                        <FileSearchOutlined 
                                            className='w-6 h-6 cursor-pointer hover:text-blue-600 transition-colors duration-500' 
                                            onClick={() => {
                                                const cleanedContent = cleanDiffContent(diff.diff);
                                                setSelectedFileContent(cleanedContent);
                                                setIsCodeOnBigScreenOpen(true); // Asegúrate de que la pantalla de código esté abierta
                                                setSelectedFileName(diff.new_path);
                                            }}
                                        />
                                        <ArrowCircleDown48Regular 
                                            className='w-6 h-6 cursor-pointer hover:text-blue-600 transition-colors duration-500' 
                                            onClick={() => setExpanded(expanded === index ? -1 : index)} 
                                        />
                                    
                                </div>

                            </div>

                            </div>
                            <AccordionDetails >
                            {                                                      
                                isLoading 
                                ? ( 
                                    <div className='flex flex-grow items-center justify-center'>
                                        <PuffLoader  color="#32174D" size={50} /> 
                                    </div>                         
                                  )
                                :                                     
                                <div className='p-3 max-h-[500px] overflow-y-auto'>
                                    {parseAndStyleDiff(diff.diff)}
                                </div>
                            }
                            </AccordionDetails>
                        </Accordion>


                )})
            }
        </div>


        { isCodeOnBigScreenOpen 
            && <CodeOnBigScreen 
                    getExtension={getExtension} 
                    isCodeOnBigScreenOpen={isCodeOnBigScreenOpen} 
                    setIsCodeOnBigScreenOpen={setIsCodeOnBigScreenOpen}  
                    fileContent={selectedFileContent} 
                    fileName={selectedFileName}
                />                                   
        }  
    </div>
  )
}
