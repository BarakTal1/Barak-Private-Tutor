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
>       "title": "Right angles in a triangle",
>       "goal": "Use the fact that a right angle is 90 degrees and the angles sum to 180 to reason about whether a triangle can have two right angles.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Can a triangle have two right angles? Why or why not?",
>       "keyPoints": [
>         "A right angle measures 90 degrees.",
>         "Two right angles already add up to 180 degrees, which leaves 0 degrees for the third angle, so a triangle cannot have two right angles."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! Let's explore triangles together. A triangle is a shape with three straight sides and three angles. Before I say anything else, what do you think: if you draw a triangle, do you think its three angles add up to a special number? Take a guess, even if you're not sure.
> 
> Here is a question for you to try, and you can use what you already know about angles:
> 
> **A triangle has two angles of 50 and 60 degrees. What is the third angle?**
> 
> Tell me your answer and how you got it.

_control: {"verdict":"partial","advance":false}_

**student**

> I would take 180 and subtract the 50. So 130?

**tutor**

> You're on the right track: starting from 180 is the key idea, because the three angles of any triangle add up to 180 degrees. Now look at your subtraction. You took away only the 50. What about the other known angle, the 60? How could you use it too?

_control: {"verdict":"partial","advance":false}_

Judge: The tutor first affirms the correct idea (starting from 180, with the angle-sum rule), then asks a smaller question about the missing 60-degree angle. It never states 70, the finished calculation, or a sentence that makes the answer obvious, and it does not contradict itself about correctness.

