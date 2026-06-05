import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios'
import {toast} from 'react-hot-toast'
import { useNavigate } from "react-router-dom";
import { dummyCarData } from "../assets/assets";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || ''

const apiErrorMessage = (error) => {
    if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') return null
    if (error.response?.status === 405) {
        return 'API route not available. Redeploy the frontend and ensure the backend is running.'
    }
    if (error.response?.status === 503) {
        return error.response?.data?.message || 'Server database is not configured.'
    }
    if (error.response?.data?.message) return error.response.data.message
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        return 'Cannot reach the server. Run the backend: cd server && npm run server'
    }
    return error.message
}

const clearAuth = (setToken, setUser, setIsOwner) => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setIsOwner(false)
    axios.defaults.headers.common['Authorization'] = ''
}

export const AppContext = createContext();

export const AppProvider = ({ children })=>{

    const navigate = useNavigate()
    const currency = import.meta.env.VITE_CURRENCY

    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)
    const [isOwner, setIsOwner] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const [pickupDate, setPickupDate] = useState('')
    const [returnDate, setReturnDate] = useState('')

    const [cars, setCars] = useState([])

    // Function to check if user is logged in
    const fetchUser = async ({ silent = false } = {})=>{
        try {
           const {data} = await axios.get('/api/user/data')
           if (data.success && data.user) {
            setUser(data.user)
            setIsOwner(data.user.role === 'owner')
           } else {
            clearAuth(setToken, setUser, setIsOwner)
           }
        } catch (error) {
            clearAuth(setToken, setUser, setIsOwner)
            const message = apiErrorMessage(error)
            if (!silent && message) toast.error(message)
        }
    }

    const fetchCars = async ({ silent = false } = {}) =>{
        try {
            const {data} = await axios.get('/api/user/cars')
            if (data.success) {
                const apiCars = Array.isArray(data.cars) ? data.cars : []
                setCars(apiCars)
            } else if (!silent) {
                toast.error(data.message)
            }
        } catch (error) {
            setCars(dummyCarData)
            const message = apiErrorMessage(error)
            if (!silent && message) toast.error(message)
        }
    }

    // Function to log out the user
    const logout = ()=>{
        clearAuth(setToken, setUser, setIsOwner)
        toast.success('You have been logged out')
    }


    // Load token, cars, and user on startup (silent — no error toasts for stale tokens / retries)
    useEffect(()=>{
        const savedToken = localStorage.getItem('token')
        setToken(savedToken)

        if (savedToken) {
            axios.defaults.headers.common['Authorization'] = savedToken
            fetchUser({ silent: true })
        }

        fetchCars({ silent: true })
    },[])

    const value = {
        navigate, currency, axios, user, setUser,
        token, setToken, isOwner, setIsOwner, fetchUser, showLogin, setShowLogin, logout, fetchCars, cars, setCars, 
        pickupDate, setPickupDate, returnDate, setReturnDate, apiErrorMessage
    }

    return (
    <AppContext.Provider value={value}>
        { children }
    </AppContext.Provider>
    )
}

export const useAppContext = ()=>{
    return useContext(AppContext)
}
