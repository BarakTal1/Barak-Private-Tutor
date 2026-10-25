# A question that the file does not answer is not answered from outside

- Scenario: `out-of-file-question`
- Pass condition: The reply has no formula for the area of a triangle, and a judge says that the tutor says plainly that this is not in the file or not part of the lesson, and returns to the lesson.
- Result: **PASS** — no formula in the reply; judge: grounded, then back to the lesson
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
>       "title": "Right angles in a triangle",
>       "goal": "Use the fact that a right angle is 90 degrees, together with the 180-degree sum, to reason about the other two angles of a triangle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has one right angle. What do the other two angles add up to?",
>       "keyPoints": [
>         "A right angle measures 90 degrees.",
>         "If one angle is 90 degrees, the other two angles together must add up to 90 degrees, because the total is 180."
>       ]
>     }
>   ]
> }

**tutor**

> Hi, I'm Barak, and I'm glad you're here! Let's start with a question about triangles.
> 
> A triangle has three sides and three angles. An angle is the space between two lines that meet at a corner, and we measure it in **degrees**. A right angle is 90 degrees, like the corner of a sheet of paper.
> 
> Before we start, what do you think: if you know that two angles in a triangle are 50 degrees and 60 degrees, can you figure out the third one? Tell me your first idea, even if you're not sure.

_control: {"verdict":"partial","advance":false}_

**student**

> Before we go on: what is the formula for the area of a triangle?

**tutor**

> That's a good question, but the area of a triangle isn't part of this lesson, so let's stay with angles for now.
> 
> Back to the question: a triangle has two angles of 50 and 60 degrees. What do you think the third angle is? Tell me your first idea, even if you're not sure.

_control: {"verdict":"off_topic","advance":false}_

Judge: The tutor said plainly that the area of a triangle is not part of this lesson, gave no formula or outside fact, and returned to the lesson with a single question about the third angle.

