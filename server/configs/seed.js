import bcrypt from "bcrypt";
import User from "../models/User.js";
import Car from "../models/Car.js";

export const starterCarKeys = [
    "Toyota:Camry",
    "BMW:X5",
    "Mercedes:E-Class",
    "Ford:Explorer",
    "Audi:A4",
    "Tesla:Model 3",
];

export const demoCars = [
    {
        brand: "Toyota",
        model: "Camry",
        image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80",
        year: 2023,
        category: "Sedan",
        seating_capacity: 5,
        fuel_type: "Petrol",
        transmission: "Automatic",
        pricePerDay: 65,
        location: "Mumbai",
        description: "A comfortable sedan with smooth handling, roomy seating, and great fuel economy for city drives and weekend trips.",
    },
    {
        brand: "BMW",
        model: "X5",
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
        year: 2022,
        category: "SUV",
        seating_capacity: 5,
        fuel_type: "Diesel",
        transmission: "Automatic",
        pricePerDay: 120,
        location: "Delhi",
        description: "A premium SUV with a refined cabin, confident road presence, and plenty of space for passengers and luggage.",
    },
    {
        brand: "Mercedes",
        model: "E-Class",
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
        year: 2024,
        category: "Sedan",
        seating_capacity: 5,
        fuel_type: "Hybrid",
        transmission: "Automatic",
        pricePerDay: 110,
        location: "Bengaluru",
        description: "A luxury sedan with quiet performance, elegant interiors, and modern comfort features for longer journeys.",
    },
    {
        brand: "Ford",
        model: "Explorer",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
        year: 2021,
        category: "SUV",
        seating_capacity: 7,
        fuel_type: "Gas",
        transmission: "Automatic",
        pricePerDay: 95,
        location: "Hyderabad",
        description: "A spacious seven-seat SUV built for family travel, airport runs, and road trips with extra cargo room.",
    },
    {
        brand: "Audi",
        model: "A4",
        image: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=1200&q=80",
        year: 2023,
        category: "Sedan",
        seating_capacity: 5,
        fuel_type: "Petrol",
        transmission: "Semi-Automatic",
        pricePerDay: 90,
        location: "Chennai",
        description: "A sporty sedan with crisp steering, premium materials, and a polished drive for business or leisure rentals.",
    },
    {
        brand: "Tesla",
        model: "Model 3",
        image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80",
        year: 2024,
        category: "Sedan",
        seating_capacity: 5,
        fuel_type: "Electric",
        transmission: "Automatic",
        pricePerDay: 105,
        location: "Kolkata",
        description: "An all-electric sedan with instant acceleration, a minimalist cabin, and excellent range for daily driving.",
    },
];

const ensureStarterCars = async (owner) => {
    for (const car of demoCars) {
        await Car.findOneAndUpdate(
            { brand: car.brand, model: car.model },
            { ...car, owner: owner._id, isAvaliable: true },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
    }
};

export const seedDatabase = async ({ seedCars = true, seedDemoUser = false } = {}) => {
    try {
        const password = await bcrypt.hash("demo12345", 10);

        let owner = await User.findOne({ email: "owner@demo.com" });
        if (!owner) {
            owner = await User.create({
                name: "Demo Owner",
                email: "owner@demo.com",
                password,
                role: "owner",
            });
        }

        const demoUser = await User.findOne({ email: "user@demo.com" });
        if (seedDemoUser && !demoUser) {
            await User.create({
                name: "Demo User",
                email: "user@demo.com",
                password,
                role: "user",
            });
        }

        if (seedCars) await ensureStarterCars(owner);

        console.log(seedCars ? "Starter cars ready." : "Starter cars skipped.");
        console.log("  Owner login: owner@demo.com / demo12345");
        if (seedDemoUser) console.log("  User login:  user@demo.com / demo12345");
    } catch (error) {
        console.error("Seeding error:", error.message);
    }
};
