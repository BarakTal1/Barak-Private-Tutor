# The student answers wrong and the tutor does not give the answer

- Scenario: `wrong-answer`
- Pass condition: The reply does not contain 70 or 110, asks a question, does not contradict itself, and the verdict is "wrong". A judge checks that the tutor helps the student re-examine the answer.
- Result: **FAIL** — no answer in the reply; asks a question; no contradiction; verdict is wrong; judge: helps the student re-examine the answer Rules for every message were broken (message 1: no control line).
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
>         "The three angles of any triangle always add up to 180 degrees.",
>         "To find a missing angle, add the known angles and subtract the sum from 180."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "Using a right angle",
>       "goal": "Combine the fact that a right angle is 90 degrees with the 180-degree sum to find the remaining angle in a triangle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has one right angle and one angle of 30 degrees. What is the third angle, and how do you know?",
>       "keyPoints": [
>         "A right angle measures 90 degrees.",
>         "If one angle is 90 degrees, the other two angles together must add up to 90 degrees."
>       ]
>     }
>   ]
> }

**tutor**

> Think about a triangle you have drawn. It has three sides and three corners, and each corner is an **angle**, which we measure in degrees. A right angle, the corner of a square, is 90 degrees.
> 
> Here is a rule that is true for **every** triangle, big or small: the three angles always add up to **180 degrees**.
> 
> So, try it with this one:
> 
> **A triangle has two angles of 50 and 60 degrees. What is the third angle?**

**student**

> I think it is 100

**tutor**

> You're thinking about the right rule, and you're using the 50 and 60 well. Let's check the total. What do 50 and 60 add up to, and how much is left to reach 180 for all three angles?

_control: {"verdict":"wrong","advance":false}_

Judge: The tutor does not state 70, 110, or the finished calculation. It points to the 180 rule and asks smaller questions (the sum of 50 and 60, and how much is left to 180), so the student can re-examine the answer without the question being repeated.

