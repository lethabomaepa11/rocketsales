# Task: Ask user if they want to create an opportunity after client creation

## Plan
1. [x] Modify client provider to return created client from createClient function
2. [x] Update ClientFormModal to pass created client to onSuccess callback
3. [x] Update AIChatbot to prompt for opportunity creation after client creation
4. [x] Update clients page to prompt for opportunity creation after client creation

## Additional Features Implemented
- [x] Ask user if they want to create a contact after client creation
- [x] After contact is created, prompt for opportunity creation
- [x] Opportunity form is pre-filled with client name as title
- [x] Pass contact ID to opportunity when available

## Files Modified
1. src/providers/clientProvider/index.tsx - Modified to return created client
2. src/providers/contactProvider/context.tsx - Updated createContact return type
3. src/components/common/ClientFormModal.tsx - Updated to pass created client to onSuccess
4. src/components/dashboards/ai/AIChatbot.tsx - Added useCreateEntityPrompts hook
5. src/app/(dashboards)/clients/page.tsx - Added prompt for opportunity after client creation
6. src/app/(dashboards)/clients/[clientId]/page.tsx - Handle addContact param and prompt for opportunity
7. src/components/dashboards/client/ContactsTable.tsx - Added ref for modal control and onContactCreated callback
8. src/app/(dashboards)/opportunities/page.tsx - Added contactId query param support for prefilling
9. src/hooks/useCreateEntityPrompts.ts - New hook for client → contact → opportunity flow
