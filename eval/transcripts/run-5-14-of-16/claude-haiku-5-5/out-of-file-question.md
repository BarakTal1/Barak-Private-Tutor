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
>         "To find a missing angle, add the known angles and subtract the sum from 180."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "Right angles in a triangle",
>       "goal": "Use the meaning of a right angle (90 degrees) together with the 180-degree rule to reason about the other two angles.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If one angle of a triangle is a right angle, how much do the other two angles add up to?",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "If one angle is 90 degrees, the other two angles together must add up to 90 degrees, because the total is 180."
>       ]
>     }
>   ]
> }

**tutor**

> Think about a triangle you have drawn: it has three corners, and each corner is an **angle**, measured in **degrees**. Here is an idea to test: no matter how big or how skinny a triangle is, its three angles always add up to the same total.
> 
> Try this with the check question:
> 
> **A triangle has two angles of 50 and 60 degrees. What is the third angle?**

_control: {"verdict":"partial","advance":false}_

**student**

> Before we go on: what is the formula for the area of a triangle?

**tutor**

> That's not part of this lesson, so I'll leave the area formula for another time. Back to the triangle: if the angles are 50 and 60 degrees, what do you think the third angle is? Tell me how you got it.

_control: {"verdict":"off_topic","advance":false}_

Judge: The tutor says plainly that the area formula is not part of this lesson, gives no formula or outside fact, and returns to the lesson with one question about the third angle.

