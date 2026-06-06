import React, { useState } from 'react'
import { assets, menuLinks } from '../assets/assets'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import {motion} from 'motion/react'

const Navbar = () => {

    const {setShowLogin, user, logout, isOwner, axios, fetchUser, apiErrorMessage} = useAppContext()

    const location = useLocation()
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    const changeRole = async ()=>{
        try {
            const { data } = await axios.post('/api/owner/change-role')
            if (data.success) {
                await fetchUser()
                toast.success(data.message)
                navigate('/owner')
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(apiErrorMessage(error) || error.message)
        }
    }

  return (
    <motion.div 
    initial={{y: -20, opacity: 0}}
    animate={{y: 0, opacity: 1}}
    transition={{duration: 0.5}}
    className={`flex items-center justify-end px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-borderColor relative z-40 transition-all ${location.pathname === "/" ? "bg-white/75 text-asphalt backdrop-blur-xl" : "bg-white text-gray-700"}`}>

        <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${location.pathname === "/" ? "bg-white/95 sm:bg-transparent" : "bg-white"} ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>
            {menuLinks.map((link, index)=> (
                <Link key={index} to={link.path} className="font-medium transition hover:text-primary">
                    {link.name}
                </Link>
            ))}

            <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>

                <button onClick={()=> isOwner ? navigate('/owner') : changeRole()} className="cursor-pointer font-medium transition hover:text-primary">{isOwner ? 'Dashboard' : 'Become a Owner'}</button>

                <button onClick={()=> {user ? logout() : setShowLogin(true)}} className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg shadow-lg shadow-orange-900/15">{user ? 'Logout' : 'Login'}</button>
            </div>
        </div>

        <button className='sm:hidden cursor-pointer' aria-label="Menu" onClick={()=> setOpen(!open)}>
            <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
        </button>
      
    </motion.div>
  )
}

export default Navbar
