# TODO: Filter out inactive items (isActive = false)

## Task
Remove items with isActive set to false from the application, treating them as deleted.

## Implementation Plan

### Step 1: Client Provider
- [x] src/providers/clientProvider/reducer.tsx
  - Filter out inactive clients in `FETCH_CLIENTS_SUCCESS` ✅

### Step 2: Opportunity Provider
- [x] src/providers/opportunityProvider/reducer.tsx
  - Filter out inactive opportunities in `FETCH_OPPORTUNITIES_SUCCESS` ✅

### Step 3: Contact Provider
- [x] src/providers/contactProvider/types.ts
  - Add `isActive?: boolean` to `ContactQueryParams` ✅
- [x] src/providers/contactProvider/reducer.tsx
  - Filter out inactive contacts in `FETCH_CONTACTS_SUCCESS` ✅

## Status: Completed ✅
