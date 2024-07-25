
import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Icon } from '@ricons/utils';
import ArrowCircleDown48Regular from '@ricons/fluent/ArrowCircleDown48Regular'
import { Accordion, AccordionDetails } from '@mui/material';
import { TextField, Autocomplete, Select, MenuItem } from '@mui/material';
import LoadingCircle from '../../../../PublicRoutes/auth/helpers/Loading';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Avatar } from '@mui/material';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { RootState } from '../../../../store/store';
import { DedicatedCommit } from './hooks/useActivityData';
import { LayerBase, RepositoryBase } from '../../../../interfaces/models';

interface RenderCommitsProps {
  projectLayers: { label: string; value: string }[];
  projectRepositories: { label: string; value: string }[];
  commits: DedicatedCommit[];
  setRender: (value: React.SetStateAction<string>) => void;
  render: string;
}


export const RenderCommits = ({ projectLayers, projectRepositories, commits, setRender, render }: RenderCommitsProps) => {

  const accordionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const { layers, repositories } = useSelector((state: RootState) => state.platypus);

  const [isLoading, setIsLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null);
  const [layerID, setLayerID] = useState<string | null>(null)
  const [repoID, setRepoID] = useState<string | null>(null)
  const [layerInfo, setLayerInfo] = useState<LayerBase | null>(null);
  const [repoInfo, setRepoInfo] = useState<RepositoryBase | null>(null);
  const [repoTerm, setRepoTerm] = useState<string | null>(null)
  const [layerTerm, setLayerTerm] = useState<string | null>(null)
  const [repoFilter, setRepoFilter] = useState<string | null>(null)
  const [userFilter, setUserFilter] = useState<string | null>(null)
  const [hashFilter, setHashFilter] = useState<string | null>(null)
  const [layerFilter, setLayerFilter] = useState<string | null>(null)


  const handleExpandClick = (commitHash: string, layerID: string, repoID: string) => {
    const isExpanded = expanded === commitHash; // Verificar si el acordeón ya está expandido
    setExpanded(isExpanded ? null : commitHash); // 'null' para representar que se está cerrando
    setLayerID(isExpanded ? null : layerID)
    setRepoID(isExpanded ? null : repoID)

    if (!isExpanded) {
      // Esperar al próximo ciclo del evento para asegurar que la expansión se ha completado antes de desplazarse
      setTimeout(() => {
        const accordionElement = accordionRefs.current[commitHash]
        const container = document.querySelector('#container-scroll') // Asegúrate de que este selector coincida con tu contenedor          
        if (accordionElement && container) {

          const containerRect = container.getBoundingClientRect()
          const accordionRect = accordionElement.getBoundingClientRect()

          // Calcular la posición relativa del acordeón respecto al contenedor y ajustar el scrollTop del contenedor
          const scrollTop = accordionRect.top - containerRect.top + container.scrollTop
          container.scrollTo({ top: scrollTop, behavior: 'smooth' })
        }
      }, 0)

    }

  };

  const handleLayerAndRepoInformation = useCallback((layerID: string, repoID: string) => {
    setIsLoading(true)

    const layer = layers.filter(layer => layer._id === layerID)
    const repo = repositories.filter(repo => repo._id === repoID)
    const repoUrl = `${backendUrl}/repos/${repoID}`
    const layerUrl = `${backendUrl}/layer/get-layer/${layerID}`

    if (!layer[0] && !repo[0]) {
      axios.all([
        axios.get(repoUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('x-token')
          }
        }),
        axios.get(layerUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('x-token')
          }
        })
      ])
        .then(axios.spread((repo, layer) => {
          // console.log('Respuesta desde el thunk R:', repo)
          // console.log('Respuesta desde el thunk L:', layer)
          setRepoInfo(repo.data.repo)
          setLayerInfo(layer.data.layer)
          setIsLoading(false)
        }))
    } else if (layer[0] && !repo) {
      axios.get(repoUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('x-token')
        }
      })
        .then((repo) => {
          console.log('Respuesta desde el thunk R:', repo)
          setRepoInfo(repo.data.repo)
          setLayerInfo(layer[0])
          setIsLoading(false)
        })
    } else if (!layer && repo[0]) {
      axios.get(layerUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('x-token')
        }
      })
        .then((layer) => {
          setLayerInfo(layer.data.layer)
          setRepoInfo(repo[0])
          setIsLoading(false)
        })
    } else {
      setLayerInfo(layer[0])
      setRepoInfo(repo[0])
      setIsLoading(false)
    }
  }, [layers, repositories])

  const filteredCommits = useMemo(() => {

    if (!commits) return [];

    const filterCommits = (commits: DedicatedCommit[]) => commits.filter(commit => {
      // Verificar filtro de capa
      const layerPasses = layerFilter ? commit.layer === layerFilter : true;
      // Verificar filtro de repositorio
      const repoPasses = repoFilter ? commit.repository === repoFilter : true;
      // Verificar filtro de usuario
      const userPasses = userFilter ? commit.author.uid === userFilter : true;

      const hashPasses = hashFilter ? commit.uuid === hashFilter : true;
      // Añade otras condiciones de filtrado aquí
      return layerPasses && repoPasses && userPasses && hashPasses;
    });
    return filterCommits(commits);

  }, [commits, layerFilter, repoFilter, userFilter, hashFilter]);

  useEffect(() => {
    if (expanded && layerID && repoID) {
      handleLayerAndRepoInformation(layerID, repoID)
    }
  }, [expanded, layerID, repoID, handleLayerAndRepoInformation])

  return (
    <div className="flex flex-col  flex-grow px-7 h-full overflow-y-auto">
      <div className='flex justify-between h-[70px]'>
        <div className='flex space-x-4 items-center h-full'>

          <Autocomplete
            size="small" // Ajusta el tamaño
            options={projectLayers}
            getOptionLabel={(option) => option.label}
            onChange={(_, value) => {
              setLayerFilter(value?.value as string)
              setLayerTerm(value?.label as string)
            }}
            renderInput={(params) => <TextField {...params} label="Layer" />}
            onInputChange={(_, newInputValue, reason) => {
              if (reason !== 'reset') {
                setLayerFilter(newInputValue);
                setLayerTerm(newInputValue);
              }
            }}
            inputValue={layerTerm || ''}
            sx={{ width: 120 }} // Ajusta el ancho mediante estilos
          />

          {/* Filtro por usuario */}
          <Autocomplete
            size="small" // Ajusta el tamaño
            options={projectRepositories}
            getOptionLabel={(option) => option.label}
            onChange={(_, value) => {
              setRepoFilter(value?.value as string)
              setRepoTerm(value?.label as string)

            }}
            onInputChange={(_, newInputValue, reason) => {
              if (reason !== 'reset') {
                setRepoFilter(newInputValue);
                setRepoTerm(newInputValue);
              }
            }}
            inputValue={repoTerm || ''}
            renderInput={(params) => <TextField {...params} label="Repository" />}
            sx={{ width: 140 }} // Ajusta el ancho mediante estilos
          />

          <TextField
            size="small" // Ajusta el tamaño
            label="User ID"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            sx={{ width: 120 }} // Ajusta el ancho mediante estilos
          />

          <TextField
            size="small" // Ajusta el tamaño
            label="Hash"
            value={hashFilter}
            onChange={(e) => setHashFilter(e.target.value)}
            sx={{ width: 120 }} // Ajusta el ancho mediante estilos
          />


        </div>

        <div className='flex h-full items-center'>
          <Select
            size="small" // Ajusta el tamaño
            value={render}
            onChange={(event) => setRender(event.target.value)}
            sx={{ width: 140 }} // Ajusta el ancho mediante estilos
            MenuProps={{
              anchorOrigin: {
                vertical: 'bottom', // Puede ser 'top' o 'bottom'
                horizontal: 'left', // Puede ser 'left', 'center' o 'right'
              },
              transformOrigin: {
                vertical: 'top', // Puede ser 'top' o 'bottom'
                horizontal: 'left', // Puede ser 'left', 'center' o 'right'
              },
            }}
          >
            <MenuItem value="tasks">Tasks</MenuItem>
            <MenuItem value="commits">Commits</MenuItem>
          </Select>
        </div>
      </div>


      <div id='container-scroll' className='flex flex-col space-y-4 pb-6 flex-grow max-h-[750px] overflow-y-auto'>
        {
          filteredCommits.length === 0
            ?
            <div className="flex flex-col items-center mt-2 border-t-[1px]  border-gray-400  w-full h-full">
              <h1 className="text-xl mt-[22%] text-gray-400">No Data Available</h1>
            </div>
            :
            filteredCommits.map((commit) => (
              <Accordion
                key={commit.uuid}
                expanded={expanded === commit.uuid}
                onChange={() => setExpanded(expanded === commit.uuid ? null : commit.uuid)}
                ref={(el) => accordionRefs.current[commit.uuid] = el}
              >
                <div className="flex w-full p-4 rounded shadow-lg  bg-white hover:bg-gray-100 transition-colors border-[1px] border-yellow-300">
                  <div className="flex flex-col justify-between w-full">
                    {/* Encabezado con hash y mensaje del commit */}
                    <div className='flex flex-col'>
                      <div className='flex justify-between'>
                        <h3 className="text-sm font-semibold text-yellow-600 truncate" title={commit.uuid}>{commit.uuid}</h3>
                        <span className='text-gray-600 text-sm'>Committed on {new Date(commit.createdAt).toLocaleDateString()}</span>
                      </div>

                      <h2 className="text-lg font-bold text-gray-800">{commit.message}</h2>
                    </div>

                    {/* Información del autor del commit */}
                    <div className="flex justify-between">
                      <div className='flex items-center mt-2'>
                        <Avatar alt={commit.author.name} src={commit.author.photoUrl || commit.author.name} sx={{ width: 24, height: 24 }} />
                        <span className="ml-2 text-sm text-gray-600">{commit.author.name}</span>
                      </div>

                      <button
                        onClick={() => handleExpandClick(commit.uuid, commit.layer, commit.repository as string)}
                        className="mr-3">
                        <Icon size={24}><ArrowCircleDown48Regular onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /></Icon>
                      </button>

                    </div>
                  </div>
                </div>
                <AccordionDetails >
                  <div className='rounded-lg max-h-[160px]'>
                    {
                      isLoading
                        ? <LoadingCircle />
                        :
                        <div className='flex p-4 justify-between'>
                          <div className='flex flex-col space-y-4 '>
                            <div className='flex flex-col'>
                              <h4 className="font-bold text-xl text-yellow-600">Commit Details</h4>
                              <p className="text-sm text-gray-800">{commit.uuid}</p>
                            </div>
                            <div className='flex flex-col'>
                              <h4 className="text-sm font-bold">Commit Message</h4>
                              <p className="text-sm max-w-[300px] max-h-[40px] overflow-y-auto break-words text-gray-800">"{commit.message}"</p>
                            </div>
                          </div>


                          <div className='flex space-x-16 pr-4'>
                            <div className="flex flex-col">
                              <h5 className="text-md font-semibold">Layer Information</h5>
                              <p className="text-sm truncate w-[150px] text-pink-500">{layerInfo?.name || 'Layer name not available'}</p>
                              <p className="text-xs text-gray-600">{layerInfo?._id || 'ID not available'}</p>
                            </div>


                            <div className="flex flex-col ">
                              <h5 className="text-md font-semibold">Repository Information</h5>
                              <p className="text-sm truncate w-[150px] text-green-500">{repoInfo?.name || 'Repository name not available'}</p>
                              <p className="text-xs text-gray-600">{repoInfo?._id || 'ID not available'}</p>
                            </div>

                            <div className="flex flex-col">
                              <h5 className="text-md font-semibold">Associated Task</h5>
                              <p className="text-sm truncate w-[150px] text-blue-500">
                                {typeof commit?.associated_task === 'object' && commit?.associated_task !== null
                                  ? commit.associated_task.task_name
                                  : 'No associated Task'
                                }
                              </p>
                              <p className="text-xs text-gray-600">
                                {typeof commit?.associated_task === 'object' && commit?.associated_task !== null
                                  ? commit.associated_task._id
                                  : null
                                }
                              </p>
                            </div>

                            <div className="flex flex-col space-y-2 ">
                              <h5 className="text-md font-semibold">Committed By</h5>
                              <div className="flex items-center">
                                <Avatar alt={commit.author.name} src={commit.author.photoUrl || commit.author.name} sx={{ width: 24, height: 24 }} />
                                <span className="ml-2 text-sm text-gray-700">{commit.author.name}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                    }
                  </div>

                </AccordionDetails>
              </Accordion>
            ))
        }
      </div>

    </div>
  )

}