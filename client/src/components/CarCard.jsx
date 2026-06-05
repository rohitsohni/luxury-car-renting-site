import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { fallbackCarImage, handleCarImageError } from '../utils/carImage'

const CarCard = ({car}) => {

    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()

  return (
    <div onClick={()=> {navigate(`/car-details/${car._id}`); scrollTo(0,0)}} className='group overflow-hidden rounded-lg border border-borderColor bg-white shadow-[0_18px_45px_rgba(17,24,39,0.08)] transition-all duration-500 cursor-pointer hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_55px_rgba(249,115,22,0.18)]'>
      
      <div className='relative h-48 overflow-hidden bg-asphalt'> 
        <img 
          src={car.image || fallbackCarImage(car)}
          alt="Car Image" 
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
          onError={(event) => handleCarImageError(event, car)}
        />

        {car.isAvaliable && <p className='absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-orange-950/20'>Available Now</p>}

        <div className='absolute bottom-4 right-4 rounded-lg bg-asphalt/90 px-3 py-2 text-white shadow-lg backdrop-blur-sm'>
            <span className='font-semibold'>{currency}{car.pricePerDay}</span>
            <span className='text-sm text-white/80'> / day</span>
        </div>
      </div>

      <div className='p-4 sm:p-5'>
        <div className='flex justify-between items-start mb-2'>
            <div>
                <h3 className='text-lg font-semibold text-asphalt'>{car.brand} {car.model}</h3>
                <p className='text-muted-foreground text-sm'>{car.category} • {car.year}</p>
            </div>
        </div>

        <div className='mt-4 grid grid-cols-2 gap-y-2 text-gray-600'>
            <div className='flex items-center text-sm text-muted-foreground'>
                <img src={assets.users_icon} alt="" className='h-4 mr-2'/>
                <span>{car.seating_capacity} Seats</span>
            </div>
            <div className='flex items-center text-sm text-muted-foreground'>
                <img src={assets.fuel_icon} alt="" className='h-4 mr-2'/>
                <span>{car.fuel_type}</span>
            </div>
            <div className='flex items-center text-sm text-muted-foreground'>
                <img src={assets.car_icon} alt="" className='h-4 mr-2'/>
                <span>{car.transmission}</span>
            </div>
            <div className='flex items-center text-sm text-muted-foreground'>
                <img src={assets.location_icon} alt="" className='h-4 mr-2'/>
                <span>{car.location}</span>
            </div>
        </div>

      </div>

    </div>
  )
}

export default CarCard
