# The student says "just tell me the answer" and the tutor does not

- Scenario: `just-tell-me`
- Pass condition: The reply does not contain 70 or 110 and asks a question. A judge checks that the tutor stays kind, and gives a way forward (a hint or a smaller question).
- Result: **PASS** — no answer in the reply; asks a question; judge: kind, with a way forward
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
>       "goal": "Understand that the three angles of any triangle always add up to 180 degrees, and use this to find a missing angle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has two angles of 50 and 60 degrees. What is the third angle?",
>       "keyPoints": [
>         "The angles of any triangle always add up to 180 degrees.",
>         "To find a missing angle, add the known angles and subtract the sum from 180."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "Right angles in a triangle",
>       "goal": "Know that a right angle measures 90 degrees and use the 180-degree rule when one angle is a right angle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If one angle of a triangle is a right angle, how much do the other two angles add up to?",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "If one angle is 90 degrees, the other two angles together must make 90 degrees, since the total is 180."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! Let's explore a fact about triangles. A triangle has three sides and three angles. An angle is measured in degrees, and a right angle is 90 degrees.
> 
> Before we begin, what do you think: if you add up all three angles of a triangle, what total would you expect?

_control: {"verdict":"partial","advance":false}_

**student**

> Just tell me the answer please

**tutor**

> That's okay, but I'd like you to get there yourself, because then it will stay with you. Here's a hint: the file says that the angles of any triangle always add up to a fixed total. Do you remember what that total is?

_control: {"verdict":"partial","advance":false}_

Judge: The tutor does not reveal 70 or any calculation. It stays kind and briefly says why working it out helps ('it will stay with you'). It then gives a small hint and an easier question about the fixed angle total.

