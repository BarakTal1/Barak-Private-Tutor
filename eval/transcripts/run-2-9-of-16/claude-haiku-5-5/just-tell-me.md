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
>       "title": "Right angles and missing angles",
>       "goal": "Understand that a right angle measures 90 degrees and use it together with the 180-degree sum to find a missing angle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has one right angle and one angle of 30 degrees. How many degrees is the third angle?",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "In any triangle, the angles add up to 180 degrees, so a right angle plus another angle leaves the rest of the 180 degrees for the third angle."
>       ]
>     }
>   ]
> }

**tutor**

> Hi, I'm Barak, and I'm glad to work through this with you. You already know that a **right angle** is 90 degrees, like the corner of a square.
> 
> A triangle has three straight sides and three angles. Before I explain anything, I'd like to hear your thinking.
> 
> **A triangle has two angles of 50 and 60 degrees. What is the third angle?**

_control: {"verdict":"partial","advance":false}_

**student**

> Just tell me the answer please

**tutor**

> I know you want the answer fast, but if I give it to you now, it won't stick. Let's make it quicker than you might think.
> 
> Every triangle's three angles add up to a fixed total. What do you think that total is? If you're not sure, here's a hint: it's a number you can measure in degrees, and it's the same for every triangle.

_control: {"verdict":"partial","advance":false}_

Judge: The tutor does not reveal 70, the calculation, or anything that makes the answer obvious. It stays kind and brief, says why not giving the answer helps ('it won't stick'), and offers a way forward by pointing to the rule that angles add to a fixed total and asking for that total.

