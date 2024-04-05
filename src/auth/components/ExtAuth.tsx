import { useLocation, Navigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import Swal from "sweetalert2";
import LoadingCircle from "../helpers/Loading";
import { decodeParams } from "../helpers/decodeParams";

const ExtAuth = () => {

    const timeoutRef = useRef(null); // Referencia para el temporizador
    const [isLoading, setIsLoading] = useState(true)
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [respStatus, setRespStatus] = useState({});
    const location = useLocation();

    const { authCode, npmsocketid, type, port } = decodeParams(location.search);

    const sendCodeToExtension = async (code) => {
        if (!socket || !isConnected) {
            console.log('Socket no está conectado');
            return;
        }

        try {
            await axios.post(`http://localhost:${port}/receive-code`, { code, FRONTENDTID: socket.id });
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
        if (!socket || !isConnected) {
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/auth/extension-auth-user', { code: authCode });    
            const { data } = response;

            console.log('Desde onPrJCUPersistance', data )

            if( data.status === true ) {
                socket.emit('onPrJCUPersistance', { type: 'NPM', success: true, npmsocketid, user: data.user, pat: data.pat, token: data.token }, (response) => {                                   
                    setRespStatus(response);
                    setIsLoading(false);
                    clearTimeout(timeoutRef.current); // Limpia el temporizador
                    socket.close();
                });
            } else {
                socket.emit('onPrJCUPersistance', { npmsocketid, success: false, message: data.msg } );
                setRespStatus({ success: false, message: data.msg || 'There was an error during authentication' });
                setIsLoading(false);
                clearTimeout(timeoutRef.current); // Limpia el temporizador
                socket.close();              
            }
            // // Iniciar el temporizador
            timeoutRef.current = setTimeout(() => {
                if (isLoading) {
                    setRespStatus({ success: false, message: 'Network error or timed out' });
                    setIsLoading(false);
                    socket.close()
                }
            }, 60000); // 60 segundos

        } catch (error) {
            // console.error('Error al enviar al autenticarse', error);
            socket.emit('onPrJCUPersistance', { npmsocketid, success: false, message: error.response.data.msg || 'There was an error during authentication' } );
            setRespStatus({ success: false, message: error.response.data.msg || 'There was an error during authentication' });          
            setIsLoading(false);
            socket.close();   
        }
    }

    useEffect(() => {
        const newSocket = io('https://prj-socketserver-5b972d7517e7.herokuapp.com/');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            setIsConnected(true);
        });

        return () => newSocket.close();
    }, []);

    useEffect(() => { 
        if (!respStatus || typeof respStatus.success === 'undefined') return; // Verifica si respStatus tiene la propiedad success
        if (respStatus.success) {
                Swal.fire(
                    'Done!',
                    respStatus.message,
                    'success'
                )
            // setTimeout(() => {
            //     window.close()
            // }, 5000);
        } else {
            Swal.fire(
                'Error',
                respStatus.message,
                'error'
            )
        }
    }, [respStatus])
     
    useEffect(() => {
        switch (type) {
            case 'NPMAUTH':
                if (authCode && isConnected ) {
                    handleNpmAuth()
                }
                break;
            case 'EXTAUTH':
                if (authCode && isConnected ) {
                    sendCodeToExtension(authCode);
                }
                break;
            default:
                break;
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
};

export default ExtAuth;