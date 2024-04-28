import { Routes, Route, useLocation } from "react-router-dom"
import AuthRoutes from '../auth/routes/AuthRoutes';
import useCheckAuth from "../auth/hooks/useCheckAuth";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import ManagerRoutes from "../prjmanager/routes/ManagerRoutes";
import LoadingCircle from "../auth/helpers/Loading";
import { useStateVerifier } from "../auth/hooks/useStateVerifier";
import { isOauthCallback } from "../helpers/isOauthCallback";
import ExtAuth from "../auth/components/ExtAuth";


export const AppRouter = () => {

  const { status } = useCheckAuth()
  const { loading } = useStateVerifier()
  const location = useLocation()

  if( isOauthCallback(location) ) return <ExtAuth/>

  if( loading ) return <LoadingCircle/>
  if( status === 'checking' ) return <LoadingCircle/>     
   
  return (

      <Routes>
          <Route path="/user/*" element={
                <PublicRoutes>
                        <AuthRoutes/>
                </PublicRoutes>
          }/> 


          <Route path="/*" element={
                <PrivateRoutes>
                        <ManagerRoutes/>
                </PrivateRoutes>
          }/>  
      </Routes>

  )
}


