# TODO - AI Text Generation for Descriptions and Text Inputs

## Plan:
- [x] Create API endpoint for AI text generation
- [x] Create useAITextGeneration hook
- [x] Create AIGenerateButton component
- [x] Add AI generation to form components

## Steps Completed:
1. [x] Create `/api/ai/generate-text/route.ts` - API endpoint for text generation
2. [x] Create `src/hooks/useAITextGeneration.ts` - Hook for AI text generation
3. [x] Create `src/components/common/AIGenerateButton.tsx` - Button component for AI generation
4. [x] Update ContractFormModal.tsx - Add AI to terms field
5. [x] Update OpportunityForm.tsx - Add AI to description field
6. [x] Update EntityNotesList.tsx - Add AI to notes

## Summary:
- Created API endpoint at `/api/ai/generate-text` using Groq LLM
- Created reusable hook `useAITextGeneration` for AI text generation
- Created `AIGenerateButton` component that can be added to any form field
- Added AI generation to:
  - Contract terms field
  - Opportunity description field
  - Notes content field
- Additional components (EntityDocumentsList, proposals) can be updated similarly using the reusable AIGenerateButton component
