
// Sidebar Navigation
const navLinks = document.querySelectorAll(".sidebar-nav a");

navLinks.forEach((link) => {
    link.addEventListener("click", function () {

        // Remove active class from all links
        navLinks.forEach((item) => {
            item.classList.remove("active");
        });

        // Add active class to clicked link
        this.classList.add("active");
    });
});


// Logout Confirmation
const logoutBtn = document.querySelector(".logout-btn");

logoutBtn.addEventListener("click", function (event) {

    const confirmLogout = confirm(
        "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
        event.preventDefault();
    }
});
