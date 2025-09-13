```spec
title: Prompt Beautifier
summary: Convert raw, unstructured prompt text into clear, structured prompts to improve AI responses.

motivation:
  - Users submit prompts that are unclear, overly verbose, or poorly structured.
  - Unstructured prompts reduce model accuracy and increase iteration time.

goals:
  - Add a dedicated page at `/prompt-beautifier` for refining prompts.
  - Provide a lightweight UI that accepts raw text and returns a polished, structured prompt.
  - Make it easy to copy or download the refined prompt for reuse.

non_goals:
  - Not intended to replace full prompt libraries or advanced prompt engineering tooling.

user_stories:
  - "As a user, I want to paste a messy prompt and get a clearer version so the model responds better."
  - "As a user, I want to quickly copy the refined prompt to use it elsewhere."

requirements:
  - UI: Add a `Prompt Beautifier` link to the main navbar that routes to `/prompt-beautifier`.
  - Page: A textarea for raw prompt input with placeholder text and optional examples.
  - Action: A prominent `Refine` button that invokes the refinement flow.
  - Output: Display the refined prompt in a selectable area with `Copy` and `Download` actions.
  - Accessibility: Controls must be keyboard accessible and screen-reader friendly.

acceptance_criteria:
  - Navbar link labeled `Prompt Beautifier` is present and navigates to `/prompt-beautifier`.
  - The page renders a textarea and an enabled `Refine` button.
  - Submitting input with `Refine` returns a transformed prompt and renders it in the output area.
  - `Copy` places the refined prompt into clipboard; `Download` saves it as a `.txt` file.

implementation_notes:
  - The initial implementation can run refinement client-side using a small heuristics function or use an API route to call an AI service.
  - Keep UI minimal: textarea, primary action, output panel, and small help text with examples.
  - Consider adding optional templates (e.g., "Explain like I'm 5", "Step-by-step", "Technical spec") in the future.

metrics:
  - Click-through rate: percentage of users who open the `Prompt Beautifier` page from the navbar.
  - Conversion: percent of uses where the user copies or downloads the refined prompt.

security_privacy:
  - If prompts are sent to a third-party API, show a clear disclosure and avoid sending PII by default.

roadmap:
  - v1: Minimal UI + client-side refinement heuristics.
  - v2: Server-side AI refinement integration with rate-limits and user feedback.
  - v3: Templates, history, and export/import integrations.
```

```spec
title: Server-side Refine Endpoint (What & Why)
summary: A secure server endpoint powered by Gemini that converts a raw prompt into a clean, structured prompt for clients that prefer server-side refinement.

what_and_why:
  - What: Provide a POST `/api/refine` endpoint that accepts raw prompt text and returns a refined prompt string.
  - Why: Server-side refinement centralizes API usage, enforces rate-limits, hides API keys, and allows using higher-capacity models or paid APIs without exposing credentials.

route:
  - POST `/api/refine`

input_json:
  - raw: string (user-provided prompt)
  - preset: enum `concise|developer|teacher|analyst|product` (optional; default `concise`)
  - maxWords: integer (optional; default 300)

output_json:
  - refined: string

constraints:
  - API key must be read from `process.env.GOOGLE_GENERATIVE_AI_API_KEY` and not checked into source control.
  - Reject requests with empty `raw` or `raw.length > 10000` characters with `400 Bad Request`.
  - Apply request timeouts (e.g., 10s) and per-IP rate limiting to prevent abuse.
  - Return structured error payloads with safe, human-friendly messages. Hide internal details on 5xx responses.
  - Validate `preset` against allowed values; enforce `maxWords` is a positive integer ≤ 3000.

security_and_privacy:
  - Log minimal metadata (timestamps, anonymized client ID) for monitoring; never log full prompt text.
  - If using third-party APIs, include a user-facing disclosure on the client page.

success_criteria:
  - 200 OK with `{ "refined": "..." }` for valid requests.
  - 4xx responses for invalid input with helpful error messages.
  - 5xx responses do not leak internal stack traces or API keys.
  - The client UI calls `/api/refine` and displays the refined string in the preview area.

implementation_notes:
  - Implement endpoint in `app/api/refine/route.ts` (Next.js App Router). Keep logic in `lib/refiners/serverRefiner.ts`.
  - Use a circuit-breaker and retry policy for third-party API calls; fail fast on rate-limit errors.
  - Return small, consistent JSON error objects: `{ "error": { "code": 400, "message": "..." } }`.
```