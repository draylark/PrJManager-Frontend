import React, { useEffect, useRef } from 'react';
import { Timeline } from 'vis-timeline/standalone';

const VisTimeline = () => {
  const timelineRef = useRef(null); // Referencia para montar el timeline

  useEffect(() => {
    // Datos de ejemplo para los ítems del timeline
    const items = [
      {id: 1, content: 'item 1', start: '2021-04-20'},
      {id: 2, content: 'item 2', start: '2021-04-14'},
      {id: 3, content: 'item 3', start: '2021-04-18'}
    ];

    // Opciones de configuración del timeline
    const options = {};

    // Crear el timeline
    const timeline = new Timeline(timelineRef.current, items, options);

    return () => {
      timeline.destroy();
    };
  }, []);

  return <div className='flex flex-grow border-2 border-black' ref={timelineRef} style={{ height: '400px' }} />;
};

export default VisTimeline;