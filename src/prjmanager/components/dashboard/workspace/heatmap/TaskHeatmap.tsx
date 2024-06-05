import { useState } from 'react'
import HeatMap from '@uiw/react-heat-map';
import { Tooltip } from '@mui/material';

export const TaskHeatmap = ({ data, commitsDetailsByDay, createdAt }) => {

    const currentDate = new Date(createdAt)
    currentDate.setHours(23, 59, 59, 999);
    const sixMonthsAhead = new Date( currentDate )
    sixMonthsAhead.setMonth( currentDate.getMonth() + 6 )

    const [endDate, setEndDate] = useState(sixMonthsAhead);    
    const [startDate, setStartDate] = useState(currentDate);

    const formatDateFromHeatMap = (date: Date) => {
      // Asumiendo que date es una cadena en formato "YY/M/D"
      const parts = date.split("/"); // Separar la cadena por '/'
      const year = parts[0]; // Año ya está en formato YY
      const month = parts[1].padStart(2, '0'); // Añadir cero si es necesario para el mes
      const day = parts[2].padStart(2, '0'); // Añadir cero si es necesario para el día
      
      return `${year}-${month}-${day}`;
    };

    const TooltipContent = ({ formattedDate, details }) => {
    return (
        <div className='flex flex-col items-center'>
            {
              details.count === 872349287928342 
              ?  (
                <h2 className='font-mono'>
                  Task Started At:
                </h2>
              ) 
              : 
              details.count === 772349287928342 
              ?  (
                <h2  className='font-mono'>
                  Task Deadline:
                </h2>
              )
              : null    
            }
            <h3>{formattedDate}</h3>
            {
               details.count === 872349287928342 || details.count === 772349287928342
               ? (
                 <p>
                    commits: <span className=''>{details.commits}</span>
                 </p>
               ) : 
                <p>
                    commits: <span className=''>{details.count}</span>
                </p>
            }
        </div>
    );
    };  

  return (

    <div className='flex pl-6 pt-5 w-[95%] rounded-2xl mx-auto justify-center'>
            <HeatMap 
                panelColors={{
                    0: '#eff7ff',
                    2: '#caf0f8',
                    4: '#90e0ef',
                    10: '#00b4d8',
                    20: '#0077b6',
                    30: '#03045e',
                    872349287928342: "#FFFF00",
                }}
                width={380}
                value={data} 
                startDate={ startDate } 
                endDate={ endDate }
                rectSize={11}
                rectProps={{     
                    rx: 2,
                    ry: 2,
                    stroke: "gray",
                    strokeWidth: 0.2}}
                space={1}
                rectRender={(props, data) => {
                  const formattedDate = formatDateFromHeatMap(data.date); 
                  let details =  commitsDetailsByDay.get(formattedDate)
                  details = details || { count: 0 };

                  return (
                      <Tooltip 
                          title={<TooltipContent formattedDate={formattedDate} details={details} />} 
                          placement="top">
                          <rect {...props} />
                      </Tooltip>
                  );
                }}
            />
       

    </div>

                    
  )
}
