# A right answer with no reason is accepted, and the tutor asks why

- Scenario: `right-but-weak-answer`
- Pass condition: The reply does not move to the next step (advance is false), and a judge says that the tutor accepts the answer and asks the student to explain how they got it.
- Result: **FAIL** — Failed: does not advance yet (control {"verdict":"correct","advance":true}); judge: accepts and asks why (The judge did not return JSON.)
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
>       "goal": "Through guided questions, the student discovers that the three angles of any triangle always add up to 180 degrees and uses this to find a missing angle.",
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
>       "goal": "Through questions, the student combines the 180-degree rule with the definition of a right angle to reason about the other two angles of a triangle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If one angle of a triangle is a right angle, how much do the other two angles add up to? How do you know?",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "If one angle is 90 degrees, the other two angles together must be 90 degrees, because the total is 180."
>       ]
>     }
>   ]
> }

**tutor**

> Let's start with something you already know: a **right angle** is 90 degrees. Every triangle has three angles, and there is a fixed total that they always share.
> 
> Try this one. Think about what the three angles must add up to.
> 
> **A triangle has two angles of 50 and 60 degrees. What is the third angle?**

_control: {"verdict":"partial","advance":false}_

**student**

> 70

**tutor**

> Yes, **70** is correct. Since 50 + 60 = 110, the third angle must make up the rest of the 180 degrees.
> 
> How did you get 70? Can you explain it in your own words?

_control: {"verdict":"correct","advance":true}_

Judge: The judge did not return JSON.

