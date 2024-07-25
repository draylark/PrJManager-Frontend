import  { Routes, Route } from 'react-router-dom';
import ExtAuth from '../components/ExtAuth';
import { Login } from '../components/login/Login';
import { Register } from '../components/register/Register';

export const AuthRoutes = () => {
  return (

        <Routes>
              <Route path='/login' element={ <Login/> }/>
              <Route path='/register' element={ <Register/> }/>
              <Route path='/callback' element={ <ExtAuth/> }/>
        </Routes>
   )
}


export default AuthRoutes
