import { useRef, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { useOrgChart } from './hooks/useOrgChart';
import Tree from 'react-d3-tree'
import { NodeModal } from './modals/NodeModal';
import { FaLayerGroup } from 'react-icons/fa';
import AddSquareMultiple16Regular from '@ricons/fluent/AddSquareMultiple16Regular';
import { LayerForm } from '../forms/LayerForm';
import { tierS } from '../../../helpers/accessLevels-validator';
import LoadingCircle from '../../../../auth/helpers/Loading';
import { fetchProjectReposAndLayers } from '../../../../store/platypus/thunks';
import { useDispatch } from 'react-redux';


export const TreeChart = () => {

    const { treeData, newTreeData, handleMouseMove, 
      handleMouseOver, currentNode, showModal, translate, modalPosition, setTranslate, setShowModal } = useOrgChart()

    const location = useLocation();
    const dispatch = useDispatch();
    const treeContainerRef  = useRef();
    const projectData = location.state?.project;
    const { uid } = useSelector((state: RootState) => state.auth );
    const [isLayerFormOpen, setIsLayerFormOpen] = useState(false) 
    const { currentProject: project, repositories, layers, fetchingResources } = useSelector((state: RootState) => state.platypus );

    const handleWrapperClick = (event) => {
      // Si se hace clic en el contenedor pero fuera del modal (y posiblemente fuera de los nodos específicos), cierra el modal.
      // Asegúrate de que este manejador no interfiera con los clics en el modal o en los nodos.
      if (showModal) {
        setShowModal(false);
      }
    };

    useEffect(() => {
      // Calculate the center of the container and set the translate state
      const containerWidth = treeContainerRef.current.getBoundingClientRect().width;
      const containerHeight = treeContainerRef.current.getBoundingClientRect().height;
  
      setTranslate({
        x: containerWidth / 2 - 20, // Disminuye este valor para mover hacia la izquierda
        y: containerHeight / 8 // Ajusta este valor según sea necesario para centrar verticalmente
      });
    }, []); // Empty dependency array means this effect runs once on mount

    useEffect(() => {
      if (project) {
        newTreeData(project)
      }
    }, [ project, repositories, layers ]);
    
    useEffect(() => {
      const handleClickOutside = (event) => {
        // Asegúrate de que treeContainerRef y modalRef sean referencias a los elementos adecuados
        if (treeContainerRef.current && !treeContainerRef.current.contains(event.target) && showModal) {
          setShowModal(false);
        }
      };
    
      // Agregar el event listener cuando el componente se monta
      document.addEventListener("mousedown", handleClickOutside);
    
      // Limpiar el event listener cuando el componente se desmonte
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [showModal]); // Dependencias: Re-ejecutar este efecto si 'showModal' cambia.

    // console.log('treeData', treeData)

    useEffect(() => {
      dispatch( fetchProjectReposAndLayers(projectData.ID, projectData.accessLevel, uid) )
    }, [])
    



    if( fetchingResources ) return <LoadingCircle />

    return (
      <div className='flex flex-grow relative'>
            { isLayerFormOpen && <LayerForm isLayerFormOpen={isLayerFormOpen} setIsLayerFormOpen={setIsLayerFormOpen} /> }

            {
                tierS(uid, project) && (
                    <AddSquareMultiple16Regular  
                      onClick={ () => setIsLayerFormOpen(true) }
                      className='absolute w-10 h-10 z-10 right-5 top-5  text-pink-300 hover:text-pink-400 cursor-pointer transition-colors duration-200'
                    />
                  )
            }

          <div ref={treeContainerRef} onClick={handleWrapperClick} className="glass2 w-full h-full rounded-b-3xl"  id="treeWrapper">
            
            { showModal && currentNode && (
              <div style={{ position: 'absolute', left: modalPosition.x, top: modalPosition.y, zIndex: 100 }}>
                <NodeModal project={projectData}  nodeData={currentNode} />
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
                const isRootNode = nodeDatum.__rd3t.depth === 0;
                
                // Determinar el color del nodo basado en la propiedad 'type'
                let fillColor;
                if (isRootNode) {
                  fillColor = "black"; // Color para el nodo raíz
                } else {
                  fillColor = nodeDatum.type === 'R' ? "#c7f9cc" : "#ffafcc";
                }
                
                return (
                  <g>
                    {isRootNode ? (
                      <>
                        <text fill="black" strokeWidth="1" x={ nodeDatum.__rd3t.depth === 0 ? '80' : '0' } y="-20" textAnchor="middle">
                            {nodeDatum.name}
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
                    ) : nodeDatum.name === 'Layers' ? ( 
                        <>
                          <text fill="black" strokeWidth="1" x={ '0' } y="-45" textAnchor="middle">
                              {nodeDatum.name}
                          </text>
                          <foreignObject x="-20" y="-35" width="40" height="40">
                              <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontSize: '40px' }}>
                                  <FaLayerGroup  color="#ffafcc" />
                              </div>
                          </foreignObject>
                        </>
                    ) : nodeDatum.type === 'R' ? (
                      <>
                        <text fill="black" strokeWidth="1" x={ nodeDatum.__rd3t.depth === 0 ? '80' : '0' } y="-20" textAnchor="middle">
                          {nodeDatum.name}
                        </text>
                        <circle
                          className='node-class'
                          r="10" // Radio del círculo, ajusta según necesites
                          fill={fillColor}
                          stroke="black"
                          strokeWidth="1px"
                          onClick={toggleNode}
                          onMouseOver={nodeDatum.name !== 'Layers' ? (event) => handleMouseOver(event, nodeDatum) : undefined}
                          onMouseMove={handleMouseMove}
                          // onMouseOut={() => console.log('Mouse out', nodeDatum)}
                        />               
                      </>

                    ) : (
                      <>
                        <text fill="black" strokeWidth="1" x={ nodeDatum.__rd3t.depth === 0 ? '80' : '0' } y="-20" textAnchor="middle">
                          {nodeDatum.name}
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
                          onMouseOver={ nodeDatum.name !== 'Layers' ? (event) => handleMouseOver(event, nodeDatum) : undefined }
                          onMouseMove={handleMouseMove}
                          // onMouseOut={() => console.log('Mouse out', nodeDatum)}
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