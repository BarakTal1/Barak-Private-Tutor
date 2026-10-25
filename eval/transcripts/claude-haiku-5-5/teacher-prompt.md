# The lesson follows the language, the level and the length of the teacher prompt

- Scenario: `teacher-prompt`
- Pass condition: The plan language is Hebrew, the plan has 3 or 4 steps, and the first message and the answer to a student turn are in Hebrew. The tutor does not speak to the student in masculine singular forms.
- Result: **PASS** — plan language "he"; 3 steps (3 or 4); first message in Hebrew; second message in Hebrew; no masculine singular forms
- Model: `claude-haiku-5-5` · judge: `claude-sonnet-5-5` · 2026-10-25

**plan**

> {
>   "title": "זוויות של משולש",
>   "language": "he",
>   "audience": "תלמידי כיתה ז׳",
>   "difficulty": "medium",
>   "estimatedMinutes": 5,
>   "steps": [
>     {
>       "id": "s1",
>       "title": "מה זה משולש?",
>       "goal": "התלמיד יזהה מהו משולש ואילו חלקים יש לו.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "אם יש לנו צורה עם שלוש צלעות ישרות בלבד, כמה זוויות יש לה, ומדוע?",
>       "keyPoints": [
>         "משולש הוא צורה עם שלוש צלעות ישרות ושלוש זוויות.",
>         "כל משולש מוגדר לפי שלוש הצלעות הישרות שלו."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "סכום הזוויות במשולש",
>       "goal": "התלמיד יבין שסכום הזוויות בכל משולש הוא קבוע.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "אם שתי זוויות של משולש הן 50 ו-60 מעלות, מה צריכה להיות הזווית השלישית? איך הגעת לתשובה?",
>       "keyPoints": [
>         "סכום שלוש הזוויות בכל משולש הוא תמיד 180 מעלות.",
>         "זה נכון לכל משולש, גדול או קטן."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "מעלות וזווית ישרה",
>       "goal": "התלמיד יבין איך מודדים זוויות ומה זו זווית ישרה.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "מה המידה של זווית ישרה, ומה נובע מכך לגבי זוויות שסכומן 180 מעלות?",
>       "keyPoints": [
>         "זווית נמדדת במעלות.",
>         "זווית ישרה היא 90 מעלות."
>       ]
>     }
>   ]
> }

**tutor**

> שלום! היום נלמד מה זה משולש. נתחיל ממשהו שאתם מכירים: כשאתם מציירים משולש בדף, איזה חלקים אתם רואים בו?

_control: {"verdict":"partial","advance":false}_

**student**

> אני לא בטוח, אולי שלוש?

**tutor**

> שלוש זו בדיוק הכמות הנכונה, והמספר שאתם זוכרים נכון. עכשיו נסו לחשוב: שלוש **מה**? תארו לעצמכם את הקווים הישרים שמקיפים את הצורה, ואת הפינות שבהן הם נפגשים. איזה מהם שניהם, ובאיזו כמות?

_control: {"verdict":"partial","advance":false}_

