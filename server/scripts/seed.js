import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../configs/db.js";
import { demoCars, seedDatabase } from "../configs/seed.js";
import Car from "../models/Car.js";

const uri = process.env.MONGODB_URI?.trim() ?? "";
const uriIsUnset =
    uri.length === 0 ||
    uri.includes("<") ||
    uri.includes("YOUR_ATLAS_PASSWORD") ||
    uri.includes("YOUR_PASSWORD") ||
    uri.includes("db_password");

if (uriIsUnset) {
    console.error(
        "Set MONGODB_URI to the live database before seeding. Use the same connection string as the Vercel project car-rental-app-server. Optional MONGODB_DB_NAME defaults to car-rental. An empty or placeholder URI is refused so this command cannot silently seed a temporary in-memory database."
    );
    process.exit(1);
}

await connectDB();
await seedDatabase({
    seedCars: true,
    seedDemoUser: process.env.SEED_DEMO_USER === "true",
});

const mismatches = [];
for (const car of demoCars) {
    const saved = await Car.findOne({ brand: car.brand, model: car.model });
    if (!saved || saved.pricePerDay !== car.pricePerDay) {
        mismatches.push(`${car.brand} ${car.model}`);
    }
}

if (mismatches.length > 0) {
    console.error(`Seed did not persist daily prices for: ${mismatches.join(", ")}`);
    await mongoose.disconnect();
    process.exit(1);
}

const dbName = process.env.MONGODB_DB_NAME || "car-rental";
console.log(`Starter cars updated in "${dbName}". Daily prices:`);
for (const car of demoCars) {
    console.log(`  ${car.brand} ${car.model}: ₹${car.pricePerDay.toLocaleString("en-IN")}/day`);
}
console.log("Matched cars were upserted by brand and model, so location, image, description, and availability were set back to the seed values.");

await mongoose.disconnect();
process.exit(0);
