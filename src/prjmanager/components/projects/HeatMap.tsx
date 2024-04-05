import { useHeatMapData } from './hooks/useHeatMapData'
import HeatMap from '@uiw/react-heat-map';
import { TextField, MenuItem, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';


export const HeatMapComponent = ({ project }) => {

    const { uid } = useSelector((state) => state.auth);
    const { data, year, setYear, detailsMap, formatDateFromHeatMap } = useHeatMapData(project.pid, uid);

   const projectYear = new Date(project.startDate).getFullYear();
   const currentYear = new Date().getFullYear();
   const yearsRange = Array.from({ length: currentYear - projectYear + 1 }, (v, k) => projectYear + k);

   const startDate = new Date(`${year}/01/01`);
   const endDate = new Date(`${year}/12/31`);


   const TooltipContent = ({ formattedDate, details }) => {
        return (
            <div className='flex space-x-2'>
                <h3>{formattedDate} |</h3>
                <button 
                    className='hover:text-yellow-200 transition-colors duration-100'
                    onClick={() => console.log(`Commits: ${details.commits}`)}>
                    Commits: {details.commits}
                </button>
                <button 
                    className='hover:text-blue-200 transition-colors duration-100'
                    onClick={() => console.log(`Tasks: ${details.tasks}`)}>
                    Tasks: {details.tasks}
                </button>
            </div>
        );
    };  


    return (
        <div className='absolute bottom-6 w-[94%] flex flex-col h-[230px] rounded-2xl bg-blue-200/40 border-[1px] border-gray-400 '>


                <div className='flex w-full h-[70px] items-center px-[60px] justify-between pt-2'>
                    <div className='flex space-x-3'>
                        <h2 className='text-lg font-semibold'> 
                            {year}  
                        </h2>
                        <h2 className='text-lg font-semibold'>
                            General Contributions
                        </h2>
                    </div>
                    <TextField
                        select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        variant='standard'
                        size='small'
                        className='w-40'
                    >
                        {yearsRange.map((yr) => (
                            <MenuItem key={yr} value={yr.toString()}>
                                {yr}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>

                <div className='flex justify-center w-full  pt-1'>              
                        <HeatMap
                            value={data}
                            width={800}
                            startDate={startDate}
                            endDate={endDate}
                            panelColors={{
                                0: '#eff7ff',
                                2: '#90e0ef',
                                4: '#0096c7',
                                10: '#0077b6',
                                20: '#03045e',
                                30: 'black',
                            }}
                            rectRender={(props, data) => {
                                const formattedDate = formatDateFromHeatMap(data.date); 
                                const details = detailsMap.get(formattedDate) || { commits: 0, tasks: 0 };

                                return (
                                    <Tooltip 
                                        title={<TooltipContent formattedDate={formattedDate} details={details} />} 
                                        placement="right">
                                        <rect {...props} />
                                    </Tooltip>
                                );
                            }}
                        />  
                </div>
        </div>
    );
}
