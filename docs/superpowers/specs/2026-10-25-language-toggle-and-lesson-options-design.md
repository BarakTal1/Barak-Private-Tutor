# Language toggle and lesson options: design

Date: 2026-10-25. Status: waiting for approval.

## Intent

The app is Hebrew only. A teacher who works in English cannot use it, and a Hebrew teacher cannot easily say how long, how hard and in which language a lesson should be. Two changes fix this:

1. A Hebrew/English toggle for the whole app. The lesson language follows it by default.
2. Three button rows in the "איך ללמד" step (lesson length, difficulty, lesson language). The free text box stays, for extra requests.

The reason: the teacher should set the common choices with one tap and use the text box only for special wishes.

## Goals

- One toggle switches the whole interface between Hebrew (right to left) and English (left to right). It covers every screen, error, warning, praise phrase, button label and the example prompt.
- The page direction and language (`dir` and `lang` on the document) follow the toggle.
- The lesson language defaults to the app language. The teacher can change it with the language row or by writing it in the text box.
- The "איך ללמד" step shows three rows of buttons, then the text box (see the mockup in `.superpowers/brainstorm/*/content/how-to-teach.html`):

| Row | Choices | Default |
|---|---|---|
| Lesson length | 5, 10, 15, 30 minutes | 15 |
| Difficulty | Easy, Medium, Challenging | Medium |
| Lesson language | Hebrew, English | The app language |

- The buttons are separate settings. They do not write into the text box. The plan request carries them as structured fields, and the server turns them into lines of the prompt.
- If the text box says something that conflicts with a button (for example "30 minutes" with the 15 button), the text box wins. This matches the current rule that reads minutes from the text.
- The length sets the number of steps, as it does today (`stepCountFor`).
- The difficulty reaches the planner and the tutor, so the questions, the examples and the hints match it.
- Everything stays optional. A teacher who touches nothing gets the defaults.

## Non-goals

- Other languages (Arabic, Russian). The structure should make a third language a matter of adding one dictionary, but I do not build one now.
- Translating the teacher's file. The tutor teaches in the lesson language from the file as it is.
- Accounts, or saving the button values between visits.
- Translating the tutor system prompt. It is English already and takes the lesson language from the plan.

## Anti-goals

- A screen with mixed Hebrew and English interface text after a switch.
- Broken right-to-left or left-to-right layout. The existing test that enforces logical CSS properties must keep passing.
- The buttons and the text box giving the model two different lengths or languages without a rule.

## Constraints

- About 31 source files and the tests import the Hebrew strings today (`src/ui/he.js`). The 631 existing tests must pass, adjusted only where the way to get a string changes.
- Hebrew text stays gender-neutral (plural and infinitive forms). English text is plain and short.
- The tutor keeps its name "Barak" in both languages.
- Both dictionaries must have the same keys. A test checks this.
- The mockup is the target for the layout: the three rows sit above the text box, the toggle sits in the top bar next to Settings.

## Decisions made with the user

- Buttons plus a free text box for extra requests.
- The toggle changes the whole app and the default lesson language.
- Three button rows: time, difficulty, language.

## My calls (check these)

- The first language is the saved choice. With none saved, it is Hebrew when the browser language is Hebrew, and English otherwise.
- The toggle is saved in the browser. The three button rows are not saved.
- Length choices are 5, 10, 15 and 30 minutes. Difficulty names are Easy, Medium and Challenging.
- The toggle is in the top bar of the setup screen and in the settings panel. The lesson, report and complete screens do not need their own toggle.
- A switch during a lesson changes the interface only. The lesson keeps its own language.
- A lesson saved before this change opens as before. If it has no difficulty, the tutor uses Medium.
- The example prompt ("נסו דוגמה") changes with the app language.
- README and DECISIONS get a short note.

## Answers from the review (my calls, check these)

- **Lesson language when the file is in the other language.** The lesson language wins, as the user asked: "if English is selected the lesson is in English by default unless stated otherwise". A Hebrew file with the English toggle gives an English lesson. The planner and the tutor teach the ideas of the file in the lesson language. The passages in the Source view stay in the original language. The plan prompt and the tutor prompt need an explicit rule for this.
- **The language row and the toggle.** The row has two states: untouched and chosen. While it is untouched it follows the toggle. After the teacher taps a language it keeps that value, even if the toggle changes later. The language of the teacher's text box still wins over both.
- **Text box wins.** The server keeps its regex for minutes only. For difficulty and language, the prompt tells the model that the teacher text overrides the button lines. The server does not parse more words.
- **Where difficulty lives.** It is a field of the plan (`difficulty`: easy, medium or challenging). The plan API returns it and `validatePlan` checks it. It is saved with the lesson, and the tutor turn reads it from the plan, as it reads `language` and `audience`. A saved plan without it means medium.
- **Step count.** The page always sends the length, so the default is 15 minutes and `stepCountFor` gives 8 steps. The old default of 6 steps is for a request with no minutes at all (the API stays that way). Tests that assume 6 steps from the page are updated.
- **Labels from the file reader.** Page labels such as "עמוד 3" are data that the reader makes when the file is read. They follow the app language at that moment and are not changed later. Texts of the report screen, errors and warnings are interface text and follow the toggle.
- **Praise phrases.** They are interface text only. Nothing parses them. The tutor's own praise is written by the model in the lesson language.

## Left to the builder

- How the interface gets its strings (a provider with a hook, a context, a proxy over the old `he` object) and how to keep the tests simple.
- The file layout of the two dictionaries.
- The exact lines that the server adds to the plan prompt and to the tutor turn for length, difficulty and language.
- How the plan API carries the new fields, and the validation of them.
- Which tests to add. At least: dictionary parity, direction and `lang` on the document, the three rows and their defaults, text beats button, language default follows the toggle, and a plan request that carries the fields.
