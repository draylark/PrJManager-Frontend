import { Routes, Route, useLocation, Navigate } from "react-router-dom"
import useCheckAuth from "../PublicRoutes/auth/hooks/useCheckAuth";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import { useStateVerifier } from "../PublicRoutes/auth/hooks/useStateVerifier";
import { isOauthCallback } from "../helpers/isOauthCallback";
import ExtAuth from "../PublicRoutes/auth/components/ExtAuth";

import AuthRoutes from '../PublicRoutes/auth/routes/AuthRoutes';
import ManagerRoutes from "../PrivateRoutes/routes/ManagerRoutes";
import HomeRoutes from "../PublicRoutes/home/routes/HomeRoutes"
import { ScaleLoader } from 'react-spinners';
// import DocsRoutes from "../PublicRoutes/docs/routes/DocsRoutes"

export const AppRouter = () => {

  const { status } = useCheckAuth()
  const { loading } = useStateVerifier()
  const location = useLocation()

  if (isOauthCallback(location)) return <ExtAuth />



  if (loading) return (
    <div className="flex h-screen flex-grow justify-center items-center">
      <ScaleLoader color={'#000'} loading={true}  />
    </div>
  )

  if (status === 'checking') return (
    <div className="flex h-screen  flex-grow justify-center items-center">
      <ScaleLoader color={'#000'} loading={true}  />
    </div>
  )

  return (

    <Routes>

      <Route path="/auth/*" element={<PublicRoutes><AuthRoutes /></PublicRoutes>} />
      <Route path="/home/*" element={<PublicRoutes><HomeRoutes /></PublicRoutes>} />
      <Route path="/*" element={<PrivateRoutes><ManagerRoutes /></PrivateRoutes>} />

      {/* <Route path="/docs/*" element={
        <PublicRoutes>
          <DocsRoutes />
        </PublicRoutes>
      } /> */}

      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>

  )
}


