import { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import useCheckAuth from "../hooks/useCheckAuth"
import LoadingCircle from "../auth/helpers/Loading";


interface PrivateRoutesProps {
    children: ReactNode
}


const PrivateRoutes = ({ children }: PrivateRoutesProps ) => {

    const { isLoading, status } = useCheckAuth()

    // console.log(status, isLoading)

    if( isLoading ) return <LoadingCircle/> 



    return ( status === 'authenticated')
    ? children
    : <Navigate to='/login'/>

}

export default PrivateRoutes
