# A long document gets a plan with valid sources, and the first answer starts fast

- Scenario: `long-document`
- Pass condition: The plan has at least 3 steps, every step has valid passage ids, the steps use at least 3 different passages, and the first word of the tutor comes in under 10 seconds.
- Result: **PASS** — 6 steps (at least 3); passage ids valid; 11 different passages used (at least 3); first word after 4468 ms (under 10000)
- Model: `claude-haiku-5-5` · judge: `claude-sonnet-5-5` · 2026-10-25

**plan**

> {
>   "title": "How Regions Shape Daily Life",
>   "language": "English",
>   "audience": "8th grade students",
>   "difficulty": "medium",
>   "estimatedMinutes": 15,
>   "steps": [
>     {
>       "id": "s1",
>       "title": "What the chapters are about",
>       "goal": "Identify the topic and region named in a chapter title.",
>       "passageIds": [
>         "p1",
>         "p2",
>         "p3"
>       ],
>       "checkQuestion": "What is the topic and the region in Chapter 2?",
>       "keyPoints": [
>         "Each chapter has a number, a topic, and a region.",
>         "Chapter 2 is about mountains in region 2."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "Topics shape daily life",
>       "goal": "Understand that the file says these topics are important because they shape daily life.",
>       "passageIds": [
>         "p1",
>         "p2"
>       ],
>       "checkQuestion": "According to the chapter text, why are the rivers of region 1 important?",
>       "keyPoints": [
>         "The text says the topic is important because it shapes daily life.",
>         "This idea is repeated in every chapter."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "Why people study these topics",
>       "goal": "Understand that people study these topics to learn how communities grow.",
>       "passageIds": [
>         "p1",
>         "p4"
>       ],
>       "checkQuestion": "Why do people study energy, according to Chapter 4?",
>       "keyPoints": [
>         "People study these topics to learn how communities grow.",
>         "The purpose of the study is to understand communities."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "Same topic, different regions",
>       "goal": "Notice that one topic appears again in later chapters with a different region number.",
>       "passageIds": [
>         "p1",
>         "p11",
>         "p21"
>       ],
>       "checkQuestion": "Which chapters besides Chapter 1 are about rivers?",
>       "keyPoints": [
>         "The topics repeat across the chapters.",
>         "Each repeat names a different region."
>       ]
>     },
>     {
>       "id": "s5",
>       "title": "Regions and their topics",
>       "goal": "Connect a region number with its topic in several chapters.",
>       "passageIds": [
>         "p5",
>         "p15",
>         "p25"
>       ],
>       "checkQuestion": "What topic is covered in Chapter 15, and in which region?",
>       "keyPoints": [
>         "Chapters 5, 15 and 25 are all about plants.",
>         "The region number changes with each chapter."
>       ]
>     },
>     {
>       "id": "s6",
>       "title": "Putting it together",
>       "goal": "Explain the main message of the file in your own words.",
>       "passageIds": [
>         "p10",
>         "p60"
>       ],
>       "checkQuestion": "In your own words, what do the chapters teach us about regions and communities?",
>       "keyPoints": [
>         "Topics such as metals or cities shape daily life in each region.",
>         "Studying them helps us learn how communities grow."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! Let's start with how the chapters in this lesson are set up. Each chapter has a **number**, a **topic**, and a **region**. For example, "Chapter 2: mountains" gives the number and the topic, and the text inside says "the mountains of region 2," so the region is part of the chapter too.
> 
> Look at Chapter 2 in the file. What is its topic, and what is its region?

_control: {"verdict":"partial","advance":false}_

