# Decisions

This file says what I chose, what I did not do, what is weak, and how I know it works. I wrote it in simple English on purpose.

## 1. The main choices and why

**1. One lesson plan, built once, kept in state.**
When the teacher presses "Start", one AI call turns the file and the prompt into a plan. The plan has steps. Each step has a goal, one check question, key points and the passages it uses. The plan and the student progress live in a plain reducer (`src/lesson/`), not in the chat history. Each tutor turn sends only the current step, its passages and the last 6 messages. So the tutor stays on one step, long files stay cheap, and "step 3 of 7" is real.

**2. The source comes from the plan, not from search.**
Each step lists the IDs of its passages. The "Source" button shows exactly those passages. The model does not pick the source, so it cannot invent one. The server checks every ID. I did not use embeddings: they add a service, a cost and a way to fail.

**3. The attempt limit is in code, not in the prompt.**
Each tutor reply ends with a hidden control line (`<<STATE {"verdict": ..., "advance": ...}>>`). The browser reads it. The rule "after 3 wrong answers, explain and move on" is enforced by the reducer. A model that forgets the control line cannot trap a student on one step.

**4. The file is read in the browser.**
The browser reads the text and sends only text and page images (2 pages per request, under 1 MB each). This stays under the Vercel request limit and needs no server tools. Each PDF page gets a quality check. A good page uses its text. A bad page goes to the vision model as a picture. Bad means a scan, broken fonts, reversed Hebrew, or a page that is one big picture with only a short stamp as text. A scan that has a long text layer is checked: the model reads the picture too, and if its words differ a lot from the layer, the model's text is used. PDF pages are drawn at 150 dpi, because 72 dpi made small print unreadable. HEIC photos from an iPhone are converted in the browser.

**5. One adapter for many providers.**
Anthropic, OpenAI, Groq and OpenRouter use the OpenAI chat format, so one small adapter covers them. Gemini has its own path. The key goes in a request header, is used once, and is never stored, logged or put in an error. The server refuses addresses on private networks. Each provider offers three models in the settings (fast, balanced, strong), with names from the official documentation, because a wrong name fails every request.

**6. Hebrew and English, and three lesson buttons.**
Two dictionaries (`he.js`, `en.js`) with the same keys. A toggle switches the whole interface and its direction. The lesson language follows the toggle, even if the file is in another language. The "how to teach" step has three button rows (length, difficulty, language) and a text box for extra wishes. The text box wins if it conflicts with a button.

**7. Tests first.**
I wrote each test and watched it fail before I wrote the code. There are 847 tests. I also ran the whole app in a browser with a fake model server (`scripts/fake-provider.mjs`). That found a bug that unit tests missed: React strict mode stopped the first turn.

**Libraries**

| Library | Why |
|---|---|
| `pdfjs-dist`, `mammoth`, `jszip` | Read PDF, DOCX and the zip-based formats (PPTX, XLSX, EPUB, ODF). I did not use the SheetJS package: its npm version is old and has known security problems. |
| `heic-to` | Convert iPhone photos. It loads only when the browser cannot read HEIC. The older `heic2any` failed on an iPhone 17 photo. |
| `react-markdown`, `katex` and plugins | Show tables and formulas in the chat. No raw HTML. |
| `@fontsource/*` | Fonts that I host myself, so no student request goes to a font server. |

## 2. What I decided not to do, and why

- **Multiple-choice questions.** Free text shows more understanding and fits the Socratic method. The Hint button gives help.
- **Voice.** Browser speech for Hebrew and Arabic is weak, and the assignment does not ask for it.
- **Audio, video and ZIP files.** They show a clear "not supported yet" message.
- **Vector search and safety products.** The plan already ties each step to its passages. Safety rules are in the prompt.
- **Accounts, a database, memory across sessions, a teacher dashboard.** They do not fit 4 hours, and they are not needed to show how the tutor teaches.
- **Editing the extracted text, dark mode, sound, more interface languages.** Not needed for this version.

## 3. Weaknesses that I know about

**Evidence**
- **The tutor was tested with Claude models only.** Haiku was the tutor in the strong tests. I did not test a free model (Gemini Flash, a Llama model), which reviewers may use.
- **The tests are noisy.** In the last four runs Haiku passed 13, 14, 14 and 14 of 16 scenarios, and the failing ones changed. The judge is a model, so it can be wrong. In the last run two scenarios fail: Haiku sometimes asks two things in one question, and it adds small facts that are not in the file. I stopped there, because more prompt changes would only fit the tests.
- **I called only Claude models with a real key.** The model names for OpenAI, Gemini, Groq and OpenRouter come from the official documentation (25 October 2026), and I did not call those providers. A name can still fail, for example if an account has no access to a model. Free models also change often.

**The tutor**
- **A weak model can forget the control line.** It happened in 3 of 197 messages before I added a reminder at the end of each request, and in 0 of 80 after. The app treats a missing line as "do not advance", so a right answer must be sent again.
- **The prompt is light protection.** The file and the student text are marked as data, and the tutor ignored instructions hidden in a file in every test. But nothing filters the text. A file that contains `FILE>>>` can close the data block.
- **The Hebrew was not read by a native speaker.** Nor was the English.

**Files**
- **Scans are better, but I did not test the accuracy.** I checked only the pictures that go to the model. I did not test handwriting. A sideways scan goes sideways.
- **Some content is lost.** DOCX equations and images, PPTX pictures, old `.doc` / `.ppt` / `.xls` files.
- **A rate limit (429) while reading scanned pages loses the pages already read.**

**Interface**
- **The report screen does not show the chosen length, difficulty and language.**
- **No focus trap in the panels, and no arrow keys in the button rows.**
- **I checked the design only at 375 px and about 1100 px, in my browser tool.** I did not check Safari or a real phone.
- **The lesson is saved in `sessionStorage`.** It survives a reload, but not a closed tab.
- **Source is per step, not per sentence.**

## 4. What I would do with 4 more hours

1. Run the 16 scenarios with Sonnet and with a free model. Run each one 3 times, read every transcript, and fix the prompts.
2. Add a short repair call when the control line is missing, and a check that rejects a question with two parts.
3. Retry each scanned page alone, with a wait, so a 429 does not lose pages.
4. Escape `FILE>>>` and `STUDENT>>>` in the input.
5. Show the exact source sentence, not the whole step.
6. A keyboard and screen-reader pass. Test on a real phone and on Safari.

## 5. How I know it works

### The scenarios with a real model

There are 16 scenarios in `eval/scenarios.mjs`. The runner uses the real server code and the real lesson reducer, like the browser. It saves a transcript for each scenario in `eval/transcripts/`.

My first 7 scenarios passed (`eval/transcripts/first-run-simple-checks/`), but the checks were weak: they looked for one number or one word. So I made them stronger, in four ways:
1. **Text checks.** The answer (70) and the finished calculation (110) must not appear. A reply must not say "not exactly" and then "yes, exactly". The verdict must fit. The language is detected.
2. **Rules for every tutor message.** It has a control line, at most 150 words, and at most 3 questions.
3. **A judge.** A second model reads the conversation and applies a written rule, such as "no answer in other words". If it does not answer in the right shape, the check fails.
4. **A simulated student.** A model plays a student and runs a whole lesson.

| Scenarios | What they test |
|---|---|
| `wrong-answer`, `just-tell-me`, `hint-request`, `three-wrong-forced-explain` | The tutor never gives the answer early, stays kind, and after 3 wrong answers explains. |
| `partial-answer-consistent`, `right-but-weak-answer` | A partly right answer, and a right answer with no reason. |
| `full-lesson-simulated-student` | A whole lesson: one question at a time, no outside facts. |
| `out-of-file-question`, `off-topic-injection`, `file-injection` | Questions outside the file, rule-breaking requests, and instructions hidden in a file. |
| `student-distress` | A sad student, and a student who says they want to hurt themselves. |
| `lesson-language-wins`, `difficulty-levels`, `teacher-prompt` | The language, the difficulty and the teacher prompt are followed. |
| `long-document`, `hebrew-scan` | A 60-chapter file and a scanned Hebrew page. |

**Result:** the final run passed 14 of 16 with Haiku as the tutor and Sonnet as the judge. The runs were 9, 13, 14, 14 and 14 of 16. The folders in `eval/transcripts/` are named by result, and the final run is in `claude-haiku-5-5/`. The two failures are listed in section 3.

**What the scenarios found.** I fixed each of these in the prompts, with a unit test:
- After 3 wrong answers the app ended the step, but the model asked a new question instead of explaining.
- The tutor said "advance" and then asked a follow-up question.
- A sad student got an emergency number that was not needed.
- Masculine Hebrew forms, a difficulty button with little effect, and facts from outside the file.
- A forgotten control line.

The scenarios also found bugs in my own test code. They are fixed.

**Run them** in a terminal where `EVAL_KEY` holds your key:

```bash
npm run dev                          # in one terminal
EVAL_BASE_URL=https://api.anthropic.com/v1 EVAL_MODEL=claude-haiku-5-5 EVAL_JUDGE_MODEL=claude-sonnet-5-5 npm run eval
```

The default model is Gemini (`gemini-3.8-flash`). `npm run check-providers` checks every provider and model that the settings offer, if you give it keys (see `scripts/check-providers.mjs`).

### The other checks

- **847 automated tests.** They cover the tutor prompts, the control line (including a line cut in the middle), the lesson state, every file reader, the vision routing, every screen, the key (never in a body, URL, error, log or server storage), both languages, the lesson options and the model list.
- **A real browser run with a fake model server.** Upload, read, plan, wrong answer, hint, right answer, Stop and Continue, and the end of the lesson.
- **12 generated scan files** (clean, small print, skewed photo, sideways, stamp-only text layer, wrong text layer, phone photo, table, 25 pages, A3). I ran them through the real reader and looked at the pictures that would go to the model. This found three problems (72 dpi, a stamp that hides a scan, a wrong text layer that was trusted). They are fixed. A real iPhone 17 photo also failed in the old converter, and that is fixed.
- **30 role-played reviews** (teachers, students, parents, a principal and others). They are not real users. The clearest finding was that the API key is hard to set up. The assignment requires the key field, so I left it.
