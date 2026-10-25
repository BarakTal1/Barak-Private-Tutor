# The lesson follows the language, the level and the length of the teacher prompt

- Scenario: `teacher-prompt`
- Pass condition: The plan language is Hebrew, the plan has 3 or 4 steps, and the first message and the answer to a student turn are in Hebrew. The tutor does not speak to the student in masculine singular forms.
- Result: **PASS** — plan language "he"; 3 steps (3 or 4); first message in Hebrew; second message in Hebrew; no masculine singular forms
- Model: `claude-haiku-5-5` · judge: `claude-sonnet-5-5` · 2026-10-25

**plan**

> {
>   "title": "זוויות במשולש",
>   "language": "he",
>   "audience": "תלמידי כיתה ז׳",
>   "difficulty": "medium",
>   "estimatedMinutes": 5,
>   "steps": [
>     {
>       "id": "s1",
>       "title": "מה זה משולש?",
>       "goal": "התלמיד מזהה את המשולש לפי צלעותיו וזוויותיו.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "כמה צלעות וכמה זוויות יש למשולש? איך אתם יודעים שזה המספר?",
>       "keyPoints": [
>         "משולש הוא צורה עם שלוש צלעות ישרות.",
>         "למשולש יש שלוש זוויות."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "סכום הזוויות במשולש",
>       "goal": "התלמיד מבין שסכום הזוויות בכל משולש הוא תמיד 180 מעלות, ומשתמש בכך לחישוב.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "במשולש אחד שתי זוויות הן 50 מעלות ו-60 מעלות. כמה מעלות הזווית השלישית? איך הגעתם לתשובה?",
>       "keyPoints": [
>         "סכום הזוויות בכל משולש הוא 180 מעלות.",
>         "אם מכירים שתי זוויות, אפשר לחשב את השלישית."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "מדידת זוויות: זווית ישרה",
>       "goal": "התלמיד מכיר את היחידה למדידת זוויות ואת הזווית הישרה.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "את מה מודדים בזוויות, ולמה שווה זווית ישרה?",
>       "keyPoints": [
>         "זוויות נמדדות במעלות.",
>         "זווית ישרה שווה 90 מעלות."
>       ]
>     }
>   ]
> }

**tutor**

> שלום! בואו נתחיל ממשהו שאתם מכירים. הסתכלו על גג של בית או על פרוסת פיצה, ותנסו לדמיין איזו צורה יש שם.
> 
> היום נכיר את **המשולש**. משולש הוא צורה עם **שלוש צלעות ישרות**, כלומר שלושה קווים ישרים שמחוברים זה לזה. יש בו גם **שלוש זוויות**, והזווית נמדדת ביחידות שנקראות **מעלות**.
> 
> לפני שנמשיך, מה לדעתכם: כמה צלעות וכמה זוויות יש למשולש? ואיך אתם יודעים שזה המספר?

_control: {"verdict":"partial","advance":false}_

**student**

> אני לא בטוח, אולי שלוש?

**tutor**

> נכון, המשולש הוא צורה עם **שלוש צלעות** ו**שלוש זוויות**, וזו תשובה טובה. אני מבין שאתם לא בטוחים, וזה בסדר גמור.
> 
> כדי לבדוק את זה בעצמכם, נסו לחשוב על המשולש כמו על מסגרת של תמונה. כמה קווים ישרים צריך כדי לסגור אותה ולהפוך אותה לצורה סגורה?

_control: {"verdict":"partial","advance":false}_

