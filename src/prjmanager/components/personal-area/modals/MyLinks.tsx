import { useState, useEffect } from 'react';
import { TextField, Stack } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { ImCancelCircle } from 'react-icons/im';
import { IosLink, LogoLinkedin } from '@ricons/ionicons4';
import Github from '@ricons/fa/Github';
import { FaXTwitter } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ScaleLoader } from 'react-spinners';
import * as Yup from 'yup';
const backendUrl = import.meta.env.VITE_BACKEND_URL

const validationSchema = Yup.object().shape({
    website: Yup.string().url('Invalid URL').matches(
      /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)\/?/,
      'Invalid Website URL'
    ),
    github: Yup.string().url('Invalid URL').matches(
      /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_-]+\/?/,
      'Invalid GitHub URL'
    ),
    linkedin: Yup.string().url('Invalid URL').matches(
      /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?/,
      'Invalid LinkedIn URL'
    ),
    twitter: Yup.string().url('Invalid URL').matches(
      /^(https?:\/\/)?(www\.)?twitter\.com\/[A-Za-z0-9_-]+\/?/,
      'Invalid Twitter URL'
    )
});

export const MyLinks = ({ isMyLinksModalOpen, setIsMyLinksModalOpen }) => {

  const { website, github, linkedin, twitter, uid } = useSelector( selector => selector.auth)
  const [isLoading, setIsLoading] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [links, setLinks] = useState({
    website,
    github,
    linkedin,
    twitter
  });

  const handleClose = () => {
    const modal = document.getElementById('linksModal');
    if (modal) {
        // Inicia la transición de opacidad a 0
        modal.classList.replace('opacity-100', 'opacity-0');

        // Espera a que la animación termine antes de ocultar el modal completamente
        setTimeout(() => {
            setIsMyLinksModalOpen(false);
        }, 500); // Asume que la duración de tu transición es de 500ms
    }
  };

  const IsTheButtonDisabled = ({ values }) => {

    useEffect(() => {
        const isDisabled = 
                            values.website === links.website
                            && values.github === links.github
                            && values.linkedin === links.linkedin 
                            && values.twitter === links.twitter;

        setButtonDisabled(isDisabled)
    }, [ values ])
    
    // Utiliza buttonDisabled para cualquier lógica relacionada aquí, o retorna este estado si es necesario
    return null; // Este componente no necesita renderizar nada por sí mismo
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    setSubmitting(true);
    axios.put(`${backendUrl}/users/update-my-links/${uid}`, values, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization':  localStorage.getItem('x-token') 
        }  
    })
      .then( response => {
        Swal.fire({
          icon: 'success',
          title: 'Your links have been updated!',
          showConfirmButton: false,
          timer: 1500
        });
        setIsLoading(false);
        setSubmitting(false);
      })
      .catch( error => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  useEffect(() => {
    if (isMyLinksModalOpen) {
      // Asegúrate de que el modal existe antes de intentar acceder a él
      // Luego, después de un breve retraso, inicia la transición de opacidad
      const timer = setTimeout(() => {
        document.getElementById('linksModal').classList.remove('opacity-0');
        document.getElementById('linksModal').classList.add('opacity-100');
      }, 20); // Un retraso de 20ms suele ser suficiente
      return () => clearTimeout(timer);
    }
  }, [isMyLinksModalOpen]);

  return (
    <div className='fixed flex w-screen h-full pb-5 top-0 right-0 justify-center items-center bg-black/30 z-50'>
        <div id="linksModal" 
            className={`bg-white flex flex-col min-w-[28%] min-h-[65%] items-center rounded-2xl glass2 border-[1px] border-gray-400 transition-opacity duration-300 ease-in-out opacity-0 ${isMyLinksModalOpen ? '' : 'pointer-events-none'}`}>

            <div className='flex justify-between w-[95%] h-12 ml-auto mr-auto mt-2 p-2 border-b-2 border-b-gray-500 px-'>
                <p className='text-xl text-black'>My Links</p>
                <button onClick={handleClose}>
                    <ImCancelCircle/>
                </button>                   
            </div>

            <Formik
                validationSchema={validationSchema}
                initialValues={links}
                onSubmit={handleSubmit}
                >
                {({ values, handleChange, isSubmitting, touched, errors }) => (
                    <Form className='flex flex-grow w-full h-full mt-4 px-5'>
                    <IsTheButtonDisabled values={values} />
                    {console.log(Object.keys(errors))}
                        {
                            
                            isLoading 
                            ? (                     
                                <div className='flex flex-grow justify-center items-center'>
                                    <ScaleLoader color='#0c4a6e' />
                                </div>
                              )
                            : 
                                <Stack style={{
                                    width: '100%',
                                    height: '100%',
                                }} spacing={2}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <IosLink className='w-20 h-20' />
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            id="website"
                                            name="website"
                                            label={touched.website && errors.website ? 'Invalid Website URL' : 'Website'}
                                            variant="outlined"
                                            value={values.website}
                                            onChange={handleChange}
                                            error={touched.website && !!errors.website}
                                        />
                                    </Stack>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Github className='w-20 h-20' />
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            id="github"
                                            name="github"
                                            label={touched.github && errors.github ? 'Invalid Github URL' : 'Github'}
                                            variant="outlined"
                                            value={values.github}
                                            onChange={handleChange}
                                            error={touched.github && !!errors.github}                                       
                                        />
                                    </Stack>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <LogoLinkedin className='w-20 h-20' />
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            id="linkedin"
                                            name="linkedin"
                                            label={touched.linkedin && errors.linkedin ? errors.linkedin : 'LinkedIn'}
                                            variant="outlined"
                                            value={values.linkedin}
                                            onChange={handleChange}
                                            error={touched.linkedin && !!errors.linkedin}

                                        />
                                    </Stack>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <FaXTwitter className='w-20 h-20' />
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            id="twitter"
                                            name="twitter"
                                            label={touched.twitter && errors.twitter ? 'Invalid Twitter URL' : 'Twitter'}
                                            variant="outlined"
                                            value={values.twitter}
                                            onChange={handleChange}
                                            error={touched.twitter && !!errors.twitter}
                                        />
                                    </Stack>
                                    <Stack direction="row" justifyContent="flex-end">
                                        <button 
                                            type="submit"
                                            disabled={ buttonDisabled || isSubmitting || Object.keys(errors).length > 0 }
                                            className={`text-[14px] w-full h-[55px] rounded-extra ${buttonDisabled || Object.keys(errors).length > 0 ? 'backdrop-blur-sm' : 'backdrop-blur-sm bg-green-400/20 shadow-sm'} border-[1px] border-gray-400 transition-colors duration-300 ease-in-out transform active:translate-y-[2px]`}
                                        >
                                            Save Changes
                                        </button>  
                                    </Stack>
                                </Stack>
                        }

                    </Form>
                )}
                </Formik>
           
        
        </div>
    </div>
  );
};
