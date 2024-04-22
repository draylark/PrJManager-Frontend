import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '../../../../store/store';
import { Locked } from '@ricons/carbon'
import { Repositories } from '../Repos/Repositories';
import { Outlet } from 'react-router-dom'
import { RepositoryForm } from '../forms/RepositoryForm';
import { useState, useEffect } from 'react';
import { MdLayers } from 'react-icons/md';
import { LayerConfigForm } from '../forms/LayerConfigForm';
import { LayerCollaboratorsForm } from '../forms/LayerCollaboratorsForm';
import { World } from '@ricons/tabler'
import { GoIssueOpened } from "react-icons/go";
import { tierS } from '../../../helpers/accessLevels-validator';
import LoadingCircle from '../../../../auth/helpers/Loading';
import { TbDatabasePlus } from "react-icons/tb";
import { VscSettingsGear } from "react-icons/vsc";
import { Tooltip } from '@mui/material';
import { TfiWorld } from "react-icons/tfi";
import axios from 'axios';


export const Layer = () => {

  const location = useLocation();

  const [ isLayerCollaboratorsFormOpen, setIsLayerCollaboratorsFormOpen ] = useState(false)
  const [ isLayerConfigFormOpen, setIsLayerConfigFormOpen] = useState(false)
  const [isConfigOpen, setIsConfigOpen] = useState(false); // Estado para controlar la visibilidad del modal de configuración
  const [isBellOpen, setIsBellOpen] = useState(false); // Estado para controlar la visibilidad del modal de configuración
  const [isRepositoryFormOpen, setIsRepositoryFormOpen] = useState(false)

  const [layer, setLayer] = useState(null)
  const [isLoading, setIsLoading] = useState(true)  
  const repository = location.state?.repository;
  const { layerID, layerName } = location.state.layer;
  const { uid } = useSelector((state: RootState) => state.auth);
  const { currentProject: project, layers } = useSelector((state: RootState) => state.platypus);


  const toggleConfigModal = () => {
    isBellOpen ? setIsBellOpen(false) : null
    setIsConfigOpen(!isConfigOpen);
  };
  
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
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/layer/get-layer/${layerID}`, {
          params: {
            projectID: project._id
          },
          headers: {
            'Authorization': localStorage.getItem('x-token')
          }
        })
        .then(res => {
          console.log(res)
          setLayer(res.data.layer)
          setIsLoading(false)
        })
        .catch(err =>{
           console.log(err)
        })
      }
    } 
  }, [])
  
  if( repository?.repoID ) return <Outlet/>

  return (
    <div id='layer' className='flex flex-col h-full rounded-2xl w-full '>
        {
          isLoading && layer === null ? 
            <LoadingCircle />
          :     
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
                            tierS( uid, project, layer ) && (
                              <>
                                  {/* <button 
                                      onClick={ () => setIsRepositoryFormOpen(!isRepositoryFormOpen) }
                                      className="glass2 border-1 text-sm border-gray-400 py-[3px] w-[11rem] rounded-lg transition-transform duration-150 ease-in-out transform active:translate-y-[2px]">
                                      New repository
                                  </button> */}

                                  
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


                        <Tooltip title={ layer.visibility === 'restricted' ? 'Restricted' : layer.visibility === 'internal' ? 'Internal' : 'Open' } arrow>
                            <div className={`${layer.visibility === 'restricted' ? 'bg-[#00BFFF]/40' : layer.visibility === 'internal' ? 'bg-[#FFEF00]/40' : 'bg-[#ED2939]/40'} flex items-center glassi h-7 border-1 border-gray-400 py-1 px-3 rounded-lg transition-transform duration-150 ease-in-out transform active:translate-y-[2px]`}>
                                {
                                    layer.visibility === 'restricted' ? 
                                      <Locked className='w-4 h-4'/>
                                    :
                                    layer.visibility === 'internal' ?
                                      <GoIssueOpened/>
                                    :
                                      <TfiWorld className='w-4 h-4'/>
                                }
                            </div>
                        </Tooltip>
                  </div>
            </div>

        }

        { layer !== null && <Repositories layer={layer} project={project} uid={uid} /> }
          
        { isRepositoryFormOpen && <RepositoryForm setIsRepositoryFormOpen={ setIsRepositoryFormOpen } isRepositoryFormOpen={ isRepositoryFormOpen } /> }
        { isLayerConfigFormOpen && <LayerConfigForm setIsLayerConfigFormOpen={ setIsLayerConfigFormOpen } isLayerConfigFormOpen={isLayerConfigFormOpen}/> }
        { isLayerCollaboratorsFormOpen && <LayerCollaboratorsForm setIsLayerCollaboratorsFormOpen={ setIsLayerCollaboratorsFormOpen } isLayerCollaboratorsFormOpen={isLayerCollaboratorsFormOpen}/> }
    </div>
  );
};

// { isLayerConfigFormOpen && <LayerConfigForm setIsLayerConfigOpen={ setIsLayerConfigOpen }/> }