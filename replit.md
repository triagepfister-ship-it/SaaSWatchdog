# ViewPoint Watchdog - SaaS Renewal Management Platform

## Overview
ViewPoint Watchdog is a comprehensive SaaS renewal tracking application that helps businesses manage customer subscriptions, track renewal dates, prevent churn, and automate notifications.

## Current State
The application is in active development with the following features implemented:

### Completed Features
- **Authentication System**: Storage-based user authentication with session management, initialized with 5 default users (Anvesh, Stephen, Calvin, Brian, Steve - all with password "viewpoint")
- **User Access Management**: Complete user management system in Settings page (restricted to Stephen and Anvesh only)
  - Create, update, and delete user credentials
  - Username uniqueness validation
  - Prevent self-deletion protection
  - Password show/hide toggle for security
  - Real-time user list with current user indicator
  - Access control: Only Stephen and Anvesh can access user management
  - Settings hidden from sidebar for unauthorized users
  - Access denied message shown to unauthorized users
- **Customer Management**: Full CRUD operations (Create, Read, Update, Delete) for customers with software filtering
  - Required fields: Company, Site, Opportunity Name, Renewal Amount, Renewal Expiration Date
  - Conditional required: Churn Reason (only when Churn is selected)
  - Optional fields: Customer Email, Responsible Salesperson, Pilot Customer checkbox
- **Dashboard**: Overview of customer metrics including total revenue aggregation and expired renewals tracking
- **Lessons Learned Workflow**: Complete 4-phase workflow system (Initiate → Root Cause Analysis → Implementation → Closed) with phase-specific data entry and navigation
- **Feedback System**: Form-based customer feedback submission with multi-phase workflow (Initiate → Analyze → Implementation → Closed)
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
2. Five hardcoded users available: Anvesh, Stephen, Calvin, Brian, Steve (all passwords: "viewpoint")
3. Session-based authentication using express-session with in-memory store
4. All API routes are protected and require authentication
5. Protected routes automatically redirect to `/auth` if not authenticated

### API Endpoints
**Authentication:**
- `POST /api/login` - Login with username/password
- `POST /api/logout` - Logout and destroy session
- `GET /api/user` - Get current authenticated user

**Users:**
- `GET /api/users` - List all users (passwords excluded)
- `POST /api/users` - Create new user (validates username uniqueness)
- `PATCH /api/users/:id` - Update user (username/password)
- `DELETE /api/users/:id` - Delete user (prevents self-deletion)

**Customers:**
- `GET /api/customers` - List all customers
- `GET /api/customers/:id` - Get specific customer
- `POST /api/customers` - Create new customer
- `PATCH /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

**Lessons Learned:**
- `GET /api/lessons-learned` - List all lessons learned workflows
- `GET /api/lessons-learned/:id` - Get specific lessons learned workflow
- `POST /api/lessons-learned` - Create new lessons learned workflow
- `PATCH /api/lessons-learned/:id` - Update lessons learned workflow (phase transitions, data updates)
- `DELETE /api/lessons-learned/:id` - Delete lessons learned workflow

**Feedback:**
- `GET /api/feedback` - List all feedback submissions
- `GET /api/feedback/:id` - Get specific feedback
- `POST /api/feedback` - Submit new feedback
- `PATCH /api/feedback/:id` - Update feedback (phase transitions, data updates)
- `DELETE /api/feedback/:id` - Delete feedback

### Recent Changes (Latest Session)
- **Customer Form Validation**: Updated validation requirements for customer forms
  - Required fields: Company, Site, Opportunity Name, Renewal Amount, Renewal Expiration Date
  - Conditional validation: Churn Reason required only when Churn checkbox is selected
  - Optional fields: Customer Email, Responsible Salesperson, and Pilot Customer checkbox
  - Created separate schemas: insertCustomerSchema (with validation) and updateCustomerSchema (for PATCH operations)
- **User Access Control**: Restricted user management to Stephen and Anvesh only
  - Backend: Added `isUserAdmin()` authorization check to all user management API routes
  - API routes return 403 Forbidden for unauthorized users with clear error messages
  - Settings page: Shows access denied message for unauthorized users (Calvin, Brian, Steve)
  - Sidebar: Settings link hidden from navigation for unauthorized users
  - Consistent authorization logic between frontend and backend
  - Successfully tested with Stephen (authorized), Anvesh (authorized), and Calvin (denied)
- **User Access Management Feature**: Complete user management system in Settings
  - Migrated authentication from hardcoded array to storage-based system
  - Users initialized on startup only if storage is empty (5 default users)
  - Settings page rebuilt with full CRUD operations for user credentials
  - Username uniqueness validation on create and update
  - Self-deletion prevention (cannot delete own account)
  - Password show/hide toggle in forms
  - API routes with proper validation and security measures
  - Real-time user list with current user indicator
- Feedback feature: Updated workflow routing bar to match Lessons Learned feature styling
  - Phase navigation now wrapped in Card with CardContent (p-6 padding)
  - Phase buttons use full-width styling with flex-1 containers
  - ChevronRight icons added between phase buttons
  - Back button changed from ghost icon to outline variant with "Back to List" text
  - Button variants simplified: active phase uses "default", others use "outline"
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
- Customer form updated: Changed "Software" from dropdown to read-only display field
- Customer form updated: Removed "Customer Name" field - name is now automatically set to company value
- Authentication updated: Added fourth hardcoded user "Brian" with password "viewpoint"
- Authentication updated: Added fifth hardcoded user "Steve" with password "viewpoint"
- Customer schema updated: Added renewalExpirationDate field (timestamp) with robust validation
- Customer forms updated: Added "Renewal Expiration Date" input field to both Add and Edit dialogs
- Dashboard updated: Replaced "Active Customers" widget with "Expired Renewals" widget
- Expired Renewals metric: Counts customers whose renewal expiration date has passed (compared to today)
- Customer forms updated: Reorganized fields into two-column grid layout for better screen utilization
- **Lessons Learned Feature**: Complete workflow management system with 4 linear phases
  - Phase navigation bar with visual indicators and restricted forward progression
  - New workflows start in "Root Cause Analysis" phase (skips Initiate)
  - Initiate phase: Available for reference but not used as initial phase
  - Root Cause Analysis phase: Document findings and analysis (initial phase for new workflows)
  - Implementation phase: Track implementation plan and progress notes
  - Closed phase: Document final outcome with automatic closure tracking
  - Grid layout displaying workflows with GUID numbers (6-digit format starting from 000001)
  - Each card displays: GUID, Customer, Description, Root Cause Analysis, Implementation Details
  - GUIDs are assigned chronologically based on initiated date
  - Responsive grid: 1 column on mobile, 2 on large screens, 3 on extra large screens
  - Detail view with phase-specific forms and data persistence
- Customer form updated: Added "Pilot Customer" checkbox to both Add and Edit dialogs
- Customer schema updated: Added pilotCustomer field (boolean, defaults to false)
- Dashboard updated: Recent Customers section now displays visual indicators for pilot customers
  - Light purple background (bg-purple-50/dark:bg-purple-950) with purple border (border-purple-200/dark:border-purple-800)
  - "Pilot" badge with flag icon displayed next to customer name
  - Badge styled with purple colors (bg-purple-100/dark:bg-purple-900, text-purple-700/dark:text-purple-300)
- Dashboard updated: Recent Customers section now displays revenue amounts
  - Revenue amount shown prominently on the right side (formatted as USD currency)
  - Email displayed below revenue amount as secondary information
  - Left side shows customer name (with pilot badge if applicable) and company
- **Feedback Feature**: Complete form-based customer feedback system with multi-phase workflow
  - Form-based submission with customerName, software, and feedbackText fields
  - Software field (Uptime360/ViewPoint) required for categorization and filtering
  - Client-side validation ensures software is selected before submission
  - Software filter dropdown on Feedback page filters submissions by selected software type
  - New submissions automatically start in "Analyze" phase (bypasses Initiate phase)
  - Workflow phases: Initiate → Analyze → Implementation → Closed
  - Analyze phase: Document analysis of customer feedback
  - Implementation phase: Create implementation plan and track progress notes
  - Closed phase: Document final outcome with automatic closure tracking (closedDate, closedBy)
  - Grid layout displaying feedback submissions sorted by submission date (newest first)
  - Each card displays: Customer Name, Feedback (truncated), Current Phase, Submission Date
  - Detail view with phase-specific forms and data persistence
  - Phase navigation bar with visual indicators and restricted forward progression
  - Responsive grid: 1 column on mobile, 2 on large screens, 3 on extra large screens
  - Feedback accessible via sidebar navigation with MessageSquare icon

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
