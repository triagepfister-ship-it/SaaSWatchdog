# ViewPoint Watchdog - SaaS Renewal Management Platform

## Overview
ViewPoint Watchdog is a comprehensive SaaS renewal tracking application that helps businesses manage customer subscriptions, track renewal dates, prevent churn, and automate notifications.

## Current State
The application is in active development with the following features implemented:

### Completed Features
- **Authentication System**: Hardcoded user authentication with session management (3 users: Anvesh, Stephen, Calvin - all with password "viewpoint")
- **Customer Management**: Full CRUD operations (Create, Read, Update, Delete) for customers
- **Dashboard**: Overview of customer metrics including total revenue aggregation from all customer renewal amounts
- **ABB Branding**: Application uses ABB LTD corporate color scheme (ABB Red #FF000F) with light mode theme
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
1. Users must login at `/auth` before accessing the app (no registration - hardcoded users only)
2. Three hardcoded users available: Anvesh, Stephen, Calvin (all passwords: "viewpoint")
3. Session-based authentication using express-session with in-memory store
4. All API routes are protected and require authentication
5. Protected routes automatically redirect to `/auth` if not authenticated

### API Endpoints
- `POST /api/login` - Login with username/password (hardcoded users only)
- `POST /api/logout` - Logout and destroy session
- `GET /api/user` - Get current authenticated user
- `GET /api/customers` - List all customers
- `GET /api/customers/:id` - Get specific customer
- `POST /api/customers` - Create new customer
- `PATCH /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Recent Changes (Latest Session)
- Added software type filtering to organize and manage multiple types of sold software
- Added software field to customer schema with predefined software types (Uptime360, ViewPoint)
- Software dropdown added to customer creation and editing forms (required field)
- Software filter dropdown added to Dashboard, Customers, and Churn pages for filtering data by selected software
- All metrics (Total Customers, Active Customers, Total Revenue) now filter based on selected software
- Recent customers list on Dashboard filters by selected software
- Application name updated to "ELSE SaaS Watchdog"
- Schema validation enforces software types using enum constraint
- Added constraint: "Add Customer" button disabled when "All Software" filter is selected
- Software field in customer form auto-inherits from filter selection and becomes read-only
- Software segregation enforced: customers can only be added to specific software types
- Customer form updated: Changed "Email" label to "Customer Email"
- Customer form updated: Added "Site" field (text input for site location)
- Customer form updated: Removed "Account Manager" field
- Customer schema updated: Replaced accountManager field with site field

### Next Steps
1. Implement subscription management (CRUD operations)
2. Add renewal date tracking and calculations
3. Build notification/reminder system
4. Implement escalation workflow for at-risk customers
5. Add charts and analytics to dashboard
6. Create calendar view for renewal dates
7. Consider migrating from in-memory to PostgreSQL database for persistence

### User Preferences
- Default theme: Light mode with ABB Red branding
- Clean, minimal UI without unnecessary mock data
- Password-protected access required

### Development Notes
- All sample/mock data has been purged from the application
- The app uses in-memory storage - data will be lost on server restart
- To persist data, update storage.ts to use PostgreSQL (infrastructure already in place)
