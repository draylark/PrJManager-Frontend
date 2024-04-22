import { useState } from 'react';
import { RootState } from '../../../../../store/store';
import { useSelector } from 'react-redux';

interface HeatMapData {
    date: string,
    count: number
}

export const useHeatMapDatesData = () => {

    const currentDate = new Date()
    currentDate.setHours(23, 59, 59, 999);
    const sixMonthsAgo = new Date( currentDate )
    sixMonthsAgo.setMonth( currentDate.getMonth() - 6 )


    const [startDate, setStartDate] = useState(sixMonthsAgo);
    const [endDate, setEndDate] = useState(currentDate);
    // const { tasks } = useSelector( ( state: RootState ) => state.task )

    const tasks = []


    const doneTasks = tasks.reduce<HeatMapData[]>((acc, task) => {

        if (task.status === 'Done' && task.endDate !== null) {
            const date = new Date(task.endDate);
            const formattedEndDate = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
            
            const existingTask = acc.find(obj => obj.date === formattedEndDate);
            if (!existingTask) {
                acc.push({ date: formattedEndDate, count: 1 });
            } else {
                existingTask.count += 1;
            }
        }
        return acc;
    }, []);


  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    currentDate,
    sixMonthsAgo,
        doneTasks
  }

}
