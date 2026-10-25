# The lesson follows the language, the level and the length of the teacher prompt

- Scenario: `teacher-prompt`
- Pass condition: The plan language is Hebrew, the plan has 3 or 4 steps, and the first message and the answer to a student turn are in Hebrew. The tutor does not speak to the student in masculine singular forms.
- Result: **PASS** — plan language "he"; 3 steps (3 or 4); first message in Hebrew; second message in Hebrew; no masculine singular forms
- Model: `claude-haiku-5-5` · judge: `claude-sonnet-5-5` · 2026-10-25

**plan**

> {
>   "title": "זוויות המשולש",
>   "language": "he",
>   "audience": "תלמידי כיתה ז'",
>   "difficulty": "medium",
>   "estimatedMinutes": 5,
>   "steps": [
>     {
>       "id": "s1",
>       "title": "מהו משולש?",
>       "goal": "לזהות את המשולש כצורה עם שלוש צלעות ישרות ושלוש זוויות.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "כמה צלעות וכמה זוויות יש למשולש?",
>       "keyPoints": [
>         "משולש הוא צורה עם שלוש צלעות ישרות.",
>         "למשולש יש שלוש זוויות."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "מדידת זוויות במעלות",
>       "goal": "להבין שזוויות נמדדות במעלות ולהכיר את הזווית הישרה.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "כמה מעלות יש בזווית ישרה, ומה אנחנו מודדים בזוויות?",
>       "keyPoints": [
>         "זווית נמדדת במעלות.",
>         "זווית ישרה היא 90 מעלות."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "סכום הזוויות במשולש",
>       "goal": "להבין שסכום הזוויות בכל משולש הוא תמיד 180 מעלות, בלי קשר לגודלו.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "אם שתי זוויות במשולש הן 60 ו-70 מעלות, מה גודל הזווית השלישית? ומה קורה לסכום אם המשולש גדול יותר?",
>       "keyPoints": [
>         "סכום הזוויות בכל משולש הוא 180 מעלות.",
>         "זה נכון לכל משולש, גדול או קטן."
>       ]
>     }
>   ]
> }

**tutor**

> שלום! היום נכיר את **המשולש**. לפני שנתחיל, נסו לחשוב: אילו צורות מוכרות לכם מהחיים, שיש להן צלעות וזוויות?
> 
> נסו לשרטט בראש משולש, או לחשוב על משולש שראיתם, למשל במשחק, בגג בית או בשלט תנועה. מה אתם חושבים שמיוחד בצורה הזו?

_control: {"verdict":"partial","advance":false}_

**student**

> אני לא בטוח, אולי שלוש?

**tutor**

> המספר שלוש הוא רמז טוב, ואתם על הדרך הנכונה! נסו לדמיין משולש: שלוש של מה? ספרו את **הקווים הישרים** שמרכיבים אותו, ואחר כך ספרו את **הפינות** שבהן שני קווים נפגשים. מה מצאתם?

_control: {"verdict":"partial","advance":false}_

