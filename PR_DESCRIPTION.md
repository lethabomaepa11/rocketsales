# RocketSales - Authentication & Landing Page Implementation

## Overview
This PR implements the authentication higher-order component (HOC) pattern and creates an appealing landing page for the RocketSales application, following best practices as outlined in the project documentation.

## Changes Made

### 1. Authentication HOC (`src/hoc/withAuth.tsx`)
- Created a reusable `withAuth` higher-order component for route protection
- Supports role-based access control with configurable `allowedRoles` option
- Provides pre-configured HOCs: `withManagerAuth` and `withSalesRepAuth`
- Shows loading spinner during authentication state check
- Automatically redirects unauthenticated users to login page

### 2. Landing Page (`src/app/(dashboards)/landing/page.tsx`)
- Beautiful gradient hero section using Ant Design tokens
- Feature cards showcasing: Client Management, Sales Pipeline, Proposals & Contracts
- Statistics section demonstrating social proof
- Call-to-action buttons for Login and Get Started
- Professional footer
- Uses Ant Design tokens for theming consistency

### 3. Landing Styles (`src/app/(dashboards)/landing/landingStyles.ts`)
- Uses `antd-style` for type-safe styling
- Leverages Ant Design tokens (`token.colorPrimary`, `token.colorBgContainer`, etc.)
- Maintains consistency with the application's theme configuration

### 4. Dashboard Layout (`src/app/(dashboards)/layout.tsx`)
- Integrated `withAuth` HOC for route protection
- Added user profile dropdown in header with avatar and name
- Implemented breadcrumb navigation
- Added logout functionality that clears auth tokens
- Shows user information and provides profile/logout options

### 5. Home Page (`src/app/page.tsx`)
- Shows landing page for unauthenticated users
- Auto-redirects to dashboard when user is logged in
- Maintains smooth user experience during auth state check

## Technical Details

### Authentication Flow
- Token stored in localStorage on successful login
- User data persisted in localStorage for session restoration
- Auth state restored on page refresh using useEffect
- Logout clears both token and user data from localStorage

### Role-Based Access
- `withAuth` accepts `allowedRoles` array for role checking
- Manager-specific routes protected with `withManagerAuth`
- Sales representative routes protected with `withSalesRepAuth`
- Unauthorized users redirected to dashboard

### Best Practices Applied
- **HOC Pattern**: Authentication logic encapsulated in reusable HOC
- **Provider Pattern**: Uses existing authProvider for state management
- **Theming**: Uses Ant Design tokens for consistent styling
- **Separation of Concerns**: Styles in separate files from components
- **Type Safety**: Full TypeScript support with proper interfaces

## Routes
- `/` - Landing page (unauthenticated) or Dashboard (authenticated)
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Protected dashboard (requires authentication)
- `/landing` - Standalone landing page

## Dependencies
- `antd` - UI component library
- `antd-style` - Type-safe styling for Ant Design
- `next/navigation` - Client-side routing

## Testing Notes
- All routes compile successfully
- Static pages generated for all routes
- Build completes without errors

## Screenshots
(Add screenshots of the landing page and authenticated dashboard view)
