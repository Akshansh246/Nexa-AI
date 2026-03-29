import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import Footer from '../components/Footer'
import { useSelector } from 'react-redux';

const VerifyPage = () => {
    const [timer, setTimer] = useState(10);
    const navigate = useNavigate()

    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)
    
    if(!loading && user){
        return <Navigate to={'/'} replace />
    }

    const time = setTimeout(()=>{
        let x=timer
        setTimer(x-1)
    },1000)

    setTimeout(() => {
        clearTimeout(time)
        navigate('/login')
    }, 10000);


    return (
        <div className="h-screen w-screen flex items-center justify-center relative text-nexa-tertiary bg-[radial-gradient(circle_at_center,#1e3a8a_0%,#0F172A_60%,#020617_100%)]">
            <div className='flex flex-col items-center gap-5'>
                <div className='w-40 px-7 shadow-2xl shadow-black py-10 rounded-full animate-pulse bg-nexa-dark/50 backdrop-blur-2xl'>
                    <img className='w-full' src="https://ik.imagekit.io/devakshu/logo.png" alt="" />
                </div>
                <div className='text-center flex flex-col gap-4'>
                    <h1 className='text-white font-bold text-3xl lg:text-5xl'>Please verify your email</h1>
                    <p className='text-lg'>An email has been send to your entered email address</p>
                    <p>You will be automatically redirected to <Link className='text-nexa-primary underline' to={'/login'}>Login</Link> in {timer}s </p>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default VerifyPage
