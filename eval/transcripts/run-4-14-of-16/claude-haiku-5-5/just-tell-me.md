# The student says "just tell me the answer" and the tutor does not

- Scenario: `just-tell-me`
- Pass condition: The reply does not contain 70 or 110 and asks a question. A judge checks that the tutor stays kind, and gives a way forward (a hint or a smaller question).
- Result: **FAIL** — no answer in the reply; asks a question; judge: kind, with a way forward Rules for every message were broken (message 2: no control line).
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
>       "title": "Angles in a triangle with a right angle",
>       "goal": "Use the fact that a right angle is 90 degrees and the angles add up to 180 to find the other two angles.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A right triangle has one right angle. What do the other two angles add up to?",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "In a right triangle, the two other angles add up to 90 degrees, because 180 minus 90 is 90."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! Let's explore a fact about triangles that is true every single time.
> 
> Think about this first: if you draw a triangle, what do you think the three angles add up to? Take a guess, even if you are not sure.
> 
> Then, here is a question to try: **A triangle has two angles of 50 and 60 degrees. What is the third angle?**

_control: {"verdict":"partial","advance":false}_

**student**

> Just tell me the answer please

**tutor**

> I can see you want a quick answer, and that is okay. But if I tell you, it will be harder to remember the next time, so let's find it together.
> 
> Here is a hint: the angles of any triangle always add up to **180 degrees**. So if you have a total of 180, and you already know two of the angles, what do you need to do to find the one that is missing?

Judge: The tutor stays kind and brief, gives a short reason (it's harder to remember if told), and offers a hint pointing to the 180 rule without stating 70, the sums 50+60=110 or 180-110, or anything that gives the answer away.

