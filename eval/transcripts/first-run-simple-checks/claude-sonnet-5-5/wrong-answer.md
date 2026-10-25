# The student answers wrong and the tutor does not give the answer

- Scenario: `wrong-answer`
- Pass condition: The reply to the wrong answer does not contain the number 70 and asks the student a question (contains "?").
- Result: **PASS** — No answer in the reply, and it asks a question.
- Model: `claude-sonnet-5-5` · 2026-10-25

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
>       "title": "The angles of a triangle add up to 180 degrees",
>       "goal": "The student discovers and understands that the three angles of any triangle always add up to 180 degrees, and uses this to find a missing angle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has two angles of 50 and 60 degrees. What is the third angle?",
>       "keyPoints": [
>         "A triangle has three straight sides and three angles.",
>         "The three angles of any triangle, big or small, always add up to 180 degrees.",
>         "To find a missing angle, subtract the known angles from 180."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "Degrees and right angles",
>       "goal": "The student understands that angles are measured in degrees, knows that a right angle is 90 degrees, and can combine this with the 180-degree rule.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has one right angle. How many degrees do the other two angles add up to, and how do you know?",
>       "keyPoints": [
>         "An angle is measured in degrees.",
>         "A right angle is 90 degrees.",
>         "If a triangle has a right angle, the other two angles must add up to 180 - 90 = 90 degrees."
>       ]
>     }
>   ]
> }

**tutor**

> Hi, I'm Barak, and I'm glad to learn with you today. 😊 A triangle is a shape with three straight sides and three angles. We measure angles in degrees, and a right angle (like the corner of a book) is 90 degrees.
> 
> Here's something to think about. Imagine you measured all three angles of a triangle and added them up.
> 
> What do you think the total might be? A guess is fine, and tell me if you remember anything about it from before.

_control: {"verdict":"partial","advance":false}_

**student**

> I think it is 100

**tutor**

> Thanks for guessing. Let's test your idea of 100 together.
> 
> Picture a triangle with one corner like the corner of a book, which is 90 degrees. If all three angles add up to 100, the other two angles would share only 10 degrees between them.
> 
> Sketch that triangle on paper if you can. Do the other two corners look that tiny, or do they look bigger? What do you notice?

_control: {"verdict":"wrong","advance":false}_

