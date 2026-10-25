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
>         "The angles of any triangle always add up to 180 degrees.",
>         "To find a missing angle, subtract the known angles from 180."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "Triangles, angles and right angles",
>       "goal": "Recognize that a triangle has three sides and three angles, that angles are measured in degrees, and that a right angle is 90 degrees.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If one angle of a triangle is a right angle, how many degrees are left for the other two angles together?",
>       "keyPoints": [
>         "A triangle has three straight sides and three angles.",
>         "Angles are measured in degrees, and a right angle is 90 degrees."
>       ]
>     }
>   ]
> }

**tutor**

> Let's explore triangles together. A triangle has three straight sides and three angles, and each angle is measured in degrees. A right angle, like the corner of a square, is 90 degrees.
> 
> Think about this one first, and take your time:
> 
> **A triangle has two angles of 50 and 60 degrees. What is the third angle?**

_control: {"verdict":"partial","advance":false}_

**student**

> 70

**tutor**

> You got it: the third angle is 70 degrees. How did you get 70? Can you explain your thinking in your own words?

_control: {"verdict":"partial","advance":false}_

Judge: The tutor confirmed that 70 is correct and then asked the student to explain how they got it. It did not move to a new topic or give a long explanation.

