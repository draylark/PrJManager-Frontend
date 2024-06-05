import { FormEvent, useEffect } from 'react';
import useForm from '../hooks/useForm';
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'
import { startGoogleLoginWEmailPassword, startLoginWEmailPassword } from '../../store/auth/thunks';
import { ThunkDispatch } from "@reduxjs/toolkit";
import { AnyAction } from "@reduxjs/toolkit";
import { RootState } from '../../store/store';
import { useGoogleLogin } from '@react-oauth/google';
import { FaGoogle } from 'react-icons/fa';
import '../styles/buttonNew.css'
import { logout } from '../../store/auth/authSlice';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
const backendUrl = import.meta.env.VITE_BACKEND_URL

interface LoginState {
    email: string;
    password: string;
}


const LoginForm = () => {

  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>()
  const { errorMessage } = useSelector( (state: RootState) => state.auth )

  const { onInputChange, email, password } = useForm<LoginState>({
      email: '',
      password: ''
  })

  const handleSubmit = async( event: FormEvent<HTMLFormElement> ) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${backendUrl}/auth/login`, {
        email,
        password
      });

      localStorage.setItem('x-token', response.data.tokenJWT )
      dispatch( startLoginWEmailPassword( response.data ))
    } catch (error: any) {
        console.error(error.message);
        dispatch( logout({ msg: error.response.data.msg, b: false }) )
    }
  };

  const googleLogin = useGoogleLogin({

    flow: 'auth-code',
    onSuccess: async ({ code }) => {

        const { data } = await axios.post(
            `${backendUrl}/auth/google`, {
                code
            });
        
            try {      

              const mongoResponse = await axios.post(
                  `${backendUrl}/auth/glogin`, {
                    email: data.payload.email,
              });

              localStorage.setItem('x-token', mongoResponse.data.token )
              dispatch( startGoogleLoginWEmailPassword( mongoResponse.data ) )
            } catch (error: any) {
                  console.error('LoginForm Error message:', error.response.data.msg);
                  dispatch( logout({ msg: error.response.data.msg, b: false }) )
            }     

    },
    onError: errorResponse => console.log(errorResponse),
  });
  
  useEffect(() => {
    if (errorMessage !== null) {
      Swal.fire({
        title: 'Error en la autenticación',
        text: errorMessage,
        icon: 'error',
        customClass: {
          confirmButton: 'my-confirm-button-class', // Clase personalizada para el botón de confirmación
          cancelButton: 'my-cancel-button-class'    // Clase personalizada para el botón de cancelación
        }
      });
      dispatch(logout({ b: null }));
    }
  }, [errorMessage, dispatch]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">PrJManager</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Please, login to continue.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Nombre de usuario</label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={email}
                onChange={ (e) => onInputChange(e) }
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={ (e) => onInputChange(e) }
              />
            </div>
          </div>
          

          <span className="mr-2">¿You don't have an account?</span>
          <Link to="/register" className="text-indigo-600 hover:text-indigo-800">Register</Link>

          <div className="button-container">
  
              <button className="btn-e" type='submit'>
                  Login
              </button>

              <button
                className="btn-g"
                onClick={googleLogin}
              >
                  <FaGoogle className="google-icon" size={20} style={{ marginRight: '8px' }} />
              </button>

          </div>

        </form>
      </div>
    </div>
  )
  }
  
  export default LoginForm;


  