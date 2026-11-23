
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

        console.log("Appointments:", data);

    } catch (error) {
        console.error("Appointments Error:", error);
    }
}
loadAppointments();