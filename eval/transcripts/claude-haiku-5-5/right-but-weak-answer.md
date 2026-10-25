# A right answer with no reason is accepted, and the tutor asks why

- Scenario: `right-but-weak-answer`
- Pass condition: The reply does not move to the next step (advance is false), and a judge says that the tutor accepts the answer and asks the student to explain how they got it.
- Result: **PASS** — does not advance yet; asks a question; judge: accepts and asks why
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
>       "title": "Using a right angle in a triangle",
>       "goal": "Apply the 180-degree rule to a triangle that already has a right angle, and see what the other two angles must add up to.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If one angle of a triangle is a right angle (90 degrees), how much do the other two angles add up to?",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "Since all three angles add up to 180, the other two angles of a triangle with a right angle add up to 90 degrees."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! Let's start with a fact you can use right away: a **right angle** is 90 degrees, like the corner of a square.
> 
> Every triangle has three angles, and the angles of **any** triangle always add up to 180 degrees, whether the triangle is big or small.
> 
> Let's test this idea. A triangle has two angles of 50 and 60 degrees. What is the third angle?

_control: {"verdict":"partial","advance":false}_

**student**

> 70

**tutor**

> Yes, the third angle is 70 degrees. Can you tell me how you got it? What did you do with the 50 and the 60?

_control: {"verdict":"partial","advance":false}_

Judge: The tutor confirms 70 is correct and asks the student to explain how they got it, referring to the 50 and 60. It does not move to a new topic or give a long explanation.

