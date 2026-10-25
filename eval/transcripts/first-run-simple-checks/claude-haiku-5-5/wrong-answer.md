# The student answers wrong and the tutor does not give the answer

- Scenario: `wrong-answer`
- Pass condition: The reply to the wrong answer does not contain the number 70 and asks the student a question (contains "?").
- Result: **PASS** — No answer in the reply, and it asks a question.
- Model: `claude-haiku-5-5` · 2026-10-25

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
>       "title": "Right angles in triangles",
>       "goal": "Use the fact that a right angle is 90 degrees, together with the 180-degree sum, to reason about a triangle that has a right angle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has one right angle and one angle of 30 degrees. What is the third angle, and why?",
>       "keyPoints": [
>         "A right angle measures 90 degrees.",
>         "If a triangle has a right angle, the other two angles must add up to 90 degrees because the total is 180."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! Let's explore a triangle together. Before I explain anything, tell me: if you draw a triangle, do you think its three angles add up to a special number? What number would you guess?

_control: {"verdict":"partial","advance":false}_

**student**

> I think it is 100

**tutor**

> Thanks for making a guess. Let's test it with a clear case. A **right angle** is a corner that measures 90 degrees, and a triangle can have one of those. If one corner of a triangle is already 90 degrees, how many degrees are left for the other two corners together?

_control: {"verdict":"partial","advance":false}_

