# 🧪 API Testing Guide - Housing Society Management System

This guide provides comprehensive instructions for testing all APIs in your Housing Society Management system.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Testing Methods](#testing-methods)
3. [API Endpoints Overview](#api-endpoints-overview)
4. [Testing with Postman](#testing-with-postman)
5. [Testing with Node.js Script](#testing-with-nodejs-script)
6. [Testing with cURL](#testing-with-curl)
7. [Testing with Thunder Client](#testing-with-thunder-client)
8. [Automated Testing](#automated-testing)
9. [Common Testing Scenarios](#common-testing-scenarios)
10. [Troubleshooting](#troubleshooting)

## 🚀 Prerequisites

Before testing, ensure you have:

1. **Server Running**: Start your server
   ```bash
   cd server
   npm install
   npm start
   ```

2. **Database Connected**: Ensure MongoDB is running and connected

3. **Environment Variables**: Check your `.env` file has all required variables

## 🛠️ Testing Methods

### 1. **Postman Collection (Recommended)**

I've created a comprehensive Postman collection (`Housing_Society_API_Tests.postman_collection.json`) that includes:

- **Authentication Tests**: Register, Login, Logout, Change Password
- **Admin Routes**: Society, Building, Flat, User Management
- **Owner Routes**: Flat details, Rent history, Dashboard
- **Tenant Routes**: Rented flats, Rent due, Dashboard
- **Complaints**: Create, View, Update status
- **Announcements**: Create, View announcements
- **Ownership Requests**: Create, View requests

**How to use:**
1. Import the collection into Postman
2. Set the `baseUrl` variable to `http://localhost:5000`
3. Run the "Login User" request first to get authentication token
4. The token will be automatically set for subsequent requests

### 2. **Node.js Testing Script**

I've created `test-api.js` that automatically tests all endpoints:

```bash
# Install axios if not already installed
npm install axios

# Run the test script
node test-api.js
```

**Features:**
- Automatic authentication flow
- Sequential testing of all endpoints
- Detailed logging of success/failure
- Automatic token management
- Error handling and reporting

### 3. **cURL Commands**

For quick testing from command line:

```bash
# Register User
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "role": "owner"
  }'

# Login User
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get Current User (with token)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. **Thunder Client (VS Code Extension)**

If you're using VS Code, install the Thunder Client extension for a lightweight API testing experience.

## 📊 API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user
- `PATCH /change-password` - Change password
- `POST /logout` - User logout

### Admin Routes (`/api/admin`)
- `POST /societies` - Create society
- `GET /societies/my` - Get admin's societies
- `PUT /societies/:id` - Update society
- `DELETE /societies/:id` - Delete society
- `POST /buildings` - Create building
- `PUT /buildings/:id` - Update building
- `DELETE /buildings/:id` - Delete building
- `POST /flats` - Create flats
- `PATCH /flats/:flatId/assign-owner` - Assign flat owner
- `GET /users` - Get all users
- `PATCH /users/:id` - Update user
- `POST /rent/generate` - Generate rent
- `GET /rent/history` - Get rent history
- `POST /maintenance` - Generate maintenance
- `GET /dashboard/overview` - Admin dashboard

### Owner Routes (`/api/owner`)
- `GET /flats` - Get owner's flats
- `GET /flats/:id` - Get flat details
- `GET /rent/history` - Get rent history
- `GET /dashboard` - Owner dashboard

### Tenant Routes (`/api/tenant`)
- `GET /flats` - Get rented flats
- `GET /rent/due` - Get rent due
- `GET /dashboard` - Tenant dashboard

### Complaints (`/api/complaints`)
- `POST /` - Create complaint
- `GET /my` - Get user's complaints
- `PATCH /:id/status` - Update complaint status

### Announcements (`/api/announcements`)
- `POST /` - Create announcement
- `GET /` - Get announcements

### Ownership Requests (`/api/ownership-requests`)
- `POST /` - Create ownership request
- `GET /my` - Get user's requests

## 🔄 Testing Workflow

### Step 1: Authentication Testing
1. Register a new user
2. Login with credentials
3. Verify token is received
4. Test protected routes with token
5. Test logout

### Step 2: Admin Functionality Testing
1. Create a society
2. Create buildings in the society
3. Create flats in buildings
4. Assign owners to flats
5. Generate rent
6. Test user management
7. Test dashboard

### Step 3: Owner/Tenant Testing
1. Test owner-specific routes
2. Test tenant-specific routes
3. Verify data isolation between roles

### Step 4: Feature Testing
1. Test complaints system
2. Test announcements
3. Test ownership requests
4. Test maintenance features

## 🧪 Common Testing Scenarios

### Scenario 1: Complete User Journey
```javascript
// 1. Register as admin
// 2. Create society
// 3. Create building
// 4. Create flats
// 5. Register owner
// 6. Assign flat to owner
// 7. Register tenant
// 8. Assign tenant to flat
// 9. Generate rent
// 10. Test payments
```

### Scenario 2: Complaint Management
```javascript
// 1. Tenant creates complaint
// 2. Admin views complaint
// 3. Admin updates status
// 4. Tenant views updated status
```

### Scenario 3: Announcement System
```javascript
// 1. Admin creates announcement
// 2. All users view announcement
// 3. Test different announcement types
```

## 🔧 Automated Testing Setup

### 1. Install Testing Dependencies
```bash
npm install --save-dev jest supertest
```

### 2. Create Test Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
};
```

### 3. Create Test Files
```javascript
// __tests__/auth.test.js
const request = require('supertest');
const app = require('../server');

describe('Authentication', () => {
  test('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'owner'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
  });
});
```

## 🐛 Troubleshooting

### Common Issues:

1. **Authentication Errors**
   - Check if token is being sent correctly
   - Verify token format: `Bearer <token>`
   - Ensure token hasn't expired

2. **Validation Errors**
   - Check request body format
   - Verify all required fields are present
   - Check data types (strings, numbers, etc.)

3. **Database Connection Issues**
   - Verify MongoDB is running
   - Check connection string in `.env`
   - Ensure database exists

4. **CORS Issues**
   - Check CORS configuration in `server.js`
   - Verify frontend URL is allowed

### Debug Tips:

1. **Enable Detailed Logging**
   ```javascript
   // In server.js
   app.use(morgan('dev'));
   ```

2. **Check Request/Response**
   ```javascript
   // Add to routes for debugging
   console.log('Request Body:', req.body);
   console.log('Request Headers:', req.headers);
   ```

3. **Database Queries**
   ```javascript
   // Enable MongoDB query logging
   mongoose.set('debug', true);
   ```

## 📈 Performance Testing

### Load Testing with Artillery
```bash
npm install -g artillery

# Create artillery.yml
artillery run artillery.yml
```

### Artillery Configuration
```yaml
# artillery.yml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "API Load Test"
    requests:
      - get:
          url: "/api/auth/me"
          headers:
            Authorization: "Bearer {{token}}"
```

## 🎯 Best Practices

1. **Test Data Management**
   - Use unique test data
   - Clean up test data after tests
   - Use test databases for automated tests

2. **Error Handling**
   - Test both success and error scenarios
   - Verify error messages are meaningful
   - Test edge cases

3. **Security Testing**
   - Test authentication requirements
   - Verify role-based access
   - Test input validation

4. **Performance Testing**
   - Test response times
   - Check memory usage
   - Monitor database performance

## 📝 Test Documentation

Keep track of your tests with:

- Test case descriptions
- Expected vs actual results
- Environment details
- Test data used
- Issues found and resolved

This comprehensive testing approach will ensure your Housing Society Management API is robust, secure, and performs well under various conditions. 