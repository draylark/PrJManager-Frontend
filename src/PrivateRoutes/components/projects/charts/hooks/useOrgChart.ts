import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { fetchProjectReposAndLayers } from '../../../../../store/platypus/thunks';
import { LayerBase } from '../../../../../interfaces/models/layer';
import { ProjectBase } from '../../../../../interfaces/models/project';
import { RepositoryBase } from '../../../../../interfaces/models/repository';
import { RootState } from '../../../../../store/store';
import { usePrJDispatch } from '../../../../../store/dispatch';
import { CustomNodeDatum } from '../TreeChart';

type projectState = {
    ID: string;
    name: string;
}

export interface NodeDatum {
    name: string;
    children?: NodeDatum[];
    type?: string;
    id?: string;
    layerID?: string;
    layerName?: string;
}

export const useOrgChart = (project: ProjectBase, projectState: projectState, uid: string) => {

    const dispatch = usePrJDispatch();
    const { layers, repositories } = useSelector((state: RootState) => state.platypus);
    const [treeData, setTreeData] = useState<NodeDatum>({ name: '', children: []})

    const [currentNode, setCurrentNode] = useState<CustomNodeDatum | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });


    const newTreeData = useCallback((project: ProjectBase) => {
        const data: NodeDatum = {
            name: project.name,
            children: [{
                name: 'Layers',
                children: layers.filter((layer: LayerBase) => layer.project === project.pid)
                .map((layer: LayerBase): NodeDatum => ({
                    name: layer.name,
                    type: 'L',
                    id: layer._id,
                    children: repositories.filter((repo: RepositoryBase) => repo.layerID === layer._id)
                    .map((repo: RepositoryBase): NodeDatum => ({
                        name: repo.name,
                        type: 'R',
                        id: repo._id,
                        layerID: layer._id,
                        layerName: layer.name
                    })),
                })),
            }],
        };
        
        setTreeData(data);
    }, [layers, repositories]);

    const handleMouseOver = (event: React.MouseEvent<SVGGElement, MouseEvent>, nodeDatum: CustomNodeDatum) => {
        event.stopPropagation();
        setCurrentNode(nodeDatum);
        setShowModal(true);

        const offsetX = 230; // Distancia horizontal del cursor al modal (ajusta según sea necesario)
        const offsetY = 210; // Distancia vertical del cursor al modal (ajusta según sea necesario)
    
        // Calcula nuevas posiciones X y Y considerando las distancias
        const newX = event.clientX - offsetX;
        const newY = event.clientY - offsetY;
    
        setModalPosition({ x: newX, y: newY });
    };
    
    const handleMouseMove = (event : React.MouseEvent<SVGGElement, MouseEvent>) => {
        // Actualiza la posición del modal para seguir al cursor
        event.stopPropagation(); // Opcional, dependiendo de si necesitas prevenir la propagación del evento
        setModalPosition({ x: event.clientX - 230, y: event.clientY - 210 });
    };
      
    useEffect(() => {
        if (layers.length > 0 || repositories.length > 0) {
            newTreeData(project);
        }
    }, [layers, repositories, project, newTreeData ])
    
    useEffect(() => {
        if (project) {
            dispatch(fetchProjectReposAndLayers(project.pid, uid, project?.accessLevel ));
        }
    }, [project, dispatch, projectState, uid]);

    return { treeData, 
        newTreeData, 
        handleMouseOver, 
        handleMouseMove, 
        showModal, 
        currentNode, 
        translate, 
        modalPosition, 
        setTranslate, 
        setShowModal,
        setModalPosition
    }
};
