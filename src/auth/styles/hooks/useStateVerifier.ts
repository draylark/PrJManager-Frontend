import axios from 'axios';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { AnyAction } from '@reduxjs/toolkit';
import { RootState } from '../../../store/store';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/auth/authSlice';
import { startStatePersistence } from '../../../store/auth/thunks';
import { setGitlabAuth } from '../../../store/auth/authSlice';

export const useStateVerifier = () => {

  
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('x-token');


  // const verifyGitlabToken = async () => {
  //   try {

  //     const response = await axios.get('http://localhost:3000/api/gitlab/access-token', {
  //       withCredentials: true
  //     });
      
  //     const token = response.data.token;
  //     console.log('Token de GitLab:', token)
  //     if (token) {
  //       // Verificar si el token es válido haciendo una llamada a la API de GitLab
  //       try {
  //         await axios.get('https://gitlab.com/api/v4/user', {
  //           headers: {
  //             'Authorization': `Bearer ${token}`
  //           }
  //         });
  //         dispatch(setGitlabAuth(true));
  //       } catch (error) {
  //         if (error.response && error.response.status === 401) {
  //           // Token no válido o ha expirado
  //           dispatch(setGitlabAuth(false));
  //         } else {
  //           // Otro error
  //           console.error('Error al verificar el token de GitLab:', error);
  //           dispatch(setGitlabAuth(false));
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error al obtener el token de GitLab:', error);
  //     dispatch(setGitlabAuth(false));
  //   }
  // };

  const getUserData = async (token: string) => {
    const response = await axios.post(
      'http://localhost:3000/api/auth/me',
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );

    return response.data;
  };

  const getData = async (userId: string) => {

    const urls = [
      `http://localhost:3000/api/notis/${userId}`,
      `http://localhost:3000/api/projects/get-projects/${userId}`,
      `http://localhost:3000/api/friends/get-friends/${userId}`
    ];

    const promises = urls.map((url) => axios.get(url));
    const results = await Promise.all(promises);

    return results.map((result) => result.data);
  };

  useEffect(() => {

    const verifyUserState = async () => {
      if (!token) {
        setLoading(false);
        dispatch(logout({}));
        return;
      }

      try {

        const userData = await getUserData(token);
        if (!userData.state) {
          setLoading(false);
          dispatch(logout({}));
          return;
        }

        const [notis, projects, friends] = await getData(userData.user.uid);

        console.log('PROYECTOS', projects)


        dispatch(
          startStatePersistence(
            userData,
            notis.notis,
            projects,
            friends
          )
        );

        setLoading(false);
      } catch (error) {
        setLoading(false);
        dispatch(logout({}));
      }

    };

    verifyUserState();
  }, [dispatch, token]);

  return {
    loading,
  };
};