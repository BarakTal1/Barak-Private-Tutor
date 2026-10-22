# מלמדים אותי את הקובץ — Teach Me This File

A teacher uploads a file and writes a short prompt. An AI tutor then teaches the file to a student in a chat. The tutor teaches one small step at a time, asks one question, waits for the answer, gives hints when the answer is wrong, and moves on when the answer is right.

The interface is in Hebrew and runs right to left. The lesson is in Hebrew for now ("Teach this to 7th graders. Be Socratic. Keep it under 15 minutes.").

- **Live app:** https://barak-private-tutor.vercel.app/
- **Decisions, weak points and test scenarios:** [DECISIONS.md](DECISIONS.md)

## How to use the app

1. Open **Settings** (הגדרות). Choose a provider (Gemini, Groq, OpenRouter, or your own), check the model name, and paste your API key. The key stays in your browser. It goes to the server only in a request header, and the server never stores it or logs it.
2. If you want to use scanned pages or photos, turn on **"The model can read images"**. Use a model that supports images.
3. Drop a file on the first step. Write a prompt in the second step (you can leave it empty). Press **Continue**.
4. Check the **report**: it shows how each page was read, the warnings, and a preview of the text. Press **Start lesson**.
5. In the lesson, answer in the text box. Use **Hint** (רמז) when you are stuck. Use **Stop** to stop an answer. Press **Source** (מקור) under a tutor message to see the part of the file behind it. The map button shows all the steps.

## Files that the app can read

| Kind | Types | How |
|---|---|---|
| Text | TXT, Markdown, CSV, JSON, HTML, LaTeX, code | Read in the browser (UTF-8, UTF-16 and old Hebrew and Arabic code pages) |
| Documents and slides | PDF, DOCX, PPTX, XLSX, EPUB, ODT, ODP, ODS | Read in the browser. Tables stay as tables. |
| Images and scans | JPG, PNG, WEBP, GIF, BMP, HEIC, and scanned PDF pages | Sent to the vision model of your provider |

A page with bad text (a scan, broken fonts, reversed Hebrew) is sent to the vision model. A file that cannot be read gets a clear message. Old `.doc`, `.ppt`, `.xls` files, audio, video and ZIP files are not supported yet.

Limits: 25 MB for a file, 100 pages of text, and 20 pages through the vision model. The page shows the limits.

## Run it on your computer

You need Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open the address that the command prints. `npm run dev` also serves the functions in `api/`, so you do not need a Vercel account.

**Try it without an API key.** Start a fake model server in a second terminal, and use `http://localhost:4010/v1` as the server address in the settings (any key and model name work):

```bash
node scripts/fake-provider.mjs
```

On your own computer you can also use a model server that runs locally (for example Ollama at `http://localhost:11434/v1`). This works only in `npm run dev`. On Vercel the server refuses addresses on private networks.

## Run the tests

```bash
npm test
```

The tests do not call a real model. The scenarios that check the behavior of the tutor with a real model are in [DECISIONS.md](DECISIONS.md) and run with `npm run eval` (see `eval/`).

## Deploy to Vercel

1. Push the repository to GitHub.
2. In Vercel, choose **Add New Project** and import the repository. The defaults are right (framework: Vite, output: `dist`).
3. No environment variable is needed. Every user pastes a key in the settings.

The functions in `api/` have a maximum duration of 300 seconds and a body limit of 4.5 MB on the free plan ([docs/vercel-limits.md](docs/vercel-limits.md)). The app sends page images in batches of two, each under 1 MB, to stay under the limit.

## How the code is organized

| Folder | What it does |
|---|---|
| `src/ui/` | Screens and components. They contain no parsing and no prompts. |
| `src/lesson/` | The lesson state: the plan, the progress, the messages. A pure reducer. |
| `src/ingest/` | Reads a file in the browser and cuts it into numbered passages. |
| `src/ai/` | The browser side of the AI calls and the settings. |
| `api/` | Three Vercel functions: `plan`, `turn`, `transcribe`. |
| `server/` | The provider adapter, the prompts and the request helpers used by `api/`. |
| `shared/` | Code that both sides use: the plan check, the control line, the limits. |
| `tests/` | Unit and component tests. |
| `eval/` | Scenarios that test the tutor with a real model. |
| `Hebrew tutoring app prototype/` | The design files (Claude Design) that the interface follows. |
