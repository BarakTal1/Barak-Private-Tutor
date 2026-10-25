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
>       "title": "The angles add up to 180 degrees",
>       "goal": "Discover that the three angles of any triangle always add up to 180 degrees, and use this to find a missing angle.",
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
>       "title": "Right angles and the other two angles",
>       "goal": "Understand that a right angle is 90 degrees and use the 180-degree rule to reason about the other two angles of a triangle that has a right angle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has one right angle. How much do the other two angles add up to, and why?",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "Since all three angles add up to 180 degrees, the other two angles of a right triangle add up to 90 degrees."
>       ]
>     }
>   ]
> }

**tutor**

> Think about the right angle you already know: it is **90 degrees**. Now picture a triangle with three angles. Our file says something special about them: **the three angles of any triangle always add up to 180 degrees**, whatever the size of the triangle.
> 
> Let's test that idea. A triangle has two angles of 50 and 60 degrees. What is the third angle?
> 
> Take your time. Tell me how you got your answer.

_control: {"verdict":"partial","advance":false}_

**student**

> Before we go on: what is the formula for the area of a triangle?

**tutor**

> That is not part of this lesson, so I can't help with the area of a triangle here. Let's stay with the angles.
> 
> Back to the check question: a triangle has two angles of 50 and 60 degrees. What is the third angle? Tell me how you got it.

_control: {"verdict":"off_topic","advance":false}_

Judge: The tutor says plainly that the area of a triangle is not part of this lesson, gives no formula or outside fact, and returns to the lesson with a single question about the third angle.

