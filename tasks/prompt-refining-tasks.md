```tasks
title: Prompt Beautifier Task Checklist

tasks:
  - id: 1
    title: Add navbar link
    file: `components/landing-page/header.tsx`
    acceptance: Clicking the link navigates to `/prompt-beautifier`.
    status: not-started

  - id: 2
    title: Scaffold page
    file: `app/prompt-beautifier/page.tsx`
    acceptance: Page renders with a heading and layout container.
    status: not-started

  - id: 3
    title: Build PromptEditor
    file: `components/prompt-editor.tsx`
    acceptance: Textarea supports up to 5,000 characters and shows a character counter.
    status: not-started

  - id: 4
    title: Create refiners
    dir: `lib/refiners`
    acceptance: Pure functions exist (`normalize.ts`, `structure.ts`, `enrich.ts`, `stylePresets.ts`) and have unit tests.
    status: not-started

  - id: 5
    title: Create PreviewCard
    file: `components/preview-card.tsx`
    acceptance: Displays refined prompt with `Copy` and `Download` actions.
    status: not-started

  - id: 6
    title: Integration
    description: Wire editor → refiners → preview; add loading and error states.
    acceptance: Editor input refines and updates the preview reliably.
    status: not-started

  - id: 7
    title: Accessibility & tests
    description: Add accessibility checks and unit tests for refiners and core components.
    acceptance: Tests pass locally and components meet basic a11y requirements.
    status: not-started

notes:
  - Start with client-side refiners for v1 to minimize complexity.
  - Reuse `components/ui/` primitives for consistent styling.

deps_and_env:
  - Install: `@google/generative-ai`, `zod`.
  - Add file: `.env.local` with entries:
    - `GOOGLE_GENERATIVE_AI_API_KEY=...`
    - optional `GEMINI_MODEL=gemini-1.5-flash`
  - Accept criteria: project builds and `process.env.GOOGLE_GENERATIVE_AI_API_KEY` is available at runtime.

server_route:
  - file: `app/api/refine/route.ts`
  - behavior: validate body using `zod`, call Gemini via `@google/generative-ai`, return `{ refined: string }`.
  - Accept criteria: `curl` with valid JSON returns `200` and refined text.

client_wiring:
  - file: `app/prompt-beautifier/page.tsx`
  - behavior: call `/api/refine` instead of local `normalize()`; show loading and handle responses.
  - Accept criteria: Clicking `Refine` sends request to API and displays result in UI.

guardrails:
  - input length checks: empty → `400`; length > 10000 → `413`.
  - timeouts: 10s default; network errors show a toast with a safe message.

unit_tests_optional:
  - stub `@google/generative-ai` and test validation, mapping, and error handling.
  - Accept criteria: tests run and pass locally.
```