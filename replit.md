# ViewPoint Watchdog - SaaS Renewal Management Platform

## Overview
ViewPoint Watchdog is a comprehensive SaaS renewal tracking application designed to help businesses manage customer subscriptions, monitor renewal dates, minimize churn, and automate notifications. The platform aims to provide a centralized system for businesses to gain oversight of their SaaS renewals, improve customer retention strategies, and streamline operational workflows related to subscription management.

## User Preferences
- Default theme: Light mode with ABB Red branding
- Clean, minimal UI without unnecessary mock data
- Password-protected access required

## System Architecture
The application is built with a modern web stack, emphasizing a responsive user experience and robust backend functionality.

### UI/UX Decisions
- **Branding**: Utilizes ABB LTD corporate color scheme (ABB Red #FF000F) in a light mode theme.
- **Responsiveness**: Mobile-friendly interface with sidebar navigation.
- **Component Library**: Uses Shadcn UI for consistent and accessible UI components.
- **Dashboard**: Provides an overview of customer metrics, including total revenue and expired renewals.
- **Renewal Calendar**: Interactive calendar displaying renewals by month with visual indicators and detailed lists.
- **Workflow Systems**: Implements multi-phase workflows for "Lessons Learned" and "Feedback" with phase-specific data entry and navigation.

### Technical Implementations
- **Frontend**: React with TypeScript, Wouter for routing, and TanStack Query for data management.
- **Backend**: Express.js, providing a RESTful API.
- **Database**: PostgreSQL, integrated with Drizzle ORM for schema management and queries.
- **Authentication**: Session-based authentication using Passport.js with a local strategy, bcrypt for password hashing, and all API routes protected.
- **Customer Management**: Full CRUD operations for customers, including required fields, conditional validation (e.g., Churn Reason), and support for software type filtering.
- **User Management**: Comprehensive user management system with CRUD operations, username uniqueness validation, self-deletion prevention, and role-based access control (restricted to specific administrators).
- **Workflow Management**: Implemented structured workflows for "Lessons Learned" (Initiate → Root Cause Analysis → Implementation → Closed) and "Feedback" (Initiate → Analyze → Implementation → Closed) with detailed phase transitions and data persistence.

### Feature Specifications
- **Authentication System**: Storage-based user authentication with session management.
- **Customer Management**: Full CRUD for customers, including software filtering, required fields (Company, Site, Opportunity Name, Renewal Amount, Renewal Expiration Date), and conditional validation (Churn Reason).
- **Dashboard**: 
  - Displays stat cards with total revenue, customer count, expired renewals, and upcoming renewals (with incremental counts for 30/60/90 day periods)
  - **Upcoming Renewals Section**: Lists all future renewals sorted by expiration date (nearest to furthest), with urgency indicators (red text + AlertTriangle icon) for renewals within 30 days
  - **Expired Renewals Section**: Lists all expired renewals sorted newest to oldest (most recently expired first), with red text and AlertTriangle icon for all entries
  - Both sections display customer name, company, software badge, pilot badge, renewal amount, expiration date, and feedback launch button
- **Renewal Calendar**: Interactive month-by-month view of renewals with customer details, currency formatting, and status badges.
- **Lessons Learned Workflow**: A 4-phase workflow system (Initiate → Root Cause Analysis → Implementation → Closed).
- **Feedback System**: A form-based submission with a multi-phase workflow (Initiate → Analyze → Implementation → Closed). Can be launched from Dashboard with customer info pre-filled and auto-focus on feedback text area.
- **User Access Management**: Create, update, delete user credentials with username uniqueness validation, self-deletion prevention, and password show/hide functionality. Access to user management is restricted to authorized users.

## External Dependencies
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Passport.js (local strategy), bcrypt (password hashing), express-session
- **UI Framework**: Shadcn UI
- **Styling**: Tailwind CSS
- **Date Handling**: react-day-picker, date-fns

## Recent Changes (October 24, 2025)

### Database Migration: In-Memory to PostgreSQL
- **Migration Completed**: Successfully migrated from in-memory storage (MemStorage) to persistent PostgreSQL database
- **Files Created**: 
  - `server/db.ts` - Database connection and Drizzle setup
  - `server/storage-db.ts` - DatabaseStorage class implementing IStorage interface with Drizzle ORM
  - `server/migrate-passwords.ts` - One-time password migration script
- **Files Updated**:
  - `server/auth.ts` - Added bcrypt password hashing for user initialization and login verification
  - `server/routes.ts` - Added bcrypt password hashing for user creation and updates
  - `shared/schema.ts` - Added CASCADE delete constraints to foreign keys
- **Schema Changes**:
  - Added `{ onDelete: "cascade" }` to all customer foreign key relationships
  - subscriptions.customerId → customers.id (CASCADE)
  - notes.customerId → customers.id (CASCADE)
  - lessonsLearned.customerId → customers.id (CASCADE)
- **Security Enhancements**:
  - Implemented bcrypt password hashing (10 salt rounds) for all user passwords
  - Migrated 6 existing users from plaintext to hashed passwords
  - All new user creation and password updates automatically hash passwords
  - Login authentication uses bcrypt.compare() for secure password verification
- **Data Persistence**: All customer, user, subscription, note, lesson learned, and feedback data now persists across server restarts
- **Testing**: Comprehensive end-to-end testing verified:
  - Hashed password authentication works for all users
  - CASCADE deletes properly remove related records
  - User management functions correctly for admins
  - Calendar and Dashboard reflect real-time database changes
  - Data persists across navigation and server restarts