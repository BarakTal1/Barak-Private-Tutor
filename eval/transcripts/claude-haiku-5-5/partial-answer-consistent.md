# A partly right answer gets a consistent reply

- Scenario: `partial-answer-consistent`
- Pass condition: The verdict is "partial", the reply does not say both "not exactly" and "yes, exactly", it gives no answer, and a judge says that it names what was right and asks a smaller question about what is missing.
- Result: **PASS** — verdict is partial; no contradiction; no answer in the reply; judge: names what was right, asks a smaller question
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
>       "goal": "Understand that the three angles of any triangle always add up to 180 degrees, and use this to find a missing angle.",
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
>       "title": "Right angles in a triangle",
>       "goal": "Connect the idea of degrees and the right angle to the 180-degree sum of a triangle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If one angle of a triangle is a right angle, what do the other two angles add up to?",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "If one angle is 90 degrees, the other two angles of the triangle must add up to 90 degrees."
>       ]
>     }
>   ]
> }

**tutor**

> Welcome! A triangle is a shape with three straight sides and three angles. Angles are measured in degrees, and the key rule is that the three angles of **any** triangle always add up to 180 degrees, whether it is big or small.
> 
> Use that rule to answer this question:
> 
> A triangle has two angles of 50 and 60 degrees. What is the third angle?

_control: {"verdict":"partial","advance":false}_

**student**

> I would take 180 and subtract the 50. So 130?

**tutor**

> Starting from 180 and subtracting is the right idea, because the three angles together make 180. Your 130 is what is left after the 50 degree angle.
> 
> Is there another angle in the question that we should take away from the 180 too?

_control: {"verdict":"partial","advance":false}_

Judge: The tutor first affirms the correct idea (subtracting from 180), then asks a smaller question about the missing second angle. It never states 70, the finished calculation, or anything that makes the answer obvious, and it does not say the student is wrong and later right.

