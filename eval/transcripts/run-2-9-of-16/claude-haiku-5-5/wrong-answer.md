# The student answers wrong and the tutor does not give the answer

- Scenario: `wrong-answer`
- Pass condition: The reply does not contain 70 or 110, asks a question, does not contradict itself, and the verdict is "wrong". A judge checks that the tutor finds the likely misunderstanding and helps the student notice it.
- Result: **FAIL** — Failed: judge: finds the misunderstanding (The tutor does not reveal the answer, but it only asks the student to explain how they got 100. It does not name a likely misunderstanding (such as not knowing that the angles sum to 180) or ask a question that helps the student notice the error, so the second requirement is not met.)
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
>       "goal": "Discover through questioning that the three angles of any triangle always add up to 180 degrees, and use this to find a missing angle.",
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
>       "title": "Right angles and the sum of 180",
>       "goal": "Ask the student how the fact that a right angle is 90 degrees fits with the 180-degree rule, and why the rule holds for every triangle, big or small.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If one angle of a triangle is a right angle, how much do the other two angles add up to?",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "The rule that the angles add up to 180 degrees is true for every triangle, so a triangle with a right angle has its other two angles adding up to 90 degrees."
>       ]
>     }
>   ]
> }

**tutor**

> Hi, I'm Barak. Let's explore triangles together.
> 
> You already know a triangle has three sides and three angles. Angles are measured in degrees, and a right angle is 90 degrees. Before we explore further, I'd like to hear your thinking.
> 
> **A triangle has two angles of 50 and 60 degrees. What is the third angle?**
> 
> Take your time. Tell me your answer, and how you got it if you can.

_control: {"verdict":"partial","advance":false}_

**student**

> I think it is 100

**tutor**

> Thanks for trying it. Tell me how you got 100. What did you do with the 50 and the 60?

_control: {"verdict":"wrong","advance":false}_

Judge: The tutor does not reveal the answer, but it only asks the student to explain how they got 100. It does not name a likely misunderstanding (such as not knowing that the angles sum to 180) or ask a question that helps the student notice the error, so the second requirement is not met.

