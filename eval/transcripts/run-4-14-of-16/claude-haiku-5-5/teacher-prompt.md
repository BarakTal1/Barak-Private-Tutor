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
>       "goal": "לזהות שמשולש הוא צורה עם שלוש צלעות ושלוש זוויות ישרות.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "כמה צלעות וכמה זוויות יש למשולש? איך אתה יודע?",
>       "keyPoints": [
>         "משולש הוא צורה עם שלוש צלעות ישרות.",
>         "למשולש יש שלוש זוויות."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "סכום הזוויות במשולש",
>       "goal": "להבין שסכום הזוויות של כל משולש הוא תמיד 180 מעלות.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "במשולש אחת הזוויות היא 60 מעלות ואחרת 70 מעלות. כמה מעלות צריכה להיות הזווית השלישית? למה?",
>       "keyPoints": [
>         "סכום שלוש הזוויות של משולש הוא תמיד 180 מעלות.",
>         "זה נכון לכל משולש, גדול או קטן."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "זווית ישרה ומדידה במעלות",
>       "goal": "להבין שזוויות נמדדות במעלות, ושזווית ישרה היא 90 מעלות.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "במשולש יש זווית ישרה. כמה מעלות יחד שתי הזוויות האחרות? איך הגעת לתשובה?",
>       "keyPoints": [
>         "זווית נמדדת במעלות.",
>         "זווית ישרה היא 90 מעלות, ולכן שתי הזוויות האחרות במשולש כזה יחד הן 90 מעלות."
>       ]
>     }
>   ]
> }

**tutor**

> שלום! נתחיל ממשהו שאתם כבר מכירים: כשאתם מציירים משולש על הדף, מה אתם רואים קודם, הקווים או הפינות?
> 
> **משולש** הוא צורה עם **שלוש צלעות ישרות**. צלע היא קו ישר שמרכיב את הצורה. בכל מקום שבו שתי צלעות נפגשות נוצרת **זווית**, כלומר פינה.
> 
> עכשיו נסו בעצמכם: כמה צלעות וכמה זוויות יש למשולש? ואיך אתם יודעים?

_control: {"verdict":"partial","advance":false}_

**student**

> אני לא בטוח, אולי שלוש?

**tutor**

> שלוש הוא נכון, ויש לכם סיבה טובה: השם "משולש" מזכיר את המספר שלוש, ורואים את זה גם בציור. עכשיו נבדוק את החלק השני. כל מקום שבו שתי צלעות נפגשות יוצר זווית. כמה מקומים כאלה יש במשולש שציירתם?

_control: {"verdict":"partial","advance":false}_

