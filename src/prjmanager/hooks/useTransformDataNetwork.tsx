import { useState, useEffect } from "react";
import axios from "axios";
import { TaskType } from "../../store/types/stateTypes";


interface NetworkData {
    nodes: { id: string; label: string; description: string; size: number; color: string; status: string; isChild: boolean  }[];
    links: { source: string; target: string; distance: number }[];
}

export const useTransformDataToNetwork = (projectId: string): NetworkData => {

    const [networkData, setNetworkData] = useState<NetworkData>({ nodes: [], links: [] });

    useEffect(() => {


        // console.log(projectId)

        if( projectId === "" ) return setNetworkData({ nodes: [], links: [] });

        try {
            
            axios.get(`http://localhost:3000/api/tasks/${projectId}`).then((response) => {

        

            const tasks: TaskType[] = response.data.tasks;
            const nodes: { id: string; label: string; description: string; size: number; color: string; status: string; isChild: boolean }[] = [];
            const links: { source: string; target: string; distance: number }[] = [];


            tasks.forEach((task) => {

                let color;
                switch(task.status) {
                    case 'To Do': color = '#ffafcc'; break;
                    case 'In Progress': color = '#bde0fe'; break;
                    case 'Done': color = '#80ed99'; break;
                    default: color = 'grey';
                }

                nodes.push({
                    id: task.tid,
                    label: task.name,
                    description: task.description,
                    size: 20,
                    color: color,
                    status: task.status,
                    isChild: task.parentId !== null
                });

                if (task.parentId) {
                    links.push({
                        source: task.parentId,
                        target: task.tid,
                        distance: 30,
                    });
                }
            });

            setNetworkData({ nodes, links });
        });
            
        } catch (error) {
            console.log(error)
        }


    }, [projectId]);

    return networkData;
};




