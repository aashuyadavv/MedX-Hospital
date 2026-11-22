
// Select the login form
const loginForm = document.getElementById("loginForm");

// Select input fields
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Select message area
const loginMessage = document.getElementById("loginMessage");


// Form submit event
loginForm.addEventListener("submit", function (event) {

    // Stop page from refreshing
    event.preventDefault();

    // Get input values
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Check email
    if (email === "") {
        showMessage("Please enter your email address.", "error");
        return;
    }

    // Check password
    if (password === "") {
        showMessage("Please enter your password.", "error");
        return;
    }

    // Check password length
    if (password.length < 6) {
        showMessage("Password must be at least 6 characters.", "error");
        return;
    }

    // Connect with backend login API
    loginPatient(email, password);

});


// Function to display messages
function showMessage(message, type) {

    loginMessage.textContent = message;

    if (type === "success") {
        loginMessage.style.color = "green";
    } else {
        loginMessage.style.color = "red";
    }

}
// Login patient with backend
async function loginPatient(email, password) {

    try {

        showMessage("Logging in...", "success");

        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showMessage(data.message || "Login failed.", "error");
            return;
        }

        // Save JWT token
        localStorage.setItem("medxToken", data.token);

        // Save patient details
        localStorage.setItem("patientName", data.fullName);
        localStorage.setItem("patientEmail", data.email);

        showMessage("Login successful! Redirecting...", "success");

        setTimeout(() => {
            window.location.href = "../Dashboard/dashboard.html";
        }, 1000);

    } catch (error) {

        console.error("Login Error:", error);

        showMessage("Unable to connect to server.", "error");
    }
}