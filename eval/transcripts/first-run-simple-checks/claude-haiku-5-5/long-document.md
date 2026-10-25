# A long document gets a plan with valid sources, and the first answer starts fast

- Scenario: `long-document`
- Pass condition: The plan has at least 3 steps, every step has valid passage ids, and the first word of the tutor comes in under 10 seconds.
- Result: **PASS** — 60 passages, 6 steps, ids valid, first word after 531 ms.
- Model: `claude-haiku-5-5` · 2026-10-25

**plan**

> {
>   "title": "Chapters That Shape Daily Life",
>   "language": "English",
>   "audience": "8th graders",
>   "difficulty": "medium",
>   "estimatedMinutes": 20,
>   "steps": [
>     {
>       "id": "s1",
>       "title": "Why rivers matter",
>       "goal": "Find the main idea of Chapter 1 and explain why rivers are important.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "According to the passage, why are the rivers of region 1 important?",
>       "keyPoints": [
>         "The rivers of region 1 are important because they shape daily life.",
>         "The chapter says rivers matter for everyday life in the region."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "What studying mountains teaches",
>       "goal": "Understand that people study a topic to learn how communities grow.",
>       "passageIds": [
>         "p2"
>       ],
>       "checkQuestion": "What do people learn by studying mountains, according to Chapter 2?",
>       "keyPoints": [
>         "People study mountains to learn how communities grow.",
>         "The study of a topic can show how communities develop."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "Finding the pattern",
>       "goal": "Notice that the chapters follow the same pattern: a topic, its importance, and why people study it.",
>       "passageIds": [
>         "p1",
>         "p2",
>         "p3"
>       ],
>       "checkQuestion": "What do Chapters 1, 2, and 3 have in common?",
>       "keyPoints": [
>         "Each chapter names a topic and says it shapes daily life.",
>         "Each chapter says people study that topic to learn how communities grow."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "Trade and energy",
>       "goal": "Identify the topic of a chapter and apply the same pattern to new topics.",
>       "passageIds": [
>         "p3",
>         "p4"
>       ],
>       "checkQuestion": "What topic is Chapter 4 about, and why do people study it?",
>       "keyPoints": [
>         "Chapter 4 is about energy.",
>         "People study energy to learn how communities grow."
>       ]
>     },
>     {
>       "id": "s5",
>       "title": "Plants and cities",
>       "goal": "Connect the study of plants and cities to community growth.",
>       "passageIds": [
>         "p5",
>         "p6"
>       ],
>       "checkQuestion": "Why do people study cities, according to Chapter 6?",
>       "keyPoints": [
>         "People study cities to learn how communities grow.",
>         "Plants and cities both shape daily life in their regions."
>       ]
>     },
>     {
>       "id": "s6",
>       "title": "Review: maps and metals",
>       "goal": "Use the pattern to explain a topic in a new chapter and summarize the lesson.",
>       "passageIds": [
>         "p9",
>         "p10"
>       ],
>       "checkQuestion": "Using what you learned, what do people learn by studying maps?",
>       "keyPoints": [
>         "Maps shape daily life in their region, according to Chapter 9.",
>         "Studying a topic like maps helps people learn how communities grow."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! Welcome to Chapter 1 of our lesson. Let's start with a quick thought: think about a river near a town or city you know, or one you have seen in a picture. What do people use it for?
> 
> The main idea of this chapter is that **the rivers of region 1 shape daily life**. "Shape" means they influence how people live from day to day. The chapter also says people study rivers to learn how communities grow.
> 
> Now it's your turn. According to the passage, why are the rivers of region 1 important?

_control: {"verdict":"partial","advance":false}_

