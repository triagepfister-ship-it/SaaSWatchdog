# ViewPoint Watchdog - SaaS Renewal Management Platform

## Overview
ViewPoint Watchdog is a comprehensive SaaS renewal tracking application that helps businesses manage customer subscriptions, track renewal dates, prevent churn, and automate notifications.

## Current State
The application is in active development with the following features implemented:

### Completed Features
- **Authentication System**: Username/password authentication with session management
- **Customer Management**: Full CRUD operations (Create, Read, Update, Delete) for customers
- **Dashboard**: Overview of customer metrics and recent activity
- **Dark/Light Theme**: Theme toggle with persistent preferences
- **Responsive Design**: Mobile-friendly interface with sidebar navigation

### Architecture
- **Frontend**: React with TypeScript, Wouter for routing, TanStack Query for data management
- **Backend**: Express.js with in-memory storage (MemStorage)
- **Authentication**: Passport.js with local strategy, session-based auth
- **UI Components**: Shadcn UI with Tailwind CSS

### Project Structure
```
client/
  src/
    components/     # Reusable UI components
    pages/          # Page components
    hooks/          # Custom React hooks (including useAuth)
    lib/            # Utility functions and configurations
server/
  auth.ts          # Authentication setup with Passport.js
  routes.ts        # API route handlers
  storage.ts       # Data storage interface and implementation
shared/
  schema.ts        # Shared TypeScript types and Zod schemas
```

### Authentication Flow
1. Users must register/login at `/auth` before accessing the app
2. Session-based authentication using express-session with in-memory store
3. All API routes are protected and require authentication
4. Protected routes automatically redirect to `/auth` if not authenticated

### API Endpoints
- `POST /api/register` - Create new user account
- `POST /api/login` - Login with username/password
- `POST /api/logout` - Logout and destroy session
- `GET /api/user` - Get current authenticated user
- `GET /api/customers` - List all customers
- `GET /api/customers/:id` - Get specific customer
- `POST /api/customers` - Create new customer
- `PATCH /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Recent Changes (Latest Session)
- Added "Churn" checkbox to customer form with conditional "Churn Reason" text field (required when churn is checked)
- Created dedicated Churn page to list churned customers with their information, renewal amount, and churn reason
- Added Churn navigation item to sidebar for easy access to churned customer tracking
- Implemented proper null normalization in storage layer for all optional fields including churn-related fields
- Enhanced storage to preserve valid numeric values (including 0) for renewalAmount while normalizing empty strings to null
- All customer fields now properly handle create and update operations with consistent data normalization

### Next Steps
1. Implement subscription management (CRUD operations)
2. Add renewal date tracking and calculations
3. Build notification/reminder system
4. Implement escalation workflow for at-risk customers
5. Add charts and analytics to dashboard
6. Create calendar view for renewal dates
7. Consider migrating from in-memory to PostgreSQL database for persistence

### User Preferences
- Default theme: Dark mode
- Clean, minimal UI without unnecessary mock data
- Password-protected access required

### Development Notes
- All sample/mock data has been purged from the application
- The app uses in-memory storage - data will be lost on server restart
- To persist data, update storage.ts to use PostgreSQL (infrastructure already in place)
