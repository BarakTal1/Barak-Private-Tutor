# The lesson follows the language, the level and the length of the teacher prompt

- Scenario: `teacher-prompt`
- Pass condition: The plan language is Hebrew, the plan has 3 or 4 steps, and the first message and the answer to a student turn are in Hebrew. The tutor does not speak to the student in masculine singular forms.
- Result: **FAIL** — Failed: no masculine singular forms
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
>       "goal": "להבין שמשולש הוא צורה עם שלוש צלעות ישרות ושלוש זוויות.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "כמה צלעות וכמה זוויות יש למשולש?",
>       "keyPoints": [
>         "משולש הוא צורה עם שלוש צלעות ישרות.",
>         "לכל משולש יש שלוש זוויות."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "סכום הזוויות במשולש",
>       "goal": "להבין שסכום שלוש הזוויות של כל משולש הוא תמיד 180 מעלות, גם אם המשולש גדול או קטן.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "אם שתי זוויות במשולש הן 60 מעלות ו-70 מעלות, מה גודל הזווית השלישית? ואיך ידעת?",
>       "keyPoints": [
>         "סכום הזוויות בכל משולש הוא תמיד 180 מעלות.",
>         "זה נכון לכל משולש, גדול או קטן."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "מעלות וזווית ישרה",
>       "goal": "להבין שזווית נמדדת במעלות, ושזווית ישרה היא 90 מעלות.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "מה גודל זווית ישרה, ולמה היא חשובה כשמחשבים זוויות במשולש?",
>       "keyPoints": [
>         "זווית נמדדת במעלות.",
>         "זווית ישרה היא 90 מעלות."
>       ]
>     }
>   ]
> }

**tutor**

> שלום! בוא נתחיל בדבר פשוט: אם תחשוב על **גג של בית** או על **תמרור משולש** בכביש, איך הצורה נראית?
> 
> משולש הוא צורה עם **שלוש צלעות ישרות**. צלע היא קו ישר שגובל את הצורה. בכל פינה שבה שתי צלעות נפגשות יש **זווית**, ולכן במשולש יש גם שלוש זוויות.
> 
> עכשיו נסה בעצמך: כמה צלעות וכמה זוויות יש למשולש?

_control: {"verdict":"partial","advance":false}_

**student**

> אני לא בטוח, אולי שלוש?

**tutor**

> נכון לחלוטין שיש שלוש צלעות, ואתה צודק. מה גרם לך לחשוב על "שלוש" כבר בהתחלה?
> 
> עכשיו השאלה השנייה: האם אתה חושב שמספר הזוויות שווה למספר הצלעות? נסה לנמק במילים שלך, למה כך או אחרת.

_control: {"verdict":"partial","advance":false}_

