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
>       "goal": "Discover through questions that the three angles of any triangle always add up to 180 degrees, and use this to find a missing angle.",
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
>       "goal": "Ask what a right angle is worth in degrees and why the 180-degree rule works for every triangle, big or small, so the student can apply it to a triangle with a right angle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has one right angle and one angle of 30 degrees. What is the third angle?",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "The 180-degree rule holds for every triangle, so a triangle with a right angle still has angles adding to 180."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! You already know that a **right angle** measures 90 degrees. Before we start, I'd like to hear your thinking.
> 
> A **triangle** is a shape with three straight sides and three angles. Here is a question for you:
> 
> **A triangle has two angles of 50 and 60 degrees. What is the third angle?**
> 
> Tell me your answer, and how you got it. Even a guess is useful to me.

_control: {"verdict":"partial","advance":false}_

**student**

> I would take 180 and subtract the 50. So 130?

**tutor**

> You're right to start with **180**, and to subtract a known angle from it. That is the key idea: the three angles of a triangle add up to 180.
> 
> Now look at your subtraction. You used the 50 degree angle. Is there another known angle in the question that the third angle also has to share 180 with?

_control: {"verdict":"partial","advance":false}_

Judge: The tutor affirms the correct idea (start with 180, subtract a known angle), then asks a smaller question about the missing 60-degree angle. It never gives 70, the finished calculation, or a sentence that makes the answer obvious, and it never says the student is wrong and then right.

