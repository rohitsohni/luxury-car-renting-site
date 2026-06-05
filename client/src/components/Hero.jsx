import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import {motion} from 'motion/react'

const Hero = () => {

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className='relative min-h-[calc(100vh-73px)] overflow-hidden bg-[#f7fbff] text-center'
    >
      <div className='absolute inset-0 bg-[linear-gradient(180deg,#0f4c81_0%,#5ca9e6_34%,#eef7ff_55%,#fff4e6_100%)]' />
      <div className='absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(165deg,transparent_0_26%,#d8d1c7_26%_39%,#f8f3eb_39%_55%,#1f2937_55%_100%)]' />
      <div className='absolute left-0 right-0 bottom-[22%] h-px bg-white/60' />
      <div className='absolute -left-16 top-28 h-52 w-52 rounded-full bg-white/18 blur-3xl' />
      <div className='absolute right-8 top-20 h-28 w-60 rounded-full bg-white/20 blur-3xl' />

      <div className='relative mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl flex-col items-center justify-center px-6 pt-12 md:px-16 lg:px-24 xl:px-32'>
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className='mb-4 rounded-full border border-white/40 bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white shadow-sm backdrop-blur'
        >
          Exotic rentals
        </motion.p>

        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className='max-w-5xl text-5xl font-black leading-[0.95] text-white drop-shadow-lg md:text-7xl lg:text-8xl'
        >
          Drive the Orange Line
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className='mt-5 max-w-2xl text-base font-medium text-white/90 drop-shadow md:text-lg'
        >
          Rent head-turning performance cars for weekend escapes, city arrivals, and open-road moments.
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className='mt-8 flex flex-wrap items-center justify-center gap-3'
        >
          <Link to='/cars' className='rounded-lg bg-primary px-7 py-3 font-semibold text-white shadow-xl shadow-orange-950/20 transition hover:bg-primary-dull'>
            Explore Cars
          </Link>
          <Link to='/my-bookings' className='rounded-lg border border-white/50 bg-white/20 px-7 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/30'>
            My Bookings
          </Link>
        </motion.div>
      
        <motion.img 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          src={assets.main_car}
          alt="Luxury sports car"
          className='relative z-10 mt-10 w-full max-w-5xl drop-shadow-[0_30px_40px_rgba(0,0,0,0.42)]'
        />
      </div>
    </motion.section>
  )
}

export default Hero
