import { useState } from 'react'
import { TextField, MenuItem, Tooltip } from '@mui/material';
import HeatMap from '@uiw/react-heat-map';
import { useProfileHeatMapData } from './hooks/useProfileHeatMapData';
import { ScaleLoader } from 'react-spinners';
import { useLocation } from 'react-router-dom';

export const ProfileHeatMap = ({ user, year, setYear, data, detailsMap, formatDateFromHeatMap, fetchingUserActivity, errorWhileFetching, errorMessage }) => {


    // const location = useLocation()
    // const [year, setYear] = useState(new Date().getFullYear().toString());
    // const { data, detailsMap, formatDateFromHeatMap, fetchingUserActivity, errorWhileFetching, errorMessage } = useProfileHeatMapData(location, year);

    const userCreatedAt = new Date(user.createdAt).getFullYear();
    const currentYear = new Date().getFullYear();
    const yearsRange = Array.from({ length: currentYear - userCreatedAt + 1 }, (v, k) => userCreatedAt + k);
 
    const startDate = new Date(`${year}/01/01`);
    const endDate = new Date(`${year}/12/31`);


    const TooltipContent = ({ formattedDate, details }) => {
        return (
            <div className='flex space-x-2'>
                <h3>{formattedDate} |</h3>
                <span 
                    className='hover:text-yellow-200 transition-colors duration-100'
                    >
                    Commits: {details.commits}
                </span>
                <span 
                    className='hover:text-blue-200 transition-colors duration-100'
                    >
                    Tasks: {details.tasks}
                </span>
            </div>
        );
   };  

  return (
    <div className='flex flex-col h-full rounded-2xl bg-blue-200/40 border-[1px] border-gray-400'>
        {
            fetchingUserActivity
            ? (                 
                <div className='flex flex-grow justify-center items-center'>
                    <ScaleLoader color='#0c4a6e' loading={true} />
                </div>                  
                )
            :
            errorWhileFetching
            ? (
                <div className='flex justify-center items-center h-full'>
                    <h2 className='text-lg font-semibold text-red-400'> {errorMessage} </h2>
                </div>
                )
            :
            <>
                <div className='flex w-full h-[65px] items-center pt-2 px-[60px] justify-between'>
                    <div className='flex space-x-3 '>
                        <h2 className='text-lg font-semibold'>
                             Activity
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

                <div className='flex justify-center w-[80%] mx-auto  pt-1'>              
                        <HeatMap
                        rectSize={14}
                            value={data}
                            width={1000}
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
            </>
        }
    </div>
  )
}
