import { Routes, Route, useLocation, Navigate } from "react-router-dom"
import useCheckAuth from "../PublicRoutes/auth/hooks/useCheckAuth";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import LoadingCircle from "../PublicRoutes/auth/helpers/Loading";
import { useStateVerifier } from "../PublicRoutes/auth/hooks/useStateVerifier";
import { isOauthCallback } from "../helpers/isOauthCallback";
import ExtAuth from "../PublicRoutes/auth/components/ExtAuth";

import AuthRoutes from '../PublicRoutes/auth/routes/AuthRoutes';
import ManagerRoutes from "../PrivateRoutes/routes/ManagerRoutes";
import HomeRoutes from "../PublicRoutes/home/routes/HomeRoutes"
// import DocsRoutes from "../PublicRoutes/docs/routes/DocsRoutes"

export const AppRouter = () => {

  const { status } = useCheckAuth()
  const { loading } = useStateVerifier()
  const location = useLocation()

  if (isOauthCallback(location)) return <ExtAuth />

  if (loading) return <LoadingCircle />
  if (status === 'checking') return <LoadingCircle />

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


