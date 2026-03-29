import {createBrowserRouter} from 'react-router'
import Login from '../features/auth/Pages/Login'
import Register from '../features/auth/Pages/Register'
import Dashboard from '../features/chat/pages/Dashboard'
import Protected from '../features/auth/components/Protected'
import VerifyPage from '../features/auth/Pages/VerifyPage'

export const router = createBrowserRouter([
    {
        path:'/',
        element: <Protected><Dashboard/></Protected>
    },
    {
        path:'/login',
        element:<Login/>
    },
    {
        path:'/register',
        element:<Register/>
    },
    {
        path:'/verify-email',
        element:<VerifyPage/>
    }
])