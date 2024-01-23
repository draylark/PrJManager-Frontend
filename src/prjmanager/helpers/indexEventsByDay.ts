
export const indexEventsByDay = (eventsArray) => {
    
    const eventsByDay = {};
  
    eventsArray.forEach((event) => {
      const dayString = new Date(event.startDate).toISOString().split("T")[0]; // Extraer solo la parte del día
  
      if (!eventsByDay[dayString]) {
        eventsByDay[dayString] = [];
      }
  
      eventsByDay[dayString].push(event);
    });
  
    return eventsByDay;

};