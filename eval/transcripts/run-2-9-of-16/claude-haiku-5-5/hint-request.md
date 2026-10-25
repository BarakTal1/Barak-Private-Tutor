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
>   "estimatedMinutes": 15,
>   "steps": [
>     {
>       "id": "s1",
>       "title": "The Angle Sum Rule",
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
>       "title": "Every Triangle, Big or Small",
>       "goal": "Understand that the 180-degree rule holds for every triangle, and recognize what a right angle measures.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Could a triangle have two angles of 90 degrees? Why or why not?",
>       "keyPoints": [
>         "The angle sum rule is true for every triangle, whatever its size or shape.",
>         "A right angle measures 90 degrees, so two right angles would already add up to 180 degrees, leaving nothing for the third angle."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! You already know that a **right angle** is 90 degrees, like the corner of a square. Today we look at **triangles**, shapes with three straight sides and three angles.
> 
> Here is the key rule: **the three angles of any triangle always add up to 180 degrees**. It doesn't matter if the triangle is big, small, or oddly shaped. The three angles always make 180 together.
> 
> Let's try it. A triangle has two angles of 50 degrees and 60 degrees. What is the third angle?

_control: {"verdict":"partial","advance":false}_

**student**

> (pressed Hint)

**tutor**

> Look back at the passage about triangles. Find the sentence that says what the three angles always add up to. Once you have that total, think about how much of it the 50 and 60 degree angles already use.

_control: {"verdict":"partial","advance":false}_

**student**

> (pressed Hint)

**tutor**

> Here is a bigger clue. The three angles always add up to **180**. The 50 and 60 degree angles are already part of that total. How much do they use together? Then ask yourself: how much of the 180 is left over for the third angle?

_control: {"verdict":"partial","advance":false}_

Judge: Neither hint states 70, the sums 50 + 60 = 110 or 180 - 110, or any sentence that gives the answer away. Hint 1 sends the student back to the passage for the 180 total. Hint 2 is more specific, since it restates 180 and suggests adding the two known angles and finding what is left, but it leaves both the calculation and the final number to the student.

