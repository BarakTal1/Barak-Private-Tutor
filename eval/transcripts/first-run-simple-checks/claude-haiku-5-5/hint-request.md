# The student presses Hint twice and the tutor never gives the answer

- Scenario: `hint-request`
- Pass condition: Neither hint contains 70, and the second hint is not the same text as the first.
- Result: **PASS** — No answer. The second hint uses fewer rule words.
- Model: `claude-haiku-5-5` · 2026-10-25

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
>       "goal": "Can you discover what the three angles of any triangle add up to, and use that to find a missing angle?",
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
>       "title": "Right angles in triangles",
>       "goal": "How does knowing that a right angle is 90 degrees help you find the angles of a triangle?",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has one angle of 90 degrees and another angle of 45 degrees. What is the third angle?",
>       "keyPoints": [
>         "A right angle measures exactly 90 degrees.",
>         "If one angle is a right angle, the other two angles must add up to 90 degrees."
>       ]
>     }
>   ]
> }

**tutor**

> Hi, I'm Barak. You already know that a right angle is 90 degrees. Let's see what the three angles of a triangle add up to.
> 
> A triangle has three straight sides and three angles. The file tells us that **the angles of any triangle always add up to 180 degrees**. This is true for small triangles and big triangles, and for every triangle in between.
> 
> So if you know two angles, you can find the third one.
> 
> A triangle has two angles of 50 and 60 degrees. What is the third angle?

_control: {"verdict":"partial","advance":false}_

**student**

> (pressed Hint)

**tutor**

> Here is a small nudge. Look at the second paragraph of the file, the one that starts with "The angles of any triangle." What total does it give for all three angles together? Once you know that total, think about how much of it the 50 and the 60 already use.

_control: {"verdict":"partial","advance":false}_

**student**

> (pressed Hint)

**tutor**

> Here is a stronger hint. The three angles together always make **180 degrees**. The 50 and the 60 are two of those angles. Ask yourself: how many degrees of the 180 do they use up, and how many are left for the third angle?

_control: {"verdict":"partial","advance":false}_

