import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import imagekit from "../configs/imageKit.js";

const requiredCarFields = [
    "brand",
    "model",
    "year",
    "category",
    "seating_capacity",
    "fuel_type",
    "transmission",
    "pricePerDay",
    "location",
    "description",
];

const hasImageKitConfig = () =>
    Boolean(
        process.env.IMAGEKIT_PUBLIC_KEY &&
        process.env.IMAGEKIT_PRIVATE_KEY &&
        process.env.IMAGEKIT_URL_ENDPOINT
    );

const uploadImage = async (file, folder) => {
    if (!file) return null;

    if (!hasImageKitConfig()) {
        return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    }

    const uploadResponse = await imagekit.upload({
        file: file.buffer.toString("base64"),
        fileName: `${folder}-${Date.now()}-${file.originalname}`,
        folder,
    });

    return uploadResponse.url;
};

const ensureOwner = (req, res) => {
    if (req.user.role !== "owner") {
        res.json({ success: false, message: "Owner access required" });
        return false;
    }

    return true;
};

const parseCarData = (rawData) => {
    if (!rawData) return { error: "Car details are required" };

    try {
        const carData = typeof rawData === "string" ? JSON.parse(rawData) : rawData;
        const missingField = requiredCarFields.find((field) => !carData[field]);

        if (missingField) {
            return { error: `Please provide ${missingField.replace("_", " ")}` };
        }

        const year = Number(carData.year);
        const pricePerDay = Number(carData.pricePerDay);
        const seating_capacity = Number(carData.seating_capacity);

        if (!Number.isInteger(year) || year < 1990) {
            return { error: "Please enter a valid car year" };
        }

        if (!Number.isFinite(pricePerDay) || pricePerDay <= 0) {
            return { error: "Daily price must be greater than zero" };
        }

        if (!Number.isInteger(seating_capacity) || seating_capacity <= 0) {
            return { error: "Seating capacity must be greater than zero" };
        }

        return {
            carData: {
                ...carData,
                year,
                pricePerDay,
                seating_capacity,
            },
        };
    } catch {
        return { error: "Invalid car details" };
    }
};

export const changeRoleToOwner = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { role: "owner" });
        res.json({ success: true, message: "You can now list cars" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const addCar = async (req, res) => {
    try {
        if (!ensureOwner(req, res)) return;

        const { carData, error } = parseCarData(req.body.carData);
        if (error) return res.json({ success: false, message: error });
        if (!req.file) return res.json({ success: false, message: "Please upload a car image" });

        const image = await uploadImage(req.file, "cars");

        await Car.create({
            ...carData,
            image,
            owner: req.user._id,
            isAvaliable: true,
        });

        res.json({ success: true, message: "Car listed successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const getOwnerCars = async (req, res) => {
    try {
        if (!ensureOwner(req, res)) return;

        const cars = await Car.find({ owner: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, cars });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const toggleCarAvailability = async (req, res) => {
    try {
        if (!ensureOwner(req, res)) return;

        const { carId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(carId)) {
            return res.json({ success: false, message: "Invalid car" });
        }

        const car = await Car.findOne({ _id: carId, owner: req.user._id });
        if (!car) return res.json({ success: false, message: "Car not found" });

        car.isAvaliable = !car.isAvaliable;
        await car.save();

        res.json({
            success: true,
            message: car.isAvaliable ? "Car is now available" : "Car is now unavailable",
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const deleteCar = async (req, res) => {
    try {
        if (!ensureOwner(req, res)) return;

        const { carId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(carId)) {
            return res.json({ success: false, message: "Invalid car" });
        }

        const car = await Car.findOne({ _id: carId, owner: req.user._id });
        if (!car) return res.json({ success: false, message: "Car not found" });

        const bookingCount = await Booking.countDocuments({ car: carId });

        if (bookingCount > 0) {
            car.isAvaliable = false;
            await car.save();
            return res.json({
                success: true,
                message: "Car has bookings, so it was marked unavailable instead of deleted",
            });
        }

        await Car.deleteOne({ _id: carId, owner: req.user._id });
        res.json({ success: true, message: "Car deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const getDashboardData = async (req, res) => {
    try {
        if (!ensureOwner(req, res)) return;

        const [totalCars, bookings] = await Promise.all([
            Car.countDocuments({ owner: req.user._id }),
            Booking.find({ owner: req.user._id }).populate("car").sort({ createdAt: -1 }),
        ]);

        const now = new Date();
        const monthlyRevenue = bookings
            .filter((booking) => {
                const createdAt = new Date(booking.createdAt);
                return (
                    createdAt.getMonth() === now.getMonth() &&
                    createdAt.getFullYear() === now.getFullYear() &&
                    booking.status === "confirmed"
                );
            })
            .reduce((total, booking) => total + booking.price, 0);

        res.json({
            success: true,
            dashboardData: {
                totalCars,
                totalBookings: bookings.length,
                pendingBookings: bookings.filter((booking) => booking.status === "pending").length,
                completedBookings: bookings.filter((booking) => booking.status === "confirmed").length,
                recentBookings: bookings.slice(0, 5),
                monthlyRevenue,
            },
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const updateUserImage = async (req, res) => {
    try {
        if (!req.file) return res.json({ success: false, message: "Please choose an image" });

        const image = await uploadImage(req.file, "users");
        await User.findByIdAndUpdate(req.user._id, { image });

        res.json({ success: true, message: "Profile image updated" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
