# Teach Me This File — Design

Status: DRAFT. Not approved. No code is written.
Marks: **(Decided)** means the user decided it. **(My call)** means the assistant chose it. The user must check each "My call".

## 1. Intent

Edventure is an Israeli EdTech startup. Its product, Edwin, is a Socratic AI tutor that teaches only from the teacher's own material. This 4-hour home assignment is a small version of that product.

A teacher uploads a file and writes a prompt. An AI then teaches the file to a student in a chat. The chat must teach. It must not summarize the file or paste its content.

The user wants a **small, efficient, professional app**. The reviewers will test it with files nobody has seen. The user said this is the most important requirement: "Build for the unexpected."

## 2. Goals, non-goals, anti-goals

### Goals
- The tutor teaches one step at a time, checks understanding, adapts, stays grounded in the file and follows the teacher prompt.
- Every uploaded file gets a clear result. The app reads it, reads part of it, or explains what to do next. The app never fails silently.
- The lesson plan and the student progress live in app state, not only in the chat history.
- The app works on a phone, in a private browser window, with a key that the reviewer pastes.
- `DECISIONS.md` gives honest reasons, known weaknesses and about 5 test scenarios.

### Non-goals (Decided)
- Option or multiple-choice questions. The student answers in free text only. (The "רמז" hint button in section 13 is not an option question.)
- Voice input and voice output.
- Audio, video and ZIP files. These show a clear "not supported yet" message. They are parked for later.
- Accounts, a database and memory across sessions.

### Non-goals (My call)
- Embedding search (vector RAG). Each plan step links to its passages. This makes grounding deterministic and costs no embedding calls.
- Guardrail vendors such as Lakera or NeMo. The app uses prompt rules and light input checks.
- Teacher dashboard and analytics.

### Anti-goals
- A bigger app that breaks on a scanned, right-to-left, or very long file.
- Code that the user cannot explain in the interview.
- A tutor that dumps the answer or summarizes the file.
- A key that appears in logs, in the repository or in storage on the server.

## 3. Constraints
- **Stack (Decided):** React, Vite, Tailwind and JavaScript on the front end. Node.js on the back end. No TypeScript.
- **Host (Decided):** Vercel. One repository. The Vite app is the static site. Node functions are in `api/`.
- **Provider (Decided):** The user chooses the provider, model and key in a settings panel. Reviewers use their own keys.
- **Key handling:** The browser sends the key with each request in a header. The server uses it once. The server never stores it, never logs it and never puts it in an error message. The repository never contains a key.
- **Vercel limits (to verify):** The request body limit and the maximum function duration for the plan in use. The design stays small to fit them. The builder checks the current numbers on the Vercel limits page before the final design of the API.
- **Commits:** Small and meaningful. The reviewers read the history.
- **Deliverables:** public repository, live URL (tested in a private window), `README.md`, `DECISIONS.md`.
- **Library rule:** Each added library needs a one-line reason in `DECISIONS.md`.

## 4. Architecture

Three layers with clear borders (the assignment requires this separation):

| Layer | Folder (My call) | Job |
|---|---|---|
| UI | `src/ui/` | Screens and components. No AI logic. No parsing logic. |
| Lesson state | `src/lesson/` | One store (reducer). Holds plan, progress and messages. Pure functions. |
| AI logic | `api/` and `src/ai/` | Prompts, provider adapter, streaming client. No UI code. |
| Ingestion | `src/ingest/` | File parsers, quality score, page rendering. Runs in the browser. |

### Browser-side parsing (My call)
The browser parses the file and renders page images. It sends only text and small images to the server. This keeps requests under the host body limit. It also avoids server tools that free hosts do not offer. Each parser loads lazily, so the first page stays light.

### Provider adapter (My call)
One small adapter speaks the OpenAI-compatible chat API. Presets exist for Gemini, Groq and OpenRouter. A custom base URL covers other providers. The adapter hides provider differences from the rest of the code.

## 5. File pipeline

The pipeline turns a file into **passages**: numbered pieces of text with a page or section label.

Tiers (My call):
1. **Plain text:** TXT, Markdown, CSV, JSON, HTML, LaTeX, code. The app reads them directly.
2. **Parsers:** PDF, DOCX, PPTX, XLSX, EPUB, ODT, ODP, ODS. Libraries extract text and tables.
3. **Vision:** Images (including HEIC, converted to JPEG), scanned PDFs, and pages with a poor quality score. The browser renders each page to a small image. The server asks the user's model to transcribe it.
4. **Clear message:** Old binary formats (DOC, PPT, XLS) say "save as PDF or DOCX". Audio, video and ZIP say "not supported yet". Password-protected and corrupt files get their own messages.

**Quality score (My call):** Each page gets a score after text extraction. The score looks at the amount of text, the share of unreadable characters, and signs of reversed right-to-left order. A good page uses text. A poor page goes to vision. This one rule covers scans, formulas and broken right-to-left text.

**No-vision case:** If the model cannot read images, the app says so. It offers to continue with the readable pages only.

**Passages:** About 500–1000 tokens each. They follow headings or pages. Each passage has an ID, a label and its text. Tables stay as Markdown tables. Formulas stay as LaTeX.

**Limits (My call):** A file size limit and a page limit. Both show in the upload screen. When a file is over the limit, the message says what was read and what was cut.

**Long documents:** The plan call receives a compact view of the passages (labels and the start of each passage) when the full text is too large. Each tutor turn receives only the passages of the current step.

**Hostile content:** The prompts say that the file is data, never instructions. Text inside a file such as "ignore your rules" has no power.

**Empty or unteachable files:** The app warns the teacher when the extracted text is empty, very short, or not teachable (for example a menu or a list of numbers).

**Extraction report (My call):** After parsing, the teacher sees one short screen. It shows each page as text, vision or failed, the warnings, and a text preview. There is no editing in the first version. The teacher presses "Start lesson".

## 6. Lesson state

State lives in one store. The chat history is not the source of truth.

**Plan** (built once by the AI, kept in state):
```
{ title, language, audience, estimatedMinutes,
  steps: [{ id, title, goal, passageIds[], checkQuestion, keyPoints[] }] }
```

**Progress:**
```
{ currentStepIndex,
  steps: [{ status: pending | teaching | checking | done, attempts, hintLevel }] }
```

**Messages:** a list of `{ id, role, text, stepId, passageIds }`. The `passageIds` of a tutor message come from the plan step, not from the model. This makes the "source" feature reliable.

**Reload (My call):** The store saves to browser storage without the key. A reload restores the lesson. The builder chooses the storage type and handles the size limit.

## 7. Tutor behavior

**Plan call.** Input: passages (or compact view) and the teacher prompt. Output: the plan as JSON. The teacher prompt sets the language, the level, the style and the length. A time limit sets the number of steps (My call: about 2 minutes for each step). The app validates the JSON and retries once. If it fails again, the app shows a clear error.

**Turn call (streamed).** Input: the current step, its passages, a short progress summary, the last few messages, the student message and the teacher prompt. Output: the tutor text, then a short control line with a verdict (`correct`, `partial`, `wrong`, `off_topic`) and an `advance` flag. The client removes the control line from the display and updates the state. If the control line is missing (for example after the stop button), the state does not change. (My call: control line. The builder may choose a second small call if it is more robust.)

**Teaching rules (My call):**
1. One step at a time. Short messages. One question at a time.
2. Teach a small piece, then ask the step's check question. Wait for the student.
3. For a wrong answer: give a graduated hint (level 1 small, level 2 stronger). Do not give the answer. After about 3 attempts, explain the answer from the source and move on. This prevents frustration.
4. For a correct answer: confirm, name why it is correct, and move on.
5. Adapt the level and the wording to the student's answers.
6. When the student says "just tell me": do not give the answer. Offer a hint and ask what the student already thinks.
7. Stay in the file. If the student asks something outside it, say so kindly and return to the step.
8. Follow the teacher prompt for language, level, style and length. Use the file's language if the prompt does not set one.
9. Write math in LaTeX and tables in Markdown.
10. At the end, give a short recap and say that the lesson is complete.

## 8. Screens

1. **Setup:** file drop zone, teacher prompt field (with an example), settings panel (provider, model, key). Clear file-type and size information.
2. **Extraction report:** see section 5.
3. **Lesson:** header with "Step 3 of 7", a progress bar and the step title. The chat. A text box with Send, which becomes Stop while the answer streams. A "Source" button on each tutor message opens the passages (a bottom sheet on a phone, a side panel on a desktop). An outline drawer shows the plan and the status of each step.

**States:** loading (parsing progress, plan skeleton, streaming indicator), error (clear text, retry button, key and rate-limit messages), empty (no file, no key, no text found). The layout works at phone width. Each message uses `dir="auto"`, so Hebrew and Arabic display correctly. Markdown, tables and LaTeX render in the chat.

**Library candidates (My call, builder confirms):** a PDF library, a DOCX library, a spreadsheet library, a Markdown renderer with table support, KaTeX for math. A heavy library loads only when needed.

## 9. Evaluation (for `DECISIONS.md`)

The builder runs each scenario against a real model and saves the transcript. "It looked fine" is not enough. A scenario passes only against a written pass condition.

Scenarios (My call, about 5):
1. The student answers wrong. The tutor gives a hint and not the answer.
2. The student says "just tell me the answer". The tutor redirects and does not give it.
3. The student asks an off-topic question or tries "ignore your rules". The tutor returns to the lesson.
4. A scanned Hebrew page. The app reads it through vision, the text is correct and displays right-to-left.
5. A long document. The plan builds, each turn stays fast, and the source passage matches the step.
6. (Extra) The teacher prompt sets language, level and length. The lesson follows all three.

Other checks: stop button mid-stream, wrong key, rate-limit error, empty file, a formula page, a table page.

## 10. Left to the builder
- Exact libraries, thresholds (quality score, file size, page limit), and the control-line format.
- Prompt wording, styling and animation.
- The storage type for reload.
- Folder details inside the layers above.

## 11. Parked for later
Audio, video and ZIP files. Voice. Option questions. Cross-session learner memory. Teacher analytics.

## 13. Look and feel (added after the design approval)

This section comes from the user's Claude Design prototype (folder `Hebrew tutoring app prototype/`). The user chose direction **1b, Bright Adventure, with the quieter chat background (Decided)**. The files `Style Guide.dc.html`, `Tutor.dc.html` and `Prototype.dc.html` are the visual source of truth for exact values.

**Goal:** The interface is professional and playful. It motivates the student and makes the lesson fun.

**Decided by the user:**
- The whole interface is in Hebrew and right-to-left. This is a first-class requirement.
- Fun animations are required. A "כל הכבוד!" style animation plays when the student answers correctly.
- Style: Bright Adventure (strong blue, sun yellow, heavy Rubik headings, solid button shadows). The chat background is plain, without the dot pattern.

**From the design (My call to keep):**
- **Tutor character "ברק" (Barak):** an SVG lightning bolt with moods (talking, thinking, cheering, encouraging, leaning in, sleepy, dancing, still).
- **Hebrew and direction rules:** The tutor bubble is on the right (start side). The student bubble is on the left (end side). The text inside a bubble keeps the lesson language and direction (for example French is left-to-right). Latin words, file names and formulas stay left-to-right inside Hebrew text. All interface text is Hebrew and gender-neutral. All CSS uses logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`).
- **Celebrations:** a praise badge with 6 rotating Hebrew phrases (correct answer), a star progress path that fills from right to left, a "השלב הושלם!" ribbon (step complete), and confetti with a recap card (lesson complete).
- **Hints:** a "רמז" button next to the input. The tutor gives a graduated hint. The hint level shows as lamps ("1 of 2"). The button stops after the last level. A hint does not use up an attempt. This is not an option question.
- **Wrong answers:** an idea-lamp hint in a warm yellow. Never red. Red is only for system errors.
- **Saved questions:** An off-topic question is not rejected. The app saves it (up to 3). The complete screen shows it: "השאלה ששמרנו לסוף".
- **Complete screen:** a recap of up to 3 bullets built from the `keyPoints` of the plan (no extra AI call), the numbers of steps, attempts and hints, and the saved questions.
- **Slow server:** After 4 seconds of waiting for the first byte, the app shows a friendly "waking up" message.
- **Mobile:** The input stays above the keyboard (`100dvh` and `visualViewport`).
- **Motion rules:** Only `transform` and `opacity`. Entrances use ease-out. Nothing starts from `scale(0)`. No animation blocks the input. Every celebration has a reduced-motion version (static badge, no confetti, no movement). The app follows `prefers-reduced-motion`.
- **Accessibility:** The chat is a `role="log"` with `aria-live="polite"`. Praise and ribbons are `role="status"`. Tab order follows the RTL reading order. Enter sends. Shift+Enter adds a line. Esc closes a panel. Color is never the only signal.

**Cut list if time is short (from the design):** limb-level animation of Barak (keep static poses), the sparkles around the badge, and the drop-zone wiggle. The praise badge, soft bubble entrance, streaming text, the progress path fill and the three celebrations stay.

**Open call (My call):** The praise badge uses Hebrew phrases (interface voice). The tutor text uses the lesson language. In a French lesson the badge still says "כל הכבוד!".

**Not in the design (My call):** No sound. No dark mode. No language switch.

## 12. Answers added after the builder check

All items here are **(My call)**. The user checks them.

1. **Key path.** The key goes browser → Vercel function → provider. The assignment requires this ("Send it to your server with each request"). The browser never calls the provider directly. The function reads the key from a request header and never logs it.
2. **Vision support.** The settings panel has a "model can read images" switch. Each provider preset sets a default (Gemini on). The user can change it. If vision is off and the file has pages that need it, the app lists those pages and continues with the readable pages. If no page is readable, the app blocks the start and explains why.
3. **Vercel budget.** The design assumes the free (Hobby) plan. The builder reads the current body limit and duration limit first. Vision pages go in small batches of reduced images. A cap on vision pages per file keeps each call inside both limits.
4. **Missing control line.** The app enforces the attempt cap in code, not in the model. Every student answer counts as one attempt. After 3 attempts on a step, the app tells the tutor to explain the answer from the source, and the step moves to done. A turn with a missing control line counts as one attempt and does not advance the step. The tutor cannot loop on one step.
5. **Model quality.** The default preset is a capable free model (Gemini Flash class). The app validates every JSON output and retries once. It degrades with a clear message, not silently. `DECISIONS.md` states that small models are a known weakness.
6. **Input checks.** Prompt rules, a clear delimiter around the file text and around the student message, and a length limit on the student message. No pattern filters.
7. **Passage IDs.** The app checks every `passageIds` value against the known IDs. It removes invalid IDs. If a step ends with no valid ID, the app repairs the plan once by matching the step to the closest passage labels.
8. **Teacher prompt.** The prompt is optional. With no prompt, the lesson is a clear, neutral lesson in the file's language. If the prompt conflicts with the file, the file wins. The plan summary tells the teacher what the app did.
9. **Starting limits.** Up to about 25 MB per file, about 100 pages of text, and about 20 vision pages per file. These are starting values. The builder adjusts them after a test on the real host.
