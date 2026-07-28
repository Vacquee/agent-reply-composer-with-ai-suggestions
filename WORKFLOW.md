# AI Prompt Workflow Comparison

## AI Prompt Comparison

### Round 1

- Prompt Writing Time: 2 min
- Claude Clarification: 3 min
- Claude Generation Time: 6 min
- Integration (Copy Files + npm install): 6 min
- Review Time: 2 min
- Fixing Time: 0 min
- Testing Time: 2 min

**Total Time:** 21 min

Notes:

- Used a fresh Claude Web chat.
- Used a single vague prompt.
- Claude asked three clarification questions before implementation.
- Generated a complete React + TypeScript + Vite project.
- Application compiled and ran successfully.
- Required more manual review to identify missing validation and incomplete functionality.

---

### Round 2

- Prompt Writing Time: 2 min
- Claude Clarification: 2 min
- Claude Generation Time: 8 min
- Integration (Copy Files + npm install): 6 min
- Review Time: 15 min
- Fixing Time: 0 min
- Testing Time: 5 min

**Total Time:** 38 min

Notes:

- Used a fresh Claude Web chat.
- Uploaded a clean React + TypeScript + Vite starter.
- Claude explored the project before implementation.
- Claude produced an implementation plan before coding.
- Generated reusable components, tests, and separated business logic.

---

# Workflow Comparison

This assignment compared two independent implementations of the same feature: an Agent Reply Composer with AI Suggestions. Round One used a single vague prompt, while Round Two used a detailed engineering specification with implementation constraints, expected behavior, accessibility requirements, testing requirements, and an Explore → Plan → Code workflow.

From a correctness perspective, Round Two produced a stronger implementation. Round One generated a functional proof of concept, but it lacked client-side validation, reset functionality, and a working regenerate feature. Round Two added validation that rejected empty and whitespace-only replies, implemented regenerate and reset functionality, and organized business logic into reusable components and a custom hook.

Accessibility also improved in Round Two. Keyboard navigation, visible focus indicators, semantic form controls, and validation feedback were better implemented than in Round One. Some ARIA support was present, although not every accessibility feature was fully verified through code inspection.

Edge-case handling was improved but remained incomplete. Empty and whitespace-only replies were handled correctly, regenerate functionality worked, and validation messages were displayed. However, double-click protection, maximum reply length validation, and draft persistence after reset were still missing or only partially implemented.

Review effort highlighted the biggest difference. Although Round Two required a more detailed prompt and longer implementation time, the resulting architecture was easier to review because components, business logic, services, and tests were clearly separated. Round One required more manual inspection to identify missing validation, incomplete functionality, and UX issues.

One AI mistake identified during review was a usability issue where the Send button text blended into the button background, making it difficult to read. This demonstrated that even a detailed engineering prompt still requires human review before code is considered production-ready.