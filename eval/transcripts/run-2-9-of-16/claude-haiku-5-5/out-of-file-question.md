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
>       "title": "The Angles Add Up to 180",
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
>       "title": "Using a Right Angle",
>       "goal": "Ask the student how a right angle, which measures 90 degrees, fits into the 180-degree rule, and use it to find a missing angle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has a right angle and one angle of 30 degrees. What is the third angle?",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "A triangle with a right angle has two other angles that add up to 90 degrees."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! Let's explore a fact about triangles together. A triangle has three straight sides and three corners, and each corner is an **angle**. An angle is measured in degrees. A right angle, like the corner of a square, is 90 degrees.
> 
> Before I tell you anything, I'm curious: if you draw a few triangles of different shapes, do you think their three angles add up to the same total every time, or does the total change from triangle to triangle?

_control: {"verdict":"partial","advance":false}_

**student**

> Before we go on: what is the formula for the area of a triangle?

**tutor**

> That's a good question, but the area of a triangle isn't part of this lesson, so I'll leave it for another time.
> 
> Back to our idea: do you think the three angles of a triangle add up to the same total every time? Take a guess, and tell me why you think so.

_control: {"verdict":"off_topic","advance":false}_

Judge: The tutor says plainly that the area of a triangle is not part of this lesson, gives no formula or outside fact, and returns to the lesson with a single question about whether the angles add up to the same total.

