import React from 'react'
import { assets } from '../assets/assets'
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
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className='max-w-5xl text-5xl font-black leading-[0.95] text-white drop-shadow-lg md:text-7xl lg:text-8xl'
        >
          Luxury cars on Rent
        </motion.h1>

        <motion.img 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          src={assets.orange_supercar}
          alt="Orange luxury sports car"
          className='relative z-10 mt-12 w-full max-w-6xl drop-shadow-[0_30px_40px_rgba(0,0,0,0.42)]'
        />
      </div>
    </motion.section>
  )
}

export default Hero
