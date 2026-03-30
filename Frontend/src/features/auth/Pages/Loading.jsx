import React from 'react'

const Loading = () => {
    return (
        <div className="h-screen w-screen flex items-center justify-center relative text-white bg-[radial-gradient(circle_at_center,#1F2126_0%,#0F1115_60%,#0B0B0C_100%)]">
            <div className='flex flex-col items-center gap-5'>
                <div className='w-40 px-7 shadow-2xl shadow-black py-10 rounded-full animate-pulse bg-nexa-dark/50 backdrop-blur-2xl'>
                    <img className='w-full' src="https://ik.imagekit.io/devakshu/logo.png" alt="" />
                </div>
                <div className='text-center flex flex-col gap-4'>
                    <h1 className='text-white font-bold text-3xl lg:text-5xl'>Initialising Neural Gateway..</h1>
                    <p className='text-lg'>Syncing encrypted memory shards and <br /> establishing secure obsidian pathways.</p>
                </div>
            </div>
        </div>
    )
}

export default Loading
