import axios from 'axios';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { AnyAction } from '@reduxjs/toolkit';
import { RootState } from '../../../store/store';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/auth/authSlice';
import { startStatePersistence, checkingAuthentication } from '../../../store/auth/thunks';
const backendUrl = import.meta.env.VITE_BACKEND_URL

export const useStateVerifier = () => {

  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('x-token');


  const getUserData = async (token: string) => {
    const response = await axios.post(
      `${backendUrl}/auth/me`, {},
      {
        headers: {
          Authorization: token,
        },
      }
    );

    return response.data;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, token]);

  return {
    loading,
  };
};