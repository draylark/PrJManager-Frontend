import { Routes, Route } from "react-router-dom"
import AuthRoutes from '../auth/routes/AuthRoutes';
import useCheckAuth from "../hooks/useCheckAuth";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import ManagerRoutes from "../prjmanager/routes/ManagerRoutes";
import LoadingCircle from "../auth/helpers/Loading";
import { useStateVerifier } from "../hooks/useStateVerifier";


export const AppRouter = () => {

  const { status } = useCheckAuth()
  const { loading } = useStateVerifier()


  if( loading ) return <LoadingCircle/>
  if( status === 'checking' ) return <LoadingCircle/>     
   
 
  return (

      <Routes>


          <Route path="/*" element={
                <PublicRoutes>
                        <AuthRoutes/>
                </PublicRoutes>
          }/> 


          <Route path="/user/*" element={
                <PrivateRoutes>
                        <ManagerRoutes/>
                </PrivateRoutes>
          }/>  
 
      </Routes>

  )
}


