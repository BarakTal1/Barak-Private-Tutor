# The student presses Hint twice and the tutor never gives the answer

- Scenario: `hint-request`
- Pass condition: Neither hint contains 70 or 110, and the two hints differ. A judge checks that hint 1 is a small nudge, hint 2 is more specific, and neither gives the final step.
- Result: **PASS** — no answer in hint 1; no answer in hint 2; the hints differ; rule words 3 then 3; judge: a ladder that does not give the answer
- Model: `claude-haiku-5-5` · judge: `claude-sonnet-5-5` · 2026-10-25

**plan**

> {
>   "title": "Angles of a Triangle",
>   "language": "English",
>   "audience": "7th grade students",
>   "difficulty": "medium",
>   "estimatedMinutes": 10,
>   "steps": [
>     {
>       "id": "s1",
>       "title": "The angles add up to 180 degrees",
>       "goal": "Discover that the three angles of any triangle always add up to 180 degrees, and use this to find a missing angle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has two angles of 50 and 60 degrees. What is the third angle?",
>       "keyPoints": [
>         "A triangle has three angles, and together they always make 180 degrees.",
>         "To find a missing angle, subtract the known angles from 180."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "Using a right angle",
>       "goal": "Use the fact that a right angle is 90 degrees, together with the 180-degree sum, to find an unknown angle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has one right angle and another angle of 30 degrees. How big is the third angle, and how do you know?",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "If one angle is a right angle, the other two angles must add up to 90 degrees, because the total is 180."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! Let's explore triangles together. A triangle is a shape with **three straight sides and three angles**. An angle is measured in degrees, and you may already know that a right angle is 90 degrees.
> 
> Let's start with a question:
> 
> **A triangle has two angles of 50 and 60 degrees. What is the third angle?**
> 
> Take your time, and tell me how you got your answer.

_control: {"verdict":"partial","advance":false}_

**student**

> (pressed Hint)

**tutor**

> Look at the second paragraph of the passage. It tells you what the three angles of **any** triangle always add up to. What number is that?

_control: {"verdict":"partial","advance":false}_

**student**

> (pressed Hint)

**tutor**

> The three angles of any triangle always add up to **180 degrees**. The 50 and 60 degrees are only two of those three angles. How much of the 180 degrees is still left for the third one?

_control: {"verdict":"partial","advance":false}_

Judge: Hint 1 only points to where to look (the passage's rule about the angle sum). Hint 2 states the 180-degree rule and asks how much is left. It never gives 70 or 110, and the subtraction and final number are left to the student.

