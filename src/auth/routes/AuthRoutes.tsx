import  { Routes, Route } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import ExtAuth from '../components/ExtAuth';


export const AuthRoutes = () => {

  return (

        <Routes>
              <Route path='/login' element={ <LoginForm/> }/>
              <Route path='/register' element={ <RegisterForm/> }/>
              <Route path='/callback' element={ <ExtAuth/> }/>
        </Routes>

   )
}


export default AuthRoutes
