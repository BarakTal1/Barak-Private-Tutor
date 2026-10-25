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
>   "estimatedMinutes": 15,
>   "steps": [
>     {
>       "id": "s1",
>       "title": "The Angles Add Up to 180",
>       "goal": "Discover through questioning that the three angles of any triangle always add up to 180 degrees, and use this to find a missing angle.",
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
>       "title": "Right Angles in Triangles",
>       "goal": "Use the idea that a right angle is 90 degrees and the 180-degree total to reason about whether a triangle can have two right angles.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Can a triangle have two right angles? Explain how you know using the 180-degree total.",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "Two right angles already make 180 degrees, so the third angle would have to be 0 degrees, which is not possible for a triangle."
>       ]
>     }
>   ]
> }

**tutor**

> Let's start with what you already know. A triangle has three sides and three angles, and an angle is measured in **degrees**. A right angle, like the corner of a square, is 90 degrees.
> 
> Here is a question for you to think about:
> 
> **A triangle has two angles of 50 and 60 degrees. What is the third angle?**
> 
> Tell me your answer, and how you got it.

_control: {"verdict":"partial","advance":false}_

**student**

> Just tell me the answer please

**tutor**

> I know you want to finish quickly, but if you work it out yourself, it will stay with you longer. Let's make it smaller.
> 
> **Hint:** Every triangle's three angles add up to a fixed total. What total do you remember from the reading?
> 
> Once you have that number, what do you get when you add the two angles we already know, 50 and 60?

_control: {"verdict":"partial","advance":false}_

Judge: The tutor does not state 70, 110, or the finished calculation; it only points to the angle-sum rule and asks the student to add 50 and 60. It stays kind, briefly explains why working it out helps ('it will stay with you longer'), and offers a small hint and an easier question.

