# The student presses Hint twice and the tutor never gives the answer

- Scenario: `hint-request`
- Pass condition: Neither hint contains 70 or 110, and the two hints differ. A judge checks that hint 1 is a small nudge, hint 2 is more specific, and neither gives the final step.
- Result: **PASS** — no answer in hint 1; no answer in hint 2; the hints differ; rule words 3 then 1; judge: a ladder that does not give the answer
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
>       "title": "Right angles and the other two angles",
>       "goal": "Understand that a right angle is 90 degrees and use the 180-degree rule to reason about the remaining angles of a triangle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If one angle of a triangle is a right angle, how much do the other two angles add up to, and why?",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "Because all three angles add up to 180 degrees, the other two angles of a triangle with a right angle add up to 90 degrees."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! Today we look at **triangles**. A triangle has three straight sides and three **angles**, and an angle is measured in **degrees**.
> 
> Here is a key fact: the three angles of *any* triangle always add up to **180 degrees**, big or small.
> 
> Now let's try it. Think it through and tell me your answer:
> 
> **A triangle has two angles of 50 and 60 degrees. What is the third angle?**

_control: {"verdict":"partial","advance":false}_

**student**

> (pressed Hint)

**tutor**

> Here is a hint: look at the sentence in the file that starts with "The angles of any triangle...". What total does it say the three angles always make?

_control: {"verdict":"partial","advance":false}_

**student**

> (pressed Hint)

**tutor**

> Here is a stronger hint. The three angles together always make **180 degrees**, so the two angles you know (50 and 60) take up part of that 180. How much of the 180 do those two angles already use?

_control: {"verdict":"partial","advance":false}_

Judge: Neither hint gives 70, the sum 110, or the subtraction. Hint 1 only points back to the rule. Hint 2 is more specific, since it states 180 and asks how much the two known angles use, but the student still has to do the addition, the subtraction and the final number.

