# A simulated good student finishes the whole lesson

- Scenario: `full-lesson-simulated-student`
- Pass condition: A model plays a good student. The lesson reaches the end within 16 turns, with no forced explanation. A judge reads the whole conversation: one question at a time, the next step only after a right answer, specific praise, a short wrap-up, and no fact that is not in the file.
- Result: **FAIL** — Failed: judge: a good lesson, grounded in the file (The tutor states facts that are not in the file text: a right angle is "a quarter of a full turn", and a straight line is "a half turn" of 180 degrees. Also, the tutor never asks the 60/70 missing-angle question the student answers, and two tutor turns end without any question.)
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
>       "goal": "Use questions to help the student recall the parts of a triangle and how angles are measured.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "How many sides and how many angles does a triangle have, and what unit is used to measure an angle?",
>       "keyPoints": [
>         "A triangle has three straight sides and three angles.",
>         "Angles are measured in degrees.",
>         "A right angle is 90 degrees."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "The angles always add up",
>       "goal": "Guide the student to discover that the three angles of any triangle add up to 180 degrees, by asking what they notice about different triangles.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "What do the three angles of any triangle add up to, and does this change for big or small triangles?",
>       "keyPoints": [
>         "The angles of any triangle always add up to 180 degrees.",
>         "This rule holds for every triangle, whatever its size."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "Using the rule to find a missing angle",
>       "goal": "Ask the student to use the 180-degree rule to find an unknown angle, and to explain each step of their reasoning.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If two angles of a triangle are 60 degrees and 70 degrees, how many degrees is the third angle, and how do you know?",
>       "keyPoints": [
>         "Since all three angles add up to 180 degrees, a missing angle equals 180 minus the sum of the other two.",
>         "The third angle in the example is 50 degrees (180 - 60 - 70)."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! Let's start with a shape you probably see every day: the triangle. Before we look at its parts, tell me in your own words: what does a triangle look like? What makes it different from a square?

_control: {"verdict":"partial","advance":false}_

**student**

> A triangle has three straight sides and three angles, and a square has four sides. Angles are measured in degrees, like a right angle is 90 degrees.

**tutor**

> Yes, you've got it: a triangle has **three straight sides** and **three angles**, and angles are measured in **degrees**. A right angle is 90 degrees, which is a quarter of a full turn.

_control: {"verdict":"correct","advance":true}_

**student**

> The three angles always add up to 180 degrees. It doesn't change for big or small triangles, it works for every triangle.

**tutor**

> Yes, the three angles of a triangle always add up to **180 degrees**, whatever the size of the triangle. Since we can't measure every triangle in the world, how could you convince a friend that this is true for *every* triangle? Tell me your idea, even if it's just a guess.

_control: {"verdict":"partial","advance":false}_

**student**

> I guess I could draw a few triangles, some big and some small, and measure their angles to see if they all add up to 180. If they do, I'd say it's probably true for every triangle, no matter the size.

**tutor**

> Testing several triangles, big and small, is a smart way to check an idea. Your guess is a good start, and it's the same kind of thinking mathematicians use. Here's a question to go further: if you cut off the three corners of a paper triangle and put the points together side by side, what do you think you would see?

_control: {"verdict":"partial","advance":false}_

**student**

> I think the three corners would fit together to make a straight line, because the angles add up to 180 degrees. It should work for any triangle, big or small.

**tutor**

> The three angles of any triangle add up to **180 degrees**, whatever the size of the triangle. If you tear off the three corners and put their points together at one spot, the angles sit side by side along a straight line. A straight line makes a half turn, and a half turn is 180 degrees, so the three angles must total 180. Your idea to test several triangles was a good way to start, and this picture shows why it holds for every triangle.

_control: {"verdict":"correct","advance":true}_

**student**

> The third angle is 50 degrees. I know because all three angles in a triangle add up to 180, so I did 60 plus 70, which is 130, and then 180 minus 130 is 50.

**tutor**

> Yes, the third angle is **50 degrees**. You used the 180-degree rule and showed each step: first you added the two known angles, then you subtracted that sum from 180.
> 
> Here is a recap of the whole lesson:
> 
> - The three angles of **every** triangle always add up to **180 degrees**, whatever its size.
> - You can see why: put the three corners together and they make a straight line, which is a half turn of 180 degrees.
> - To find a missing angle, subtract the two known angles from 180, for example 180 − 60 − 70 = 50.

_control: {"verdict":"correct","advance":true}_

Turns: 5. Judge: The tutor states facts that are not in the file text: a right angle is "a quarter of a full turn", and a straight line is "a half turn" of 180 degrees. Also, the tutor never asks the 60/70 missing-angle question the student answers, and two tutor turns end without any question.

