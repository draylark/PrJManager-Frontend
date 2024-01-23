// import { useState } from 'react';
import HeatMap from '@uiw/react-heat-map';
// import { ArrowLeftFilled, ArrowRightFilled } from '@ricons/material'
import { useHeatMapToolTip } from '../../dashboard/general/Heatmap/useHeatMapToolTip';
// import { Icon } from '@ricons/utils';
// import { useHeatMapDatesData } from './useHeatMapDates';


export const HeatMapCalendar = ({ project }) => {


//   const [isTorC, setTorC] = useState(false);
  const { tooltipInfo, handleMouseOver, handleMouseOut, tooltip } = useHeatMapToolTip()
//   const { startDate, setStartDate, endDate, setEndDate, currentDate, doneTasks } = useHeatMapDatesData()


//   const handleLeftButtonClick = () => {
//     const newEndDate = new Date(startDate);
//     newEndDate.setDate(startDate.getDate() - 1);  // Un día antes del startDate actual

//     const newStartDate = new Date(newEndDate);
//     newStartDate.setMonth(newEndDate.getMonth() - 6);  // Retrocede 6 meses desde el newEndDate

//     // Si el startDate retrocedido no cae en el mismo año que el endDate
//     if (newStartDate.getFullYear() !== newEndDate.getFullYear()) {
//       newStartDate.setFullYear(newEndDate.getFullYear());
//       newStartDate.setMonth(0);  // Enero
//       newStartDate.setDate(1);   // Primer día del año
      
//       newEndDate.setFullYear(newEndDate.getFullYear());
//       newEndDate.setMonth(5);  //r Junio
//       newEndDate.setDate(30);  // Último día de junio
//     }

//     setStartDate(newStartDate);
//     setEndDate(newEndDate);
// };

// const handleRightButtonClick = () => {
//   const newStartDate = new Date(endDate);
//   newStartDate.setDate(endDate.getDate() + 1);

//   const newEndDate = new Date(newStartDate);
//   newEndDate.setMonth(newStartDate.getMonth() + 6);
//   newEndDate.setHours(23, 59, 59, 999);  // Asegurarnos de que esté cerca del final del día

//   // Si newEndDate está en el futuro respecto a la fecha actual
//   if (newEndDate > currentDate) {
//       newEndDate.setTime(currentDate.getTime());  // Configurar newEndDate como la fecha actual
//       const adjustedStartDate = new Date(currentDate);
//       adjustedStartDate.setMonth(currentDate.getMonth() - 6);
//       newStartDate.setTime(adjustedStartDate.getTime());  // Configurar newStartDate para que sea exactamente seis meses antes
//   }

//   setStartDate(newStartDate);
//   setEndDate(newEndDate);
// };


    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString();  // Retorna, por ejemplo, "9/17/2023"
    }


  return (

    <>
      { tooltipInfo.visible && tooltip }



              <div id='calendar' className='w-full h-full mt-4 overflow-visible '>
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
                    value={ undefined } 
                    startDate={ new Date( formatDate( project.startDate )) } 
                    endDate={ undefined }
                    rectSize={15}
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

    </>
  );
}

