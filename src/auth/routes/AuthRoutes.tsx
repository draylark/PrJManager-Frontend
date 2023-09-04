import  { Routes, Route } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';


export const AuthRoutes = () => {

  return (

        <Routes>
              <Route path='/login' element={ <LoginForm/> }/>
              <Route path='/register' element={ <RegisterForm/> }/>
        </Routes>

   )
}


export default AuthRoutes
