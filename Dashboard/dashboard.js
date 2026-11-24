
 // Sidebar Navigation
const navLinks = document.querySelectorAll(".sidebar-nav a");

navLinks.forEach((link) => {
    link.addEventListener("click", function () {
        navLinks.forEach((item) => {
            item.classList.remove("active");
        });

        this.classList.add("active");
    });
});


// Logout Confirmation
const logoutBtn = document.querySelector(".logout-btn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function (event) {
        const confirmLogout = confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) {
            event.preventDefault();
        } else {
            localStorage.removeItem("medxToken");
            localStorage.removeItem("patientName");
            localStorage.removeItem("patientEmail");
        }
    });
}


// Show dashboard message
function showDashboardMessage(message) {
    console.error(message);
}


// Load Patient Profile
async function loadPatientProfile() {

    const token = localStorage.getItem("medxToken");

    if (!token) {
        window.location.href = "../Login/login.html";
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:5000/api/patient/profile",
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            showDashboardMessage(data.message || "Session expired.");
            localStorage.removeItem("medxToken");
            window.location.href = "../Login/login.html";
            return;
        }

        // Backend sends patient details inside data.patient
        const patient = data.patient;

        document.getElementById("patientName").textContent =
            patient.fullName;

        document.getElementById("welcomeName").textContent =
            `Hello, ${patient.fullName}! 👋`;

        document.getElementById("profileName").textContent =
            patient.fullName;

        document.getElementById("profileEmail").textContent =
            patient.email;

        document.getElementById("profileMobile").textContent =
            patient.mobile;

    } catch (error) {
        console.error("Profile Error:", error);
        showDashboardMessage("Unable to load patient profile.");
    }
}


// Load dashboard data
loadPatientProfile();
// Load Patient Appointments
async function loadAppointments() {
    const token = localStorage.getItem("medxToken");

    if (!token) {
        window.location.href = "../Login/login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/appointments", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to load appointments");
        }

    console.log("Appointments:", JSON.stringify(data, null, 2));
    // Update Total Appointments Count
document.getElementById("appointmentsCount").textContent =
    data.totalAppointments;

// Get Appointments Container
const appointmentsList = document.getElementById("appointmentsList");
if (!appointmentsList) {
    console.error("appointmentsList element not found!");
    return;
}

// Clear Previous Content
appointmentsList.innerHTML = "";

// Check If Appointments Exist
if (data.appointments.length === 0) {
    appointmentsList.textContent = "No appointments found.";
    console.log("No appointments found.");
    return;
}
// Display Appointment Cards
data.appointments.forEach((appointment) => {

    const appointmentCard = document.createElement("div");
    appointmentCard.className = "appointment-card";

    const details = document.createElement("div");

    const doctorHeading = document.createElement("h3");
    doctorHeading.textContent = appointment.doctorName;

    const departmentText = document.createElement("p");
    departmentText.textContent = appointment.department;

    details.appendChild(doctorHeading);
    details.appendChild(departmentText);

    const status = document.createElement("span");
    status.className = "status";
    status.textContent = appointment.status;

    const date = document.createElement("div");
    date.className = "appointment-date";
    date.textContent = new Date(appointment.appointmentDate)
        .toLocaleDateString("en-IN");

    appointmentCard.appendChild(details);
    appointmentCard.appendChild(status);
    appointmentCard.appendChild(date);

    appointmentsList.appendChild(appointmentCard);

});

    } catch (error) {
        console.error("Appointments Error:", error);
    }
}
loadAppointments();