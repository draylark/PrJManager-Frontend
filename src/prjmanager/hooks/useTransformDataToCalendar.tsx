import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';



interface CalendarData {
  day: string;
  value: number;
}


type EventCounts = Record<string, number>;

export const useTransformDataToCalendar = () => {
  
  const { events } = useSelector((selector: RootState) => selector.events);
  const [data, setData] = useState<CalendarData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Objeto para almacenar la suma de eventos por día
    const eventCounts: EventCounts = {};

    // Iterar sobre cada evento
    events.forEach((event) => {
      // Formatear la fecha para que solo contenga la parte del día (en formato "YYYY-MM-DD")
      const dayString = new Date(event.startDate).toISOString().split("T")[0];
      
      // Agregar o actualizar la cuenta de eventos para el día
      if (eventCounts[dayString]) {
        eventCounts[dayString] += 1;
      } else {
        eventCounts[dayString] = 1;
      }
    });
    // Convertir el objeto en un array en el formato deseado
    const transformedData: CalendarData[] = Object.keys(eventCounts).map((day) => ({
      value: eventCounts[day],
      day,
    }));

    // Actualizar el estado con los datos transformados
    setData(transformedData);
    setIsLoading(false);

  }, [events]);


  return {
    data,
    isLoading,
  };
};


