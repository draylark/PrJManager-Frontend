import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '../../../../store/store';
import { LayerGroup } from '@ricons/fa'
import { Locked } from '@ricons/carbon'
import { DescriptionOutlined } from '@ricons/material'
import { Repositories } from '../Repos/Repositories';
import { Icon } from "@ricons/utils";
import { Outlet } from 'react-router-dom'
import { RepositoryForm } from '../forms/RepositoryForm';
import { useState, useEffect } from 'react';
import { Edit24Filled } from '@ricons/fluent'
import { EditLayerForm } from '../forms/EditLayerForm';
import { MdLayers } from 'react-icons/md';
import { FaLayerGroup, FaRegSquare } from 'react-icons/fa';
import { IoLayersOutline } from 'react-icons/io5';
import { RxGear } from "react-icons/rx";
import { HiOutlineBellSlash } from "react-icons/hi2";
import { MdArrowDropDown } from "react-icons/md";
import { LayerConfigForm } from '../forms/LayerConfigForm';
import { LayerCollaboratorsForm } from '../forms/LayerCollaboratorsForm';
import CircleDashed from '@ricons/tabler/CircleDashed'



export const Layer = () => {

  const [ isRepoFormOpen, setIsRepoFormOpen ] = useState(false);
  const [ isLayerCollaboratorsFormOpen, setIsLayerCollaboratorsFormOpen ] = useState(false)
  const [ isLayerConfigFormOpen, setIsLayerConfigFormOpen] = useState(false)
  const [isConfigOpen, setIsConfigOpen] = useState(false); // Estado para controlar la visibilidad del modal de configuración
  const [isBellOpen, setIsBellOpen] = useState(false); // Estado para controlar la visibilidad del modal de configuración
  const [isRepositoryFormOpen, setIsRepositoryFormOpen] = useState(false)
  const [repoCollaborators, setRepoCollaborators] = useState([]);


  const onAddColaborador = (newCollaborator) => {
    if( !repoCollaborators.find(colaborador => colaborador.id === newCollaborator.id) ) {
        setRepoCollaborators(prevRepoCollaborators => [...prevRepoCollaborators, newCollaborator]);
    }
  };

  // Tu lógica existente...

  const toggleBellModal = () => {
    isConfigOpen ? setIsConfigOpen(false) : null
    setIsBellOpen(!isBellOpen);
  };
  const toggleConfigModal = () => {
    isBellOpen ? setIsBellOpen(false) : null
    setIsConfigOpen(!isConfigOpen);
  };

  const location = useLocation();
  const { layers } = useSelector((state: RootState) => state.platypus);
  const repository = location.state?.repository;
  const { layerID } = location.state?.layer;
  const layer = layers.find((layer) => layer._id === layerID);


  useEffect(() => {
    isLayerConfigFormOpen ? setIsConfigOpen(false) : null
    isLayerCollaboratorsFormOpen ? setIsConfigOpen(false) : null
  }, [isLayerConfigFormOpen, isLayerCollaboratorsFormOpen])
  

  if( repository?.repoID ) return <Outlet/>

  return (
    <div id='layer' className='flex flex-col h-full rounded-2xl w-full '>

          <div className="flex justify-between items-cente px-1">

                <div className="flex  mx-4 ">          
                    <h1 className="text-3xl flex font-bold items-center">
                        <div className='mr-3 '>                      
                            <MdLayers size={50} color='#ffafcc'/>                      
                        </div>   
                      {layer.name}
                    </h1>                        
                </div>

                <div id='lBtns' className="relative flex items-center space-x-3 px-4">


                      <button 
                          onClick={ () => setIsRepositoryFormOpen(!isRepositoryFormOpen) }
                          className="glass2 border-1 text-sm border-gray-400 py-[3px] w-[11rem] rounded-lg transition-transform duration-150 ease-in-out transform active:translate-y-[2px]">
                          New repository
                      </button>

                      <div className={`absolute top-[130%] right-[122px] mt-1 w-28 glass2 border-1 border-gray-400 shadow-xl rounded-lg z-10 transition-opacity duration-300 ease-in-out ${isBellOpen ? "opacity-100" : "opacity-0 pointer-events-none"} transform -translate-y-5`}>
                        <ul className="text-gray-700">
                          <li className="text-center px-4 py-2 hover:bg-blue-200 transition-colors duration-150 ease-in-out cursor-pointer">None</li>
                          <li className="text-center px-4 py-2 hover:bg-blue-200 transition-colors duration-150 ease-in-out cursor-pointer">All</li>
                          <li className="text-center px-4 py-2 hover:bg-blue-200 transition-colors duration-150 ease-in-out cursor-pointer">Dedicated</li>
                        </ul>
                      </div>

                      <button onClick={toggleConfigModal} className='glass2 h-7 border-1 border-gray-400 py-1 px-3 rounded-lg transition-transform duration-150 ease-in-out transform active:translate-y-[2px]'>
                        <RxGear/>
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

                      <div className={`${layer.visibility === 'public' ? 'green' : 'glass5'} h-7 border-1 border-gray-400 rounded-lg px-3 pt-[2px]`}>
                            <Icon>
                              <Locked/>
                            </Icon>
                      </div>


                </div>
          </div>
          <Repositories layer={layer} />

        { isRepositoryFormOpen && <RepositoryForm setIsRepositoryFormOpen={ setIsRepositoryFormOpen } isRepositoryFormOpen={ isRepositoryFormOpen } /> }
        { isLayerConfigFormOpen && <LayerConfigForm setIsLayerConfigFormOpen={ setIsLayerConfigFormOpen } isLayerConfigFormOpen={isLayerConfigFormOpen}/> }
        { isLayerCollaboratorsFormOpen && <LayerCollaboratorsForm setIsLayerCollaboratorsFormOpen={ setIsLayerCollaboratorsFormOpen } isLayerCollaboratorsFormOpen={isLayerCollaboratorsFormOpen}/> }
    </div>
  );
};

// { isLayerConfigFormOpen && <LayerConfigForm setIsLayerConfigOpen={ setIsLayerConfigOpen }/> }