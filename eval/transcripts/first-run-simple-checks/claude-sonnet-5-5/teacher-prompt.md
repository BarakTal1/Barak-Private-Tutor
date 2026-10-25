# The lesson follows the language, the level and the length of the teacher prompt

- Scenario: `teacher-prompt`
- Pass condition: The plan language is Hebrew, the plan has 3 or 4 steps, and the first tutor message is in Hebrew.
- Result: **PASS** — Language "he", 3 steps, Hebrew text: true.
- Model: `claude-sonnet-5-5` · 2026-10-25

**plan**

> {
>   "title": "זוויות במשולש",
>   "language": "he",
>   "audience": "תלמידי כיתה ז'",
>   "difficulty": "medium",
>   "estimatedMinutes": 5,
>   "steps": [
>     {
>       "id": "s1",
>       "title": "מהו משולש?",
>       "goal": "התלמידים מבינים שמשולש הוא צורה עם שלוש צלעות ישרות ושלוש זוויות.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "מה לדעתך יקרה לצורה אם נסיר ממנה אחת מהצלעות הישרות? האם עדיין יהיה לנו משולש, ולמה?",
>       "keyPoints": [
>         "למשולש יש שלוש צלעות ישרות.",
>         "למשולש יש שלוש זוויות."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "מדידת זוויות במעלות",
>       "goal": "התלמידים מבינים שזווית נמדדת במעלות ושזווית ישרה היא 90 מעלות.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "באיזו יחידה מודדים זווית, וכמה מעלות יש בזווית ישרה?",
>       "keyPoints": [
>         "זווית נמדדת במעלות.",
>         "זווית ישרה שווה ל-90 מעלות."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "סכום הזוויות במשולש",
>       "goal": "התלמידים מבינים שסכום הזוויות בכל משולש הוא תמיד 180 מעלות, בלי קשר לגודל המשולש.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "אם במשולש אחד שתי זוויות הן 60 ו-70 מעלות, כמה מעלות תהיה הזווית השלישית, ואיך ידעת? האם התשובה הייתה משתנה אילו המשולש היה גדול יותר?",
>       "keyPoints": [
>         "סכום הזוויות בכל משולש הוא 180 מעלות.",
>         "זה נכון לכל משולש, גדול או קטן."
>       ]
>     }
>   ]
> }

**tutor**

> היי, אני ברק, ואני שמח ללמוד איתך היום על זוויות במשולש. 🙂
> 
> נתחיל במשהו שאתה כבר מכיר: משולש. אם תצייר אחד על דף, איך הוא נראה? ספר לי במילים שלך מה יש בו.

_control: {"verdict":"partial","advance":false}_

