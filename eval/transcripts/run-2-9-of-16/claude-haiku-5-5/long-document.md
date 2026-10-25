# A long document gets a plan with valid sources, and the first answer starts fast

- Scenario: `long-document`
- Pass condition: The plan has at least 3 steps, every step has valid passage ids, the steps use at least 3 different passages, and the first word of the tutor comes in under 10 seconds.
- Result: **PASS** — 6 steps (at least 3); passage ids valid; 9 different passages used (at least 3); first word after 1728 ms (under 10000)
- Model: `claude-haiku-5-5` · judge: `claude-sonnet-5-5` · 2026-10-25

**plan**

> {
>   "title": "Why We Study Rivers, Mountains, and Other Topics",
>   "language": "English",
>   "audience": "8th grade students",
>   "difficulty": "medium",
>   "estimatedMinutes": 20,
>   "steps": [
>     {
>       "id": "s1",
>       "title": "Topics in the chapters",
>       "goal": "Identify the subject that each chapter is about.",
>       "passageIds": [
>         "p1",
>         "p2",
>         "p3"
>       ],
>       "checkQuestion": "What is the subject of Chapter 2, and what is the subject of Chapter 3?",
>       "keyPoints": [
>         "Each chapter has a title that names one subject, such as rivers, mountains, or trade.",
>         "The chapter title tells you the topic of the text that follows."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "Why the topics matter",
>       "goal": "Understand that these subjects shape daily life.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "According to the text, why are the rivers of region 1 important?",
>       "keyPoints": [
>         "The rivers of region 1 are important because they shape daily life.",
>         "Daily life means the everyday activities of people in a place."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "Why people study them",
>       "goal": "Explain the purpose of studying these subjects.",
>       "passageIds": [
>         "p1",
>         "p2"
>       ],
>       "checkQuestion": "What do people learn when they study rivers or mountains?",
>       "keyPoints": [
>         "People study these subjects to learn how communities grow.",
>         "The same purpose is given for every subject in the text."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "Same topic, different regions",
>       "goal": "Recognize that one topic can appear in several regions.",
>       "passageIds": [
>         "p1",
>         "p11",
>         "p21"
>       ],
>       "checkQuestion": "Which chapters are about rivers, and which regions do they describe?",
>       "keyPoints": [
>         "Chapters 1, 11, and 21 all cover rivers, each in a different region.",
>         "A topic can be studied in many places, so the region number matters."
>       ]
>     },
>     {
>       "id": "s5",
>       "title": "Topics that repeat across chapters",
>       "goal": "See the pattern of topics that repeat through the text.",
>       "passageIds": [
>         "p4",
>         "p14",
>         "p24"
>       ],
>       "checkQuestion": "What topic is covered in Chapters 4, 14, and 24?",
>       "keyPoints": [
>         "Energy appears in Chapters 4, 14, 24, 34, 44, and 54.",
>         "The text repeats a small set of topics across many regions."
>       ]
>     },
>     {
>       "id": "s6",
>       "title": "Apply the main idea",
>       "goal": "Apply the main idea of the text to one topic from the file.",
>       "passageIds": [
>         "p60"
>       ],
>       "checkQuestion": "Using the text, explain why people study metals in region 60.",
>       "keyPoints": [
>         "Metals in region 60 shape daily life, so people study them.",
>         "Studying metals helps people learn how communities grow."
>       ]
>     }
>   ]
> }

**tutor**

> Think about a book's title. Before you read, the title already tells you what the book is about. Chapters work the same way.
> 
> Look at **Chapter 1: rivers**. The title names one subject, rivers, and the text under it is about rivers.
> 
> Now you try. Look at the titles of Chapter 2 and Chapter 3. What is the subject of each one?

_control: {"verdict":"partial","advance":false}_

