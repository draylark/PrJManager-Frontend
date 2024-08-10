import { useEffect, useState } from 'react'
import { ImCancelCircle } from "react-icons/im";
import { ScaleLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import axios from 'axios'
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { FaConnectdevelop } from "react-icons/fa6";
import { formateDate } from '../../../helpers/helpers';
import { RootState } from '../../../../store/store';
import Swal from 'sweetalert2';

type Connection = {
    _id: string;
    EXTUID: string;
    username: string,
    email: string,
    createdAt: string;
    updatedAt: string
}

interface Props {
    isConnectionModalOpen: boolean;
    setIsConnectionModalOpen: (value: boolean) => void;
}


export const ExtConnections: React.FC<Props> = ({isConnectionModalOpen, setIsConnectionModalOpen}) => {


    const { uid } = useSelector((state: RootState) => state.auth)
    const [isLoading, setIsLoading] = useState(true)
    const [connections, setConnections] = useState<Connection[] | null>(null)
    const [handlingConnection, setHandlingConnection] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [errorWhileFetching, setErrorWhileFetching] = useState(false);


    const updateConnections = (id: string) => {
        if(!connections) return
        const newConnections = connections.filter((connection) => connection._id !== id)
        setConnections(newConnections)
        setHandlingConnection(null)

        Swal.fire({
            icon: 'success',
            title: 'Connection removed successfully',
            showConfirmButton: false,
            timer: 1500
        })
    };

    const fetchConnections = async () => {
        try {
            const res = await axios.get(`${backendUrl}/users/connections/${uid}`)
            setConnections(res.data.connections)
            setIsLoading(false)
        } catch (error) {
            setErrorMessage('Error while fetching connections')
            setErrorWhileFetching(true)
            setIsLoading(false)
        }
    };

    const deleteConnection = async (NPMUID: string, EXTUID: string) => {
        setHandlingConnection(NPMUID)
        try {
            const resp = await axios.delete(`${backendUrl}/users/connections/${uid}`, {
                params: {
                    NPMUID: NPMUID,
                    EXTUID: EXTUID
                }
            })
            if (resp.data.success) {       
                setTimeout(() => {
                    updateConnections(NPMUID)
                }, 1000);
            }
        } catch (error) {
            setHandlingConnection(null)
            setIsLoading(false)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            })
        }
    };

    const handleClose = () => {
        const modal = document.getElementById('connectionModal');
        if (modal) {
            // Inicia la transición de opacidad a 0
            modal.classList.replace('opacity-100', 'opacity-0');

            // Espera a que la animación termine antes de ocultar el modal completamente
            setTimeout(() => {
                setIsConnectionModalOpen(false);
            }, 500); // Asume que la duración de tu transición es de 500ms
        }
    };

    useEffect(() => {
        if (isConnectionModalOpen) {
            // Asegúrate de que el modal existe antes de intentar acceder a él
            // Luego, después de un breve retraso, inicia la transición de opacidad
            const timer = setTimeout(() => {
            document.getElementById('connectionModal')?.classList.remove('opacity-0');
            document.getElementById('connectionModal')?.classList.add('opacity-100');
            }, 20); // Un retraso de 20ms suele ser suficiente
            return () => clearTimeout(timer);
        }
    }, [isConnectionModalOpen]);

    useEffect(() => {
            fetchConnections()          
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


  return (
    <div className='fixed flex w-screen h-full pb-5 top-0 right-0 justify-center items-center bg-black/30 z-50'>
        <div id="connectionModal" 
            className={`flex flex-col space-y-3 w-[70%] md:w-[40%] md:max-h-[635px]  overflow-hidden items-center rounded-2xl bg-white glassi border-[1px] border-gray-400 transition-opacity duration-300 ease-in-out opacity-0 ${isConnectionModalOpen ? '' : 'pointer-events-none'}`}
        >
            <div className='flex justify-between w-[95%] h-12 ml-auto mr-auto mt-2 p-2'>
                <h3 className='text-lg font-semibold'> 
                     { connections?.length || 0 } Connections
                </h3>
                <button onClick={handleClose}>
                        <ImCancelCircle/>
                </button>                   
            </div>

            {
                isLoading 
                ?
                    <div className='flex flex-grow justify-center items-center py-10'>
                        <ScaleLoader color={'#000'} loading={isLoading}  />
                    </div>
                :
                errorWhileFetching
                ?
                    <div className='flex flex-grow justify-center items-center py-10'>
                        <h3 className='text-lg font-semibold text-red-500'> 
                            {errorMessage}
                        </h3>
                    </div>
                :
                <div className='flex flex-grow flex-col w-full px-4 overflow-y-auto py-5 max-h-[400px]'>     
                    {
                        connections && connections.length > 0 
                        ?
                            connections.map((connection, index) => (
                                <div key={index} className='flex w-full pl-4 pr-5 justify-between border-[1px] border-gray-400 rounded-lg p-3'>
                                    <div className='flex space-x-3 w-full h-full'>                    
                                        <div className='flex justify-center items-center w-12 h-12 bg-gray-200 rounded-full'>
                                            <FaConnectdevelop className='text-2xl text-gray-500'/>
                                        </div>

                                        <div className='flex w-full  flex-col'>
                                            <h3 className='text-sm font-semibold'> 
                                                {connection.username}
                                            </h3>
                                            <h3 className='text-xs font-semibold'> 
                                                {connection.email}
                                            </h3>  
                                            <h3 className='text-xs font-semibold'> 
                                               <span>Connected At: </span> {formateDate(connection.createdAt)}
                                            </h3>  
                                                                                      
                                        </div>
                                    </div>

                                    {
                                        handlingConnection === connection._id
                                        ?
                                            <div className='flex justify-center items-center px-4'>
                                                <ScaleLoader color={'#000'} loading={true}  />
                                            </div>
                                        :                            
                                        <div className='flex justify-center items-center px-4 rounded-2xl text-red-500 hover:text-white hover:bg-red-500 transition-colors duration-100'>
                                            <button 
                                                onClick={() => deleteConnection(connection._id, connection.EXTUID)}
                                                className='text-sm font-semibold'
                                            >                               
                                              Remove
                                            </button>    
                                        </div>
                                    }
                                </div>
                            ))
                        :
                        <div className='flex flex-grow justify-center items-center py-10'>
                            <h3 className='text-lg font-semibold'> 
                                No connections
                            </h3>
                        </div>
                    }

                </div>
            }
        </div>
    </div>
  )
}
