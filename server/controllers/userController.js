import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Car from "../models/Car.js";
import { seedDatabase, starterCarKeys } from "../configs/seed.js";

const indianLocationByOldCity = {
    "New York": "Mumbai",
    "Los Angeles": "Delhi",
    "Chicago": "Bengaluru",
    "Houston": "Hyderabad",
};

const withIndianLocation = (car) => {
    const normalizedCar = typeof car.toObject === "function" ? car.toObject() : car;
    return {
        ...normalizedCar,
        location: indianLocationByOldCity[normalizedCar.location] || normalizedCar.location,
    };
};


// Generate JWT Token
const generateToken = (userId)=>{
    return jwt.sign({ id: userId }, process.env.JWT_SECRET)
}

// Register User
export const registerUser = async (req, res)=>{
    try {
        const {name, email, password} = req.body

        if(!name || !email || !password){
            return res.json({success: false, message: 'Fill all the fields'})
        }

        const userExists = await User.findOne({email})
        if(userExists){
            return res.json({success: false, message: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({name, email, password: hashedPassword})
        const token = generateToken(user._id.toString())
        res.json({success: true, token})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Login User 
export const loginUser = async (req, res)=>{
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.json({success: false, message: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({success: false, message: "Invalid Credentials" })
        }
        const token = generateToken(user._id.toString())
        res.json({success: true, token})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Get User data using Token (JWT)
export const getUserData = async (req, res) =>{
    try {
        const {user} = req;
        res.json({success: true, user})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Get All Cars for the Frontend
export const getCars = async (req, res) =>{
    try {
        if (await Car.countDocuments({ isAvaliable: true }) < 6) {
            await seedDatabase({ seedCars: true });
        }

        const cars = await Car.find({isAvaliable: true})
        const starterCars = cars
            .filter((car) => starterCarKeys.includes(`${car.brand}:${car.model}`))
            .sort((a, b) => starterCarKeys.indexOf(`${a.brand}:${a.model}`) - starterCarKeys.indexOf(`${b.brand}:${b.model}`));
        const starterIds = new Set(starterCars.map((car) => car._id.toString()));
        const addedCars = cars.filter((car) => !starterIds.has(car._id.toString()));
        const orderedCars = starterCars.length >= 6 ? [...starterCars.slice(0, 6), ...addedCars] : cars;

        res.json({success: true, cars: orderedCars.map(withIndianLocation)})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
