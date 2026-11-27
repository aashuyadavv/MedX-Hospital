# 🏥 MedX Hospital – Patient Management System

A modern, responsive hospital website with a full-stack patient management system. Patients can create accounts, log in securely, book appointments, view their appointment history, and cancel appointments through their dashboard.

## ✨ Features

### Patient Authentication
- Patient registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected patient routes

### Patient Dashboard
- Personalized patient dashboard
- Patient profile information
- Total appointment count
- Dynamic appointment listing
- Appointment status indicators

### Appointment Management
- Book appointments through the website
- Save appointment details in MongoDB
- View personal appointments
- Cancel pending or confirmed appointments
- Automatic dashboard refresh after cancellation
- Appointment status tracking:
  - Pending
  - Confirmed
  - Completed
  - Cancelled

### Additional Features
- Responsive dashboard design
- WhatsApp appointment confirmation flow
- Form validation
- Logout functionality

## 🛠️ Tech Stack

**Frontend**
- HTML5
- CSS3
- JavaScript

**Backend**
- Node.js
- Express.js
- REST API

**Database**
- MongoDB Atlas
- Mongoose

**Authentication & Security**
- JSON Web Token (JWT)
- bcryptjs
- dotenv
- CORS

**Development Tools**
- Visual Studio Code
- Git & GitHub
- Postman

## 📁 Project Structure

```text
MedX-Hospital-Beginner-Friendly/
│
├── Backend/
│   ├── models/
│   │   ├── Patient.js
│   │   └── Appointment.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── Signup/
│   ├── signup.html
│   ├── signup.css
│   └── signup.js
│
├── Login/
│   ├── login.html
│   ├── login.css
│   └── login.js
│
├── Dashboard/
│   ├── dashboard.html
│   ├── dashboard.css
│   └── dashboard.js
│
├── index.html
├── style.css
├── script.js
└── README.md
```

*Note: The structure above represents the main project files; adjust folder names if your local structure differs.*

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/aashuyadavv/MedX-Hospital.git
```

```bash
cd MedX-Hospital
```

### 2. Install Backend Dependencies

```bash
cd Backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the Backend folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=1d
```

Replace the placeholder values with your own credentials.

**Important:** Never upload your `.env` file or expose your database credentials and JWT secret on GitHub.

### 4. Start the Backend Server

```bash
npm run dev
```

Backend server:

```text
http://localhost:5000
```

### 5. Run the Frontend

Open the root `index.html` file using VS Code Live Server.

Make sure the backend is running before testing features that require API access.

## 🔗 API Endpoints

Base URL: `http://localhost:5000`

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/api/auth/signup` | Register patient | No |
| POST | `/api/auth/login` | Patient login | No |
| GET | `/api/patient/profile` | Get patient profile | Yes |
| POST | `/api/appointments` | Book appointment | Yes |
| GET | `/api/appointments` | Get patient appointments | Yes |
| PATCH | `/api/appointments/:id` | Update appointment | Yes |
| PATCH | `/api/appointments/:id/cancel` | Cancel appointment | Yes |

For protected endpoints, send the JWT token in the Authorization header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🗄️ Database Models

### Patient
- Full Name
- Email
- Mobile Number
- Hashed Password

### Appointment
- Patient Reference
- Doctor Name
- Department
- Appointment Date
- Appointment Time
- Reason
- Appointment Status

## 🚀 Deployment Notes

The project has a separate frontend and backend.

**Frontend**
- Can be deployed using Vercel or Netlify.

**Backend**
- Can be deployed using a Node.js hosting platform.

**Database**
- MongoDB Atlas.

Before deployment:
1. Deploy the backend and get its public API URL.
2. Configure production environment variables on the backend host.
3. Update frontend API requests from `http://localhost:5000` to the deployed backend URL.
4. Configure CORS to allow your deployed frontend domain.
5. Ensure MongoDB Atlas allows connections from your backend hosting environment.
6. Test Signup, Login, Profile, Booking, Appointment Listing and Cancellation on the live website.

**Important:** The project currently uses a local backend URL during development. Production deployment requires updating the frontend API URLs.

## 🔮 Future Improvements

- Edit and reschedule appointments
- Doctor management
- Admin dashboard
- Online payment integration
- Email appointment notifications
- Appointment search and filters
- Improved role-based access control

## 👨‍💻 Developer

**Aashish Yadav**

- GitHub: https://github.com/aashuyadavv
- LinkedIn: https://linkedin.com/in/aashish-yadav-54b68b2a7/
- X: https://x.com/aashuyadavvv

## 📄 License

This project is developed for learning and portfolio purposes.

---

⭐ If you find this project interesting, consider giving it a star on GitHub.

**MedX Hospital – Modern Healthcare Experience.**