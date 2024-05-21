import axios from 'axios';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { AnyAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/auth/authSlice';
import { startStatePersistence, checkingAuthentication } from '../../store/auth/thunks';
import { setGitlabAuth } from '../../store/auth/authSlice';

export const useStateVerifier = () => {

  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('x-token');


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
    ];

    const promises = urls.map((url) => axios.get(url));
    const results = await Promise.all(promises);

    return results.map((result) => result.data);
  };

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

        dispatch(startStatePersistence(userData));      
        setLoading(false);
      } catch (error) {
        setLoading(false);
        dispatch(logout({}));
      }
  };


  useEffect(() => {
    dispatch(checkingAuthentication());
    verifyUserState();
  }, [dispatch, token]);

  return {
    loading,
  };
};