# MedX Hospital

A responsive, modern hospital website frontend built with **HTML, CSS,
and JavaScript**. The design uses a clean healthcare-focused interface
with teal, navy, and white colors.

> **Note:** MedX Hospital is a portfolio/demo project. The hospital
> details, doctor profiles, statistics, timings, phone number, email
> address, and address shown on the website are sample content. Replace
> them with verified information before using the site publicly.

## Features

-   Responsive navigation with section links
-   Hero section with hospital introduction and call-to-action buttons
-   Hospital highlights and sample statistics
-   Medical department cards
-   Doctor profile cards
-   Appointment request form interface
-   Contact information section
-   Light/dark theme styling support
-   Responsive layout for desktop, tablet, and mobile screens

## Technologies

-   HTML5
-   CSS3
-   Vanilla JavaScript

## Project Structure

``` text
MedX-Hospital/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── medx-logo.webp
    ├── hospital-hero.webp
    ├── doctor-abhilash.webp
    ├── doctor-deeksha.webp
    └── doctor-shrikant.webp
```

Make sure the `assets` folder and its image files are present. The image
filenames must match the paths used in `index.html`.

## Run Locally

1.  Download or clone this repository.
2.  Open the project folder in Visual Studio Code.
3.  Check that `index.html`, `style.css`, `script.js`, and the `assets`
    folder are in the locations shown above.
4.  Open `index.html` with the **Live Server** extension, or open the
    HTML file directly in your browser.

The CSS and JavaScript are linked from the project root:

``` html
<link rel="stylesheet" href="./style.css">
<script src="./script.js" defer></script>
```

## Customization

-   Update colors, spacing, typography, and responsive styles in
    `style.css`.
-   Update page content and image paths in `index.html`.
-   Update interactive behavior in `script.js`.
-   Replace the sample logo and photos in the `assets` folder with your
    own authorized images.

## Appointment Form

The appointment section currently provides a frontend form interface. A
real appointment workflow requires a backend or a trusted form/booking
service to securely receive, store, and process submissions. Do not
collect real patient or medical information until appropriate security
and privacy safeguards are in place.

## Future Improvements

-   Connect appointment requests to a backend or booking service
-   Add form validation and clear success/error feedback
-   Add individual pages for departments and doctors
-   Add secure admin tools to manage appointments
-   Improve accessibility and performance

## License

This project is intended for learning and portfolio demonstration. Add a
license file if you plan to distribute or reuse the code under specific
terms.
