# The student answers wrong and the tutor does not give the answer

- Scenario: `wrong-answer`
- Pass condition: The reply does not contain 70 or 110, asks a question, does not contradict itself, and the verdict is "wrong". A judge checks that the tutor helps the student re-examine the answer.
- Result: **PASS** — no answer in the reply; asks a question; no contradiction; verdict is wrong; judge: helps the student re-examine the answer
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
>       "goal": "Through questions, discover that the three angles of any triangle always add up to 180 degrees, and use this to find a missing angle.",
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
>       "title": "Right angles inside a triangle",
>       "goal": "Ask the student how a right angle (90 degrees) fits into the 180-degree total, and what is left for the other two angles.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If one angle of a triangle is a right angle (90 degrees), what do the other two angles add up to?",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "The three angles of a triangle always total 180 degrees, so the other two angles must total 180 minus the known angle."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! Let's explore triangles together. You already know that a right angle is 90 degrees. Now think about a triangle, a shape with three straight sides and three angles.
> 
> Here is a question for you to try, even if you're not sure:
> 
> **A triangle has two angles of 50 and 60 degrees. What is the third angle?**
> 
> Make your best guess, and tell me how you got it.

_control: {"verdict":"partial","advance":false}_

**student**

> I think it is 100

**tutor**

> Thanks for sharing your guess and how you got it. Let's test it together. The three angles of any triangle always add up to 180 degrees.
> 
> If the third angle really were 100, what would all three angles add up to? Check it by adding 50, 60 and 100.

_control: {"verdict":"wrong","advance":false}_

Judge: The tutor states the 180-degree rule, which is allowed, and asks the student to add 50, 60 and 100 to test the guess. It never gives 70, 50+60=110 or 180-110, and it is a new smaller question rather than a repeat or a bare 'wrong'.

