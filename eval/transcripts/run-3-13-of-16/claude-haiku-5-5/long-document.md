# A long document gets a plan with valid sources, and the first answer starts fast

- Scenario: `long-document`
- Pass condition: The plan has at least 3 steps, every step has valid passage ids, the steps use at least 3 different passages, and the first word of the tutor comes in under 10 seconds.
- Result: **PASS** — 6 steps (at least 3); passage ids valid; 7 different passages used (at least 3); first word after 2840 ms (under 10000)
- Model: `claude-haiku-5-5` · judge: `claude-sonnet-5-5` · 2026-10-25

**plan**

> {
>   "title": "Chapters on Regions and Daily Life",
>   "language": "English",
>   "audience": "8th graders",
>   "difficulty": "medium",
>   "estimatedMinutes": 15,
>   "steps": [
>     {
>       "id": "s1",
>       "title": "Each chapter has a topic",
>       "goal": "Find the topic of a chapter from its title.",
>       "passageIds": [
>         "p1",
>         "p2"
>       ],
>       "checkQuestion": "What is the topic of Chapter 2, and which region does it describe?",
>       "keyPoints": [
>         "Each chapter has a number and a title.",
>         "The title names one topic, such as rivers or mountains, and the text names one region."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "Topics repeat across chapters",
>       "goal": "Notice that the same topics come back in different chapters.",
>       "passageIds": [
>         "p1",
>         "p11"
>       ],
>       "checkQuestion": "Chapter 1 and Chapter 11 have the same topic. What is it, and how do their regions differ?",
>       "keyPoints": [
>         "The same topic can appear in more than one chapter.",
>         "Each chapter with the same topic describes a different region number."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "Why the topics matter",
>       "goal": "Understand that these topics shape daily life.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "According to the chapter, why are the rivers of region 1 important?",
>       "keyPoints": [
>         "The text says the topics are important because they shape daily life.",
>         "Daily life is affected by things like rivers in a region."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "Why people study them",
>       "goal": "Understand the purpose of studying these topics.",
>       "passageIds": [
>         "p2",
>         "p3"
>       ],
>       "checkQuestion": "Why do people study trade, according to the text?",
>       "keyPoints": [
>         "People study these topics to learn how communities grow.",
>         "The purpose of the study is to understand community growth."
>       ]
>     },
>     {
>       "id": "s5",
>       "title": "A pattern across the document",
>       "goal": "See the repeating cycle of topics across the chapters.",
>       "passageIds": [
>         "p5",
>         "p15"
>       ],
>       "checkQuestion": "Which topic appears in both Chapter 5 and Chapter 15, and what does that show about the pattern?",
>       "keyPoints": [
>         "The topics follow a repeating order: rivers, mountains, trade, energy, plants, cities, music, ships, maps, metals.",
>         "Chapters 5 and 15 both cover plants, so the cycle repeats."
>       ]
>     },
>     {
>       "id": "s6",
>       "title": "Putting it together",
>       "goal": "Summarize what the whole document is about.",
>       "passageIds": [
>         "p1",
>         "p60"
>       ],
>       "checkQuestion": "In your own words, what is the document about, and how does it end?",
>       "keyPoints": [
>         "The document has 60 chapters, each about one topic in one numbered region.",
>         "Each chapter explains that its topic shapes daily life and helps people learn how communities grow."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! Think about a school textbook. Each chapter has a number and a title, and the title tells you the topic before you read a word.
> 
> Let's look at Chapter 1 together. Its title is "rivers," so the **topic** is rivers. The text mentions "region 1," so that is the **region** it describes.
> 
> Now it's your turn. Look at Chapter 2 in the file. What is its topic, and which region does it describe?

_control: {"verdict":"partial","advance":false}_

