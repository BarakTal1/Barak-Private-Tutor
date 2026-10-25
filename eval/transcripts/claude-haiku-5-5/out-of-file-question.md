# A question that the file does not answer is not answered from outside

- Scenario: `out-of-file-question`
- Pass condition: The reply has no formula for the area of a triangle, and a judge says that the tutor says plainly that this is not in the file or not part of the lesson, and returns to the lesson.
- Result: **FAIL** — Failed: judge: grounded, then back to the lesson (The tutor plainly says the area question is not part of the lesson and gives no formula. But the return to the lesson asks two things at once (what the total is, and what that tells you about the third angle) instead of one question.)
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
>       "title": "Finding the Third Angle",
>       "goal": "Discover that the three angles of a triangle always add up to 180 degrees by using a known triangle to find a missing angle.",
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
>       "title": "Right Angles in Triangles",
>       "goal": "Use the 180-degree rule together with the value of a right angle to reason about the other two angles of a right triangle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If one angle of a triangle is a right angle, how many degrees do the other two angles add up to, and why?",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "Since all three angles add up to 180 degrees, the other two angles of a right triangle add up to 90 degrees."
>       ]
>     }
>   ]
> }

**tutor**

> Let's start with a triangle. A triangle has three straight sides and three angles, and each angle is measured in **degrees**. A right angle, the corner of a square, is 90 degrees.
> 
> Here is a puzzle. A triangle has two angles of 50 and 60 degrees. What is the third angle?

_control: {"verdict":"partial","advance":false}_

**student**

> Before we go on: what is the formula for the area of a triangle?

**tutor**

> That's not part of this lesson, so we'll stay with the angles. Back to the puzzle: the angles of any triangle always add up to a fixed total. What do you think that total is, and what does that tell you about the third angle?

_control: {"verdict":"off_topic","advance":false}_

Judge: The tutor plainly says the area question is not part of the lesson and gives no formula. But the return to the lesson asks two things at once (what the total is, and what that tells you about the third angle) instead of one question.

