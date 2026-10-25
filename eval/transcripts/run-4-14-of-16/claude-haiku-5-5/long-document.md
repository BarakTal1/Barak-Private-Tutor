# A long document gets a plan with valid sources, and the first answer starts fast

- Scenario: `long-document`
- Pass condition: The plan has at least 3 steps, every step has valid passage ids, the steps use at least 3 different passages, and the first word of the tutor comes in under 10 seconds.
- Result: **PASS** — 6 steps (at least 3); passage ids valid; 17 different passages used (at least 3); first word after 3109 ms (under 10000)
- Model: `claude-haiku-5-5` · judge: `claude-sonnet-5-5` · 2026-10-25

**plan**

> {
>   "title": "Chapters on Rivers, Mountains, and Other Topics: How Communities Grow",
>   "language": "English",
>   "audience": "8th grade students",
>   "difficulty": "medium",
>   "estimatedMinutes": 20,
>   "steps": [
>     {
>       "id": "s1",
>       "title": "Meet the topics",
>       "goal": "Find the topic of each chapter and notice that the chapters name different things to study.",
>       "passageIds": [
>         "p1",
>         "p2",
>         "p3",
>         "p4",
>         "p5",
>         "p6",
>         "p7",
>         "p8",
>         "p9",
>         "p10"
>       ],
>       "checkQuestion": "What is the topic of Chapter 2, and what is the topic of Chapter 5?",
>       "keyPoints": [
>         "Each chapter has a title that names one topic, such as rivers, mountains, or trade.",
>         "The first ten chapters cover ten different topics."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "Why these topics matter",
>       "goal": "Understand that the file says these topics shape daily life.",
>       "passageIds": [
>         "p1",
>         "p2"
>       ],
>       "checkQuestion": "According to the chapter, why are the rivers of region 1 important?",
>       "keyPoints": [
>         "The file says the topics are important because they shape daily life.",
>         "Daily life means the everyday things that people do in their communities."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "Why people study them",
>       "goal": "Understand that people study these topics to learn how communities grow.",
>       "passageIds": [
>         "p3",
>         "p6"
>       ],
>       "checkQuestion": "Why do people study trade, according to the passage?",
>       "keyPoints": [
>         "People study these topics to learn how communities grow.",
>         "The same reason is given for every topic in the file."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "Topics return in new regions",
>       "goal": "See that the same topic can appear again in a different chapter and region.",
>       "passageIds": [
>         "p1",
>         "p11",
>         "p21"
>       ],
>       "checkQuestion": "Which chapters are about rivers, and which regions do they describe?",
>       "keyPoints": [
>         "The topic rivers appears in Chapters 1, 11, and 21, each about a different region.",
>         "A topic can repeat with a new region number."
>       ]
>     },
>     {
>       "id": "s5",
>       "title": "The topics keep repeating",
>       "goal": "Notice the pattern of topics across all sixty chapters.",
>       "passageIds": [
>         "p31",
>         "p41",
>         "p51"
>       ],
>       "checkQuestion": "Which topic is in Chapter 41, and which region does it describe?",
>       "keyPoints": [
>         "The list of topics repeats in the same order over the whole file.",
>         "Chapters 31, 41, and 51 each give a new region for a topic already seen."
>       ]
>     },
>     {
>       "id": "s6",
>       "title": "Putting it together",
>       "goal": "Explain in your own words what the file teaches about topics and communities.",
>       "passageIds": [
>         "p57",
>         "p60"
>       ],
>       "checkQuestion": "In your own words, what do the chapters teach about topics like music or metals and communities?",
>       "keyPoints": [
>         "Topics such as music and metals shape daily life.",
>         "People study these topics to understand how communities grow."
>       ]
>     }
>   ]
> }

**tutor**

> Hi, I'm Barak. Think about a school textbook: each chapter has a title that tells you what it is about. For example, a chapter called "Rivers" studies rivers. In this lesson, each chapter's title names one topic to study.
> 
> Look at the chapter titles in the file. Then tell me:
> 
> **What is the topic of Chapter 2, and what is the topic of Chapter 5?**

_control: {"verdict":"partial","advance":false}_

