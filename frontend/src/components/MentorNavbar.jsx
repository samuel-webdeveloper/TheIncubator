import React, { useState } from 'react'
import { assets, mentorMenuLinks } from '../../assets/assets'
import { Link } from 'react-router-dom'

const Navbar = () => {

    const [open, setOpen] = useState(false)

  return (
    <div className='bg-primary flex items-center justify-between text-semibold py-4 px-6 md:px-16 lg:px-24 xl:px-32 relative transition-all'>
        <Link to='/'>
            <img className='w-12 rounded-full cursor-pointer ml-5' src={assets.logo_1} alt='Logo image' />
        </Link>

        <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 flex flex-col sm:flex-row items-start sm:-items-center gap-4 sm:gap-8 max-sm:p-4 text-white transsitiona-all duration-300 z-50 ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>
            {mentorMenuLinks.map((link, index)=> (
                <Link key={index} to={link.path}>
                    {link.name}
                </Link>
            ))}
        </div>

        <button className='sm:hidden cursor-pointer' aria-label='Menu' onClick={() => setOpen(!open)}>
            <img src={open ? assets.cross_icon : assets.menu_icon} alt='menu' />
        </button>
    </div>
  )
}

export default Navbar



