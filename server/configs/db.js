import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;
let cachedConnection = null;
let lastConnectionCheck = 0;

mongoose.set("bufferCommands", false);

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

const isPlaceholderUri = (uri) =>
    !uri ||
    uri.includes("<db_password>") ||
    uri.includes("YOUR_ATLAS_PASSWORD") ||
    uri.includes("YOUR_PASSWORD");

const isConnectionStale = () => {
    const now = Date.now();
    // Treat connection as stale if not checked in last 30 seconds
    return now - lastConnectionCheck > 30000;
};

const connectDB = async () => {
    // Check if connection is already ready and not stale
    if (mongoose.connection.readyState === 1 && !isConnectionStale()) {
        lastConnectionCheck = Date.now();
        return mongoose.connection;
    }

    // If connection is stale or broken, disconnect and reconnect
    if (mongoose.connection.readyState !== 0) {
        try {
            await mongoose.disconnect();
        } catch (err) {
            console.warn("Error disconnecting:", err.message);
        }
        cachedConnection = null;
    }

    if (cachedConnection) {
        try {
            await cachedConnection;
            if (mongoose.connection.readyState === 1) {
                lastConnectionCheck = Date.now();
                return mongoose.connection;
            }
        } catch (err) {
            console.warn("Cached connection failed:", err.message);
            cachedConnection = null;
        }
    }

    let uri = process.env.MONGODB_URI?.trim();

    if (isPlaceholderUri(uri)) {
        if (isServerless) {
            throw new Error(
                "Database not configured. Set MONGODB_URI in Vercel (car-rental-app-server project)."
            );
        }

        console.log(
            "MONGODB_URI not configured — using in-memory MongoDB for local dev."
        );
        if (!memoryServer) {
            memoryServer = await MongoMemoryServer.create();
        }
        uri = memoryServer.getUri();
    }

    // Set up connection event listeners (only once)
    if (!mongoose.connection.listeners("connected").length) {
        mongoose.connection.on("connected", () => console.log("✓ Database Connected"));
        mongoose.connection.on("disconnected", () => console.log("✗ Database Disconnected"));
        mongoose.connection.on("error", (err) =>
            console.error("✗ Database error:", err.message)
        );
    }

    cachedConnection = mongoose.connect(uri, {
        dbName: process.env.MONGODB_DB_NAME || "car-rental",
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4, // Use IPv4, skip trying IPv6
        retryWrites: true,
        retryReads: true,
        maxPoolSize: 10,
        minPoolSize: 2,
    });

    await cachedConnection;

    if (mongoose.connection.readyState !== 1) {
        throw new Error("Database connection failed");
    }

    lastConnectionCheck = Date.now();
    return mongoose.connection;
};

export default connectDB;
