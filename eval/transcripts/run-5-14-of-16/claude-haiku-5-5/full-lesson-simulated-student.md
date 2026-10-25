# A simulated good student finishes the whole lesson

- Scenario: `full-lesson-simulated-student`
- Pass condition: A model plays a good student. The lesson reaches the end within 16 turns, with no forced explanation. A judge reads the whole conversation: one question at a time, the next step only after a right answer, specific praise, a short wrap-up, and no fact that is not in the file.
- Result: **FAIL** — Failed: judge: a good lesson, grounded in the file (The first tutor message asks two questions ("What do you notice..." and the four-sided shape question) and never waits for an answer to the first. The tutor also adds facts that are not in the file text, such as "An angle is the corner where two sides meet" and the comparison of degrees to centimeters. Criteria 1 and 5 fail.)
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
>       "title": "What makes a triangle?",
>       "goal": "Help the student describe what a triangle is by asking what parts it has.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If a shape has four straight sides, could it be a triangle? Why or why not?",
>       "keyPoints": [
>         "A triangle is a shape with three straight sides and three angles.",
>         "The number of sides and angles is what identifies a triangle."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "How do we measure an angle?",
>       "goal": "Help the student understand that angles are measured in degrees and recognize a right angle as 90 degrees.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If one angle in a triangle is a right angle, how many degrees is it?",
>       "keyPoints": [
>         "An angle is measured in degrees.",
>         "A right angle is 90 degrees."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "What do the angles add up to?",
>       "goal": "Guide the student to discover that the three angles of any triangle always add up to the same total, and to reason about why this holds for every triangle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If two angles of a triangle measure 60 degrees and 70 degrees, what must the third angle be, and how do you know?",
>       "keyPoints": [
>         "The angles of any triangle always add up to 180 degrees.",
>         "This is true for every triangle, big or small."
>       ]
>     }
>   ]
> }

**tutor**

> Let's start with a shape you probably know well. Think of a slice of pizza or a roof's pointed top. What do you notice about its sides and corners?
> 
> A **triangle** is a shape with **three straight sides** and **three angles**. An angle is the corner where two sides meet. The number of sides and angles is what tells us a shape is a triangle.
> 
> Now try this: if a shape has four straight sides, could it be a triangle? Tell me what you think and why.

_control: {"verdict":"partial","advance":false}_

**student**

> No, it couldn't be a triangle. A triangle has to have exactly three straight sides and three angles, so a shape with four sides is something else.

**tutor**

> Yes, that's right, and your reason is the key part: a triangle is defined by having exactly three straight sides and three angles, so a four-sided shape can't be one.

_control: {"verdict":"correct","advance":true}_

**tutor**

> Earlier you found that a triangle has three angles. But how do we say how big an angle is? We measure angles in **degrees**, the same way we measure length in centimeters.
> 
> Think of the corner of a sheet of paper. That corner is a **right angle**, a special angle that is a square corner.
> 
> Based on that, how many degrees do you think a right angle is?

_control: {"verdict":"partial","advance":false}_

**student**

> I think a right angle is 90 degrees, like the corner of a sheet of paper.

**tutor**

> Yes, a right angle is **90 degrees**, and you connected it well to the square corner of a sheet of paper. So if one angle of a triangle is a right angle, that angle measures 90 degrees.

_control: {"verdict":"correct","advance":true}_

**tutor**

> Let's start the last step. You already know that a right angle is 90 degrees, and a triangle has three angles. What do you think the three angles of a triangle add up to? Make a guess, even if you're not sure.

_control: {"verdict":"partial","advance":false}_

**student**

> I think they add up to 180 degrees. I remember that the angles in any triangle always add up to 180.

**tutor**

> Yes, the three angles of a triangle add up to **180 degrees**. Remembering a rule is a good start, but I'd like to know your thinking too. Can you say in your own words why the total must be 180, and not some other number?

_control: {"verdict":"partial","advance":false}_

**student**

> I'm not totally sure why it's 180, I just know that's the rule for every triangle, big or small. I only know that it always adds up to 180, but I can't explain why it has to be that number.

**tutor**

> That's an honest answer, and it's fine not to know the reason yet. Our notes give us the rule, that the angles of any triangle always add up to 180 degrees, but they don't explain why. Let's use the rule and see what it tells us.
> 
> If two angles of a triangle measure 60 degrees and 70 degrees, what must the third angle be? Tell us how you got your answer.

_control: {"verdict":"partial","advance":false}_

**student**

> I add 60 and 70 and get 130. The angles in a triangle have to add up to 180, so I do 180 minus 130 and the third angle is 50 degrees.

**tutor**

> Your answer is right: the third angle is **50 degrees**. You added the two known angles, 60 + 70 = 130, and then subtracted that sum from the total, 180 − 130 = 50. You can check it: 60 + 70 + 50 = 180.
> 
> Now we will move on, and this is the last step of the lesson.
> 
> **Recap of the lesson:**
> - A triangle is a shape with three straight sides and three angles.
> - The angles of any triangle always add up to 180 degrees, whether the triangle is big or small.
> - If you know two angles, add them and subtract the sum from 180 to find the third.

_control: {"verdict":"correct","advance":true}_

Turns: 5. Judge: The first tutor message asks two questions ("What do you notice..." and the four-sided shape question) and never waits for an answer to the first. The tutor also adds facts that are not in the file text, such as "An angle is the corner where two sides meet" and the comparison of degrees to centimeters. Criteria 1 and 5 fail.

