const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({

    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },

    doctorName: {
        type: String,
        required: true,
        trim: true
    },

    department: {
        type: String,
        required: true
    },

    appointmentDate: {
        type: Date,
        required: true
    },

    appointmentTime: {
        type: String,
        required: true
    },

    reason: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
        default: "Pending"
    }

}, {
    timestamps: true
});

const Appointment = mongoose.model(
    "Appointment",
    appointmentSchema
);

module.exports = Appointment;