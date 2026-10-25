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
>       "title": "The Angle Sum Rule",
>       "goal": "Discover through questions that the three angles of any triangle always add up to 180 degrees.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has two angles of 50 and 60 degrees. What is the third angle?",
>       "keyPoints": [
>         "The angles of any triangle always add up to 180 degrees.",
>         "If you know two angles, you can find the third by subtracting their sum from 180."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "Right Angles in Triangles",
>       "goal": "Use the 180-degree rule and the meaning of a right angle to reason about the angles of a triangle that has a right angle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If one angle of a triangle is a right angle, what do the other two angles add up to?",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "In a triangle with a right angle, the other two angles together make 90 degrees, because 180 minus 90 is 90."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! You already know that a triangle has three sides and three angles, and that angles are measured in degrees. A right angle is 90 degrees.
> 
> Let's see what you can work out. A triangle has two angles of 50 and 60 degrees. What is the third angle?

_control: {"verdict":"partial","advance":false}_

**student**

> 70

**tutor**

> Yes, 70 is correct. Can you tell me how you got it? Explain your steps in your own words.

_control: {"verdict":"partial","advance":false}_

Judge: The tutor confirms 70 is correct, asks the student to explain how they got it, and neither changes topic nor gives a long explanation.

