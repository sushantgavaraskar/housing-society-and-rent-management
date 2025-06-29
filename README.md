
```
Housing Society Management
├─ client
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ admin
│  │  │  │  ├─ AssignOccupantModal.jsx
│  │  │  │  ├─ BuildingFormModel.jsx
│  │  │  │  ├─ BuildingTable.jsx
│  │  │  │  ├─ ComplaintTable.jsx
│  │  │  │  ├─ FlatTable.jsx
│  │  │  │  ├─ ResolveComplaintModal.jsx
│  │  │  │  ├─ SocietyFormModal.jsx
│  │  │  │  └─ SocietyTable.jsx
│  │  │  ├─ owner
│  │  │  │  ├─ AssignTenantModal.jsx
│  │  │  │  ├─ DashboardCard.jsx
│  │  │  │  ├─ MaintenanceTable.jsx
│  │  │  │  ├─ MyFlatsTable.jsx
│  │  │  │  ├─ OwnershipRequestForm.jsx
│  │  │  │  ├─ OwnershipRequestTable.jsx
│  │  │  │  └─ RentTable.jsx
│  │  │  ├─ shared
│  │  │  │  ├─ PageContainer.jsx
│  │  │  │  ├─ Sidebar.jsx
│  │  │  │  └─ Topbar.jsx
│  │  │  ├─ tenant
│  │  │  │  ├─ AnnouncementList.jsx
│  │  │  │  ├─ ComplaintForm.jsx
│  │  │  │  ├─ ComplaintTable.jsx
│  │  │  │  ├─ DashboardCard.jsx
│  │  │  │  ├─ MaintenanceTable.jsx
│  │  │  │  └─ RentTable.jsx
│  │  │  └─ ui
│  │  │     ├─ Loader.jsx
│  │  │     └─ Toast.jsx
│  │  ├─ context
│  │  │  └─ AuthContext.js
│  │  ├─ hooks
│  │  ├─ index.css
│  │  ├─ layouts
│  │  │  └─ DashboardLayout.jsx
│  │  ├─ lib
│  │  │  ├─ axios.js
│  │  │  ├─ schemas
│  │  │  │  └─ societySchema.js
│  │  │  └─ validation.js
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ admin
│  │  │  │  ├─ Buildings.jsx
│  │  │  │  ├─ Complaints.jsx
│  │  │  │  ├─ Dashboard.jsx
│  │  │  │  ├─ Flats.jsx
│  │  │  │  └─ Societies.jsx
│  │  │  ├─ auth
│  │  │  │  ├─ Login.jsx
│  │  │  │  └─ Register.jsx
│  │  │  ├─ Landing.jsx
│  │  │  ├─ owner
│  │  │  │  ├─ Dashboard.jsx
│  │  │  │  ├─ MaintenanceHistory.jsx
│  │  │  │  ├─ MyFlats.jsx
│  │  │  │  ├─ OwnershipRequests.jsx
│  │  │  │  └─ RentHistory.jsx
│  │  │  └─ tenant
│  │  │     ├─ Announcements.jsx
│  │  │     ├─ Complaints.jsx
│  │  │     ├─ Dashboard.jsx
│  │  │     ├─ Maintenance.jsx
│  │  │     └─ RentPayment.jsx
│  │  └─ router
│  │     └─ PrivateRoute.jsx
│  ├─ tailwind.config.js
│  └─ vite.config.js
├─ config
│  ├─ constant.js
│  ├─ db.js
│  └─ mailer.js
├─ controllers
│  ├─ adminController.js
│  ├─ announcementController.js
│  ├─ authController.js
│  ├─ complaintController.js
│  ├─ ownerController.js
│  ├─ ownershipRequestController.js
│  └─ tenantController.js
├─ middleware
│  ├─ authMiddleware.js
│  ├─ errorHandler.js
│  ├─ roleAccessGuard.js
│  ├─ roleMiddleware.js
│  └─ validate.js
├─ models
│  ├─ Announcement.js
│  ├─ Building.js
│  ├─ Complaint.js
│  ├─ Flat.js
│  ├─ Maintenance.js
│  ├─ OwnershipRequest.js
│  ├─ Rent.js
│  ├─ Society.js
│  └─ User.js
├─ package-lock.json
├─ package.json
├─ README.md
├─ routes
│  ├─ adminRoutes.js
│  ├─ announcementRoutes.js
│  ├─ authRoutes.js
│  ├─ complaintRoutes.js
│  ├─ ownerRoutes.js
│  ├─ ownershipRequestRoutes.js
│  └─ tenantRoutes.js
├─ server.js
├─ services
│  ├─ authService.js
│  ├─ complaintServices.js
│  ├─ flatService.js
│  ├─ ownershipService.js
│  └─ paymentService.js
├─ uploads
├─ utils
│  ├─ formatResponse.js
│  ├─ generateToken.js
│  ├─ logger.js
│  ├─ pagination.js
│  ├─ sendEmail.js
│  └─ validateEnv.js
└─ validators
   ├─ authValidator.js
   ├─ flatValidator.js
   └─ societyValidator.js

```