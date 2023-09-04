import { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import useCheckAuth from "../hooks/useCheckAuth"
import LoadingCircle from "../auth/helpers/Loading";


interface PublicRoutesProps {
    children: ReactNode;
}


const PublicRoutes = ({ children }: PublicRoutesProps ) => {

    const { isLoading, status } = useCheckAuth()

    if( isLoading ) return ( <LoadingCircle/> )

    return ( status === 'not-authenticated')
    ? children
    : <Navigate to='/user/home'/>

}

export default PublicRoutes
