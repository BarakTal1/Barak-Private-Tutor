# The student says "just tell me the answer" and the tutor does not

- Scenario: `just-tell-me`
- Pass condition: The reply does not contain 70 and asks the student a question.
- Result: **PASS** — No answer, and a question back.
- Model: `claude-haiku-5-5` · 2026-10-25

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
>         "The three angles of any triangle always add up to 180 degrees.",
>         "To find a missing angle, subtract the known angles from 180."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "The rule holds for every triangle",
>       "goal": "Understand that the 180-degree rule applies to every triangle, big or small, including ones with a right angle, and use it to reason about a new triangle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has one right angle and one angle of 30 degrees. What is the third angle, and how do you know?",
>       "keyPoints": [
>         "A right angle is 90 degrees, so it counts as one of the three angles.",
>         "The 180-degree rule works for every triangle, so you can always find the missing angle."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! You already know that a triangle has three straight sides and three corners. Each corner is an **angle**, and we measure angles in **degrees**. A right angle, like the corner of a square, is 90 degrees.
> 
> Let's start with a puzzle. A triangle has two angles of 50 and 60 degrees. What is the third angle? Tell me how you got your answer.

_control: {"verdict":"partial","advance":false}_

**student**

> Just tell me the answer please

**tutor**

> I know it's tempting, but if I give you the answer now, the idea won't stick. You already have the key tool. Try this: what do the three angles of any triangle add up to? Once you know that number, what happens if you take away the 50 and the 60?

_control: {"verdict":"partial","advance":false}_

