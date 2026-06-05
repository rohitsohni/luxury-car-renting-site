import express from "express";
import "dotenv/config";
import cors from "cors";
import { fileURLToPath } from "url";
import connectDB from "./configs/db.js";
import { seedDatabase } from "./configs/seed.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Middleware to ensure DB connection with retry logic
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection failed:", error.message);
        return res.status(503).json({
            success: false,
            message: "Database unavailable. Retrying...",
        });
    }
});

app.get("/", (req, res) => res.send("Server is running"));
app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);

const isLocalServer =
    process.argv[1] === fileURLToPath(import.meta.url);

if (isLocalServer) {
    try {
        await connectDB();
        await seedDatabase({
            seedCars: process.env.SEED_DEMO_CARS !== "false",
            seedDemoUser: process.env.SEED_DEMO_USER === "true",
        });
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error("Server failed to start:", error.message);
        process.exit(1);
    }
}

export default app;
