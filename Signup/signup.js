
// Select signup form
const signupForm = document.getElementById("signupForm");

// Select input fields
const fullName = document.getElementById("fullName");
const email = document.getElementById("signupEmail");
const mobile = document.getElementById("mobile");
const password = document.getElementById("signupPassword");
const confirmPassword = document.getElementById("confirmPassword");
const terms = document.getElementById("terms");

// Select message area
const signupMessage = document.getElementById("signupMessage");


// Form submit event
signupForm.addEventListener("submit", function (event) {

    // Stop page refresh
    event.preventDefault();

    // Get input values
    const nameValue = fullName.value.trim();
    const emailValue = email.value.trim();
    const mobileValue = mobile.value.trim();
    const passwordValue = password.value;
    const confirmValue = confirmPassword.value;

    // Check full name
    if (nameValue.length < 3) {
        showMessage("Please enter your full name.", "error");
        return;
    }

    // Check mobile number
    if (!/^[0-9]{10}$/.test(mobileValue)) {
        showMessage("Enter a valid 10-digit mobile number.", "error");
        return;
    }

    // Check password length
    if (passwordValue.length < 6) {
        showMessage("Password must contain at least 6 characters.", "error");
        return;
    }

    // Check confirm password
    if (passwordValue !== confirmValue) {
        showMessage("Passwords do not match.", "error");
        return;
    }

    // Check terms checkbox
    if (!terms.checked) {
        showMessage("Please accept Terms & Conditions.", "error");
        return;
    }

    // Frontend validation successful
    showMessage("Signup form validated successfully!", "success");

});


// Function to show messages
function showMessage(message, type) {

    signupMessage.textContent = message;

    if (type === "success") {
        signupMessage.style.color = "green";
    } else {
        signupMessage.style.color = "red";
    }

}
