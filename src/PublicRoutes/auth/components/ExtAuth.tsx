import { useLocation, Navigate, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { decodeParams } from "../helpers/decodeParams";
const backendUrl = import.meta.env.VITE_BACKEND_URL
import { Socket } from "socket.io-client";
import { ScaleLoader } from 'react-spinners';

// https://prj-socketserver-5b972d7517e7.herokuapp.com/

interface IRespStatus {
    success: boolean;
    message: string;
}


interface ApiResponse {
    status: boolean;
    msg: string;
    user: string;
    pat: string;
    token: string;
}


const ExtAuth = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
        
    const [isConnected, setIsConnected] = useState(false);
    const [respStatus, setRespStatus] = useState<IRespStatus | null>(null);
    const location = useLocation();

    const { authCode, npmsocketid, type, port } = decodeParams(location.search);

    const handleRedirect = (path: string) => {
        navigate(path, { replace: true });
    };

    const sendCodeToExtension = async (code: string) => {
        if (!socket || !isConnected) {
            return;
        }

        try {
            await axios.post(`http://localhost:${port}/receive-code`, { code, FRONTENDTID: socket.id });
            socket.on('authenticationResult', (data) => {
                setRespStatus( data.status.authStatus || data.status );
                setIsLoading(false);
                clearTimeout(timeoutRef.current as NodeJS.Timeout); // Limpia el temporizador
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
            socket.close();
            setRespStatus({ success: false, message: 'Network error or timed out' });
            setIsLoading(false);
        }
    };

    const handleNpmAuth = async () => {
        if (!socket || !isConnected) {
            return;
        }

        try {
            const response = await axios.post(`${backendUrl}/auth/extension-auth-user`, { code: authCode });    
            const { data } = response;

            if( data.status === true ) {
                socket.emit('onPrJCUPersistance', { type: 'NPM', success: true, npmsocketid, user: data.user, pat: data.pat, token: data.token }, (response: IRespStatus) => {                                   
                    setRespStatus(response);
                    setIsLoading(false);
                    clearTimeout(timeoutRef.current as NodeJS.Timeout); // Limpia el temporizador
                    socket.close();
                });
            } else {
                socket.emit('onPrJCUPersistance', { npmsocketid, success: false, message: data.msg } );
                setRespStatus({ success: false, message: data.msg || 'There was an error during authentication' });
                setIsLoading(false);
                clearTimeout(timeoutRef.current as NodeJS.Timeout); // Limpia el temporizador
                socket.close();              
            }
            // Iniciar el temporizador
            timeoutRef.current = setTimeout(() => {
                if (isLoading) {
                    setRespStatus({ success: false, message: 'Network error or timed out' });
                    setIsLoading(false);
                    socket.close()
                }
            }, 60000); // 60 segundos

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            socket.close();
            if(axiosError.response){
                socket.emit('onPrJCUPersistance', { npmsocketid, success: false, message: axiosError.response.data.msg || 'There was an error during authentication' } );
                setRespStatus({ success: false, message: axiosError.response.data.msg || 'There was an error during authentication' });
                setIsLoading(false);

            } else {
                socket.emit('onPrJCUPersistance', { npmsocketid, success: false, message: 'There was an error during authentication' } );
                setRespStatus({ success: false, message: 'There was an error during authentication' });
                setIsLoading(false);
            }
        }
    };

    useEffect(() => { 
        if(!respStatus) return;

        setTimeout(() => {
            handleRedirect("/login"); // Redirecciona a la página del usuario
        }, 5000);

        if (respStatus.success) {
            Swal.fire({
                title: 'Done!',
                text: respStatus.message || 'You have been authenticated successfully',
                icon: 'success',
                confirmButtonText: 'Close'
            })
        } else {
            Swal.fire({
                title: 'Error',
                text: respStatus.message || 'There was an error during authentication',
                icon: 'error',
                confirmButtonText: 'Close'
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authCode, isConnected]);

    useEffect( () => {
        const newSocket = io('https://prj-socketserver-5b972d7517e7.herokuapp.com/');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            setIsConnected(true);
        });

        return () => {
            newSocket.close();
            return; 
        };
    }, []);

    if (!authCode) return <Navigate to='/register'/>;

    return (
        <div className="flex w-screen h-screen justify-center items-center bg-[#0a1128]">      
            {
                isLoading ? <ScaleLoader color={'#FFFFFF'} loading={true}  />
                : <>
                
                    {
                        respStatus?.success ? 
                        <div className="flex flex-col justify-center items-center">
                            <h1 className="text-4xl font-bold text-white">Successful authentication</h1>
                            <p className="text-lg font-semibold text-white">You can now close this window</p>
                            </div>                           
                        : 
                        <div className="flex flex-col justify-center items-center">
                            <h1 className="text-4xl font-bold text-white">Ups! There was an error authenticating</h1>
                            <p className="text-lg font-semibold text-white">please try again.</p>
                        </div>
                    }
                
                </>
            }
        </div>
    );
};

export default ExtAuth;