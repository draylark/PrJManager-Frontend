import React, { useRef, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { useOrgChart } from './hooks/useOrgChart';
import Tree from 'react-d3-tree'
import { NodeModal } from './modals/NodeModal';
import { FaLayerGroup } from 'react-icons/fa';
import AddSquareMultiple16Regular from '@ricons/fluent/AddSquareMultiple16Regular';
import { LayerForm } from '../forms/layer/LayerForm';
import { tierS } from '../../../helpers/accessLevels-validator';
import { fetchProjectReposAndLayers } from '../../../../store/platypus/thunks';
import { PuffLoader  } from 'react-spinners';
import { setError } from '../../../../store/platypus/platypusSlice';
import { ProjectBase } from '../../../../interfaces/models/project';
import { usePrJDispatch } from '../../../../store/dispatch';
import { TreeNodeDatum } from 'react-d3-tree';


export interface CustomNodeDatum extends TreeNodeDatum{
  type?: string;
  id?: string;
  layerID?: string;
  layerName?: string;
}


export const TreeChart = () => {

    const location = useLocation();
    const dispatch = usePrJDispatch();
    const treeContainerRef  = useRef<HTMLDivElement>();
    const projectState = location.state?.project;
    const { uid } = useSelector((state: RootState) => state.auth );
    const [isLayerFormOpen, setIsLayerFormOpen] = useState(false) 
    const { currentProject, fetchingResources, errorWhileFetching, errorMessage, errorType } = useSelector((state: RootState) => state.platypus );
    const project = currentProject as ProjectBase;


    const { treeData, handleMouseMove, 
      handleMouseOver, currentNode, showModal, translate, modalPosition, setTranslate, setShowModal } = useOrgChart(project, projectState, uid as string)
   
    const handleWrapperClick = () => {
      // Si se hace clic en el contenedor pero fuera del modal (y posiblemente fuera de los nodos específicos), cierra el modal.
      // Asegúrate de que este manejador no interfiera con los clics en el modal o en los nodos.
      if (showModal) {
        setShowModal(false);
      }
    };

    useEffect(() => {
      if( treeContainerRef.current ){
              // Calculate the center of the container and set the translate state
      const containerWidth = treeContainerRef.current.getBoundingClientRect().width;
      const containerHeight = treeContainerRef.current.getBoundingClientRect().height;
  
      setTranslate({
        x: containerWidth / 2 - 20, // Disminuye este valor para mover hacia la izquierda
        y: containerHeight / 8 // Ajusta este valor según sea necesario para centrar verticalmente
      });
      }
    }, [setTranslate]); // Empty dependency array means this effect runs once on mount

    
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        // Asegúrate de que treeContainerRef y modalRef sean referencias a los elementos adecuados
        if (treeContainerRef.current && !treeContainerRef.current.contains(event.target as Node) && showModal) {
          setShowModal(false);
        }
      };
    
      // Agregar el event listener cuando el componente se monta
      document.addEventListener("mousedown", handleClickOutside);
    
      // Limpiar el event listener cuando el componente se desmonte
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [showModal, setShowModal]); // Dependencias: Re-ejecutar este efecto si 'showModal' cambia.


    if( errorWhileFetching ) return (
        <div className='flex flex-col flex-grow glass2 items-center justify-center'>
          <h1 className='text-xl text-red-500'>{errorMessage}</h1>
          {
            errorType !== 'collaborator-validation' && errorType !== 'token-validation' ? (
              <button
                onClick={() => {
                  dispatch(
                    setError({
                      fetchingResources: true,
                      errorWhileFetching: false,
                      errorMessage: null,
                      errorType: null,
                    })
                  );
                  dispatch(fetchProjectReposAndLayers(projectState.ID, projectState.accessLevel, uid as string));
                }}
                className='hover:text-blue-500 transition-colors duration-100'
              >
                Try Again
              </button>
            ) : null
          }
        </div>
    );

    if( fetchingResources ) return  ( 
      <div className='flex flex-grow items-center justify-center'>
          <PuffLoader  color="#32174D" size={50} /> 
      </div> 
    );

    return (
      <div className='flex flex-grow relative'>
            { isLayerFormOpen && <LayerForm isLayerFormOpen={isLayerFormOpen} setIsLayerFormOpen={setIsLayerFormOpen} /> }

            {
                tierS(uid as string, project) && (
                    <AddSquareMultiple16Regular  
                    onClick={() => setIsLayerFormOpen(true)}
                    className='absolute w-10 h-10 z-10 right-5 top-5  text-pink-300 hover:text-pink-400 cursor-pointer transition-colors duration-200' onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                    />
                  )
            }

          <div ref={treeContainerRef as React.RefObject<HTMLDivElement>} onClick={handleWrapperClick} className="glassi w-full h-full rounded-b-3xl" id="treeWrapper">
            
            { showModal && currentNode && (
              <div style={{ position: 'absolute', left: modalPosition.x, top: modalPosition.y, zIndex: 100 }}>
                <NodeModal project={projectState}  nodeData={currentNode} />
              </div>
            )}

            <Tree 
              data={treeData}
              translate={translate}
              pathFunc={'straight'}
              orientation='vertical'
              nodeSize={{ x: 200, y: 100 }}
              initialDepth={5}
              zoom={0.6}
              enableLegacyTransitions={true}        
              transitionDuration={500} // Establece la duración de la animación a 500 ms
              renderCustomNodeElement={({ nodeDatum, toggleNode }) => {
                // Determinar si el nodo es el nodo raíz usando la propiedad 'depth'
                const customNodeDatum = nodeDatum as CustomNodeDatum;

                const isRootNode = customNodeDatum.__rd3t.depth === 0;
                // Determinar el color del nodo basado en la propiedad 'type'
                let fillColor;
                if (isRootNode) {
                  fillColor = "black"; // Color para el nodo raíz
                } else {
                  fillColor = customNodeDatum.type === 'R' ? "#c7f9cc" : "#ffafcc";
                }
                
                return (
                  <g>
                    {isRootNode ? (
                      <>
                        <text fill="black" strokeWidth="1" x={ customNodeDatum.__rd3t.depth === 0 ? '80' : '0' } y="-20" textAnchor="middle">
                            {customNodeDatum.name}
                        </text>

                        <g transform={`translate(${-35}, ${-55})`}> {/* Ajusta estos valores según sea necesario */}
                          <polygon
                            className='node-class'
                            points="45,15 55,30 45,45 25,45 15,30 25,15"
                            fill="skyblue"
                            stroke="slategray"
                            strokeWidth="1px"
                            onClick={toggleNode}
                          />
                        </g>        
                      </>
                    ) : customNodeDatum.name === 'Layers' ? ( 
                        <>
                          <text fill="black" strokeWidth="1" x={ '0' } y="-45" textAnchor="middle">
                              {customNodeDatum.name}
                          </text>
                          <foreignObject x="-20" y="-35" width="40" height="40">
                              <div style={{ fontSize: '40px' }}>
                                  <FaLayerGroup  color="#ffafcc" />
                              </div>
                          </foreignObject>
                        </>
                    ) : customNodeDatum.type === 'R' ? (
                      <>
                        <text fill="black" strokeWidth="1" x={ customNodeDatum.__rd3t.depth === 0 ? '80' : '0' } y="-20" textAnchor="middle">
                          {customNodeDatum.name}
                        </text>
                        <circle
                          className='node-class'
                          r="10" // Radio del círculo, ajusta según necesites
                          fill={fillColor}
                          stroke="black"
                          strokeWidth="1px"
                          onClick={toggleNode}
                          onMouseOver={customNodeDatum.name !== 'Layers' ? (event) => handleMouseOver(event, nodeDatum) : undefined}
                          onMouseMove={handleMouseMove}
                          // onMouseOut={() => console.log('Mouse out', nodeDatum)}
                        />               
                      </>

                    ) : (
                      <>
                        <text fill="black" strokeWidth="1" x={ customNodeDatum.__rd3t.depth === 0 ? '80' : '0' } y="-20" textAnchor="middle">
                          {customNodeDatum.name}
                        </text>
                        <rect
                          className='node-class'
                          width="20"
                          height="20"
                          x="-10"
                          y="-10"
                          fill={fillColor}
                          stroke="black"
                          strokeWidth="1px"
                          onClick={toggleNode}
                          onMouseOver={ customNodeDatum.name !== 'Layers' ? (event) => handleMouseOver(event, nodeDatum) : undefined }
                          onMouseMove={handleMouseMove}
                        />      
                      </>
                    )}
                  </g>
                );
              }}
            />
          </div>
      </div>

    );
  };