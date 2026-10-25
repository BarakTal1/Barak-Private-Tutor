# A simulated good student finishes the whole lesson

- Scenario: `full-lesson-simulated-student`
- Pass condition: A model plays a good student. The lesson reaches the end within 16 turns, with no forced explanation. A judge reads the whole conversation: one question at a time, the next step only after a right answer, specific praise, a short wrap-up, and no fact that is not in the file.
- Result: **FAIL** — Failed: judge: a good lesson, grounded in the file (The first tutor message asks two questions at once ("What do you notice about the sides?" and "how many sides and angles?"), which breaks rule 1. The tutor also says that when a triangle gets bigger its angles can stay the same, which is not in the file text, which breaks rule 5.)
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
>       "goal": "Use Socratic questions to help the student describe a triangle by its sides and angles.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "How many straight sides and how many angles does every triangle have?",
>       "keyPoints": [
>         "A triangle is a shape with three straight sides.",
>         "A triangle also has three angles."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "The angles always add up to 180",
>       "goal": "Help the student discover that the three angles of any triangle always total 180 degrees, whatever its size.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If two angles of a triangle measure 60 degrees and 70 degrees, how many degrees is the third angle, and how do you know?",
>       "keyPoints": [
>         "The three angles of any triangle always add up to 180 degrees.",
>         "This rule holds for big and small triangles alike, so you can use it to find a missing angle."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "Degrees and the right angle",
>       "goal": "Help the student understand that angles are measured in degrees and use the right angle (90 degrees) as a reference point.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If a triangle has one right angle, how many degrees are left for its other two angles together?",
>       "keyPoints": [
>         "Angles are measured in degrees.",
>         "A right angle is 90 degrees, so a triangle with a right angle has 90 degrees left to share between its other two angles."
>       ]
>     }
>   ]
> }

**tutor**

> Hi there! Let's start with a shape you probably know well: the triangle. Think of a slice of pizza, or a yield sign on the road. What do you notice about the sides of a triangle?
> 
> Here is a question to start with: **how many straight sides and how many angles does every triangle have?**

_control: {"verdict":"partial","advance":false}_

**student**

> Every triangle has three straight sides and three angles.

**tutor**

> Yes, that's right. A triangle has **three straight sides** and **three angles**, and that is what makes it a triangle. Your answer matches the lesson text exactly.

_control: {"verdict":"correct","advance":true}_

**tutor**

> Now let's look at the angles inside a triangle. We measure angles in **degrees**, and a right angle is 90 degrees. The file says that the three angles of **any** triangle always add up to **180 degrees**, whether the triangle is big or small.
> 
> Before you check that yourself, what do you think: if a triangle is much bigger, would its three angles add up to more than 180 degrees, less, or the same?

_control: {"verdict":"partial","advance":false}_

**student**

> I think it would still be the same, 180 degrees. The file says any triangle adds up to 180, big or small.

**tutor**

> Good thinking, and you are right that the file says any triangle has angles that add up to 180 degrees. Now try it in your own words. If a triangle gets bigger, why do you think its angles would still add up to the same total?

_control: {"verdict":"partial","advance":false}_

**student**

> I think it's because the rule works for every triangle, big or small. Making a triangle bigger just stretches the sides, but the angles still add up to 180 degrees.

**tutor**

> You noticed something useful: when a triangle gets bigger, its sides get longer but its angles can stay the same. The file tells us the total is 180 degrees for every triangle, so we can use that rule to find a missing angle.
> 
> Let's try it. Two angles of a triangle measure **60 degrees** and **70 degrees**. How many degrees is the third angle, and how do you know?

_control: {"verdict":"partial","advance":false}_

**student**

> The third angle is 50 degrees. I know because all three angles in a triangle add up to 180, and 60 + 70 is 130, so 180 − 130 is 50.

**tutor**

> That's exactly right. You used the rule that the angles of any triangle add up to 180 degrees, then subtracted the two known angles, 60 + 70 = 130, from the total: 180 − 130 = 50. You also explained why the method works, which is what makes this a strong answer.

_control: {"verdict":"correct","advance":true}_

**tutor**

> Angles are measured in **degrees**, and we already used degrees when we found the missing angle of 50 degrees. Now let's look at one special angle: the **right angle**, which measures **90 degrees**.
> 
> Think of it as a reference point. A right angle is 90 degrees, and every triangle's angles add up to 180 degrees. So if you know one angle is a right angle, you can work out how much is left for the other two.
> 
> Here is the question to start with: if a triangle has one right angle, how many degrees are left for its other two angles together?

_control: {"verdict":"partial","advance":false}_

**student**

> There are 90 degrees left for the other two angles together, because the right angle uses up 90 of the 180.

**tutor**

> That's right, and your reason is the key part: the right angle uses 90 of the 180 degrees, so 90 are left for the other two angles.
> 
> Here is a recap of the whole lesson:
> 
> - A triangle has three angles, and they always add up to **180 degrees**, whatever its size.
> - Angles are measured in **degrees**, and a **right angle** is **90 degrees**.
> - If you know some of the angles, subtract them from 180 to find the missing one.

_control: {"verdict":"correct","advance":true}_

Turns: 5. Judge: The first tutor message asks two questions at once ("What do you notice about the sides?" and "how many sides and angles?"), which breaks rule 1. The tutor also says that when a triangle gets bigger its angles can stay the same, which is not in the file text, which breaks rule 5.

