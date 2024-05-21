import React, { useState, useEffect } from 'react';

export const TreeNodeToolTip = ({ data, id, position, visible, type }) => {
  const [toolTipData, setToolTipData] = useState(null);

  // Función para buscar un nodo por ID en la estructura jerárquica
  const findNodeById = (treeNode, nodeId) => {
    if (treeNode.id === nodeId) {
      return treeNode;
    }

    if (treeNode.children) {
      for (const child of treeNode.children) {
        const foundNode = findNodeById(child, nodeId); // Búsqueda recursiva en los hijos
        if (foundNode) {
          return foundNode;
        }
      }
    }

    return null; // Devuelve null si no se encuentra el nodo
  };

  const removePrefix = (name) => {
    return name.replace(/^[^-]+-/, ''); // Elimina todo antes del primer guion
  };

  const capitalizeFirstLetter = (text) => {
    if (!text) return ''; // Si el texto está vacío o es undefined, devuelve una cadena vacía
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  useEffect(() => {
    const fetchToolTipData = () => {
      let item;

      switch (type) {
        case 'project':
          item = findNodeById(data, id); // Encuentra el proyecto por ID
          break;
        case 'task':
          item = findNodeById(data, id); // Encuentra la tarea por ID
          break;
        case 'layer':
          item = findNodeById(data, id); // Encuentra la capa por ID
          break;
        case 'repo':
          item = findNodeById(data, id); // Encuentra el repositorio por ID
          break;
        case 'user':
          item = findNodeById(data, id); // Encuentra el usuario por ID
          break;
        default:
          break;
      }

      setToolTipData(item); // Establece la información para el tooltip
    };

    if (visible) {
      fetchToolTipData(); // Solo obtiene datos si el tooltip es visible
    }
  }, [type, id, visible, data]);

  if (!visible) {
    return null; // No muestra el tooltip si no es visible
  }

  const formatDate = (date) => {
    const formattedDate = new Date(date).toLocaleDateString();
    return formattedDate;
  };

  if(toolTipData?.type === 'user') return;

  return (
    <div
      className={`absolute p-3 z-50 min-w-[400px] max-w-[450px] rounded-lg shadow-lg glass border-[1px] ${
        type === 'project' ? 'border-blue-400' : type === 'layer' ? 'border-pink-400' : type === 'repo' ? 'border-green-400' : 'border-blue-600'
      }`}
      style={{ top: position.top + 10, left: position.left - 250 }}
    >
      {type === 'project' && toolTipData && (
        <div className='flex flex-col space-y-2 p-2'>
            <div className='flex justify-between'>
                <div className='text-blue-400 font-bold'>{removePrefix(toolTipData.name)}</div>
                <div className='text-[12px]'>#{toolTipData.id}</div>
            </div>
          
          <div className='text-sm'>{toolTipData.description}</div>

          <div className='flex space-x-2'>
            <div className='text-sm'>Start Date: {formatDate(toolTipData.startDate)}</div>
            <div className='text-sm'>End Date: {formatDate(toolTipData.endDate)}</div>
          </div>

          {/* <div className='text-sm'>Status: {toolTipData.status}</div> */}
          <div className='text-[12px] text-slate-600 font-mono'>{toolTipData.tags?.join(', ')}</div>
        </div>
      )}

      {type === 'task' && toolTipData && (
        <div className='flex flex-col space-y-2'>
            <div className='flex flex-col'>
                <div className='flex justify-between'>
                    <div className='text-blue-500 font-bold truncate w-[200px] cursor-pointer'>{removePrefix(toolTipData.name)}</div>
                    <div className='text-[12px]'>#{toolTipData.id}</div>
                </div>
                <div className='flex space-x-2'>
                    <div className='text-[12px]'>{capitalizeFirstLetter(toolTipData.status)}</div>
                    <div className='text-[12px]'>{capitalizeFirstLetter(toolTipData.priority)}</div>
                </div>
            </div>
            <div className='text-sm'>{toolTipData.description}</div>
            <div className='text-[12px]'>Estimated hours: {toolTipData?.additional_info?.estimated_hours}h</div>

            <div className='flex justify-between mb-3'>

                
                <div className="flex -space-x-2">
                    {
                        toolTipData?.contributorsIds && toolTipData?.contributorsIds.length > 0
                        ? toolTipData?.contributorsIds
                            .sort((a, b) => {
                                if (a.photoUrl && !b.photoUrl) {
                                    return -1;
                                } else if (!a.photoUrl && b.photoUrl) {
                                    return 1;
                                }
                                return 0;
                            })
                            .slice(0, 3)
                            .map((contributor) => (
                                <img
                                    key={contributor._id}
                                    className="w-5 h-5 border-2 border-white rounded-full dark:border-gray-800"
                                    src={contributor.photoUrl || `https://dummyimage.com/500x500/000/fff&text=${contributor.username.charAt(0).toUpperCase()}`}
                                    alt={`${contributor.username}'s profile`}
                                    onError={(e) => {
                                        e.target.onerror = null; // prevents looping
                                        e.target.src = `https://dummyimage.com/500x500/000/fff&text=${contributor.username.charAt(0).toUpperCase()}`;
                                    }}
                                />
                            ))
                        : null
                    }

                    {
                         toolTipData?.contributorsIds && toolTipData?.contributorsIds.length > 3 && (
                            <a
                                className="flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-gray-400 border-2 border-white rounded-full hover:bg-gray-500 dark:border-gray-800"
                                href="#"
                            >
                                +{toolTipData.contributorsIds.length - 3}
                            </a>
                            )
                    }
                </div>

                <div className='text-sm'>Deadline: <span className='text-red-500'>{formatDate(toolTipData.deadline)}</span> </div>
            </div>


        </div>
      )}

      {type === 'repo' && toolTipData && (
        <div className='flex flex-col space-y-2'>
            <div className='flex  justify-between'>
                <div className='text-green-500 font-bold'>{removePrefix(toolTipData.name)}</div>
                <div className='text-[12px]'>#{toolTipData.id}</div>
            </div>
          <div className='text-sm'>{toolTipData.description}</div>
        </div>
      )}

      {type === 'layer' && toolTipData && (
        <div className='flex flex-col space-y-2'>
            <div className='flex min-w-[] justify-between'>
                <div className='text-pink-400 font-bold'>{removePrefix(toolTipData.name)}</div>
                <div className='text-[12px]'>#{toolTipData.id}</div>
            </div>
          
          <div className='text-sm'>{toolTipData.description}</div>
        </div>
      )}
    </div>
  );
};
