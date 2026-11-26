/* =========================================================
   MedX Hospital - JavaScript
   This file controls the small interactive parts of the page.
   ========================================================= */

'use strict';

// Wait until the HTML has loaded before selecting page elements.
document.addEventListener('DOMContentLoaded', function () {
  // Get the elements that JavaScript needs to work with.
  const currentYear = document.getElementById('currentYear');
  const themeToggle = document.getElementById('themeToggle');
  const appointmentForm = document.getElementById('appointmentForm');
  const appointmentDate = document.getElementById('appointmentDate');
  const formMessage = document.getElementById('formMessage');

  // ---------------------------------------------------------
  // 1. Show the current year in the footer.
  // ---------------------------------------------------------
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // ---------------------------------------------------------
  // 2. Prevent visitors from selecting a date in the past.
  // ---------------------------------------------------------
  if (appointmentDate) {
    const today = new Date();

    // Build a local YYYY-MM-DD date without UTC timezone shifts.
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    appointmentDate.min = `${year}-${month}-${day}`;
  }

  // ---------------------------------------------------------
  // 3. Switch between light mode and dark mode.
  // ---------------------------------------------------------
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const rootElement = document.documentElement;
      const currentTheme = rootElement.dataset.theme || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      rootElement.dataset.theme = newTheme;
      themeToggle.setAttribute('aria-pressed', String(newTheme === 'dark'));
    });
  }

  // ---------------------------------------------------------
  // 4. Validate the appointment form and prepare a WhatsApp link.
  // ---------------------------------------------------------
  if (appointmentForm) {
appointmentForm.addEventListener('submit', async function (event) {
      // Stop the browser from reloading the page on form submission.
      event.preventDefault();

      // Read the visitor's details from the form.
      // Check patient login
      const token = localStorage.getItem('medxToken');

      if (!token) {
          formMessage.className = 'error-message';
          formMessage.textContent = 'Please login before booking an appointment.';
          return;
      }
      const fullName = document.getElementById('fullName').value.trim();
      const phoneNumber = document.getElementById('phoneNumber').value.replace(/\D/g, '');
      const department = document.getElementById('department').value;
      const doctor = document.getElementById('doctor').value;
      const preferredDate = appointmentDate.value;
      const message = document.getElementById('message').value.trim();

      // Check that the required information is valid.
      if (fullName.length < 2 || phoneNumber.length !== 10 || !preferredDate) {
        formMessage.className = 'error-message';
        formMessage.textContent =
          'Please enter your name, a valid 10-digit phone number and a preferred date.';
        return;
      }
      // Save appointment to MongoDB through backend API
const response = await fetch('http://localhost:5000/api/appointments', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
        doctorName: doctor,
        department: department,
        appointmentDate: preferredDate,
        appointmentTime: '11:00 AM',
        reason: message || 'Regular consultation'
    })
});

const data = await response.json();

if (!response.ok) {
    formMessage.className = 'error-message';
    formMessage.textContent = data.message || 'Appointment booking failed.';
    return;
}

console.log('Appointment saved:', data);
// Prepare WhatsApp message after successful database save
const appointmentDetails = [
    'Appointment request',
    `Name: ${fullName}`,
    `Phone: ${phoneNumber}`,
    `Department: ${department}`,
    `Doctor: ${doctor}`,
    `Date: ${preferredDate}`,
    `Note: ${message || 'Not provided'}`
].join('\n');

const hospitalWhatsAppNumber = '919990219967';

const whatsappURL =
    `https://wa.me/${hospitalWhatsAppNumber}?text=${encodeURIComponent(appointmentDetails)}`;

formMessage.className = 'success-message';
formMessage.textContent = `Thank you, ${fullName}! `;

const whatsappLink = document.createElement('a');
whatsappLink.href = whatsappURL;
whatsappLink.target = '_blank';
whatsappLink.rel = 'noopener noreferrer';
whatsappLink.textContent = 'Send on WhatsApp to confirm';

formMessage.appendChild(whatsappLink);

appointmentForm.reset();
    });
  }
});
