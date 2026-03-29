import React from 'react'

const Footer = () => {
    return (
        <footer className='w-full absolute text-center left-0 bottom-0 text-lg bg-nexa-dark/40 backdrop-blur-2xl lg:flex justify-between py-2 px-4 uppercase'>
            <p>©2026 Nexa AI. Precision in every thought</p>
            <div className='lg:flex gap-10 hidden'>
                <p>Privacy policy</p>
                <p>Terms of service</p>
                <p>help center</p>
            </div>
        </footer>
    )
}

export default Footer
