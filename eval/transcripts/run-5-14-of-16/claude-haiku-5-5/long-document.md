# A long document gets a plan with valid sources, and the first answer starts fast

- Scenario: `long-document`
- Pass condition: The plan has at least 3 steps, every step has valid passage ids, the steps use at least 3 different passages, and the first word of the tutor comes in under 10 seconds.
- Result: **PASS** — 6 steps (at least 3); passage ids valid; 11 different passages used (at least 3); first word after 620 ms (under 10000)
- Model: `claude-haiku-5-5` · judge: `claude-sonnet-5-5` · 2026-10-25

**plan**

> {
>   "title": "Why Rivers, Mountains and Other Topics Matter",
>   "language": "English",
>   "audience": "8th grade students",
>   "difficulty": "medium",
>   "estimatedMinutes": 15,
>   "steps": [
>     {
>       "id": "s1",
>       "title": "Topics shape daily life",
>       "goal": "Understand that the topics in the file are important because they shape daily life.",
>       "passageIds": [
>         "p1",
>         "p2"
>       ],
>       "checkQuestion": "According to the passage, why are the rivers of region 1 important?",
>       "keyPoints": [
>         "The passage says rivers are important because they shape daily life.",
>         "The same reason is given for mountains in region 2."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "Studying topics to learn about communities",
>       "goal": "Understand that people study these topics to learn how communities grow.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "What do people learn by studying rivers, according to the passage?",
>       "keyPoints": [
>         "People study rivers to learn how communities grow.",
>         "The study of a topic helps us understand communities."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "The same idea in different chapters",
>       "goal": "Compare chapters about mountains and trade and notice the shared message.",
>       "passageIds": [
>         "p2",
>         "p3"
>       ],
>       "checkQuestion": "What idea appears in both the chapter about mountains and the chapter about trade?",
>       "keyPoints": [
>         "Both chapters say the topic shapes daily life.",
>         "Both chapters say people study the topic to learn how communities grow."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "Energy, plants and cities",
>       "goal": "Apply the same pattern to new topics: energy, plants and cities.",
>       "passageIds": [
>         "p4",
>         "p5",
>         "p6"
>       ],
>       "checkQuestion": "Choose one topic from energy, plants or cities and explain how the passage says it matters.",
>       "keyPoints": [
>         "Energy, plants and cities are each described as shaping daily life.",
>         "Each topic is studied to learn how communities grow."
>       ]
>     },
>     {
>       "id": "s5",
>       "title": "What changes and what stays the same",
>       "goal": "Notice that the region number and topic change, while the main message stays the same.",
>       "passageIds": [
>         "p7",
>         "p8",
>         "p9"
>       ],
>       "checkQuestion": "What changes from chapter to chapter, and what stays the same?",
>       "keyPoints": [
>         "The topic and region number change from chapter to chapter.",
>         "The sentence about shaping daily life and studying communities stays the same."
>       ]
>     },
>     {
>       "id": "s6",
>       "title": "Putting it together",
>       "goal": "Explain in your own words why the file says a topic like metals is important.",
>       "passageIds": [
>         "p10",
>         "p60"
>       ],
>       "checkQuestion": "In your own words, explain why people study metals according to the passage.",
>       "keyPoints": [
>         "Metals are important because they shape daily life.",
>         "People study metals to learn how communities grow."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! Let's start with a question about rivers. Think about your own day: do you use water from a tap, walk near a river, or eat food that grew near water? Those things are part of daily life.
> 
> Now, here is the idea for this step. The file says that **the rivers of region 1 are important because they shape daily life**. It also says that people study rivers to learn how communities grow.
> 
> Here is my question for you, in your own words: according to the passage, why are the rivers of region 1 important?

_control: {"verdict":"partial","advance":false}_

