# Multi-Tenancy Implementation Guide

## Overview

The RocketSales frontend has been updated to support multi-tenancy as per API v2. This guide explains the implementation and how to use it.

## Key Changes

### 1. Authentication Provider (`src/providers/authProvider/`)

Updated to handle tenant information:

- **`context.tsx`**: Extended `IUser` interface with:
  - `tenantId`: Organization/tenant identifier
  - `expiresAt`: Token expiration timestamp

- **`index.tsx`**: Enhanced login and register flows:
  - Login/register responses now extract and store `tenantId`
  - `tenantId` is persisted to localStorage for tenant scoping
  - Logout clears both token and `tenantId`

### 2. Axios Configuration (`src/utils/axiosInstance.ts`)

Multi-tenant aware HTTP client:

```typescript
// Automatically includes:
// - Authorization: Bearer <token>
// - X-Tenant-Id: <tenantId> (if available)
```

New helper functions:
- `getTenantId()`: Get current tenant ID
- `setTenantId(tenantId)`: Store tenant ID
- `removeTenantId()`: Clear tenant ID

### 3. Registration Flow (`src/app/(auth)/register/page.tsx`)

Supports all three registration scenarios:

**Scenario A: Create New Organisation**
- User provides `tenantName`
- Becomes Admin of the new organization
- API creates new tenant automatically

**Scenario B: Join Existing Organisation**
- User provides `tenantId` from existing admin
- Optionally specifies role (SalesManager, BusinessDevelopmentManager)
- Joins existing tenant

**Scenario C: Use Default Shared Tenant**
- No organization specified
- User added to system default tenant
- Great for demo/testing

### 4. Tenant Utilities (`src/utils/tenantUtils.ts`)

Helper functions for tenant and role management:

```typescript
// Tenant operations
getCurrentTenantId(): string | null
getCurrentUser(): IUser | null
isUserAuthenticated(): boolean

// Role-based checks
getUserRoles(): string[]
hasRole(role: string): boolean
isAdmin(): boolean
isManagerOrAdmin(): boolean
isBDMOrHigher(): boolean

// Token operations
getTokenExpiresAt(): Date | null
isTokenExpired(): boolean
getUserFullName(): string
```

## API v2 Integration

All API endpoints now:

1. **Receive tenant context from JWT token** - No need to pass tenant ID in requests
2. **Auto-scope data to current tenant** - Only your organization's data is returned
3. **Return 404 instead of 403** - Prevents leaking cross-tenant resource existence

### Example API Call

```typescript
// Backend automatically scopes to user's tenant from token
const response = await instance.get('/api/clients');
// Returns only clients for the authenticated user's organization
```

## Implementation Details

### Token Structure

JWT tokens from API v2 include:
```json
{
  "sub": "userId",
  "email": "user@company.com",
  "firstName": "John",
  "lastName": "Doe",
  "tenantId": "org-uuid",
  "role": "SalesManager",
  "exp": 1234567890
}
```

### Data Scoping

Data providers automatically work with tenant-scoped data because:

1. Token includes `tenantId`
2. Axios instance adds `tenantId` to request headers
3. Backend uses header to scope queries
4. Frontend receives only tenant-specific data

### Example: Clients List

```typescript
// Before: Needed explicit tenant filtering
// GET /api/clients?tenantId=xxx

// After: Automatic tenant scoping
// GET /api/clients
// (tenantId in Authorization token + X-Tenant-Id header)
```

## Usage in Components

### Check User Authentication
```typescript
import { useAuthState } from '@/providers/authProvider';

function MyComponent() {
  const { user, isLoading } = useAuthState();
  
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;
  
  return <div>Welcome {user.firstName}</div>;
}
```

### Check User Role
```typescript
import { isAdmin, isManagerOrAdmin } from '@/utils/tenantUtils';

function AdminPanel() {
  if (!isAdmin()) {
    return <div>Access denied</div>;
  }
  return <div>Admin features here</div>;
}
```

### Get Current Tenant
```typescript
import { getCurrentTenantId } from '@/utils/tenantUtils';

function TenantAwareComponent() {
  const tenantId = getCurrentTenantId();
  // Use tenantId for tenant-specific operations
}
```

## Best Practices

1. **Always rely on token for tenant context** - Never ask users for tenant ID in normal flows
2. **Use tenant utilities** - Leverage `tenantUtils.ts` for common operations
3. **Let axios handle headers** - Always use `getAxiosInstance()` for API calls
4. **Handle token expiry** - Check `isTokenExpired()` before operations
5. **Validate roles** - Use role-checking functions before rendering role-specific UI

## Migration Checklist

✅ Auth provider supports tenantId
✅ Axios instance includes tenant headers
✅ Register page supports 3 scenarios
✅ Login/register persist tenant info
✅ Logout clears tenant data
✅ Utility functions for tenant operations
✅ Role-based access helpers

## Testing Multi-Tenancy

### Test Scenario A (New Organisation)
1. Register with `tenantName: "Test Company"`
2. Verify you become Admin
3. Check localStorage has `tenantId`

### Test Scenario B (Join Organisation)
1. Create org in Scenario A
2. Copy the `tenantId`
3. Register different user with that `tenantId`
4. Verify both users see same data

### Test Scenario C (Default Tenant)
1. Register without tenantName or tenantId
2. Should use default tenant: `11111111-1111-1111-1111-111111111111`
3. Share this with other demo users

## Common Issues

### "No tenant ID in token"
- Solution: Ensure login response includes `tenantId`
- Check: localStorage.getItem('tenantId')

### "Data scoped to wrong tenant"
- Solution: Verify X-Tenant-Id header is sent
- Check: Browser DevTools > Network > Request Headers

### "Role checks not working"
- Solution: Ensure token includes `roles` claim
- Check: `getCurrentUser()?.roles`

## Next Steps

After completing multi-tenancy:
1. Test all registration scenarios
2. Verify data isolation across tenants
3. Test role-based features
4. Update any custom API calls to use `getAxiosInstance()`
5. Test logout clears tenant context

## Support

For questions about implementation:
- Check `src/providers/authProvider/` for auth implementation
- Check `src/utils/tenantUtils.ts` for utility functions
- Review API documentation in `public/skills/api_doc.txt`