import { useState } from 'react';
import HeatMap from '@uiw/react-heat-map';
import { ArrowLeftFilled, ArrowRightFilled } from '@ricons/material'
import { Icon } from '@ricons/utils';
import { useHeatMapDatesData } from './useHeatMapDates';
import { Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import { ScaleLoader   } from 'react-spinners';
import '../../styles.css'



export const HeatMapCalendar = () => {


  const [isTorC, setTorC] = useState(false);
  const { uid } = useSelector((state) => state.auth); 
  const { startDate, setStartDate, endDate, setEndDate, currentDate, 
    formatDateFromHeatMap, tasks, commits, 
    tasksDetailsByDay, commitsDetailsByDay, isLoading, errorWhileFetching, errorMessage } = useHeatMapDatesData(uid);


  const showYears = () => {

    const start = startDate.getFullYear();
    const end = endDate.getFullYear();

    if (start === end) {
      return start;
    } else {
      return `${start} - ${end}`;
    }
  }

  const handleLeftButtonClick = () => {
      const newEndDate = new Date(startDate);
      newEndDate.setDate(startDate.getDate() - 1);  // Un día antes del startDate actual

      const newStartDate = new Date(newEndDate);
      newStartDate.setMonth(newEndDate.getMonth() - 6);  // Retrocede 6 meses desde el newEndDate

      // Si el startDate retrocedido no cae en el mismo año que el endDate
      if (newStartDate.getFullYear() !== newEndDate.getFullYear()) {
        newStartDate.setFullYear(newEndDate.getFullYear());
        newStartDate.setMonth(0);  // Enero
        newStartDate.setDate(1);   // Primer día del año
        
        newEndDate.setFullYear(newEndDate.getFullYear());
        newEndDate.setMonth(5);  //r Junio
        newEndDate.setDate(30);  // Último día de junio
      }

      setStartDate(newStartDate);
      setEndDate(newEndDate);
  };

  const handleRightButtonClick = () => {
    const newStartDate = new Date(endDate);
    newStartDate.setDate(endDate.getDate() + 1);

    const newEndDate = new Date(newStartDate);
    newEndDate.setMonth(newStartDate.getMonth() + 6);
    newEndDate.setHours(23, 59, 59, 999);  // Asegurarnos de que esté cerca del final del día

    // Si newEndDate está en el futuro respecto a la fecha actual
    if (newEndDate > currentDate) {
        newEndDate.setTime(currentDate.getTime());  // Configurar newEndDate como la fecha actual
        const adjustedStartDate = new Date(currentDate);
        adjustedStartDate.setMonth(currentDate.getMonth() - 6);
        newStartDate.setTime(adjustedStartDate.getTime());  // Configurar newStartDate para que sea exactamente seis meses antes
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const TooltipContent = ({ formattedDate, details, type }) => {

    return (
        <div className='flex space-x-2'>
            <h3>{formattedDate} |</h3>
          {
              type === 'tasks' ? 
              <button 
                  className='hover:text-blue-200 transition-colors duration-100'
                  onClick={() => console.log(`Completed Tasks: ${details.tasks}`)}>
                  Completed Tasks: {details.count}
              </button>
              :
              <button 
                  className='hover:text-yellow-200 transition-colors duration-100'
                  onClick={() => console.log(`Commits: ${details.commits}`)}>
                  Commits: {details.count}
              </button>
          }
        </div>
    );
  };

  return (

    <div className='flex flex-col flex-grow'>

      <div className='flex items-center w-full justify-between pr-10 '>              
          <h3 className='text-lg w-[30%] font-bold text-sky-950 ml-5 mb-1'>Activity</h3>   
          <h3 className="text-sm text-sky-950 font-bold mt-[2px]">{showYears()}</h3>   
      </div>

      <div className='flex flex-col h-full w-full rounded-extra space-y-2 mt-3 px-2'>
          <div id="heatMap" className="flex flex-col w-[95%]">   

              <div id="heatMapOpt" className='flex w-full h-10 pl-2 space-x-3  rounded-extra'>
                    <button onClick={ handleLeftButtonClick } 
                    className='dashboard-buttons hover:bg-[#1f26870e] rounded-l-extra flex items-center justify-center w-[10%] h-8 transition-all duration-300 ease-in-out transform active:translate-y-[2px]'>
                      <Icon size={22}>
                        <ArrowLeftFilled/>
                      </Icon>
                    </button>
                  <button 
                      onClick={() => setTorC(!isTorC)}
                      className='h-8 w-[70%] text-sm  dashboard-buttons transition-transform duration-150 ease-in-out transform active:translate-y-[2px]'>
                        { !isTorC ? 'Tasks' : 'Commits' }
                  </button>
                    <button onClick={ handleRightButtonClick } 
                        className='dashboard-buttons hover:bg-[#1f26870e] rounded-r-extra flex items-center justify-center w-[10%] h-8 transition-all duration-300 ease-in-out transform active:translate-y-[2px]'>
                      <Icon size={22}>
                        <ArrowRightFilled/>
                      </Icon>
                    </button>

              </div>

              <div id='calendar' className='w-full mt-4 overflow-visible pl-2'>

                {
                  isLoading 
                  ? (
                      <div className='flex justify-center items-center  min-h-[150px]'>
                        <ScaleLoader color='#0c4a6e' loading={true} />
                      </div>
                    ) 
                  : errorWhileFetching
                  ? (
                      <div className='flex justify-center items-center  min-h-[150px]'>
                        <p className='text-red-500 text-[14px] text-center font-semibold'>{errorMessage}</p>
                      </div>
                    )
                  :
                    (
                      <HeatMap 
                        style={{ width: '100%'}}
                        panelColors={{
                            0: '#eff7ff',
                            2: '#caf0f8',
                            4: '#90e0ef',
                            10: '#00b4d8',
                            20: '#0077b6',
                            30: '#03045e',
                        }}
                        value={!isTorC ? tasks : commits} 
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
                          let details = !isTorC ? tasksDetailsByDay.get(formattedDate) : commitsDetailsByDay.get(formattedDate)
                          details = details || { count: 0 };
                          const type = !isTorC ? 'tasks' : 'commits';

                          return (
                              <Tooltip 
                                  title={<TooltipContent formattedDate={formattedDate} details={details} type={type} />} 
                                  placement="right">
                                  <rect {...props} />
                              </Tooltip>
                          );
                        }}
                      />
                    )
                }
                  
              </div>
          </div>
        </div>
    </div>
  );
}

