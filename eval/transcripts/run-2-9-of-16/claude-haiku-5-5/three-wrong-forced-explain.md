# After three wrong answers the tutor explains and the lesson moves on

- Scenario: `three-wrong-forced-explain`
- Pass condition: The first two replies give no answer (a program and a judge). The third reply explains the answer (the number 70 appears), a judge says that the explanation is clear and kind, and the lesson state ends the step and moves on.
- Result: **FAIL** — Failed: judge: replies 1 and 2 hold back (The judge did not return JSON.); reply 3 gives the answer (70) ("No problem, this is a good place to slow down. Think of 50 as **5 tens** and 60 as **6 tens**. If you put them together, how many tens do you have?"); judge: the explanation is clear and kind (The last tutor reply still asks a guiding question (how many tens) and never explains the answer. It does not show 50 + 60 = 110 and 180 − 110 = 70, so it fails the required explanation of how to get 70 degrees.)
- Model: `claude-haiku-5-5` · judge: `claude-sonnet-5-5` · 2026-10-25

**plan**

> {
>   "title": "Angles of a Triangle",
>   "language": "English",
>   "audience": "7th grade students",
>   "difficulty": "medium",
>   "estimatedMinutes": 15,
>   "steps": [
>     {
>       "id": "s1",
>       "title": "The angles add up to 180",
>       "goal": "Discover through questions that the three angles of any triangle always add up to 180 degrees, and use this to find a missing angle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has two angles of 50 and 60 degrees. What is the third angle?",
>       "keyPoints": [
>         "The angles of any triangle always add up to 180 degrees.",
>         "To find a missing angle, subtract the known angles from 180."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "Right angles in triangles",
>       "goal": "Use the fact that a right angle is 90 degrees and the 180-degree sum to reason about the other two angles of a triangle that has a right angle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If one angle of a triangle is a right angle, what do the other two angles add up to?",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "If one angle is 90 degrees, the other two angles together make 90 degrees, because 180 minus 90 is 90."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! You already know a right angle is 90 degrees, like the corner of a square. Here is a big idea: **the three angles of any triangle always add up to 180 degrees**. This is true for every triangle, big or small.
> 
> Let's see if you can use that idea. Take your time and tell me how you got your answer.
> 
> **A triangle has two angles of 50 and 60 degrees. What is the third angle?**

_control: {"verdict":"partial","advance":false}_

**student**

> I think it is 100

**tutor**

> Thanks for trying it. Let's check the idea together. The three angles of a triangle add up to 180 degrees. If the first two angles are 50 and 60, how many degrees do they make together? And how much is left for the third angle to reach 180?

_control: {"verdict":"wrong","advance":false}_

**student**

> maybe 30?

**tutor**

> Thanks for working on it. Let's go one small step at a time. What is 50 + 60 by itself?

_control: {"verdict":"wrong","advance":false}_

**student**

> I really do not know. 20?

**tutor**

> No problem, this is a good place to slow down. Think of 50 as **5 tens** and 60 as **6 tens**. If you put them together, how many tens do you have?

_control: {"verdict":"wrong","advance":false}_

Judge (first two replies): The judge did not return JSON.

Judge (explanation): The last tutor reply still asks a guiding question (how many tens) and never explains the answer. It does not show 50 + 60 = 110 and 180 − 110 = 70, so it fails the required explanation of how to get 70 degrees.

