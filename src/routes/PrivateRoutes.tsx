import { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import useCheckAuth from "../PublicRoutes/auth/hooks/useCheckAuth"



interface PrivateRoutesProps {
    children: ReactNode
}


const PrivateRoutes = ({ children }: PrivateRoutesProps) => {

    const { status } = useCheckAuth()

    return (status === 'authenticated')
        ? children
        : <Navigate to='/auth/login' />

}

export default PrivateRoutes
