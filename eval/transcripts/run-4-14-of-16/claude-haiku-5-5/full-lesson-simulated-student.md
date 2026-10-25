# A simulated good student finishes the whole lesson

- Scenario: `full-lesson-simulated-student`
- Pass condition: A model plays a good student. The lesson reaches the end within 16 turns, with no forced explanation. A judge reads the whole conversation: one question at a time, the next step only after a right answer, specific praise, a short wrap-up, and no fact that is not in the file.
- Result: **FAIL** — Failed: judge: a good lesson, grounded in the file (The tutor asked what the three angles add up to, but the student instead answered an unasked question about 50 and 60 degrees. The tutor accepted this as right, referring to a "check question" that was never asked, and moved on. So the step moved forward without a right answer to the question that was asked.) Rules for every message were broken (message 4: no control line).
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
>       "goal": "Recall what a triangle is and what its angles are, and how angles are measured.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "How many sides and how many angles does a triangle have, and what unit do we use to measure an angle?",
>       "keyPoints": [
>         "A triangle is a shape with three straight sides and three angles.",
>         "An angle is measured in degrees."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "The angles always add up to 180",
>       "goal": "Understand that the three angles of any triangle always add up to 180 degrees, whatever the triangle's size.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If you know that a triangle has angles of 50 degrees and 60 degrees, how many degrees must the third angle be, and why?",
>       "keyPoints": [
>         "The angles of any triangle always add up to 180 degrees.",
>         "This is true for every triangle, big or small."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "Using the right angle",
>       "goal": "Use the fact that a right angle is 90 degrees together with the 180-degree total to reason about a triangle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If one angle of a triangle is a right angle, how many degrees do the other two angles add up to?",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "The three angles of a triangle total 180 degrees, so the other two must total 180 minus the known angle."
>       ]
>     }
>   ]
> }

**tutor**

> Welcome to our lesson on the angles of a triangle! We'll start with the basics. Picture a triangle in your mind.
> 
> Before we look at any rules, what do you already notice about it? Count its **straight sides** and its **corners**. Tell me what you find.

_control: {"verdict":"partial","advance":false}_

**student**

> A triangle has 3 straight sides and 3 angles, which are the corners. We measure angles in degrees.

**tutor**

> That's right: a triangle has **3 straight sides** and **3 angles**, and we measure angles in **degrees**. You also connected the angles to the corners, which is a helpful way to picture them.

_control: {"verdict":"correct","advance":true}_

**tutor**

> Let's look at the angles inside a triangle. You already know that a **right angle** is 90 degrees. Two right angles make 180 degrees.
> 
> Before I tell you anything, what do you think the **three angles** of a triangle add up to? Give your best guess, even if you're not sure.

_control: {"verdict":"partial","advance":false}_

**student**

> The third angle has to be 70 degrees. The angles in any triangle add up to 180, and 50 + 60 is 110, so 180 − 110 = 70.

**tutor**

> Yes, the third angle is **70 degrees**. You used the rule that the angles of any triangle add up to 180 degrees, then subtracted the two angles you knew from 180. That is exactly the reasoning the check question asks for.

**student**

> Oh okay, so I add 50 and 60 to get 110, and then 180 minus 110 is 70. It works because the angles in any triangle always add up to 180.

**tutor**

> Yes, you explained it clearly: the angles of **any** triangle add up to 180 degrees, so the missing angle is whatever is left after you subtract the two you know. This rule holds for every triangle, big or small.

_control: {"verdict":"correct","advance":true}_

**tutor**

> Now let's combine two facts you already know: a **right angle** is 90 degrees, and the three angles of a triangle add up to 180 degrees.
> 
> Imagine a triangle where one of its angles is a right angle. Its first angle is 90 degrees. If all three angles must total 180, how many degrees do the other two angles add up to? Tell me how you got your answer.

_control: {"verdict":"partial","advance":false}_

**student**

> They add up to 90 degrees. I did 180 minus 90 because the whole triangle is 180 and the right angle already uses 90, so the other two angles have 90 left.

**tutor**

> Yes, the other two angles add up to **90 degrees**. You started with the total of 180, took away the 90 that the right angle already uses, and found what was left. That is the same method you used with the 50 and 60 angles.
> 
> Here is one more question to check your thinking: if the two other angles are equal, how big is each one?

_control: {"verdict":"partial","advance":false}_

**student**

> Each one would be 45 degrees. The two angles have to add up to 90, so I split 90 in half and got 45.

**tutor**

> Yes, each angle is **45 degrees**. You knew the two angles together make 90, and splitting them equally gives 45 each. You used the total you already had to find a missing part.
> 
> Here is a recap of the whole lesson:
> 
> - The angles of **any** triangle always add up to 180 degrees.
> - A **right angle** is 90 degrees, so it uses half of that 180 total.
> - If you know two angles of a triangle, subtract their sum from 180 to find the third.

_control: {"verdict":"correct","advance":true}_

Turns: 5. Judge: The tutor asked what the three angles add up to, but the student instead answered an unasked question about 50 and 60 degrees. The tutor accepted this as right, referring to a "check question" that was never asked, and moved on. So the step moved forward without a right answer to the question that was asked.

