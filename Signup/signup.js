
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

// Send signup data to backend
registerPatient(nameValue, emailValue, mobileValue, passwordValue);

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
// Register patient with backend
async function registerPatient(name, email, mobile, password) {

    try {
        showMessage("Creating your account...", "success");

        const response = await fetch("http://localhost:5000/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullName: name,
                email: email,
                mobile: mobile,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showMessage(data.message || "Signup failed.", "error");
            return;
        }

        showMessage("Account created successfully!", "success");

        signupForm.reset();

    } catch (error) {

        console.error("Signup Error:", error);

        showMessage("Unable to connect to server. Please try again.", "error");
    }
}