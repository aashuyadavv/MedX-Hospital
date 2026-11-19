
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const Patient = require("./models/Patient");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection Monitoring
mongoose.connection.on("connected", () => {
    console.log("MongoDB connection established");
});

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
    console.error("MongoDB runtime error:", error.message);
});


app.post("/api/auth/signup", async (req, res) => {

    try {
        // Step 1: Get patient details
        const { fullName, email, mobile, password } = req.body || {};

        // Step 2: Check empty fields
        if (!fullName || !email || !mobile || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Step 3: Validate input
        const normalizedEmail = email.trim().toLowerCase();

        if (
            typeof fullName !== "string" ||
            typeof email !== "string" ||
            typeof mobile !== "string" ||
            typeof password !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
            !/^\d{10}$/.test(mobile) ||
            password.length < 6
        ) {
            return res.status(400).json({
                message: "Invalid patient details"
            });
        }

        // Step 4: Check existing patient
        const existingPatient = await Patient.findOne({
            email: normalizedEmail
        });

        if (existingPatient) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // Step 5: Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Step 6: Save patient in MongoDB
        const newPatient = new Patient({
            fullName: fullName.trim(),
            email: normalizedEmail,
            mobile,
            password: hashedPassword
        });

        await newPatient.save();

        // Step 7: Success response
        return res.status(201).json({
            message: "Patient registered successfully!"
        });

    } catch (error) {
        console.error("Signup Error:", error.message);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        return res.status(500).json({
            message: "Server error during registration"
        });
    }

});

// Test Route
app.get("/", (req, res) => {
    res.send("MedX Hospital Backend is Running!");
});

// Start Server After MongoDB Connection
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB Connected Successfully!");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`MedX Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
}

connectDB();