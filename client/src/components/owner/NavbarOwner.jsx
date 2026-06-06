import React from 'react'
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const NavbarOwner = () => {

    const {user} = useAppContext()

  return (
    <div className='flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-borderColor relative transition-all'>
      <Link to='/' className='rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white shadow-lg shadow-orange-900/15 transition hover:bg-primary-dull'>
        Home
      </Link>
      <p>Welcome, {user?.name || "Owner"}</p>
    </div>
  )
}

export default NavbarOwner
