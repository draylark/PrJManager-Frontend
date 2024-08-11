import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '../../../../store/store';
import { Locked } from '@ricons/carbon'
import { Repositories } from '../Repos/Repositories';
import { Outlet } from 'react-router-dom'
import { RepositoryForm } from '../forms/repository/RepositoryForm';
import { useState, useEffect, useCallback } from 'react';
import { MdLayers } from 'react-icons/md';
import { LayerConfigForm } from '../forms/layer/LayerConfigForm';
import { LayerCollaboratorsForm } from '../forms/layer/LayerCollaboratorsForm';
import { GoIssueOpened } from "react-icons/go";
import { tierS } from '../../../helpers/accessLevels-validator';
import { TbDatabasePlus } from "react-icons/tb";
import { VscSettingsGear } from "react-icons/vsc";
import { Tooltip } from '@mui/material';
import { TfiWorld } from "react-icons/tfi";
import { PuffLoader  } from 'react-spinners';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from 'axios';
import { LayerBase, ProjectBase } from '../../../../interfaces/models';

export const Layer = () => {

  const location = useLocation();

  const [ layer, setLayer ] = useState<LayerBase | null>(null)
  const [ isLoading, setIsLoading ] = useState(true)  
  const { layerID, layerName } = location.state.layer;
  const { uid } = useSelector((state: RootState) => state.auth);
  const { currentProject: project, layers } = useSelector((state: RootState) => state.platypus);
  const repository = location.state?.repository;
  const [ isBellOpen, setIsBellOpen ] = useState(false); 
  const [ isConfigOpen, setIsConfigOpen ] = useState(false);
  const [ isRepositoryFormOpen, setIsRepositoryFormOpen ] = useState(false)
  const [ isLayerConfigFormOpen, setIsLayerConfigFormOpen ] = useState(false) 
  const [ isLayerCollaboratorsFormOpen, setIsLayerCollaboratorsFormOpen ] = useState(false)
  
  const [errorType, setErrorType] = useState(null) 
  const [errorMessage, seterrorMessage] = useState(null);
  const [errorWhileFetching, setErrorWhileFetching] = useState(false);

  const toggleConfigModal = () => {
    isBellOpen ? setIsBellOpen(false) : null
    setIsConfigOpen(!isConfigOpen);
  };

  const fetchLayerData = useCallback(() => {
    axios.get(`${backendUrl}/layer/get-layer/${layerID}`, {
      headers: {
        'Authorization': localStorage.getItem('x-token')
      }
    })
    .then(res => {
      setLayer(res.data.layer)
      setIsLoading(false)
    })
    .catch(err => {
      setIsLoading(false)
      setErrorWhileFetching(true)
      setErrorType(err.response.data.type || 'Error')
      seterrorMessage(err.response.data.message || 'An error occurred while fetching data')
    })
  }, [layerID]);

  useEffect(() => {
    isLayerConfigFormOpen ? setIsConfigOpen(false) : null
    isLayerCollaboratorsFormOpen ? setIsConfigOpen(false) : null
  }, [isLayerConfigFormOpen, isLayerCollaboratorsFormOpen])

  useEffect(() => {
    if( layerID ){
      const layerFromRState = layers.find(layer => layer._id === layerID)
      if( layerFromRState && layerFromRState !== undefined  ){
        setLayer(layerFromRState)
        setIsLoading(false)
      } else {
        fetchLayerData()
      }
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ layerID, layers])
  

  if( repository?.repoID ) return <Outlet/>

  if( errorWhileFetching ) return (
    <div className='flex flex-col flex-grow items-center justify-center'>
      <h1 className='text-xl text-red-500'>{errorMessage}</h1>
      {
          errorType !== 'collaborator-validation' && errorType !== 'token-validation' ? (
            <button
              onClick={() => {
                setErrorWhileFetching(false)
                setIsLoading(true)
                fetchLayerData()
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
    <div id='layer' className='flex flex-col h-full rounded-2xl w-full '>
        {
          isLoading 
          ? ( 
            <div className='flex flex-grow items-center justify-center'>
                <PuffLoader  color="#32174D" size={50} /> 
            </div>                         
          ) :     
            <div className="flex justify-between items-cente px-1">

                  <div className="flex  mx-4 ">          
                      <h1 className="text-3xl flex font-bold items-center">
                          <div className='mr-3 '>                      
                              <MdLayers size={50} color='#ffafcc'/>                      
                          </div>   
                        {layerName}
                      </h1>                        
                  </div>

                  <div id='lBtns' className="relative flex items-center space-x-3 px-4">
                        {
                            tierS( uid as string, project, layer ) && (
                              <>
                                  <button 
                                      onClick={ () => setIsRepositoryFormOpen(!isRepositoryFormOpen) }
                                      className='glassi h-7 border-1 border-gray-400 py-1 px-3 rounded-lg transition-transform duration-150 ease-in-out transform active:translate-y-[2px]'>
                                    <TbDatabasePlus size={17}/>
                                  </button>

                                  <div className={`absolute top-[130%] right-[122px] mt-1 w-28 glass2 border-1 border-gray-400 shadow-xl rounded-lg z-10 transition-opacity duration-300 ease-in-out ${isBellOpen ? "opacity-100" : "opacity-0 pointer-events-none"} transform -translate-y-5`}>
                                    <ul className="text-gray-700">
                                      <li className="text-center px-4 py-2 hover:bg-blue-200 transition-colors duration-150 ease-in-out cursor-pointer">None</li>
                                      <li className="text-center px-4 py-2 hover:bg-blue-200 transition-colors duration-150 ease-in-out cursor-pointer">All</li>
                                      <li className="text-center px-4 py-2 hover:bg-blue-200 transition-colors duration-150 ease-in-out cursor-pointer">Dedicated</li>
                                    </ul>
                                  </div>

                                  <button onClick={toggleConfigModal} className='glassi h-7 border-1 border-gray-400 py-1 px-3 rounded-lg transition-transform duration-150 ease-in-out transform active:translate-y-[2px]'>
                                    <VscSettingsGear />
                                  </button>
                
                                  <div className={`absolute top-[130%] right-[68px] mt-1 w-48 glass2 border-1 border-gray-400 shadow-xl rounded-lg z-10 transition-opacity duration-300 ease-in-out ${isConfigOpen ? "opacity-100" : "opacity-0 pointer-events-none"} transform -translate-y-5`}>
                                    <ul className="text-gray-700">
                                      <li 
                                          className="text-center px-4 py-2 hover:bg-blue-200 transition-colors duration-150 ease-in-out cursor-pointer"
                                          onClick={() => setIsLayerConfigFormOpen(!isLayerConfigFormOpen)}
                                      >
                                        Layer Configuration
                                      </li>
                                      <li 
                                          className="text-center px-4 py-2 hover:bg-blue-200 transition-colors duration-150 ease-in-out cursor-pointer"
                                          onClick={() => setIsLayerCollaboratorsFormOpen(!isLayerCollaboratorsFormOpen)}
                                      >
                                        Layer Collaborators
                                      </li>
                                    </ul>
                                  </div>
                              
                              </>
                            )
                        }


                        <Tooltip title={ layer?.visibility === 'restricted' ? 'Restricted' : layer?.visibility === 'internal' ? 'Internal' : 'Open' } arrow>
                            <div className={`${layer?.visibility === 'restricted' ? 'bg-[#00BFFF]/40' : layer?.visibility === 'internal' ? 'bg-[#FFEF00]/40' : 'bg-[#ED2939]/40'} flex items-center glassi h-7 border-1 border-gray-400 py-1 px-3 rounded-lg transition-transform duration-150 ease-in-out transform active:translate-y-[2px]`}>
                                {
                                    layer?.visibility === 'restricted' ? 
                                      <Locked className='w-4 h-4' onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}/>
                                    :
                                    layer?.visibility === 'internal' ?
                                      <GoIssueOpened/>
                                    :
                                      <TfiWorld className='w-4 h-4'/>
                                }
                            </div>
                        </Tooltip>
                  </div>
            </div>

        }

    { layer !== null && <Repositories layer={layer} project={project as ProjectBase} uid={uid as string} /> } {/*  */}   
          
        { isRepositoryFormOpen && <RepositoryForm setIsRepositoryFormOpen={ setIsRepositoryFormOpen } isRepositoryFormOpen={ isRepositoryFormOpen } /> }
        { isLayerConfigFormOpen && <LayerConfigForm layer={layer as LayerBase} setIsLayerConfigFormOpen={ setIsLayerConfigFormOpen } isLayerConfigFormOpen={isLayerConfigFormOpen}/> }
        { isLayerCollaboratorsFormOpen && <LayerCollaboratorsForm setIsLayerCollaboratorsFormOpen={ setIsLayerCollaboratorsFormOpen } isLayerCollaboratorsFormOpen={isLayerCollaboratorsFormOpen}/> }
    </div>
  );
};

// { isLayerConfigFormOpen && <LayerConfigForm setIsLayerConfigOpen={ setIsLayerConfigOpen }/> }