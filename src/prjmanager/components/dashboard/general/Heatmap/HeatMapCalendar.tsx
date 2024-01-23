import { useState } from 'react';
import HeatMap from '@uiw/react-heat-map';
import { ArrowLeftFilled, ArrowRightFilled } from '@ricons/material'
import { useHeatMapToolTip } from './useHeatMapToolTip';
import { Icon } from '@ricons/utils';
import { useHeatMapDatesData } from './useHeatMapDates';
import '../../styles.css'


export const HeatMapCalendar = () => {


  const [isTorC, setTorC] = useState(false);
  const { tooltipInfo, handleMouseOver, handleMouseOut, tooltip } = useHeatMapToolTip()
  const { startDate, setStartDate, endDate, setEndDate, currentDate, doneTasks } = useHeatMapDatesData()


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



  return (

    <>
      { tooltipInfo.visible && tooltip }


      <div className='flex w-full'>              
          <h3 className='text-lg w-[30%] font-bold text-sky-950 mt-5 ml-5'>Activity</h3>       
      </div>

      <div className="text-sm ml-5 font-bold">
        {startDate.getFullYear()}
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

              <div id='calendar' className='w-full mt-4 overflow-visible pl-2 '>
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
                    value={doneTasks} 
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
                      return (
                        <rect 
                          {...props} 
                          onMouseOver={(e) => handleMouseOver(e, data.date)}
                          onMouseOut={handleMouseOut}
                         />
                      );
                    }}
                  />
              </div>
          </div>
        </div>
    </>
  );
}

