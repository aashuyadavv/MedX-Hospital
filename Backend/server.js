const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const Patient = require("./models/Patient");
const authMiddleware = require("./middleware/authMiddleware");
const Appointment = require("./models/Appointment");

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

// Book Appointment API
app.post("/api/appointments", authMiddleware, async (req, res) => {

    try {
        const {
            doctorName,
            department,
            appointmentDate,
            appointmentTime,
            reason
        } = req.body || {};

        // Check required fields
        if (
            !doctorName ||
            !department ||
            !appointmentDate ||
            !appointmentTime ||
            !reason
        ) {
            return res.status(400).json({
                message: "All appointment fields are required"
            });
        }

        // Validate appointment date
        const date = new Date(appointmentDate);

        if (Number.isNaN(date.getTime())) {
            return res.status(400).json({
                message: "Invalid appointment date"
            });
        }

        if (date < new Date()) {
            return res.status(400).json({
                message: "Appointment date cannot be in the past"
            });
        }

        // Create appointment
        const newAppointment = new Appointment({
            patient: req.patient.patientId,
            doctorName,
            department,
            appointmentDate: date,
            appointmentTime,
            reason
        });

        await newAppointment.save();

        return res.status(201).json({
            message: "Appointment booked successfully!",
            appointment: newAppointment
        });

    } catch (error) {
        console.error("Appointment Error:", error.message);

        return res.status(500).json({
            message: "Server error while booking appointment"
        });
    }

});

// Get All Appointments API
app.get("/api/appointments", authMiddleware, async (req, res) => {

    try {
        // Find appointments of logged-in patient
        const appointments = await Appointment.find({
            patient: req.patient.patientId
        }).sort({ appointmentDate: -1 });

        return res.status(200).json({
            message: "Appointments fetched successfully!",
            totalAppointments: appointments.length,
            appointments: appointments
        });

    } catch (error) {
        console.error("Get Appointments Error:", error.message);

        return res.status(500).json({
            message: "Server error while fetching appointments"
        });
    }

});


// Update Appointment API
app.patch("/api/appointments/:id", authMiddleware, async (req, res) => {

    try {
        // Step 1: Get appointment ID
        const appointmentId = req.params.id;

        // Step 2: Find patient's appointment
        const appointment = await Appointment.findOne({
            _id: appointmentId,
            patient: req.patient.patientId
        });

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        // Step 3: Check appointment status
        if (["Cancelled", "Completed"].includes(appointment.status)) {
            return res.status(400).json({
                message: "This appointment cannot be updated"
            });
        }

        // Step 4: Allowed fields
        const allowedFields = [
            "doctorName",
            "department",
            "appointmentDate",
            "appointmentTime",
            "reason"
        ];

        const updates = req.body || {};
        const updateFields = Object.keys(updates);

        if (
            updateFields.length === 0 ||
            updateFields.some(field => !allowedFields.includes(field))
        ) {
            return res.status(400).json({
                message: "Invalid or empty update fields"
            });
        }

        // Step 5: Validate and update fields
        for (const field of updateFields) {

            if (
                typeof updates[field] !== "string" ||
                !updates[field].trim()
            ) {
                return res.status(400).json({
                    message: `Invalid ${field}`
                });
            }

            if (field === "appointmentDate") {
                const date = new Date(updates[field]);

                if (
                    Number.isNaN(date.getTime()) ||
                    date < new Date()
                ) {
                    return res.status(400).json({
                        message: "Invalid or past appointment date"
                    });
                }

                appointment.appointmentDate = date;
            } else {
                appointment[field] = updates[field].trim();
            }
        }

        // Step 6: Save updated appointment
        await appointment.save();

        return res.status(200).json({
            message: "Appointment updated successfully!",
            appointment
        });

    } catch (error) {
        console.error("Update Appointment Error:", error.message);

        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid appointment ID"
            });
        }

        return res.status(500).json({
            message: "Server error while updating appointment"
        });
    }

});


// Cancel Appointment API
app.patch("/api/appointments/:id/cancel", authMiddleware, async (req, res) => {

    try {
        // Step 1: Get appointment ID
        const appointmentId = req.params.id;

        // Step 2: Find patient's appointment
        const appointment = await Appointment.findOne({
            _id: appointmentId,
            patient: req.patient.patientId
        });

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        // Step 3: Check appointment status
        if (appointment.status === "Cancelled") {
            return res.status(400).json({
                message: "Appointment is already cancelled"
            });
        }

        if (appointment.status === "Completed") {
            return res.status(400).json({
                message: "Completed appointment cannot be cancelled"
            });
        }

        // Step 4: Update status
        appointment.status = "Cancelled";

        // Step 5: Save changes
        await appointment.save();

        return res.status(200).json({
            message: "Appointment cancelled successfully!",
            appointment
        });

    } catch (error) {
        console.error("Cancel Appointment Error:", error.message);

        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid appointment ID"
            });
        }

        return res.status(500).json({
            message: "Server error while cancelling appointment"
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
