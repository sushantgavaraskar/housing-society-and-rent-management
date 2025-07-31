# 📋 Complete API List - Housing Society Management System

## 🔐 Authentication APIs (`/api/auth`)
1. `POST /register` - Register new user
2. `POST /login` - User login
3. `GET /me` - Get current user
4. `PATCH /change-password` - Change password
5. `POST /logout` - User logout

## 👨‍💼 Admin APIs (`/api/admin`)

### Society Management
6. `POST /societies` - Create society
7. `GET /societies/my` - Get admin's societies
8. `PUT /societies/:id` - Update society
9. `DELETE /societies/:id` - Delete society

### Building Management
10. `POST /buildings` - Create building
11. `PUT /buildings/:id` - Update building
12. `DELETE /buildings/:id` - Delete building

### Flat Management
13. `POST /flats` - Create flats
14. `PATCH /flats/:flatId/assign-owner` - Assign flat owner
15. `PATCH /flats/:flatId/remove-owner` - Remove flat owner
16. `PATCH /flats/:flatId/remove-tenant` - Remove flat tenant

### User Management
17. `GET /users` - Get all users
18. `GET /users/:id` - Get user by ID
19. `PATCH /users/:id` - Update user
20. `PATCH /users/:id/toggle-status` - Toggle user status

### Rent Management
21. `POST /rent/generate` - Generate rent
22. `GET /rent/history` - Get rent history

### Maintenance
23. `POST /maintenance` - Generate maintenance
24. `GET /maintenance/status` - Get maintenance status

### Ownership Requests
25. `GET /ownership-requests` - Get ownership requests
26. `PATCH /ownership-requests/review` - Review ownership request

### Dashboard & Documents
27. `GET /dashboard/overview` - Admin dashboard
28. `GET /flats/:flatId/info` - Get flat info

### Notes & Reminders
29. `PATCH /societies/:id/note` - Add society note
30. `POST /users/:id/reminder` - Send reminder to user

## 🏠 Owner APIs (`/api/owner`)

### Dashboard & Profile
31. `GET /dashboard/overview` - Owner dashboard
32. `PATCH /profile` - Update owner profile

### Flat Management
33. `GET /flats` - Get owner's flats
34. `GET /flats/:id/society` - Get flat society info

### Rent & Maintenance
35. `GET /rent-history` - Get rent history
36. `GET /maintenance-due` - Get unpaid maintenance
37. `PATCH /maintenance/:maintenanceId/pay` - Pay maintenance

## 🏠 Tenant APIs (`/api/tenant`)

### Dashboard & Profile
38. `GET /dashboard/overview` - Tenant dashboard
39. `PATCH /profile` - Update tenant profile

### Flat & Rent Management
40. `GET /my-flat` - Get tenant's flat
41. `GET /rent-history` - Get rent history
42. `PATCH /rent/:rentId/pay` - Pay rent
43. `GET /rent-due` - Get rent due

### Maintenance
44. `GET /maintenance-due` - Get unpaid maintenance
45. `PATCH /maintenance/:maintenanceId/pay` - Pay maintenance

### Announcements
46. `GET /announcements` - Get relevant announcements

## 📝 Complaint APIs (`/api/complaints`)

### User Complaints
47. `POST /` - Create complaint (Owner/Tenant)
48. `GET /my` - Get my complaints (Owner/Tenant)

### Admin Complaint Management
49. `GET /` - Get all complaints (Admin)
50. `PATCH /:id` - Update complaint status (Admin)

## 📢 Announcement APIs (`/api/announcements`)

### Admin Announcement Management
51. `POST /` - Create announcement (Admin)
52. `GET /` - Get all announcements (Admin)
53. `PUT /:id` - Update announcement (Admin)
54. `DELETE /:id` - Delete announcement (Admin)

### User Announcements
55. `GET /relevant` - Get relevant announcements (Owner/Tenant)

## 📋 Ownership Request APIs (`/api/ownership-requests`)

### User Requests
56. `POST /` - Create ownership request (Owner)
57. `GET /my` - Get my ownership requests (Owner)

### Admin Management
58. `GET /` - Get all ownership requests (Admin)
59. `PATCH /:requestId` - Review ownership request (Admin)

## 📊 Total Count: 59 APIs

### Breakdown by Role:
- **Authentication**: 5 APIs
- **Admin**: 25 APIs
- **Owner**: 7 APIs
- **Tenant**: 9 APIs
- **Complaints**: 4 APIs
- **Announcements**: 5 APIs
- **Ownership Requests**: 4 APIs

### API Categories:
- **CRUD Operations**: Society, Building, Flat, User management
- **Financial**: Rent generation, payment, maintenance
- **Communication**: Announcements, complaints
- **Dashboard**: Overview data for all roles
- **Profile Management**: User profile updates
- **Ownership**: Transfer requests and management 