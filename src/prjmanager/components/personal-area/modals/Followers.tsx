import { useState, useEffect } from 'react'
import { ImCancelCircle } from "react-icons/im";
import { PuffLoader  } from 'react-spinners';

export const Followers = ({ isFollowersModalOpen, setIsFollowersModalOpen }) => {

    const [ render, setRender ] = useState('followers')

    const handleClose = () => {
        const modal = document.getElementById('followersModal');
        if (modal) {
            // Inicia la transición de opacidad a 0
            modal.classList.replace('opacity-100', 'opacity-0');
  
            // Espera a que la animación termine antes de ocultar el modal completamente
            setTimeout(() => {
                setIsFollowersModalOpen(false);
            }, 500); // Asume que la duración de tu transición es de 500ms
        }
    }
  
    useEffect(() => {
        if (isFollowersModalOpen) {
            // Asegúrate de que el modal existe antes de intentar acceder a él
            // Luego, después de un breve retraso, inicia la transición de opacidad
            const timer = setTimeout(() => {
            document.getElementById('followersModal').classList.remove('opacity-0');
            document.getElementById('followersModal').classList.add('opacity-100');
            }, 20); // Un retraso de 20ms suele ser suficiente
            return () => clearTimeout(timer);
        }
    }, [isFollowersModalOpen]);

  return (
    <div className='fixed flex w-screen h-full pb-5 top-0 right-0 justify-center items-center bg-black/30 z-50'>
        <div id="followersModal" 
            style={{
                // backgroundImage: isBackgroundReady ? `url(${formbg})` : 'none',
                // backgroundPosition: 'top right', // Muestra la parte superior izquierda de la imagen
            }}
            className={`flex flex-col w-[70%] md:w-[50%] md:max-h-[635px] md:h-[635px] items-center rounded-2xl bg-white glassi border-[1px] border-gray-400 transition-opacity duration-300 ease-in-out opacity-0 ${isFollowersModalOpen ? '' : 'pointer-events-none'}`}
        >
            <div className='flex justify-end w-[95%] h-12 ml-auto mr-auto mt-2 p-2 '>
                <button onClick={handleClose}>
                        <ImCancelCircle/>
                </button>                   
            </div>


            <div className='flex flex-col w-full h-full '>

                <div className='flex w-[95%] mx-auto h-11  border-b-2 space-x-1'>
                    <button 
                        onClick={() => setRender('followers')}
                        className={` ${render === 'followers' ? 'bg-gray-200' : ''} flex w-1/2 justify-center items-center  text-center text-sm hover:bg-gray-200 transition-colors duration-200 `}>
                        <h4>
                           Followers 
                        </h4>          
                    </button>
                    <button 
                        onClick={() => setRender('following')}
                        className={` ${render === 'following' ? 'bg-gray-200' : ''} flex w-1/2 justify-center items-center text-center text-sm hover:bg-gray-200 transition-colors duration-200`}>
                        <h4>
                           Following 
                        </h4>          
                    </button>
                </div>
                
                <div className='flex flex-grow'>

                </div>
            </div>



        </div>
    </div>
  )
}
