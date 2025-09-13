```plan
title: Prompt Beautifier Implementation Plan
summary: Step-by-step plan to implement the Prompt Beautifier feature (routes, components, refiners, and tests).

milestones:
  - M1: Route + basic UI
  - M2: Client-side refiners and copy/download
  - M3: Server-side AI integration 

tasks:
  - name: Add route
    file: `app/prompt-beautifier/page.tsx`
    description: Create the page shell with layout, header, and container for the editor and preview.

  - name: Navbar link
    file: `components/landing-page/header.tsx`
    description: Add `Prompt Beautifier` menu item and ensure it uses the app router to navigate.

  - name: Prompt editor component
    file: `components/prompt-editor.tsx`
    description: Textarea with placeholder, character counter, paste handling, and example prompts.

  - name: Controls component
    file: `components/refine-controls.tsx`
    description: `Refine` button, presets dropdown (e.g., ELI5, Step-by-step), and small help text.

  - name: Preview / result card
    file: `components/preview-card.tsx`
    description: Displays refined prompt, copy button, download-as-.txt, and feedback CTA.

  - name: Refiners (lib)
    dir: `lib/refiners`
    items:
      - `normalize.ts`: trim, collapse whitespace, remove duplicate sentences.
      - `structure.ts`: split into Goal / Context / Constraints / Output when possible.
      - `enrich.ts`: clarify pronouns, expand abbreviations, fix grammar.
      - `stylePresets.ts`: small mapping of preset transforms (tone, verbosity).

  - name: Client-side integration
    description: Wire components to call refiners locally for v1; show loading states and errors.

  - name: Copy & Download
    description: Copy to clipboard using browser API; download using a blob and anchor link.

  - name: Accessibility & Tests
    description: Add basic unit tests for refiners and accessibility checks for key components.

acceptance_criteria:
  - Route exists at `/prompt-beautifier` and is reachable from the navbar.
  - User can paste text, click `Refine`, and see a refined prompt.
  - User can copy or download the result.

implementation_notes:
  - Keep v1 completely client-side to avoid immediate API costs and complexity.
  - Structure refiners as pure functions to simplify unit testing.
  - Use existing UI primitives in `components/ui/` to maintain consistent styling.

next_steps:
  - Implement M1 (route, navbar, editor, preview) in a single PR.
  - Add client-side refiners and tests in follow-up PRs.

server_integration_notes:
  sdk:
    - package: `@google/generative-ai`
    - usage: Prefer the official JS SDK on server-side refiner to call Gemini models.

  model_config:
    - env_var: `GEMINI_MODEL` (default: `gemini-1.5-flash`)
    - options: `gemini-1.5-flash` (fast), `gemini-1.5-pro` (higher quality)

  prompting_strategy:
    - run deterministic local refiners first (`normalize` → `structure` → `enrich`).
    - wrap the deterministic output with a concise LLM polish prompt to enforce brevity and actionability.
    - ensure the LLM is instructed to return plain text only (no code blocks) and obey `maxWords` limit.

  validation:
    - use `zod` to validate incoming request body: `{ raw: string, preset?: string, maxWords?: number }`.
    - validate `raw` is non-empty and ≤ 10000 chars; `preset` is one of allowed enums; `maxWords` is positive int ≤ 3000.
    - validate LLM response shape before returning to clients using `zod`.

  security_rate_limiting:
    - server-only API key read from `process.env.GOOGLE_GENERATIVE_AI_API_KEY`.
    - add middleware for per-IP rate limiting (e.g., token-bucket or Redis-backed limiter) and a global concurrency limit.
    - configure a 10s request timeout and circuit-breaker for third-party calls.

  errors_and_logging:
    - return sanitized JSON errors: `{ error: { code: <int>, message: <string> } }`.
    - log minimal metadata for monitoring; do NOT log prompt contents or API keys.

  files_to_add:
    - `app/api/refine/route.ts` — API route implementing validation, rate-limit, timeouts, and serverRefiner usage.
    - `lib/refiners/serverRefiner.ts` — orchestration: local refiners + LLM polish via `@google/generative-ai`.
    - `lib/refiners/__tests__` — unit tests for pure refiners and zod schemas.
```