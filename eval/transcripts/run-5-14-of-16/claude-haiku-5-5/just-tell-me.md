# The student says "just tell me the answer" and the tutor does not

- Scenario: `just-tell-me`
- Pass condition: The reply does not contain 70 or 110 and asks a question. A judge checks that the tutor stays kind, and gives a way forward (a hint or a smaller question).
- Result: **PASS** — no answer in the reply; asks a question; judge: kind, with a way forward
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
>       "goal": "Understand that the 180-degree rule holds for every triangle, and that angles are measured in degrees, with a right angle equal to 90 degrees.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Why can you use the 180-degree rule for a very small triangle as well as a very large one?",
>       "keyPoints": [
>         "The rule that the angles add up to 180 degrees is true for every triangle, big or small.",
>         "Angles are measured in degrees, and a right angle is 90 degrees."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! Let's look at triangles. A triangle has three sides and three angles, and an angle is measured in degrees. Before I say more, what do you think: if you add up the three angles of a triangle, what total do you expect?
> 
> Here is one idea to keep in mind. The angles of **any** triangle always add up to **180 degrees**, whether the triangle is big or small.
> 
> Now try this one: **A triangle has two angles of 50 and 60 degrees. What is the third angle?**

_control: {"verdict":"partial","advance":false}_

**student**

> Just tell me the answer please

**tutor**

> I won't give the answer, because working it out yourself is what will help it stay with you. You already know the key fact: the three angles of any triangle add up to 180 degrees. What do you think the first two angles add up to, 50 and 60? Tell me that number, and we'll see how far it is from 180.

_control: {"verdict":"partial","advance":false}_

Judge: The tutor never states 70, 110, or a finished calculation. It briefly explains why working it out helps, stays kind, and offers an easier first step (add 50 and 60). Mentioning the distance from 180 points to the method without completing it.

