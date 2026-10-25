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
>       "title": "The angles add up to 180 degrees",
>       "goal": "Understand that the three angles of any triangle always add up to 180 degrees, and use this to find a missing angle.",
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
>       "title": "Right angles and every triangle",
>       "goal": "Understand that a right angle is 90 degrees and that the 180-degree rule holds for every triangle, big or small.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If one angle of a triangle is a right angle, what do the other two angles add up to?",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "The 180-degree rule is true for every triangle, so it still applies when one angle is a right angle."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! Let's look at triangles. A triangle has three sides and three angles. Here is a key fact: **the three angles of any triangle always add up to 180 degrees**, whether the triangle is big or small.
> 
> Before we try it, think about this: if you already know two of the angles, what could you do to find the third?
> 
> Here is your first question:
> 
> **A triangle has two angles of 50 and 60 degrees. What is the third angle?**

_control: {"verdict":"partial","advance":false}_

**student**

> I think it is 100

**tutor**

> Thanks for giving a number. Let's test it. The three angles together must make 180 degrees. If the third angle were 100, what would all three angles add up to? Try adding 50, 60 and 100.

_control: {"verdict":"wrong","advance":false}_

Judge: The tutor never states 70 or the finished calculation (50 + 60 = 110, 180 - 110). It asks the student to test their answer by adding 50, 60 and 100 and comparing with 180, which is a new smaller question that helps the student re-examine the answer, not a repeat of the original question.

