import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

const toDateRange = (pickupDate, returnDate) => {
    const pickup = new Date(pickupDate);
    const dropoff = new Date(returnDate);

    if (!pickupDate || !returnDate || Number.isNaN(pickup.getTime()) || Number.isNaN(dropoff.getTime())) {
        return { error: "Please select valid pickup and return dates" };
    }

    if (dropoff <= pickup) {
        return { error: "Return date must be after pickup date" };
    }

    return { pickup, dropoff };
};

const hasOverlappingBooking = async (car, pickupDate, returnDate) => {
    const booking = await Booking.findOne({
        car,
        status: { $ne: "cancelled" },
        pickupDate: { $lte: returnDate },
        returnDate: { $gte: pickupDate },
    });

    return Boolean(booking);
};

export const checkAvailabilityOfCar = async (req, res) => {
    try {
        const { location, pickupDate, returnDate } = req.body;
        const { pickup, dropoff, error } = toDateRange(pickupDate, returnDate);

        if (error) return res.json({ success: false, message: error });

        const cars = await Car.find({ location, isAvaliable: true });
        const bookedCars = await Booking.distinct("car", {
            car: { $in: cars.map((car) => car._id) },
            status: { $ne: "cancelled" },
            pickupDate: { $lte: dropoff },
            returnDate: { $gte: pickup },
        });
        const bookedIds = new Set(bookedCars.map((id) => id.toString()));
        const availableCars = cars.filter((car) => !bookedIds.has(car._id.toString()));

        res.json({ success: true, availableCars });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const createBooking = async (req, res) => {
    try {
        const { car, pickupDate, returnDate } = req.body;
        const { pickup, dropoff, error } = toDateRange(pickupDate, returnDate);

        if (error) return res.json({ success: false, message: error });
        if (!mongoose.Types.ObjectId.isValid(car)) {
            return res.json({ success: false, message: "Please choose a car from the live inventory before booking" });
        }

        const carData = await Car.findById(car);
        if (!carData || !carData.isAvaliable) {
            return res.json({ success: false, message: "Car is not available" });
        }

        const isBooked = await hasOverlappingBooking(car, pickup, dropoff);
        if (isBooked) {
            return res.json({ success: false, message: "Car is already booked for the selected dates" });
        }

        const days = Math.ceil((dropoff - pickup) / (1000 * 60 * 60 * 24));
        const price = days * carData.pricePerDay;

        await Booking.create({
            car,
            user: req.user._id,
            owner: carData.owner,
            pickupDate: pickup,
            returnDate: dropoff,
            price,
        });

        res.json({ success: true, message: "Booking created successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate("car").sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const getOwnerBookings = async (req, res) => {
    try {
        if (req.user.role !== "owner") {
            return res.json({ success: false, message: "not authorized" });
        }

        const bookings = await Booking.find({ owner: req.user._id })
            .populate("car")
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const changeBookingStatus = async (req, res) => {
    try {
        const { bookingId, status } = req.body;
        const allowedStatuses = ["pending", "confirmed", "cancelled"];

        if (!mongoose.Types.ObjectId.isValid(bookingId) || !allowedStatuses.includes(status)) {
            return res.json({ success: false, message: "Invalid booking update" });
        }

        const booking = await Booking.findOneAndUpdate(
            { _id: bookingId, owner: req.user._id },
            { status },
            { new: true }
        );

        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        res.json({ success: true, message: "Booking status updated" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
