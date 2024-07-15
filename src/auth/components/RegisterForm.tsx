// import { FormEvent } from 'react';
import { ThunkDispatch } from "@reduxjs/toolkit";
import { UnknownAction } from "@reduxjs/toolkit";
import { RootState } from '../../store/store';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'
import { FaGoogle } from 'react-icons/fa';
import { useGoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom'
import '../styles/buttonNew.css'
import { startGoogleLoginWEmailPassword, startLoginWEmailPassword } from '../../store/auth/thunks';
import { useDispatch } from 'react-redux';
import '../styles/validations.css'
const backendUrl = import.meta.env.VITE_BACKEND_URL

interface ResponseM {
  data: {
    status: boolean,
    user: object,
    token: string
  }
}

const RegisterForm = () => {

  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, UnknownAction>>()

  const validationSchema = Yup.object({
    username: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${backendUrl}/auth/register`, values);

        localStorage.setItem('x-token', response.data.token);
        dispatch(startLoginWEmailPassword(response.data));

      } catch (error) {
        console.error(error);
      }
    },
  });

  const googleRegistration = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async ({ code }) => {
      const { data } = await axios.post(`${backendUrl}/auth/google`, { code});
      try {      
        const { data: userData }: ResponseM = await axios.post(
            `${backendUrl}/auth/gregister`, {
              email: data.payload.email,
              username: data.payload.name,
              photoUrl: data.payload.picture,
              status: true,
              google: true
        });

        localStorage.setItem('x-token', userData.token )
        dispatch( startGoogleLoginWEmailPassword( userData ) )
      } catch (error) {
        console.error(error)
      }     
    },
    onError: errorResponse => console.log(errorResponse),
  });
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Register</h2>
        <form onSubmit={formik.handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Nombre de usuario</label>


              {formik.touched.username && formik.errors.username ? (
                <div className="text-red-500 text-sm mt-2 fade-in">
                  {formik.errors.username}
                 </div>
               ) : null}

              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                {...formik.getFieldProps('username') }
              />
            </div>



            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm mt-2 fade-in">
                {formik.errors.email}
              </div>
            ) : null}

            <div>
              <label htmlFor="email" className="sr-only">Correo electrónico</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                {...formik.getFieldProps('email')}
              />
            </div>


            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-sm mt-2 fade-in">
                {formik.errors.password}
              </div>
            ) : null}

            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                {...formik.getFieldProps('password')}
              />
            </div>
 
 
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="text-red-500 text-sm mt-2 fade-in">
                {formik.errors.confirmPassword}
              </div>
            ) : null}

            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Repeat Password"
                {...formik.getFieldProps('confirmPassword')}
              />
            </div>

          </div>

          <span className="mr-2">¿You already have an account?</span>
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800">Log In</Link>
           
           <div className="button-container">
    
                <button className="btn-e" type='submit'>
                    Login
                </button>

                <button
                  className="btn-g"
                  onClick={googleRegistration}
                >
                    <FaGoogle className="google-icon" size={20} style={{ marginRight: '8px' }} />
                </button>

            </div>

        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
