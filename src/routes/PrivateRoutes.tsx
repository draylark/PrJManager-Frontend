import { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import useCheckAuth from "../auth/styles/hooks/useCheckAuth"



interface PrivateRoutesProps {
    children: ReactNode
}


const PrivateRoutes = ({ children }: PrivateRoutesProps ) => {

    const { status } = useCheckAuth()

    return ( status === 'authenticated')
    ? children
    : <Navigate to='/user/login'/>

}

export default PrivateRoutes
