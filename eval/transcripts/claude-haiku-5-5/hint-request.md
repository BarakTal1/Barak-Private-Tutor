# The student presses Hint twice and the tutor never gives the answer

- Scenario: `hint-request`
- Pass condition: Neither hint contains 70 or 110, and the two hints differ. A judge checks that hint 1 is a small nudge, hint 2 is more specific, and neither gives the final step.
- Result: **PASS** — no answer in hint 1; no answer in hint 2; the hints differ; rule words 4 then 4; judge: a ladder that does not give the answer
- Model: `claude-haiku-5-5` · judge: `claude-sonnet-5-5` · 2026-10-25

**plan**

> {
>   "title": "Angles of a Triangle",
>   "language": "English",
>   "audience": "7th grade students",
>   "difficulty": "medium",
>   "estimatedMinutes": 20,
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
>         "The three angles of any triangle always add up to 180 degrees.",
>         "To find a missing angle, subtract the known angles from 180."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "Right angles and triangles",
>       "goal": "Understand that a right angle is 90 degrees and use it with the 180-degree rule to reason about triangles.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has one right angle (90 degrees). What do its other two angles add up to, and why?",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "Since all three angles add up to 180 degrees, the other two angles of a triangle with a right angle add up to 90 degrees."
>       ]
>     }
>   ]
> }

**tutor**

> Let's start with a triangle. It has three straight sides and three corners, and each corner is an **angle**. You already know that a right angle measures 90 degrees.
> 
> Here is a triangle with two of its angles known: one is 50 degrees and the other is 60 degrees. What is the third angle?

_control: {"verdict":"partial","advance":false}_

**student**

> (pressed Hint)

**tutor**

> Look at the second paragraph of the passage. It tells you what the three angles of any triangle always add up to. Once you know that total, what would you need to do with the 50 and the 60?

_control: {"verdict":"partial","advance":false}_

**student**

> (pressed Hint)

**tutor**

> Here is a stronger clue. The three angles of a triangle always add up to **180 degrees**, so they share that total between them. The 50 and the 60 are two of those three parts.
> 
> How many degrees do the 50 and the 60 use up together, and how much of the 180 is left for the third angle?

_control: {"verdict":"partial","advance":false}_

Judge: Neither hint states 70, 110, or the finished calculation. Hint 1 only points to the passage and the idea of a total. Hint 2 gives the 180 rule and frames the steps as questions, so the addition, subtraction and final number are left to the student.

