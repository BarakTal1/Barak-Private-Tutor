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
>       "title": "The angles add up to 180 degrees",
>       "goal": "Discover through questioning that the three angles of any triangle always add up to 180 degrees, and use this to find a missing angle.",
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
>       "title": "A triangle with a right angle",
>       "goal": "Use the fact that a right angle is 90 degrees and the 180-degree sum to reason about the other two angles of a triangle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "One angle of a triangle is a right angle. How many degrees do the other two angles add up to, and why?",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "Since all three angles add up to 180 degrees, the other two angles of a right triangle add up to 90 degrees."
>       ]
>     }
>   ]
> }

**tutor**

> Hi, I'm Barak, and I'm glad you're here! You already know that a **right angle** is 90 degrees. A triangle is a shape with three straight sides and three angles. The key idea for today is that the three angles of any triangle always add up to 180 degrees, whatever the triangle's size.
> 
> Let's test that idea. A triangle has two angles of 50 and 60 degrees. What is the third angle?

_control: {"verdict":"partial","advance":false}_

**student**

> 70

**tutor**

> Yes, 70 degrees is right. Can you tell me how you found it? What did you do with the 50 and the 60?

_control: {"verdict":"partial","advance":false}_

Judge: The tutor confirms 70 is correct and asks the student to explain how they found it (what they did with 50 and 60). It does not change topic or give a long explanation.

