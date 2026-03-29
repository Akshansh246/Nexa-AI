import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import Footer from "../components/Footer";
import {useAuth} from '../hooks/useAuth'
import { useSelector } from "react-redux";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {handleRegister} =useAuth()
    const navigate = useNavigate()

    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)
    

    async function handleSubmit(e){
        e.preventDefault()

        const payload = {
            username,
            email, 
            password
        }

        await handleRegister(payload)
        navigate('/verify-email')
    }

    if(!loading && user){
        return <Navigate to={'/'} replace />
    }

    

    return (
        <main className="h-screen w-screen relative text-nexa-tertiary bg-[radial-gradient(circle_at_center,#1e3a8a_0%,#0F172A_60%,#020617_100%)]">
        <nav className="w-full flex justify-between py-4 px-7 text-xl">
            <img
            className="w-15"
            src="https://ik.imagekit.io/devakshu/logo.png"
            alt=""
            />
            <p className="hidden md:block uppercase">Encrytion Active.</p>
        </nav>

        <div className="w-full md:w-150 shadow-black shadow-lg p-10 absolute rounded-3xl justify-between left-1/2 top-1/2 text-xl -translate-1/2 bg-nexa-dark/40 backdrop-blur-2xl box flex flex-col gap-10">
            <div className="flex flex-col items-center">
                <h1 className="text-5xl font-bold px-4 text-white">Register</h1>
                <p className="text-sm">Create your neural gateway</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-7">
                <div className="flex flex-col gap-2">
                    <label htmlFor="username">USERNAME</label>
                    <input
                    value={username}
                    onInput={(e)=>{setUsername(e.target.value)}}
                    className="p-4 border border-e-nexa-tertiary rounded-xl"
                    type="text"
                    name="username"
                    id="username"
                    placeholder="nexa_explorer"
                    required
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="email">EMAIL ADDRESS</label>
                    <input
                    value={email}
                    onInput={(e)=>{setEmail(e.target.value)}}
                    className="p-4 border border-e-nexa-tertiary rounded-xl"
                    type="email"
                    name="email"
                    id="email"
                    placeholder="name@company.com"
                    required
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="password">PASSWORD</label>
                    <input
                    value={password}
                    onInput={(e)=>{setPassword(e.target.value)}}
                    className="p-4 border border-e-nexa-tertiary rounded-xl"
                    type="password"
                    name="password"
                    id="password"
                    placeholder="*******"
                    required
                    />
                </div>
                <div className="flex items-center gap-2">
                    <input type="checkbox" required id="checkbox" />
                    <label className="text-sm" htmlFor="checkbox">
                    I Agree to the Terms and conditions.
                    </label>
                </div>
            <button
                className="bg-nexa-secondary-dark cursor-pointer font-bold rounded-xl p-4"
                type="submit"
            >
                Create Account
            </button>
            </form>
            <div className="w-full text-center">
                <p>
                    Already part of Nexa?{" "}
                    <Link className="text-nexa-primary" to={"/login"}>
                    Sign in
                    </Link>
                </p>
            </div>
        </div>

        <Footer />
        </main>
    );
};

export default Register;
