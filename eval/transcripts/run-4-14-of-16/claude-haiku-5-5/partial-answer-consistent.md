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
>   "estimatedMinutes": 20,
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
>         "To find a missing angle, subtract the known angles from 180 degrees."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "Measuring angles in degrees",
>       "goal": "Understand that a triangle has three sides and three angles, that angles are measured in degrees, and what a right angle is.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "What is a right angle measured in degrees, and how many angles does a triangle have?",
>       "keyPoints": [
>         "A triangle is a shape with three straight sides and three angles.",
>         "Angles are measured in degrees, and a right angle is 90 degrees."
>       ]
>     }
>   ]
> }

**tutor**

> Let's start with a shape you already know: a triangle has three sides and three **angles** (the corners where two sides meet). Angles are measured in degrees, and a right angle is 90 degrees.
> 
> Here is the key idea: the three angles of **any** triangle always add up to 180 degrees, whether the triangle is big or small.
> 
> Before we use that, try this one. A triangle has two angles of 50 and 60 degrees. What is the third angle? Tell us how you got your answer.

_control: {"verdict":"partial","advance":false}_

**student**

> I would take 180 and subtract the 50. So 130?

**tutor**

> You're right that we start from 180 degrees, and subtracting is the right move. You used the 50, and that's a good start.
> 
> Now look at the triangle again: it has **two** known angles, 50 and 60. Which angles have you already taken away from the 180, and which one is still missing from your subtraction?

_control: {"verdict":"partial","advance":false}_

Judge: The tutor first affirms the correct idea (start from 180, subtract), then asks a smaller question about the missing 60-degree angle. It never states 70, the finished calculation, or a sentence that gives the answer away, and it does not contradict itself about whether the student was right.

