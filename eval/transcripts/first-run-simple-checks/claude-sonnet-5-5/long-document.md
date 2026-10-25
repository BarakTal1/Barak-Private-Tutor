# A long document gets a plan with valid sources, and the first answer starts fast

- Scenario: `long-document`
- Pass condition: The plan has at least 3 steps, every step has valid passage ids, and the first word of the tutor comes in under 10 seconds.
- Result: **PASS** — 60 passages, 6 steps, ids valid, first word after 1010 ms.
- Model: `claude-sonnet-5-5` · 2026-10-25

**plan**

> {
>   "title": "How Geography and Daily Life Shape Communities",
>   "language": "English",
>   "audience": "8th grade students",
>   "difficulty": "medium",
>   "estimatedMinutes": 20,
>   "steps": [
>     {
>       "id": "s1",
>       "title": "The Big Idea: Why Study Things Like Rivers?",
>       "goal": "Understand the main message that every chapter shares: these topics shape daily life, and people study them to learn how communities grow.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "According to the chapter on rivers, why do people study rivers?",
>       "keyPoints": [
>         "Rivers shape daily life in a region.",
>         "People study rivers to learn how communities grow."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "Mountains Shape Daily Life",
>       "goal": "See that the same idea applies to a landform: mountains.",
>       "passageIds": [
>         "p2"
>       ],
>       "checkQuestion": "How does the chapter on mountains explain why mountains are important?",
>       "keyPoints": [
>         "Mountains shape daily life in their region.",
>         "Studying mountains helps explain how communities grow."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "Trade and Energy",
>       "goal": "Apply the idea to human activities and resources, such as trade and energy.",
>       "passageIds": [
>         "p3",
>         "p4"
>       ],
>       "checkQuestion": "What do the chapters on trade and energy say about how they connect to communities?",
>       "keyPoints": [
>         "Trade and energy both shape daily life.",
>         "People study them to learn how communities grow."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "Plants and Cities",
>       "goal": "Compare a natural topic (plants) with a human-made one (cities) and notice they play the same role.",
>       "passageIds": [
>         "p5",
>         "p6"
>       ],
>       "checkQuestion": "What do plants and cities have in common in how the chapters describe them?",
>       "keyPoints": [
>         "Both plants and cities shape daily life.",
>         "Natural and human-made topics can both help us understand community growth."
>       ]
>     },
>     {
>       "id": "s5",
>       "title": "Music, Ships and Maps",
>       "goal": "Understand that culture and tools, such as music, ships and maps, are also studied to learn how communities grow.",
>       "passageIds": [
>         "p7",
>         "p8",
>         "p9"
>       ],
>       "checkQuestion": "Pick one of music, ships or maps. What does the chapter say about why people study it?",
>       "keyPoints": [
>         "Music, ships and maps all shape daily life.",
>         "People study each of them to learn how communities grow."
>       ]
>     },
>     {
>       "id": "s6",
>       "title": "Putting It Together: Patterns Across Regions",
>       "goal": "Recognize the repeating pattern across chapters and regions, including metals, and sum up the lesson.",
>       "passageIds": [
>         "p10",
>         "p11",
>         "p12"
>       ],
>       "checkQuestion": "Looking at metals and the repeated chapters on rivers and mountains for other regions, what pattern do you notice, and what is the shared message?",
>       "keyPoints": [
>         "The chapters repeat across different regions (for example, region 10, 11 and 12).",
>         "Each topic shapes daily life, and studying it helps us learn how communities grow."
>       ]
>     }
>   ]
> }

**tutor**

> Hi, I'm Barak, and I'm glad to learn with you today. Let's start with a simple question: think about where you live. Is there a river, a lake, or a big road nearby that changes how people go about their day?
> 
> Our first chapter is about rivers. It says that the rivers of region 1 are important because they **shape daily life**, and that people study rivers to learn how communities grow.
> 
> So before we go on, what do you think? How could a river change what people do each day?

_control: {"verdict":"partial","advance":false}_

