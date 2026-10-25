# The student presses Hint twice and the tutor never gives the answer

- Scenario: `hint-request`
- Pass condition: Neither hint contains 70, and the second hint is not the same text as the first.
- Result: **PASS** — No answer. The second hint uses the same or more rule words.
- Model: `claude-sonnet-5-5` · 2026-10-25

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
>       "title": "The angles of a triangle add up to 180°",
>       "goal": "The student discovers and states that the three angles of any triangle always add up to 180 degrees, and uses this to find a missing angle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has two angles of 50 and 60 degrees. What is the third angle?",
>       "keyPoints": [
>         "A triangle has three straight sides and three angles.",
>         "The three angles of any triangle add up to 180 degrees.",
>         "If you know two angles, subtract their sum from 180 to find the third."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "Degrees, right angles and every triangle",
>       "goal": "The student understands that angles are measured in degrees, that a right angle is 90 degrees, and that the 180-degree rule holds for every triangle, whatever its size.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has one right angle. What do its other two angles add up to, and why?",
>       "keyPoints": [
>         "Angles are measured in degrees, and a right angle is 90 degrees.",
>         "The 180-degree total is true for every triangle, big or small.",
>         "With a right angle (90°), the other two angles must add up to 90°."
>       ]
>     }
>   ]
> }

**tutor**

> Hi, I'm Barak! Today we'll look at a neat fact about triangles. A triangle is a shape with three straight sides and three angles, and we measure angles in degrees. For example, a right angle (like the corner of a book) is 90 degrees.
> 
> Imagine you measured all three angles of a triangle and added them up. Do you think the total would be different for every triangle, or could something special happen? Tell me what you think.

_control: {"verdict":"partial","advance":false}_

**student**

> (pressed Hint)

**tutor**

> Here's a small nudge. Look at the second paragraph of the file, the one about the angles of "any triangle". Pay attention to the words **always** and **big or small**.
> 
> What do those words tell you about the total of the three angles? Is it different for every triangle, or something else?

_control: {"verdict":"partial","advance":false}_

**student**

> (pressed Hint)

**tutor**

> Let's make it smaller. Every triangle's three angles add up to **one fixed number**, the same every time. That number is written in the second paragraph of the file, in the sentence that says "always add up to".
> 
> Can you find it? Tell me which number you see, and what you think it means for our triangle with angles of 50 and 60 degrees.

_control: {"verdict":"partial","advance":false}_

