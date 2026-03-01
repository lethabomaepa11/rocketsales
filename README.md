# RocketSales

A comprehensive B2B sales automation CRM built for enterprise sales teams managing government and large-scale clients.

## Overview

RocketSales is a modern Customer Relationship Management (CRM) system built for Boxfusion — an enterprise software company selling large-scale digital solutions to government clients. The system manages the full sales lifecycle from initial lead through to signed contract and renewal, with role-based access control for Sales Managers and Sales Representatives.

## Tech Stack

- **Frontend Framework**: Next.js 16 (App Router)
- **UI Library**: Ant Design + antd-style (CSS-in-JS)
- **State Management**: React Context API with useReducer
- **HTTP Client**: Axios with JWT interceptors
- **Language**: TypeScript
- **AI Integration**: Groq SDK (llama-3.3-70b-versatile) with agentic tool execution
- **PDF Generation**: jsPDF
- **Email**: Integrated email sending via API

## Roles

The application has 4 roles, each with a different experience:

| Feature                                 | Sales Manager | Sales Rep |
| --------------------------------------- | :-----------: | :-------: |
| Full team dashboard + leaderboard       |       ✅       |     ❌     |
| Reports section                         |       ✅       |     ❌     |
| Approve / Reject proposals              |       ✅       |     ❌     |
| Activate / Cancel contracts             |       ✅       |     ❌     |
| Assign opportunities to reps            |       ✅       |     ❌     |
| Assign pricing requests                 |       ✅       |     ❌     |
| Pending pricing requests queue          |       ✅       |     ❌     |
| Delete clients / documents              |       ✅       |     ❌     |
| Initiate & complete renewals            |       ✅       |     ❌     |
| Create clients, contacts, opportunities |       ✅       |     ✅     |
| Submit proposals                        |       ✅       |     ✅     |
| Log activities, notes, documents        |       ✅       |     ✅     |
| Personal pipeline & activity views      |       ✅       |     ✅     |

## Features

### Authentication
- JWT token-based login and registration
- Role-based access control (Sales Manager / Sales Rep)
- Token expiry detection with automatic logout
- HOC-based route protection (`withAuth`, `withManagerAuth`, `withSalesRepAuth`)

### Dashboard
- **Sales Manager**: Full team pipeline value, win rate, revenue trend (monthly), sales performance leaderboard, expiring contracts widget, team activities summary
- **Sales Rep**: Personal pipeline, my opportunities by stage, upcoming activities (7 days), overdue activities with inline complete action

### Clients
- Paginated, searchable client list with industry and status filters
- Client detail page with stats row (contacts, opportunities, contracts, total value)
- Tabbed detail: **Contacts · Opportunities · Contracts · Activities · Notes · Documents**
- Contacts are managed exclusively within the client — no standalone contacts page

### Opportunities (Pipeline)
- Stage-based pipeline: Lead → Qualified → Proposal → Negotiation → Closed Won / Closed Lost
- Visual stage stepper on detail page — click to advance stage with confirmation
- Loss reason required when moving to Closed Lost
- Kanban pipeline view with counts and values per stage
- Stage history timeline — full audit trail of every stage change
- Assign opportunities to reps (manager only)
- Tabbed detail: **Overview · Stage History · Pricing Requests · Proposals · Activities · Notes · Documents**

### Pricing Requests
- Internal workflow for obtaining pricing from the finance/pricing team
- Priority levels: Low, Medium, High, Urgent
- Pending queue (manager only) — assign unassigned requests to users
- Statuses: Pending → In Progress → Completed

### Proposals
- Multi-line item proposals with live total calculation
- Line item formula: `qty × unitPrice × (1 - discount%) × (1 + taxRate%)`
- Approval workflow: Draft → Submitted → Approved / Rejected
- Submit (both roles), Approve/Reject (manager only)
- Tabbed detail: **Line Items · Notes · Documents**

### Contracts
- Full contract lifecycle: Draft → Active → Expired → Renewed / Cancelled
- Expiry alert banner — red if < 30 days, amber if < 90 days
- Expiring Soon dedicated view
- Renewal management: Initiate → Complete (manager only)
- Tabbed detail: **Details · Renewals · Activities · Notes · Documents**

### Activities
- Types: Meeting, Call, Email, Task, Presentation, Other
- Views: All Activities, My Activities, Upcoming (configurable days), Overdue
- Complete activity with outcome notes
- Linked to any entity (Client, Opportunity, Proposal, Contract)
- Overdue badge count in sidebar

### Notes & Documents
- Contextual only — accessible as tabs inside entity detail pages, not standalone
- Notes support private/public toggle with lock icon indicator
- Documents support upload (max 50MB), download, and delete (manager only)
- Categories: Contract, Proposal, Presentation, Quote, Report, Other

### Reports (Sales Manager only)
- **Opportunities Report**: Filter by date range, stage, owner — bar chart + table + CSV export
- **Sales by Period**: Group by day/month/year — line/bar chart + CSV export

### AI Assistant
- Floating chatbot powered by Groq (llama-3.3-70b-versatile)
- Standard and Agentic modes
- Agentic tools: create client, fetch clients, navigate to any page, send email, generate PDF
- Business context injection (live dashboard, clients, opportunities data)
- Streaming responses
- Session management (multiple chat sessions)

## Sales Workflow

```
Client Created
    ↓
Contact Added (inside Client)
    ↓
Opportunity Created → Lead
    ↓
Activities Logged (calls, meetings)
    ↓
Opportunity → Qualified
    ↓
Pricing Request → Assigned → Completed
    ↓
Opportunity → Proposal
    ↓
Proposal Built (line items) → Submitted → Approved
    ↓
Opportunity → Negotiation → Closed Won
    ↓
Contract Created → Activated
    ↓
[~90 days before expiry]
    ↓
Renewal Initiated → Completed
    ↓
Cycle Repeats
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/                   # Login, Register pages
│   ├── (dashboards)/             # All protected pages
│   │   ├── dashboard/            # Role-aware dashboard
│   │   ├── clients/              # Client list + detail
│   │   ├── opportunities/        # List, pipeline, detail
│   │   ├── pricing-requests/     # List + pending queue
│   │   ├── proposals/            # List + detail
│   │   ├── contracts/            # List + expiring + detail
│   │   ├── activities/           # All, mine, upcoming, overdue
│   │   └── reports/              # Opportunities + sales by period
│   ├── api/
│   │   ├── chat/                 # Groq AI chat endpoint
│   │   ├── ai/
│   │   │   ├── send-email/       # Email sending endpoint
│   │   │   └── generate-pdf/     # PDF generation endpoint
│   └── layout.tsx
├── components/
│   ├── common/                   # Shared UI components
│   │   ├── StatusBadge/
│   │   ├── ConfirmModal/
│   │   ├── EmptyState/
│   │   ├── DetailPageHeader/
│   │   ├── TabbedSection/
│   │   ├── NotesList/
│   │   ├── DocumentsList/
│   │   ├── ActivitiesList/
│   │   └── ClientFormModal/
│   ├── ai/                       # AI Chatbot components
│   │   ├── AIChatbot/
│   │   ├── ChatMessage/
│   │   └── ChatInput/
│   └── dashboards/
│       └── sidebars/
│           ├── SalesManagerSidebar/
│           └── SalesRepSidebar/
├── hoc/
│   └── withAuth/                 # Auth HOC + role variants
├── hooks/
│   └── useCreateEntityPrompts/   # Post-create AI prompt flows
├── providers/                    # React Context + useReducer per domain
│   ├── aiProvider/
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

## API Integration

**Base URL**: `https://sales-automation-bmdqg9b6a0d3ffem.southafricanorth-01.azurewebsites.net`

All endpoints require `Authorization: Bearer <token>` except login and register.

| Module           | Base Path              |
| ---------------- | ---------------------- |
| Auth             | `/api/auth`            |
| Clients          | `/api/clients`         |
| Contacts         | `/api/contacts`        |
| Opportunities    | `/api/opportunities`   |
| Pricing Requests | `/api/pricingrequests` |
| Proposals        | `/api/proposals`       |
| Contracts        | `/api/contracts`       |
| Activities       | `/api/activities`      |
| Notes            | `/api/notes`           |
| Documents        | `/api/documents`       |
| Dashboard        | `/api/dashboard`       |
| Reports          | `/api/reports`         |

## State Management

Each domain has its own Context + useReducer provider. The pattern is consistent across all providers:

```
providers/
└── [domain]Provider/
    ├── index.tsx        # Provider component
    ├── context.tsx      # State interface + context
    ├── reducer.tsx      # useReducer handler
    └── actions.ts       # Action type constants + action creators
```

Providers available:
- `AIProvider` — chat sessions, streaming, agentic tools, modal state
- `ActivityProvider` — activities CRUD, complete, cancel
- `AuthProvider` — JWT token, user info, roles, expiry
- `ClientProvider` — clients CRUD + stats
- `ContactProvider` — contacts CRUD + set primary
- `ContractProvider` — contracts CRUD, activate, cancel, renewals
- `DashboardProvider` — overview, pipeline metrics, sales performance
- `OpportunityProvider` — opportunities CRUD, stage updates, pipeline, stage history
- `PricingRequestProvider` — pricing requests CRUD, assign, complete
- `ProposalProvider` — proposals CRUD, line items, submit, approve, reject

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rocketsales
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables — create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=https://sales-automation-bmdqg9b6a0d3ffem.southafricanorth-01.azurewebsites.net
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

### Test Credentials
```
Email:    admin@salesautomation.com
Password: Admin@123
```

## Building for Production

```bash
npm run build
npm start
```

## CI

```bash
npm run ci
```

## License

MIT