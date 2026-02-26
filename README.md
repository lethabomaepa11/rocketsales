# RocketSales

A comprehensive sales automation CRM built with Next.js and Ant Design.

## Overview

RocketSales is a modern customer relationship management (CRM) system designed for sales teams to manage their pipeline, clients, contacts, opportunities, proposals, contracts, and activities efficiently.

## Tech Stack

- **Frontend Framework**: Next.js 16 (App Router)
- **UI Library**: Ant Design
- **State Management**: React Context API with useReducer
- **HTTP Client**: Axios
- **Language**: TypeScript
- **Styling**: CSS Modules / Ant Design Theme

## Features

### Authentication
- User login and registration
- Role-based access control
- JWT token management

### Dashboard
- Overview of key metrics
- Pipeline performance
- Activities summary
- Expiring contracts alerts

### Clients Management
- Create, read, update, delete clients
- Client details and statistics
- Filter by industry, status

### Contacts Management
- Contact information management
- Primary contact designation
- Client-contact association

### Opportunities (Pipeline)
- Full sales pipeline management
- Stage tracking (Lead, Qualified, Proposal, Negotiation, Closed Won, Closed Lost)
- Probability and value tracking
- Stage history

### Proposals
- Create and manage proposals
- Line items management
- Status tracking (Draft, Sent, Accepted, Rejected, Viewed, Expired)
- Submit and approval workflow

### Contracts
- Contract lifecycle management
- Status tracking (Draft, Active, Expired, Cancelled, Terminated)
- Renewal management
- Auto-renewal configuration

### Activities
- Task and event management
- Activity types (Call, Meeting, Task, Email, Note)
- Status tracking (Pending, In Progress, Completed)
- Due date and priority management

### Reports
- Opportunity reports
- Sales performance by period

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboards)/    # Main dashboard pages
│   │   ├── activities/
│   │   ├── clients/
│   │   ├── contacts/
│   │   ├── contracts/
│   │   ├── dashboard/
│   │   ├── landing/
│   │   ├── opportunities/
│   │   ├── pricing-requests/
│   │   ├── proposals/
│   │   └── reports/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/            # Authentication components
│   └── dashboards/      # Dashboard components
│       └── sidebars/
├── hoc/                 # Higher-order components
├── providers/           # React Context providers
│   ├── activityProvider/
│   ├── authProvider/
│   ├── clientProvider/
│   ├── contactProvider/
│   ├── contractProvider/
│   ├── dashboardProvider/
│   ├── opportunityProvider/
│   ├── pricingRequestProvider/
│   └── proposalProvider/
└── utils/
    ├── axiosInstance.ts
    └── themeConfig.ts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```
bash
git clone <repository-url>
```

2. Install dependencies:
```
bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file with:
```
env
NEXT_PUBLIC_API_URL=<your-api-url>
```

4. Run the development server:
```
bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Integration

The application is designed to work with a RESTful API. The API endpoints follow these conventions:

- Authentication: `/api/Auth/login`, `/api/Auth/register`, `/api/Auth/me`
- Clients: `/api/Clients`
- Contacts: `/api/Contacts`
- Opportunities: `/api/Opportunities`
- Proposals: `/api/Proposals`
- Contracts: `/api/Contracts`
- Activities: `/api/Activities`
- Dashboard: `/api/Dashboard`

## State Management

The application uses React Context API with useReducer pattern for state management. Each domain has its own provider:

- `ActivityProvider` - Activities state and actions
- `AuthProvider` - Authentication state
- `ClientProvider` - Clients state and actions
- `ContactProvider` - Contacts state and actions
- `ContractProvider` - Contracts state and actions
- `DashboardProvider` - Dashboard data
- `OpportunityProvider` - Opportunities state and actions
- `PricingRequestProvider` - Pricing requests
- `ProposalProvider` - Proposals state and actions

## Building for Production

```
bash
npm run build
```

## License

MIT
