# Task: Ask user if they want to create an opportunity after client creation

## Plan
1. [x] Modify client provider to return created client from createClient function
2. [x] Update ClientFormModal to pass created client to onSuccess callback
3. [x] Update AIChatbot to prompt for opportunity creation after client creation
4. [x] Update clients page to prompt for opportunity creation after client creation
5. [x] Refactored to reduce redundancy - created shared components

## Refactoring Done
- Created shared `ClientFormModal` in `src/components/common/ClientFormModal.tsx`
- Created shared hook `useCreateOpportunityPrompt` in `src/hooks/useCreateOpportunityPrompt.ts`
- Both Clients page and AI Chatbot now use the same components
- Removed duplicate ClientFormModal from AI folder

## Files Changed
1. `src/providers/clientProvider/index.tsx` - Modified createClient to return created client
2. `src/providers/clientProvider/context.tsx` - Updated createClient signature
3. `src/components/common/ClientFormModal.tsx` - New shared component
4. `src/hooks/useCreateOpportunityPrompt.ts` - New shared hook
5. `src/app/(dashboards)/clients/page.tsx` - Uses shared components
6. `src/components/dashboards/ai/AIChatbot.tsx` - Uses shared components
