import { useState, useEffect } from 'react';
import axios from 'axios';

type Data = {
    proyecto: string;
    progreso: number;
};

interface UseProgressCalculatorReturnType {
    data: Data[];
}

export const useProgressCalculator = (projectIds: string[]): UseProgressCalculatorReturnType => {
  
    const [data, setData] = useState<Data[]>([]);

    useEffect(() => {
     
        if (!projectIds || projectIds.length === 0) {
            setData([]);
        } else {
            // console.log('holis');
            Promise.all(
                projectIds.map((projectId) =>
                    axios.all([
                        axios.get(`http://localhost:3000/api/projects/calculate-progress/${projectId}`),
                        axios.get(`http://localhost:3000/api/projects/get-project-by-id/${projectId}`),
                    ])
                )
            )
            .then((responses) => {
                const newData = responses.map((response) => {
                    const progress = parseFloat(response[0].data.progress.toFixed(2));
                    const projectName = response[1].data.project.name;
                    return {
                        proyecto: projectName,
                        progreso: progress,
                    };
                });
                setData(newData);
            })
            .catch((errors) => {
                console.log(errors);
            }); 
        }
    }, [projectIds]);

    return {
        data,
    };
};