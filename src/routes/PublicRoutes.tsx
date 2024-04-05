import { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import useCheckAuth from "../auth/styles/hooks/useCheckAuth"


interface PublicRoutesProps {
    children: ReactNode;
}


const PublicRoutes = ({ children }: PublicRoutesProps ) => {
    const { status } = useCheckAuth()
    return ( status === 'not-authenticated')
    ? children
    : <Navigate to='/home'/>
}

export default PublicRoutes
