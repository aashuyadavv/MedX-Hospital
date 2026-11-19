
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

    // Demo login message
    showMessage("Login form validated successfully!", "success");

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
