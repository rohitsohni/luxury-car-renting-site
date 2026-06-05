import React from 'react'
import { assets } from '../assets/assets'
import {motion} from 'motion/react'

const Hero = () => {

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className='relative min-h-[calc(100vh-73px)] overflow-hidden bg-asphalt bg-cover bg-center text-center md:bg-[center_58%]'
      style={{ backgroundImage: `url(${assets.hero_orange_car_bg})` }}
    >
      <div className='absolute inset-0 bg-black/20' />

      <div className='relative mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl flex-col items-center justify-start px-6 pt-24 md:px-16 md:pt-28 lg:px-24 xl:px-32'>
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className='max-w-5xl text-5xl font-black leading-[0.95] text-white drop-shadow-[0_5px_18px_rgba(0,0,0,0.55)] md:text-7xl lg:text-8xl'
        >
          Luxury cars on Rent
        </motion.h1>
      </div>
    </motion.section>
  )
}

export default Hero
