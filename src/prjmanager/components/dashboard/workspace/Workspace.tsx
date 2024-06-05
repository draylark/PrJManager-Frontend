import { useEffect, useState, useRef, useMemo } from 'react'
import { TaskSet } from './FollowingPointer'
import TextField from '@mui/material/TextField';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import axios from 'axios'
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { useSelector } from 'react-redux';
import { ScaleLoader } from 'react-spinners';
import { IoIosArrowForward, IoIosArrowBack  } from "react-icons/io";

export const Workspace = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const taskId = location.state?.task?.taskId
  const [tasks, setTasks] = useState(null)
  const { uid } = useSelector( state => state.auth )

  const [ isLoading, setIsLoading ] = useState(true);
  const [ errorMessage, setErrorMessage ] = useState(null);
  const [ errorWhileFetching, setErrorWhileFetching ] = useState(false);
  const [ready, setReady] = useState(false)

  const [filter, setFilter] = useState('')
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);  // Muestra la flecha izquierda si no estás en el inicio
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth);  // Muestra la flecha derecha si no estás al final
  };

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
  };

  // Agrega un efecto para añadir el evento de scroll después de montar el componente
  useEffect(() => {
    if(ready && scrollContainerRef.current){ 
      const container = scrollContainerRef.current;
      container.addEventListener('scroll', checkScroll);
      checkScroll();  // Verificación inicial por si la página carga en una posición no inicial

      // Limpieza del evento al desmontar
      return () => {
        container.removeEventListener('scroll', checkScroll);
      };
    }
  }, [ready]);

  useEffect(() => {
    setIsLoading(true)
    axios.get(`${backendUrl}/tasks/get-user-tasks/${uid}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('x-token')
      }
    })
      .then(res => {
        // console.log(res)
        setTasks(res.data.tasks)
        setIsLoading(false)
        setReady(true)
      })
      .catch(err => {
        console.log(err)
        setIsLoading(false)
        setErrorWhileFetching(true)
        setErrorMessage(err.response.data.message || 'An error occurred while fetching the task data')
      })
  }, [])


  const filteredTasks = useMemo(() => {
    if (filter === '') return tasks;
  
    return tasks.filter(task => {
      // Verificar filtro de capa por coincidencia de string y no sensibilidad a mayúsculas
      const filterLower = filter.toLowerCase();
      const byNumber = task.repository_number_task.toString().toLowerCase().includes(filterLower);
      // Verificar filtro de repositorio por inclusión de string
      const byName = task.task_name.toLowerCase().includes(filterLower);
  
      // Añade otras condiciones de filtrado aquí si es necesario
      return byNumber || byName;  // Usar OR para aumentar las posibilidades de coincidencia
    });
  }, [filter, tasks]);

// min-h-[730px] max-h-[730px]  min-w-[1380px] max-w-screen
if (taskId) {
    return ( <Outlet /> )
  }

  return (
    <div className='flex  flex-col w-[95%] h-[80%] overflow-x-auto   rounded-2xl treechart-container bg-white/40'>
      <div className="flex items-center justify-between w-full h-20  bg-white/40 rounded-t-2xl px-4">
        <h1 className='text-xl nav-button'>Select a task</h1>
        <TextField
          name="set"
          label="Number task Or Task Name"
          size='small'
          value={filter}
          
          onChange={e => setFilter(e.target.value)}
          sx={{
            width: 240
          }}
        />
      </div>
      {
          isLoading 
          ? 
              ( <div className='flex flex-grow items-center justify-center'>
                  <ScaleLoader  color="#32174D" size={20} /> 
              </div> ) 
        
          : errorWhileFetching 
          ?  ( <div className='flex flex-grow items-center justify-center'>
                  <h1 className='text-red-500'>{errorMessage}</h1>
              </div> )
          : 
          (
            <div className="relative flex flex-grow">  {/* Contenedor externo */}
                <div 
                  ref={scrollContainerRef} 
                  className='flex flex-grow space-x-2 overflow-x-auto rounded-b-2xl max-w-[81vw]' 
                  onScroll={checkScroll}  // Llamada al método para verificar el scroll
                >
                  {filteredTasks.map(taskSet => (
                    <TaskSet navigate={navigate} taskSet={taskSet} uid={uid} />
                  ))}
                </div>
                {showLeftArrow && (
                  <IoIosArrowBack 
                    size={30} 
                    className='absolute z-50 top-1/2 left-0 transform -translate-y-1/2 cursor-pointer transition-transform duration-150 ease-in-out active:translate-y-[1px]' 
                    onClick={scrollLeft}
                  />
                )}
                {showRightArrow && (
                  <IoIosArrowForward 
                    size={30} 
                    className='absolute z-50 top-1/2 right-0 transform -translate-y-1/2 cursor-pointer transition-transform duration-150 ease-in-out active:translate-y-[1px]' 
                    onClick={scrollRight}
                  />
                )}
            </div>
          )
      }   
    </div>
  )
}
