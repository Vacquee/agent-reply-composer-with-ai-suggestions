# CLAUDE.md

# Project Rules

These project rules were established after comparing vague and precise AI prompting during development.

## Rule 1 — Form Validation

All editable forms must perform client-side validation before submission.

- Reject empty replies.
- Reject whitespace-only replies.
- Display a clear validation message before allowing submission.

## Rule 2 — Separation of Concerns

Business logic should be separated from presentation.

- UI components should focus on rendering.
- AI generation logic belongs in service modules.
- State management belongs in reusable hooks where appropriate.

## Rule 3 — Automated Testing

Every feature containing business logic must include automated tests covering:

- Successful behavior
- Validation
- Loading state
- At least one failure scenario

## Rule 4 — Accessibility

Interactive controls must support:

- Keyboard navigation
- Visible focus indicators
- Semantic labels
- Accessible validation feedback