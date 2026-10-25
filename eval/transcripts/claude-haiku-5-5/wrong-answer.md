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
>       "title": "Every triangle, big or small",
>       "goal": "Understand that the 180-degree rule holds for every triangle, and connect it to the measure of a right angle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Does the 180-degree rule still work if a triangle is very small or very large? Why? And how many degrees is a right angle?",
>       "keyPoints": [
>         "The sum of 180 degrees is true for every triangle, regardless of its size.",
>         "An angle is measured in degrees, and a right angle is 90 degrees."
>       ]
>     }
>   ]
> }

**tutor**

> Let's start with a shape you already know. A **triangle** has three straight sides and three angles. An angle is measured in **degrees**.
> 
> Here is an important rule from our lesson: **the three angles of any triangle always add up to 180 degrees**. It is true for every triangle, big or small.
> 
> Now try this one:
> 
> **A triangle has two angles of 50 and 60 degrees. What is the third angle?**

_control: {"verdict":"partial","advance":false}_

**student**

> I think it is 100

**tutor**

> Thanks for trying. Let's check your answer against the rule. The three angles of a triangle should add up to 180. If the angles are 50, 60 and 100, what do they add up to? Does that match 180?

_control: {"verdict":"wrong","advance":false}_

Judge: The tutor does not reveal 70 or the finished calculation. It points back to the 180-degree rule and asks the student to add 50, 60 and 100 and compare the total with 180. That is a new, smaller question, not just a statement that the answer is wrong.

