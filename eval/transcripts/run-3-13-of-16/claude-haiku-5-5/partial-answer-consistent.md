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
>   "estimatedMinutes": 15,
>   "steps": [
>     {
>       "id": "s1",
>       "title": "The angles add up to 180",
>       "goal": "Ask the student to discover that the three angles of any triangle always add up to 180 degrees, and use this to find a missing angle.",
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
>       "title": "Right angles and triangles",
>       "goal": "Ask the student how a right angle of 90 degrees fits into the 180-degree total, and what the remaining angle must be when one angle is a right angle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has one right angle and one angle of 30 degrees. What is the third angle?",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "In a triangle with a right angle, the other two angles must add up to 90 degrees."
>       ]
>     }
>   ]
> }

**tutor**

> Let's start with the triangle. You know it has three straight sides and three angles, and you already know that a right angle measures 90 degrees.
> 
> Here is a question to think about: **a triangle has two angles of 50 and 60 degrees. What is the third angle?**
> 
> Take your time. Tell me your answer and how you got it.

_control: {"verdict":"partial","advance":false}_

**student**

> I would take 180 and subtract the 50. So 130?

**tutor**

> You're right that we start from 180, and subtracting is the right move. You have only used one of the known angles, though. The triangle also has a 60-degree angle.
> 
> What do you get if you subtract *both* 50 and 60 from 180?

_control: {"verdict":"partial","advance":false}_

Judge: The tutor affirms the correct idea (start from 180 and subtract), points out the missing 60-degree angle, and asks the student to subtract both angles. It never states 70, 110, or a finished calculation, and it never contradicts itself about whether the student was right.

