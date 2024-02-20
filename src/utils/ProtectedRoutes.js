import { Outlet, Navigate } from 'react-router-dom'

const ProtectedRoutes = () => {
    const checkUser = localStorage.getItem('user');
    let auth = {'token': (checkUser ? true : false)}
    return(
        auth.token ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default ProtectedRoutes