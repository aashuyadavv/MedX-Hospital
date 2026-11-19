const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const Patient = require("./models/Patient");
const authMiddleware = require("./middleware/authMiddleware");

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

// Patient Login API
app.post("/api/auth/login", async (req, res) => {

    try {
        // Step 1: Get login details
        const { email, password } = req.body || {};

        // Step 2: Check empty fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Step 3: Validate input
        if (
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                message: "Invalid login details"
            });
        }

        // Step 4: Normalize email
        const normalizedEmail = email.trim().toLowerCase();

        // Step 5: Find patient
        const patient = await Patient.findOne({
            email: normalizedEmail
        });

        if (!patient) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Step 6: Compare password
        const isPasswordValid = await bcrypt.compare(
            password,
            patient.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Step 7: Generate JWT Token
        const token = jwt.sign(
            {
                patientId: patient._id,
                email: patient.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1d"
            }
        );

        // Step 8: Login success
        return res.status(200).json({
            message: "Login successful!",
            token: token,
            patient: {
                id: patient._id,
                fullName: patient.fullName,
                email: patient.email
            }
        });

    } catch (error) {
        console.error("Login Error:", error.message);

        return res.status(500).json({
            message: "Server error during login"
        });
    }

});

// Protected Patient Profile API
app.get("/api/patient/profile", authMiddleware, async (req, res) => {

    try {
        // Find logged-in patient
        const patient = await Patient.findById(
            req.patient.patientId
        ).select("-password");

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        return res.status(200).json({
            message: "Patient profile fetched successfully!",
            patient: patient
        });

    } catch (error) {
        console.error("Profile Error:", error.message);

        return res.status(500).json({
            message: "Server error while fetching profile"
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