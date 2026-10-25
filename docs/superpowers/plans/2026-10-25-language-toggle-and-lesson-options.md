# Language Toggle and Lesson Options Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A Hebrew/English toggle for the whole app, and three button rows (length, difficulty, lesson language) in the "איך ללמד" step that sit above the free text box.

**Architecture:** `src/ui/he.js` stays the Hebrew dictionary. A new `src/ui/en.js` has the same keys. A `LanguageProvider` in `src/ui/i18n.jsx` holds the language, saves it, and sets `lang` and `dir` on the document. Components call `useStrings()` and keep the local name `he`, so the diff in each file stays small. The three button values travel as `options` from the setup screen, through the lesson state, to the plan API, which puts them in the plan prompt. The plan gets a `difficulty` field that the tutor turn reads.

**Tech Stack:** React 19, Vite, Vitest with Testing Library, Vercel functions in `api/`.

**Spec:** `docs/superpowers/specs/2026-10-25-language-toggle-and-lesson-options-design.md`

## Global Constraints

- Two languages only: `'he'` and `'en'`. Hebrew is right to left. English is left to right.
- Hebrew text stays gender-neutral (plural and infinitive forms). English text is plain and short.
- The tutor keeps the name "Barak" in both languages.
- Both dictionaries have the same keys. A test checks this.
- Length choices: 5, 10, 15, 30 minutes. Default 15. Difficulty: `easy`, `medium`, `challenging`. Default `medium`. Lesson language default: the app language.
- The language row is "untouched" until the teacher taps it. Untouched follows the toggle. Chosen keeps its value.
- The text box wins over the buttons. The server reads minutes from the text with the existing `minutesFromPrompt`. For difficulty and language the prompt tells the model that the teacher text overrides the button lines.
- The lesson language wins over the file language. A Hebrew file with the English toggle gives an English lesson. The Source passages stay in the original language.
- First language: the saved choice (`localStorage` key `tmtf.lang.v1`). Else Hebrew when `navigator.language` starts with `he`, else English. Only the toggle is saved. The three rows are not saved.
- A switch during a lesson changes the interface only.
- A saved lesson without `options` or `difficulty` opens as before and counts as 15 minutes, `medium`.
- The 631 existing tests pass. The tests run in Hebrew: `tests/setup.js` sets `navigator.language` to `he-IL`.
- No logical-CSS regression: the existing test that bans physical left/right CSS must pass.

## Review Focus

- `navigator.language` values `he`, `he-IL`, `HE`, `iw` and `en-US`: Hebrew for the first three and for `iw`, English for the last. Pinned in Task 1.
- Storage blocked (`localStorage` throws): the app still starts and the toggle still works for the visit. Pinned in Task 1.
- A saved lesson from before this change (no `options`, no `plan.difficulty`) opens and sends `medium`. Pinned in Task 4 and Task 5.
- Text says "30 דקות" or "30 minutes" while the 15 button is on: 30 wins, and the step count follows 30. Pinned in Task 5.
- The API gets bad `options` (minutes 0 or 9999, difficulty "hard", language "fr", or no `options`): defaults apply and the request does not fail. Pinned in Task 5.
- The toggle changes during a lesson: the lesson text and messages stay as they are. Pinned in Task 3.

---

### Task 1: Language core and the English dictionary

**Files:**
- Create: `src/ui/en.js`, `src/ui/i18n.jsx`
- Modify: `tests/setup.js`, `index.html` (leave the Hebrew default; the provider sets the real value)
- Test: `tests/ui/i18n.test.jsx`, `tests/ui/he.test.js` (add the parity test)

**Interfaces:**
- Produces, in `src/ui/i18n.jsx`:
  - `LANGUAGES: ['he', 'en']`
  - `getLanguage(): 'he' | 'en'` — the language now in use. It reads the saved choice, else the browser language. Safe when storage or `navigator` is missing.
  - `stringsFor(language: 'he' | 'en'): typeof he`
  - `LanguageProvider({ children })`
  - `useLanguage(): { language, setLanguage(language), dir: 'rtl' | 'ltr' }`
  - `useStrings(): typeof he` (the dictionary of the current language)
- Produces `en` (default export name `en`) in `src/ui/en.js` with the same key paths as `he`, including `labels: { page, slide, sheet, chapter }` templates added to both dictionaries (`'עמוד {n}'`, `'שקופית {n}'`, `'גיליון: {name}'`, `'פרק {n}'` and the English `'Page {n}'`, `'Slide {n}'`, `'Sheet: {name}'`, `'Chapter {n}'`), and the new strings of Tasks 3 and 4: `language.toggleLabel`, `language.he`, `language.en`, `setup.options.*` (see Task 4).

- [ ] **Step 1: Write the failing tests** in `tests/ui/i18n.test.jsx` and `tests/ui/he.test.js`:
  - parity: every key path of `he` exists in `en` and the reverse; arrays have equal length; no value of `en` is an empty string; every `{slot}` in a Hebrew string appears in the English string of the same key.
  - `getLanguage()` returns `'he'` for `navigator.language` of `he`, `he-IL`, `HE`, `iw`, and `'en'` for `en-US` and `fr`.
  - a saved `tmtf.lang.v1` of `'en'` beats a Hebrew browser.
  - when `localStorage.getItem` and `setItem` throw, `getLanguage()` still returns a language and `setLanguage('en')` does not throw.
  - `LanguageProvider` sets `document.documentElement.lang` and `.dir` (`he`/`rtl`, `en`/`ltr`) on mount and on `setLanguage`.
  - `useStrings()` returns `he` or `en` by language and re-renders the consumer when `setLanguage` runs.
- [ ] **Step 2: Run** `npx vitest run tests/ui/i18n.test.jsx tests/ui/he.test.js`. Expect FAIL (modules missing).
- [ ] **Step 3: Implement** `src/ui/en.js` (translate every string of `he.js`; keep `{slot}` names; keep "Barak"), and `src/ui/i18n.jsx`. A module-level `current` variable follows the provider so that non-React code (`labels.js`, `messages.js`) can call `getLanguage()`. Add `Object.defineProperty(navigator, 'language', { value: 'he-IL', configurable: true })` to `tests/setup.js`.
- [ ] **Step 4: Run** the two test files again. Expect PASS. Run `npx vitest run` and expect 631 old tests still passing.
- [ ] **Step 5: Commit** `feat: add the language provider and the English dictionary`.

### Task 2: Use the dictionary of the current language everywhere

**Files:**
- Modify: every component in `src/ui/*.jsx` that imports `he` (17 files: Composer, SettingsPanel, StepRibbon, ChatMessage, ProgressHeader, SetupScreen, ProgressPath, TutorCharacter, OutlineDrawer, SourceSheet, ReportScreen, CompleteScreen, LessonScreen, Spinner, ErrorBanner, HintLamps, Drawer), `src/ui/messages.js`, `src/ui/useTutor.js`, `src/ai/client.js` if it imports `he`, `src/ingest/labels.js`, `src/main.jsx`
- Test: `tests/ui/SetupScreen.test.jsx`, `tests/ui/messages.test.js`, `tests/ingest/labels.test.js` (create)

**Interfaces:**
- Consumes: `useStrings`, `getLanguage`, `stringsFor`, `fmt` from Task 1.
- Produces: `describeError(error, strings = stringsFor(getLanguage()))` and `describeWarning(warning, strings = stringsFor(getLanguage()))` in `messages.js`. `pageLabel(n)`, `slideLabel(n)`, `sheetLabel(name)`, `chapterLabel(n)` in `labels.js` read the current language.

- [ ] **Step 1: Write the failing tests:**
  - `labels.test.js`: with the language `he`, `pageLabel(3)` is `'עמוד 3'`; with `en` it is `'Page 3'` (set through `localStorage` `tmtf.lang.v1` and a fresh `getLanguage()`).
  - `messages.test.js`: `describeError({ code: 'bad_key' }, stringsFor('en')).title` is the English text; `describeWarning({ code: 'very_short', params: { chars: 5 } }, stringsFor('en'))` is English.
  - `SetupScreen.test.jsx`: rendered inside `LanguageProvider` with the saved language `en`, the screen shows `en.setup.fileStep` and not `he.setup.fileStep`.
- [ ] **Step 2: Run** these tests. Expect FAIL.
- [ ] **Step 3: Implement.** In each component, replace `import { fmt, he } from './he.js'` by `import { fmt } from './he.js'` plus `import { useStrings } from './i18n.jsx'`, and add `const he = useStrings()` at the top of the component function. Components that pass `he` into helper functions pass the local value. Wrap the app in `LanguageProvider` in `src/main.jsx`, and in `tests/helpers/render.jsx` (`renderScreen` and `renderLesson`). Replace the `he.*` reads in `messages.js` with the `strings` parameter.
- [ ] **Step 4: Run** `npx vitest run`. Expect all old tests plus the new ones PASS.
- [ ] **Step 5: Commit** `feat: show the interface in the current language`.

### Task 3: The toggle

**Files:**
- Create: `src/ui/LanguageToggle.jsx`
- Modify: `src/ui/SetupScreen.jsx` (top bar, next to the Settings button), `src/ui/SettingsPanel.jsx`
- Test: `tests/ui/LanguageToggle.test.jsx`, `tests/ui/LessonScreen.test.jsx`

**Interfaces:**
- Consumes: `useLanguage`, `useStrings`, `language.*` strings from Task 1.
- Produces: `<LanguageToggle />` — two buttons ("עברית" and "English"). The active one has `aria-pressed="true"`. The group has an accessible name from `language.toggleLabel`.

- [ ] **Step 1: Write the failing tests:**
  - the toggle shows both names and marks the current one pressed.
  - pressing "English" changes the setup screen text to English, sets `document.documentElement.dir` to `ltr`, and saves `en` in `localStorage`.
  - pressing "עברית" back restores Hebrew and `rtl`.
  - the toggle is in the settings panel too.
  - during a lesson (`renderLesson`), switching the language changes the interface text (for example the Hint button) but the tutor messages and the plan step titles in the chat stay as they were.
- [ ] **Step 2: Run.** Expect FAIL.
- [ ] **Step 3: Implement** `LanguageToggle.jsx` with the project's button style (min height 44 px, logical CSS only). Place it in `SetupScreen` and `SettingsPanel`.
- [ ] **Step 4: Run** `npx vitest run`. Expect PASS.
- [ ] **Step 5: Commit** `feat: add the Hebrew and English toggle`.

### Task 4: The three button rows

**Files:**
- Create: `shared/options.js`, `src/ui/LessonOptions.jsx`
- Modify: `src/ui/SetupScreen.jsx`, `src/ui/he.js`, `src/ui/en.js`, `src/lesson/reducer.js`, `src/lesson/persist.js` (no change if the state spreads), `tests/helpers/lesson.js`
- Test: `tests/shared/options.test.js`, `tests/ui/LessonOptions.test.jsx`, `tests/ui/SetupScreen.test.jsx`, `tests/lesson/reducer.test.js`

**Interfaces:**
- Produces, in `shared/options.js`:
  - `LESSON_MINUTES = [5, 10, 15, 30]`, `DIFFICULTIES = ['easy', 'medium', 'challenging']`, `OPTION_LANGUAGES = ['he', 'en']`
  - `DEFAULT_OPTIONS = { minutes: 15, difficulty: 'medium', language: null }` (`null` means "the file or the app language is decided by the caller")
  - `normalizeOptions(raw): { minutes: number|null, difficulty: string, language: 'he'|'en'|null }` — a value outside the lists becomes the default. It never throws.
- Produces `<LessonOptions value, onChange, appLanguage />`. `value` is `{ minutes, difficulty, language }` where `language` is `null` while untouched. The language row shows `appLanguage` as selected while `value.language` is `null`.
- Produces state `options` (`{ minutes, difficulty, language }` with `language` always `'he'|'en'` once the lesson starts) set by the `ingested` action: `{ type: 'ingested', ingest, teacherPrompt, options }`. Missing `options` means `{ minutes: 15, difficulty: 'medium', language: null }`.
- New strings in both dictionaries under `setup.options`: `lengthLabel`, `lengthChoice` (`'{n} דק׳'` / `'{n} min'`), `difficultyLabel`, `easy`, `medium`, `challenging`, `languageLabel`, `extraLabel` (replaces the old prompt label), and updated `promptPlaceholder` and `promptExample` for the extra-requests text (the example no longer names a grade length or the language).

- [ ] **Step 1: Write the failing tests:**
  - `normalizeOptions`: `undefined`, `{}`, `{ minutes: 0 }`, `{ minutes: 9999 }`, `{ difficulty: 'hard' }`, `{ language: 'fr' }` give the defaults; valid values pass through.
  - `LessonOptions` renders three rows with buttons (4, 3 and 2). The defaults are selected: 15, medium, the app language. Tapping a button calls `onChange` with the new value. Each group is a `radiogroup` with `aria-checked` on the buttons.
  - Untouched language follows `appLanguage`: rerender with `appLanguage='en'` and the English button is selected. After a tap on Hebrew, a rerender with `appLanguage='en'` keeps Hebrew selected.
  - `SetupScreen` dispatches `ingested` with `options` that include the chosen minutes, difficulty and the resolved language (`'he'` or `'en'`), and `teacherPrompt` as the trimmed extra text.
  - reducer: `ingested` with `options` stores them in `state.options`; without `options` the state has the defaults with `language: null`.
- [ ] **Step 2: Run.** Expect FAIL.
- [ ] **Step 3: Implement** the files. `SetupScreen` keeps `options` in state, shows `LessonOptions` above the text box, and resolves `language` (`options.language ?? currentLanguage`) when it dispatches. Replace the title "איך ללמד? (לא חובה)" text only through the dictionaries. Use the segmented style of the mockup (`.superpowers/brainstorm/*/content/how-to-teach.html`) with logical CSS and 44 px targets.
- [ ] **Step 4: Run** `npx vitest run`. Expect PASS.
- [ ] **Step 5: Commit** `feat: add length, difficulty and language buttons to the how-to-teach step`.

### Task 5: Options reach the planner and the tutor

**Files:**
- Modify: `src/ai/client.js`, `src/ui/ReportScreen.jsx`, `api/plan.js`, `server/prompts.js`, `server/tutor-prompt.js`, `shared/plan.js`, `src/lesson/selectors.js`, `api/turn.js`
- Test: `tests/api/plan.test.js`, `tests/server/prompts.test.js`, `tests/shared/plan.test.js`, `tests/lesson/selectors.test.js`, `tests/api/turn.test.js`, `tests/ai/client.test.js`, `tests/ui/ReportScreen.test.jsx`

**Interfaces:**
- Consumes: `normalizeOptions`, `DEFAULT_OPTIONS` from Task 4; `state.options`.
- Produces:
  - `requestPlan({ settings, teacherPrompt, options, passages, signal })` sends `options` in the body.
  - `buildPlanMessages({ teacherPrompt, options, passages, compact })`. The step count is `stepCountFor(minutesFromPrompt(teacherPrompt) ?? options.minutes ?? null)`. The user message gets a line `Teacher buttons: length N minutes; difficulty D; lesson language L.` (L is `Hebrew` or `English`; with `null` it says `the language of the file`) and the rule: the text between TEACHER markers overrides the buttons.
  - The plan system prompt gets two rules: the lesson language wins over the file language (teach the ideas in the lesson language, keep quotes and terms of the file as they are), and the plan JSON has `"difficulty": "easy" | "medium" | "challenging"`.
  - `validatePlan` returns `plan.difficulty`: the model value when it is in `DIFFICULTIES`, else `'medium'`.
  - `buildTurnPayload` (in `selectors.js`) sends `plan: { title, language, audience, difficulty }` with `difficulty` defaulting to `'medium'`. The tutor turn context line in `prompts.js` adds `Difficulty: D.` The tutor prompt gets a `# DIFFICULTY` section: easy means smaller steps, simpler words and more hints; medium is the current style; challenging means deeper "why" and "what if" questions and fewer hints. It also says: teach in the lesson language even when the passages are in another language.

- [ ] **Step 1: Write the failing tests:**
  - `plan.test.js` (API): a body with `options: { minutes: 30, difficulty: 'easy', language: 'en' }` makes the prompt contain `length 30 minutes`, `difficulty easy`, `English`; a body with `options: { minutes: 0, difficulty: 'hard', language: 'fr' }` and a body with no `options` both succeed and use the defaults (15, medium, file language).
  - `prompts.test.js`: teacher text `30 minutes` with `options.minutes 15` asks for about 15 steps (30 minutes / 2); the prompt carries the override rule and the language-wins rule; the Hebrew text `45 דקות` also wins.
  - `shared/plan.test.js`: `difficulty` passes through when valid and becomes `'medium'` when missing or invalid.
  - `selectors.test.js`: the turn payload has `plan.difficulty`; a state whose plan has no `difficulty` sends `'medium'`.
  - `turn.test.js`: the context line contains `Difficulty: easy.`
  - `client.test.js`: `requestPlan` posts `options`. `ReportScreen.test.jsx`: pressing Start calls `requestPlan` with `state.options`; a state without `options` sends the defaults.
- [ ] **Step 2: Run.** Expect FAIL.
- [ ] **Step 3: Implement** in the files listed. `api/plan.js` runs `normalizeOptions(call.body.options)` and passes the result on. `ReportScreen` passes `state.options ?? DEFAULT_OPTIONS`.
- [ ] **Step 4: Run** `npx vitest run`. Expect PASS. Run `npm run build` and expect success.
- [ ] **Step 5: Commit** `feat: send the lesson options to the planner and the tutor`.

### Task 6: Check in the browser and update the docs

**Files:**
- Modify: `README.md`, `DECISIONS.md`
- Test: manual check with the fake provider (`node scripts/fake-provider.mjs`)

- [ ] **Step 1: Check in the browser** (dev server and the fake provider): the toggle switches the whole setup, report, lesson and complete screens; `<html lang dir>` follows; the three rows send `options` (read the plan request in the network panel); the English toggle gives a lesson-language of English; a reload keeps the language.
- [ ] **Step 2: Update** the README ("How to use the app" mentions the toggle and the three rows) and DECISIONS (the two-dictionary choice, the options flow, text beats buttons).
- [ ] **Step 3: Run** `npx vitest run` and `npm run build`. Expect all PASS.
- [ ] **Step 4: Commit** `docs: describe the language toggle and the lesson options`.
