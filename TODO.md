# Activity Entity Fixes - TODO

## Task: Fix activity entity implementation to match API requirements

### 1. Fix ActivityType Enum (src/providers/activityProvider/types.ts)
- [x] Change Call = 1 → Meeting = 1
- [x] Change Meeting = 2 → Call = 2  
- [x] Change Task = 3 → Email = 3
- [x] Change Email = 4 → Task = 4
- [x] Change Note = 5 → Presentation = 5
- [x] Add Other = 6

### 2. Fix ActivityStatus Enum (src/providers/activityProvider/types.ts)
- [x] Change Pending = 1 → Scheduled = 1
- [x] Change InProgress = 2 → Completed = 2
- [x] Change Completed = 3 → Cancelled = 3

### 3. Update UI Labels in Activities Page (src/app/(dashboards)/activities/page.tsx)
- [x] Update statusColors and statusLabels to match new enum
- [x] Update typeLabels to match new enum
- [x] Update RelatedToType label for PricingRequest (remove space)
- [x] Update tab items to use new status values
- [x] Update Type dropdown options to match new ActivityType enum

### 4. Fix RelatedEntitySelector Component (src/components/common/RelatedEntitySelector.tsx)
- [x] Replace mock data with actual API calls
- [x] Fetch real Clients from /api/clients
- [x] Fetch real Opportunities from /api/opportunities
- [x] Fetch real Proposals from /api/proposals
- [x] Fetch real Contracts from /api/contracts
- [x] Fetch real Pricing Requests from /api/pricingrequests

### 5. Test the Create Activity Modal
- [x] Verify Related To Type dropdown shows all options
- [x] Verify Related To Item dropdown shows real data when type is selected
- [x] Verify payload sent to API has correct format
