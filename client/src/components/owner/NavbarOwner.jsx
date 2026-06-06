import React from 'react'
import { useAppContext } from '../../context/AppContext';

const NavbarOwner = () => {

    const {user} = useAppContext()

  return (
    <div className='flex items-center justify-end px-6 md:px-10 py-4 text-gray-500 border-b border-borderColor relative transition-all'>
      <p>Welcome, {user?.name || "Owner"}</p>
    </div>
  )
}

export default NavbarOwner
