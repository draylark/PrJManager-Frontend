import { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export const NpmAuth = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [respStatus, setRespStatus] = useState({});
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const authCode = queryParams.get('code');
    const npmsocketid = queryParams.get('npmsocket');
    const type = queryParams.get('type');
    const timeoutRef = useRef(null); // Referencia para el temporizador

    useEffect(() => {
        const newSocket = io('http://localhost:8081');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            setIsConnected(true);
        });

        return () => newSocket.close();
    }, []);

    const sendCodeToExtension = async (code) => {
        if (!socket || !isConnected) {
            console.log('Socket no está conectado');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3002/receive-code', { code, FRONTENDTID: socket.id });
            socket.on('authenticationResult', (data) => {
                console.log(data)
                setRespStatus( data.status.authStatus || data.status );
                setIsLoading(false);
                clearTimeout(timeoutRef.current); // Limpia el temporizador
                socket.close()
            });

            // Iniciar el temporizador
            timeoutRef.current = setTimeout(() => {
                if (isLoading) {
                    setRespStatus({ success: false, message: 'Network error or timed out' });
                    setIsLoading(false);
                    socket.close()
                }
            }, 60000); // 60 segundos

        } catch (error) {
            console.error('Error al enviar el código:', error);
            setRespStatus({ success: false, message: 'Network error or timed out' });
            setIsLoading(false);
        }
    };

    const handleNpmAuth = async () => {
        console.log(npmsocketid)
        console.log(type)
    }

    useEffect(() => { 
        console.log(respStatus)
        if (!respStatus || typeof respStatus.success === 'undefined') return; // Verifica si respStatus tiene la propiedad success

        if (respStatus.success) {
                Swal.fire(
                    'Done!',
                    respStatus.message,
                    'success'
                )
            setTimeout(() => {
                window.close()
            }, 5000);
        } else {
            Swal.fire(
                'Error',
                respStatus.message,
                'error'
            )
        }
    }, [respStatus])
    
    
    useEffect(() => {
        if (authCode && isConnected && !type && !npmsocketid ) {
            sendCodeToExtension(authCode);
        } else {

            handleNpmAuth()
        }
    }, [authCode, isConnected]);

    if (!authCode) return <Navigate to='/register'/>;

    return (
        <div className="flex w-screen h-screen justify-center items-center">      
            <div className="flex glass2 w-[95%] h-[95%] rounded-extra border-1 border-gray-400 justify-center items-center">         
                {
                    isLoading ? <LoadingCircle/> 
                    : <>
                    
                        {
                            respStatus.success ? 
                            <div className="flex flex-col justify-center items-center">
                                <h1 className="text-4xl font-bold text-gray-700">Successful authentication</h1>
                                <p className="text-lg font-semibold text-gray-700">You can now close this window</p>
                             </div>                           
                            : 
                            <div className="flex flex-col justify-center items-center">
                                <h1 className="text-4xl font-bold text-gray-700">Ups! There was an error authenticating</h1>
                                <p className="text-lg font-semibold text-gray-700">please try again.</p>
                            </div>
                        }
                    
                    </>
                }
            </div>    
        </div>
    );
}
