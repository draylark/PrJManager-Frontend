import React, { useEffect, useRef } from "react";
import { indexEventsByDay } from "../../../helpers/indexEventsByDay";
import dayjs from "dayjs";

type EventsByDay = { [key: string]: Event[] };

interface Event {
  title: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface CalendarToolTipProps {
  events: Event[];
  currentDay: string;
}

const CalendarToolTip: React.FC<CalendarToolTipProps> = ({ events, currentDay }) => {

  const tooltipRef = useRef<HTMLDivElement>(null); // Especifique el tipo de elemento aquí
  const eventsByDay: EventsByDay = indexEventsByDay(events);
  const eventsForCurrentDay = eventsByDay[currentDay] || [];

  useEffect(() => {

    const tooltip = document.querySelector('#tooltip-root') as HTMLDivElement; // Asegúrese de que el tipo sea correcto

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const offsetX = x + -200;
      const offsetY = y + -410;
      tooltip.style.left = `${offsetX}px`;
      tooltip.style.top = `${offsetY}px`;
    };

    const handleWheel = (e: WheelEvent) => {
      if (tooltipRef.current) {
        tooltipRef.current.scrollTop += e.deltaY;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      document.removeEventListener('mousemove', handleMouseMove);
    };

  }, []);

  return (
    <div ref={tooltipRef} className="w-[350px] h-[400px] flex flex-col items-center overflow-y-auto p-3">
      {eventsForCurrentDay.map((event, index) => {
        const formattedStartDate = dayjs(event.startDate).format('MMMM D, YYYY h:mm A');
        const formattedEndDate = dayjs(event.endDate).format('MMMM D, YYYY h:mm A');
        
        return (
          <div className="flex flex-col p-4 w-[90%] info-box-shadow2 mt-5 rounded-extra" key={index}>
                <div className="flex flex-col">
                    <p className="text-xl flex font-bold ml-2">{event.title}</p>
                </div>
                <div className="flex flex-col mt-2">
                    <p className="text-lg flex ml-2"><p className="font-bold text-sm">From:</p><h4 className="text-sm ml-2">{formattedStartDate} to {formattedEndDate}</h4> </p>
                </div>

                <p className="flex mt-5 ml-2 text-sm font-bold">Description: <p className="ml-2 font-normal truncate">{ event.description }</p> </p>
            </div>   
        );
      })}
    </div>
  );
};

export default CalendarToolTip;


