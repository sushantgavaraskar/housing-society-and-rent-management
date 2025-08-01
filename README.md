# Housing Society Management System

A modern, full-stack web application for managing housing societies with features for complaints, announcements, user management, and more.

## 🚀 Features

### Backend Features
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Admin, Owner, and Tenant roles with different permissions
- **Complaint Management**: Submit, track, and manage complaints
- **Announcement System**: Create and manage society announcements
- **Society Management**: Manage multiple housing societies
- **Building & Flat Management**: Track buildings and individual flats
- **Maintenance Tracking**: Monitor maintenance requests and schedules
- **Payment Management**: Handle rent and maintenance payments
- **Email Notifications**: Automated email notifications for important events

### Frontend Features
- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Role-based Dashboard**: Different dashboards for Admin, Owner, and Tenant
- **Real-time Updates**: Live updates for complaints and announcements
- **Form Validation**: Comprehensive form validation with error handling
- **Toast Notifications**: User-friendly notification system
- **Protected Routes**: Secure routing based on authentication status
- **Mobile Responsive**: Works seamlessly on all devices

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email functionality
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **express-rate-limit** - Rate limiting

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Hook Form** - Form handling
- **Yup** - Form validation

## 📁 Project Structure

```
Housing Society Management/
├── server/                 # Backend application
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   ├── validators/       # Input validation
│   └── server.js         # Entry point
├── client/               # Frontend application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── contexts/     # React contexts
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── utils/        # Utility functions
│   └── package.json
├── .env                  # Environment variables
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/housing_society_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Email Configuration (for notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Security
BCRYPT_SALT_ROUNDS=10
```

### 3. Start the Backend

```bash
cd server
npm start
```

The backend will start on `http://localhost:5000`

### 4. Start the Frontend

```bash
cd client
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔧 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password
- `PUT /api/auth/update-profile` - Update profile

### Admin Endpoints
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

### Complaint Endpoints
- `GET /api/complaints` - Get all complaints
- `POST /api/complaints` - Create new complaint
- `GET /api/complaints/:id` - Get specific complaint
- `PUT /api/complaints/:id` - Update complaint
- `DELETE /api/complaints/:id` - Delete complaint

### Announcement Endpoints
- `GET /api/announcements` - Get all announcements
- `POST /api/announcements` - Create new announcement
- `GET /api/announcements/:id` - Get specific announcement
- `PUT /api/announcements/:id` - Update announcement
- `DELETE /api/announcements/:id` - Delete announcement

## 👥 User Roles

### Admin
- Full system access
- Manage all users
- Create/edit/delete announcements
- View all complaints
- Manage societies and buildings

### Owner
- Manage their properties
- View tenant information
- Submit complaints
- View announcements
- Access payment information

### Tenant
- Submit complaints
- View announcements
- Access payment information
- Update profile

## 🎨 UI Components

The application includes reusable UI components:

- **Button** - Multiple variants (primary, secondary, success, error, outline, ghost)
- **Card** - Content containers with optional headers and footers
- **Input** - Form inputs with validation states
- **Modal** - Dialog boxes for forms and confirmations
- **Toast** - Notification system for user feedback

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation and sanitization
- XSS protection
- Helmet security headers

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Deployment Options

### Backend Deployment
- **Heroku**: Easy deployment with MongoDB Atlas
- **Railway**: Simple deployment with built-in MongoDB
- **DigitalOcean**: VPS deployment with Docker
- **AWS**: EC2 with MongoDB Atlas

### Frontend Deployment
- **Vercel**: Optimized for React applications
- **Netlify**: Easy deployment with CI/CD
- **GitHub Pages**: Free static hosting
- **Firebase Hosting**: Google's hosting solution

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Ensure MongoDB is running
3. Verify all environment variables are set
4. Check if both backend and frontend are running on correct ports

## 🔄 Development

### Backend Development
```bash
cd server
npm run dev  # Start with nodemon for auto-reload
```

### Frontend Development
```bash
cd client
npm run dev  # Start Vite dev server
```

### API Testing
```bash
node complete-api-test.js  # Run comprehensive API tests
```

---

**Note**: Make sure to update the MongoDB connection string and other environment variables according to your setup before running the application.
