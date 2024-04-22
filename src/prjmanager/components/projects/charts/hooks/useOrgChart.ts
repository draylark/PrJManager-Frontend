import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'


export const useOrgChart = () => {

    const { layers, repositories } = useSelector((state) => state.platypus);
    const [treeData, setTreeData] = useState({})

    const [currentNode, setCurrentNode] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

    // console.log(layers)
    // console.log(repositories)

    const newTreeData = (project) => {
        // console.log(project)
        const data = {
            name: project.name,
            children: [
                {
                    name: 'Layers',
                    children: layers
                    .filter((layer) => layer.project === project.pid)
                    .map((layer) => {
                        return {
                            type: 'L',
                            name: layer.name,                                
                            id: layer._id,
                            children: repositories
                            .filter((repo) => repo.layerID === layer._id)
                            .map((repo) => {
                                return {
                                    type: 'R',
                                    name: repo.name,                           
                                    id: repo._id,
                                    layerID: layer._id,
                                    layerName: layer.name
                                };
                            }),
                        }
                    }),
                },
            ],
        };   
        
        setTreeData(data)
    };

    const handleMouseOver = (event, nodeDatum) => {
        event.stopPropagation();
        setCurrentNode(nodeDatum);
        setShowModal(true);

        const offsetX = 290; // Distancia horizontal del cursor al modal
        const offsetY = 210; // Distancia vertical del cursor al modal (hacia abajo)

        // Calcula nuevas posiciones X y Y considerando las distancias
        let newX = event.clientX - offsetX;
        let newY = event.clientY - offsetY;

        // Ajustes basados en el viewport podrían ser necesarios aquí si el modal puede desbordarse
        setModalPosition({ x: newX, y: newY });
    };
    
    const handleMouseMove = (event) => {
        // Actualiza la posición del modal para seguir al cursor
        event.stopPropagation(); // Opcional, dependiendo de si necesitas prevenir la propagación del evento
        setModalPosition({ x: event.clientX - 290, y: event.clientY - 210 });
    };
      

    return { treeData, newTreeData, handleMouseOver, handleMouseMove, showModal, currentNode, translate, modalPosition, setTranslate, setShowModal}
};
