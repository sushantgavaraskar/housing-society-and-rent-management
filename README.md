# Housing Society Management System - Backend

A robust, scalable, and secure Node.js backend for managing housing societies, buildings, flats, tenants, and maintenance.

## 🚀 Features

### Core Functionality
- **Society Management**: Create, update, and delete housing societies
- **Building Management**: Manage buildings with automatic flat generation
- **Flat Management**: Assign owners and tenants to flats
- **User Management**: Multi-role system (Admin, Owner, Tenant)
- **Complaint System**: File and track complaints by category
- **Maintenance Tracking**: Generate and track maintenance bills
- **Rent Management**: Track rent payments and overdue amounts
- **Announcement System**: Create and distribute announcements
- **Ownership Requests**: Handle flat ownership transfer requests

### Security Features
- **XSS Protection**: Enabled `xss-clean` middleware
- **NoSQL Injection Protection**: Enabled `express-mongo-sanitize`
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet Security**: HTTP headers security
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Granular permissions per user role
- **Input Validation**: Comprehensive validation using `express-validator`

### API Features
- **RESTful Design**: Consistent API structure
- **Response Formatting**: Standardized response format
- **Pagination**: Built-in pagination support
- **Error Handling**: Centralized error handling
- **Logging**: File-based logging with different levels
- **Database Indexing**: Optimized queries with strategic indexes

## 🏗️ Architecture

### Directory Structure
```
├── config/           # Database and environment configuration
├── controllers/      # Business logic handlers
├── middleware/       # Authentication and validation middleware
├── models/          # MongoDB schemas with indexes
├── routes/          # API route definitions
├── services/        # Business logic services
├── utils/           # Utility functions and helpers
├── validators/      # Input validation schemas
├── logs/            # Application logs
└── server.js        # Main application entry point
```

### Key Components

#### Security Middleware
- `authMiddleware.js`: JWT token validation
- `roleMiddleware.js`: Role-based access control
- `roleAccessGuard.js`: Additional access validation

#### Validation
- `adminValidator.js`: Admin route validations
- `ownerValidator.js`: Owner route validations
- `tenantValidator.js`: Tenant route validations
- `authValidator.js`: Authentication validations

#### Services
- `dashboardService.js`: Dashboard data aggregation
- `complaintService.js`: Complaint management logic
- `paymentService.js`: Payment processing logic

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Admin Routes (`/api/admin`)
- **Societies**: `POST`, `GET`, `PUT`, `DELETE /societies`
- **Buildings**: `POST`, `PUT`, `DELETE /buildings`
- **Flats**: `POST /flats` (auto-generate), `PATCH /flats/:id/assign-owner`
- **Complaints**: `GET /complaints`, `PATCH /complaints/:id`
- **Announcements**: `POST`, `GET /announcements`
- **Dashboard**: `GET /dashboard/overview`
- **Ownership Requests**: `GET`, `PATCH /ownership-requests`

### Owner Routes (`/api/owner`)
- **Flats**: `GET /flats`, `GET /flats/:id/society`
- **Tenants**: `PATCH /flats/:id/assign-tenant`, `PATCH /flats/:flatId/update-tenant`
- **Complaints**: `POST`, `GET /complaints`
- **Maintenance**: `GET /maintenance-due`, `PATCH /maintenance/:id/pay`
- **Dashboard**: `GET /dashboard/overview`

### Tenant Routes (`/api/tenant`)
- **Flat Info**: `GET /my-flat`
- **Rent**: `GET /rent-history`, `GET /current-rent`, `PATCH /rent/:id/pay`
- **Maintenance**: `GET /maintenance-due`, `PATCH /maintenance/:id/pay`
- **Complaints**: `POST`, `GET /complaints`
- **Announcements**: `GET /announcements`
- **Profile**: `PATCH /profile`
- **Dashboard**: `GET /dashboard/overview`

## 🔧 Database Models

### Optimized with Indexes
- **Building**: Auto-generates flats on creation
- **Flat**: Compound index on `{building: 1, flatNumber: 1}`
- **Complaint**: Index on `{status: 1}` for filtering
- **User**: Role-based queries optimized
- **Society**: Admin-based queries optimized

### Pre-save Hooks
- **Building Model**: Automatically creates flats based on `totalFlats` and `totalFloors`

## 🛡️ Security Features

### Input Validation
- All routes with `req.body` or `req.query` have comprehensive validation
- MongoDB ObjectId validation for all ID parameters
- String length and format validation
- Enum validation for status fields

### Authentication & Authorization
- JWT-based authentication with cookie and header support
- Role-based middleware for all protected routes
- Additional access guards for owner/tenant specific operations

### Security Headers
- Helmet for security headers
- XSS protection enabled
- NoSQL injection protection enabled
- Rate limiting to prevent abuse

## 📈 Performance Optimizations

### Database Indexes
- Strategic indexes on frequently queried fields
- Compound indexes for common query patterns
- Status-based indexes for filtering operations

### Service Layer
- Dashboard data aggregation moved to dedicated service
- Efficient data fetching with population
- Optimized queries with proper indexing

### Logging
- File-based logging with JSON format
- Different log levels (INFO, ERROR, WARN, DEBUG)
- Development console logging
- Request logging with Morgan

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with required environment variables
4. Start the server: `npm start`

### Environment Variables
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/housing-society
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=30d
```

## 🔄 Recent Refactoring Improvements

### Phase 1: Security and Middleware
- ✅ Enabled XSS and NoSQL injection protection
- ✅ Comprehensive input validation for all routes
- ✅ Proper middleware application across all routes

### Phase 2: API and Controller Refactoring
- ✅ Consolidated announcement functionality
- ✅ Implemented full CRUD for societies and buildings
- ✅ Created dashboard service for data aggregation
- ✅ Enhanced admin dashboard with meaningful metrics

### Phase 3: Database Optimization
- ✅ Added pre-save hook to Building model for auto flat generation
- ✅ Added compound index on Flat model for building+flatNumber queries
- ✅ Added status index on Complaint model for filtering

### Phase 4: Final Cleanup
- ✅ Replaced console.log with proper file-based logging
- ✅ Ensured consistent use of formatResponse utility
- ✅ Enhanced error handling and logging

## 📝 API Response Format

All API responses follow a consistent format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "statusCode": 200
}
```

## 🔍 Monitoring and Logging

- **Application Logs**: Stored in `logs/app.log`
- **Request Logs**: HTTP request/response logging
- **Error Tracking**: Comprehensive error logging with stack traces
- **Performance**: Response time tracking

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper validation for new routes
3. Use the formatResponse utility for all responses
4. Add appropriate indexes for new database queries
5. Include proper error handling and logging

## 📄 License

This project is licensed under the ISC License.
