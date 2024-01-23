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
import { useState } from 'react';
import { Edit24Filled } from '@ricons/fluent'
import { EditLayerForm } from '../forms/EditLayerForm';

export const Layer = () => {

  const [isEditLayerOpen, setIsEditLayerOpen] = useState(false)
  const location = useLocation();
  const { layers } = useSelector((state: RootState) => state.platypus);
  const repoId = location.state?.repoId;
  const layerId = location.state?.layerId;
  const layer = layers.find((layer) => layer._id === layerId);

  const [ isRepoFormOpen, setIsRepoFormOpen ] = useState(false);

  return (
    <>

      {
          repoId 
          ? ( <Outlet/> )
          : (
             <>  

              { isRepoFormOpen && <RepositoryForm setIsRepositoryModalOpen={ setIsRepoFormOpen }/> }
              { isEditLayerOpen && <EditLayerForm setIsEditLayerOpen={ setIsEditLayerOpen }/> }

                <div className="bg-white rounded-lg shadow-md p-4 ">
                    <div className="flex justify-between items-center mb-4 ">
                      <div className="flex items-center">
                        <div className="glass3 text-black rounded-lg px-3 py-1 mr-3 ">
                          <h1 className="text-xl font-bold flex items-center ">
                              <div className='mr-2'>
                                <Icon>
                                  <LayerGroup/>
                                </Icon>
                              </div>   
                            Layer: {layer.name}
                          </h1>                        
                        </div>

                        <button className='mt-1'>
                          <Icon size={30}>
                            <DescriptionOutlined/>
                          </Icon>
                        </button>
                      </div>

                      <div className="flex items-center space-x-4">
                        <button 
                            className="glass text-black rounded-lg px-3 py-1"
                            onClick={ () => setIsRepoFormOpen(true) }>
                          <p className="text-sm flex items-center">
                            Create a new Repository
                          </p>
                        </button>

                        <button onClick={ () => setIsEditLayerOpen(true) } className='glass2 text-black h-7 py-1  px-4 rounded-lg'>    
                          <Icon>
                              <Edit24Filled/>
                          </Icon>
                        </button>

                        <div className={`${layer.visibility === 'public' ? 'green' : 'glass5'} text-black rounded-lg px-3 py-1`}>
                          <p className="text-sm font-bold flex items-center">
                            <div className="w-4 h-4 mr-2">
                              <Icon>
                                <Locked/>
                              </Icon>
                            </div>
                            {layer.visibility}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                <Repositories layerId={layerId} />

             </>
            )
      }
    </>

  );
};