import { useSelector } from "react-redux"
import { useState, useEffect, useRef, FC } from "react";
import { RootState } from "../../../store/store";
import '../styles/styles.css'


type MyComponentProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};


export const ModalNotis: FC<MyComponentProps> = ({ setIsOpen }) => {

    const { notis } = useSelector( (selector: RootState) => selector.notis);
    const [isActive, setIsActive] = useState(false);
    const modalRef = useRef(null);


    const handleClick = () => {
        setIsOpen( false )
    };


    useEffect(() => {
      // Añade un pequeño retraso para iniciar la animación
      const timer = setTimeout(() => {
        setIsActive(true);
      }, 50);
  
      return () => {
        clearTimeout(timer);
      };
    }, []);


    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
  
      // Agregar el escuchador de eventos al montar el componente y removerlo al desmontarlo
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [setIsOpen]);
  

    const animationClasses = isActive ? 'opacity-100' : 'opacity-0';

  return (

    <>
    
        <div  ref={modalRef} data-popover id="popover-notications" role="tooltip" className={`transition-opacity duration-700 ease-in-out ${animationClasses} modal-glass w-80 mt-16 mr-46 absolute z-10 text-sm text-white rounded-lg shadow-sm`}>
          <div className="p-3">
            
            <p className="text-sky-950 font-bold mb-2">Notifications</p>

            {/* Contenedor con scroll vertical */}
            <div className="h-48 overflow-y-auto">
              {/* Iteramos sobre el arreglo de notificaciones */}
              <ul>

              
              {
                  notis && notis.length > 0 ?
                    (
                      notis.map((noti, index) => (
                        <li key={index} className="grapth-glass border-2 border-gray-500 rounded-lg mb-2 p-3 shadow">
                          {/* Aquí puedes renderizar los detalles de cada notificación como quieras */}
                          <p className="text-black text-xl font-semibold">{noti.title}:</p>
                          <p className="text-gray-600">{noti.description}</p>
                        </li>
                      ))
                    )
                  : <p className="text-sky-950">There are currently no notifications.</p>
              }

              </ul>
            </div>
          </div>

          <button
            onClick={handleClick}
            type="button"
            className="inline-flex items-center justify-center w-full px-5 py-2 mt-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
            Close
          </button>
      </div>
  
  </>
  )
}
