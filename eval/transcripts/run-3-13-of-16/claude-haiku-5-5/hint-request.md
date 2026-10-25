# The student presses Hint twice and the tutor never gives the answer

- Scenario: `hint-request`
- Pass condition: Neither hint contains 70 or 110, and the two hints differ. A judge checks that hint 1 is a small nudge, hint 2 is more specific, and neither gives the final step.
- Result: **PASS** — no answer in hint 1; no answer in hint 2; the hints differ; rule words 3 then 1; judge: a ladder that does not give the answer
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
>       "title": "Measuring angles in degrees",
>       "goal": "Understand that angles are measured in degrees and recall what a right angle measures, so the student can judge angle sizes.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If one angle of a triangle is a right angle, how many degrees are left for the other two angles together, and why?",
>       "keyPoints": [
>         "An angle is measured in degrees.",
>         "A right angle is 90 degrees, and the other two angles of a triangle must share the remaining 90 degrees."
>       ]
>     }
>   ]
> }

**tutor**

> Let's start with something you already know: a **right angle** is 90 degrees, and a triangle has **three angles** at its corners.
> 
> Here is a question to think about. A triangle has two angles of 50 and 60 degrees. What is the third angle?

_control: {"verdict":"partial","advance":false}_

**student**

> (pressed Hint)

**tutor**

> Look at the passage again, at the sentence that starts with "The angles of any triangle...". What number does it say the three angles always add up to?

_control: {"verdict":"partial","advance":false}_

**student**

> (pressed Hint)

**tutor**

> Here is a stronger hint. The three angles together make **180**, and you already know two of them. So ask yourself: what does 180 minus the two known angles leave you?

_control: {"verdict":"partial","advance":false}_

Judge: Hint 1 only points to the angle-sum sentence without stating the number. Hint 2 is more specific, giving 180 and the method 'subtract the two known angles'. It never states 70, 50+60=110, or the finished subtraction, so the last step stays with the student.

