import { useState } from 'react'

export const useHeatMapToolTip = () => {


    const [tooltipInfo, setTooltipInfo] = useState({ 
        visible: false, 
        x: 0, 
        y: 0, 
        content: '' 
    });

    const handleMouseOver = (e, date) => {
        // Obtener la posición del evento
        const rect = e.target.getBoundingClientRect();
        setTooltipInfo({
          visible: true,
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY - 40, // Ajuste para que aparezca encima
          content: date
        });
      };
    
      const handleMouseOut = () => {
        setTooltipInfo({
          ...tooltipInfo,
          visible: false
        });
      };
      


  return {
    tooltipInfo,
    setTooltipInfo,
    handleMouseOver,
    handleMouseOut,
    tooltip: (  
                <div 
                    style={{
                    position: 'absolute',
                    left: `${tooltipInfo.x}px`,
                    top: `${tooltipInfo.y}px`,
                    backgroundColor: 'white',
                    border: '1px solid black',
                    padding: '5px',
                    borderRadius: '3px',
                    zIndex: 1000
                    }}
                > 
                    {tooltipInfo.content}
                </div> 
             )
          
  }
}
