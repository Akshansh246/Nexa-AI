import React, { useState } from "react";
import Footer from "../components/Footer";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)


    const navigate = useNavigate()
    const {handleLogin} = useAuth()

    async function handleSubmit(e){
        e.preventDefault()

        const payload = {
            email,
            password,
        }
        
        await handleLogin(payload)
        navigate('/')
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
                <p className="hidden md:block">Precision in every thought</p>
            </nav>

            <div className="w-full shadow-black shadow-lg md:w-fit rounded-3xl p-10 absolute justify-between left-1/2 top-1/2 text-xl -translate-1/2 bg-nexa-dark/40 backdrop-blur-2xl box flex flex-col gap-10">
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-bold px-4 text-white">Welcome Back</h1>
                    <p className="text-sm">Continue your journey into the Nexa</p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-7">
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
                        />
                    </div>
                    <button
                        className="bg-nexa-secondary-dark cursor-pointer font-bold rounded-xl p-4"
                        type="submit"
                    >
                        Log in
                    </button>
                </form>
                <div className="w-full text-center">
                    <p>
                        Don't have an account?{" "}
                        <Link className="text-nexa-primary" to={"/register"}>
                        Create Account
                        </Link>
                    </p>
                </div>
            </div>

            <Footer />
        </main>
    );
};

export default Login;
