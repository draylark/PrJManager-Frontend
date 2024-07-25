import React from "react";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { cn } from "../../../../utils/cn";
import { Formik, Form, FormikHelpers } from 'formik';
import axios, { AxiosError } from 'axios' 
import { usePrJDispatch } from '../../../../store/dispatch';
import { startGoogleLoginWEmailPassword, startLoginWEmailPassword } from '../../../../store/auth/thunks';
import { useGoogleLogin } from '@react-oauth/google';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

const backendUrl = import.meta.env.VITE_BACKEND_URL
import {
  IconBrandGoogle,
} from "@tabler/icons-react";


interface FormValues {
  username: string;
  email: string;
  password: string;
}

interface ApiResponse {
    message: string;
    errors: { msg: string }[];
}

const initialValues: FormValues = { 
  username: '',
  email: '',
  password: ''
};

const validationSchema = Yup.object({
  username: Yup.string().required('The username is required.'),
  email: Yup.string().email('Invalid email address').required('The email is required.'),
  password: Yup.string().required('The password is required.')
});


export const RegisterForm = () => {

  const dispatch = usePrJDispatch();

  const handleSubmit = async(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    setSubmitting(true);
    try {
        const response = await axios.post(`${backendUrl}/auth/register`, values);
        localStorage.setItem('x-token', response.data.token);
        dispatch(startLoginWEmailPassword(response.data));
        setSubmitting(false);
      } catch (error) {
        
        const err = error as AxiosError<ApiResponse>
        setSubmitting(false);
        console.log('backendUrl', backendUrl)
        if( err.response ) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.response.data.errors[0].msg || 'Something went wrong!',
            })    
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            })
        }
      }
  };
  

  const googleRegistration = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async ({ code }) => {
      const { data } = await axios.post(`${backendUrl}/auth/google`, { code });
      try {
        const { data: userData } = await axios.post(
          `${backendUrl}/auth/gregister`, {
          email: data.payload.email,
          username: data.payload.name,
          photoUrl: data.payload.picture || null,
          status: true,
          google: true
        });

        localStorage.setItem('x-token', userData.token)
        dispatch(startGoogleLoginWEmailPassword(userData))
        
      } catch (error) {
        console.log('backendUrl', backendUrl)
        const err = error as AxiosError<ApiResponse>
        if( err.response ) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.response.data.message || 'Something went wrong!',
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            })
        }
      }
    },
    onError: () => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        })
    },
  });

  return (
    <div className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 shadow-input bg-[#0a1128] border-[1px] border-gray-400">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-white">
        Sign Up
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-white">
        Register to start developing.
      </p>

      <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
      >
          {({ errors, touched, isSubmitting, handleChange, submitForm }) => (
                <Form className="my-8">
                  <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Username</Label>
                    <Input 
                      id="username" 
                      placeholder={errors.username && touched.username ? errors.username : "pepegalicio"} 
                      className={errors.username && touched.username ? 'placeholder:text-red-400' : ''}
                      type="username" 
                      onChange={handleChange}
                    />
                  </LabelInputContainer>
                  <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      placeholder={errors.email && touched.email ? errors.email : "projectmayhem@fc.com"} 
                      className={errors.email && touched.email ? 'placeholder:text-red-400' : ''}
                      type="email" 
                      onChange={handleChange}
                    />
                  </LabelInputContainer>
                  <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      placeholder={errors.password && touched.password ? errors.password : "********"} 
                      className={errors.password && touched.password ? 'placeholder:text-red-400' : ''}
                      type="password" 
                      onChange={handleChange}
                    />
                  </LabelInputContainer>
                  <button
                    className="hover:text-blue-300 transition-all duration-200 ease-in-out transform active:translate-y-[2px] bg-gradient-to-br relative group from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="submit"
                    onClick={submitForm}
                    disabled={isSubmitting}
                  >
                    Sign Up &rarr;
                  </button>

                  <p className="text-white text-sm pt-3">You already have an account? 
                    <a href="/auth/login" className="text-blue-300"> Sign In</a>
                  </p>
                </Form>
          )}
      </Formik>

      <div className="flex flex-col">
          <button
            className="hover:text-red-300 transition-all ease-in-out transform active:translate-y-[2px] text-neutral-700 dark:text-neutral-300 text-sm duration-200 relative group flex space-x-2 items-center justify-start px-4 w-full rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="button"
            onClick={googleRegistration}
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span >
              Google
            </span>
          </button>
      </div> 
    </div>
  );
}
 
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};