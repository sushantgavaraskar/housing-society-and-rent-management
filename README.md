# Housing Society Management System

A full-stack web application to manage housing societies, including modules for society creation, property management, tenant assignment, maintenance tracking, complaint handling, and payment integration. The system supports role-based access for Admin, Owner, and Tenant.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation](#installation)
- [Folder Structure](#folder-structure)
- [Roles and Access](#roles-and-access)
- [Modules](#modules)
- [API Endpoints](#api-endpoints)
- [Frontend Pages](#frontend-pages)
- [Backend Structure](#backend-structure)
- [Authentication Flow](#authentication-flow)
- [Screens and Dashboards](#screens-and-dashboards)

---

## Tech Stack

- **Frontend**: React.js, Bootstrap
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT
- **Architecture**: RESTful API

---

## Features

- Admin dashboard to manage societies and view complaints
- Owners can add properties, assign tenants, and post maintenance
- Tenants can raise requests, view maintenance, and make rent/maintenance payments
- Secure authentication with JWT
- Responsive UI using Bootstrap
- Centralized error handling on backend
- Role-based access control on frontend and backend

---

## Installation

1. **Clone the repository:**
   ```bash
   git clone  https://github.com/sushantgavaraskar/housing-society-and-rent-management.git
   cd housing-society-and-rent-management

## Backend setup
    cd server
    npm install
    cp .env.example .env
    # Set your MongoDB URI and JWT_SECRET in .env
    npm start

## Frontend setup
    cd client
    npm install
    npm start

Roles and Access
Admin
Create and manage societies

View complaints by society

Owner
Add and manage properties

Assign tenants

Add maintenance details

Tenant
Raise maintenance or complaint requests

View assigned property’s maintenance

Make rent and maintenance payments

View payment history

Modules
Authentication

Register and login

Role-based redirection using JWT

Society Management

Admin can create societies and assign owners

Property Management

Owners can add properties and assign tenants

Maintenance

Owners can add maintenance records

Tenants can view maintenance assigned to their property

Complaints / Requests

Tenants can raise issues

Admin can view complaints grouped by society

Payments

Tenants can pay rent or maintenance

Payment records are stored and viewable in history

API Endpoints (Sample)
POST /auth/register – Register new user

POST /auth/login – Login and receive JWT

GET /dashboard/tenant – Fetch tenant dashboard data

POST /properties – Add property

POST /maintenance – Add maintenance record

GET /payments/my – Get payment history

POST /requests – Raise request or complaint

Frontend Pages
Login and Register

AdminDashboard – manage societies and complaints

OwnerDashboard – manage properties and maintenance

TenantDashboard – raise requests, make payments

Dynamic role-based routing and navbar

Backend Structure
Express.js server with modular routing

MongoDB for data storage with Mongoose models

Auth middleware for route protection

Centralized error handler

Authentication Flow
User registers with name, email, password, and role

On login, JWT token is stored in localStorage

Token is sent with each API request

Role from token decides dashboard routing

Screens and Dashboards
Admin Dashboard
View all societies

View complaints by society

Owner Dashboard
Add property

Assign tenant

Add maintenance

View properties

Tenant Dashboard
Raise complaint/request

View request status

View maintenance

Make rent/maintenance payment

View payment history



