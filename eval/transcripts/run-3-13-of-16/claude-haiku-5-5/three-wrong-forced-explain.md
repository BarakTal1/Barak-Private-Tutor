# After three wrong answers the tutor explains and the lesson moves on

- Scenario: `three-wrong-forced-explain`
- Pass condition: The first two replies give no answer (a program and a judge). The third reply explains the answer (the number 70 appears), a judge says that the explanation is clear and kind, and the lesson state ends the step and moves on.
- Result: **FAIL** — Failed: judge: the explanation is clear and kind (The reply is short, kind, and correctly shows 50+60=110 and 180−110=70. But it ends with a statement about the method and never moves on or invites the student to continue, such as offering another problem or asking if they'd like to try one.)
- Model: `claude-haiku-5-5` · judge: `claude-sonnet-5-5` · 2026-10-25

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
>       "title": "Right angles in a triangle",
>       "goal": "Recognize that a right angle is 90 degrees and use it together with the 180-degree rule to find the remaining angle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has one right angle and one angle of 35 degrees. What is the third angle?",
>       "keyPoints": [
>         "A right angle measures 90 degrees.",
>         "If a triangle has a right angle, the other two angles together add up to 90 degrees."
>       ]
>     }
>   ]
> }

**tutor**

> Hi, I'm Barak, and I'm glad you're here. You already know that a triangle has three angles, and that a right angle measures 90 degrees. Here is a fact that holds for **every** triangle, big or small: its three angles always add up to **180 degrees**.
> 
> So if you know two of the angles, you can find the third by thinking about what is left over from 180.
> 
> Let's try it. **A triangle has two angles of 50 and 60 degrees. What is the third angle?**

_control: {"verdict":"partial","advance":false}_

**student**

> I think it is 100

**tutor**

> Thanks for trying. Let's check it step by step. The two angles we know are 50 and 60. **What do 50 and 60 add up to?**

_control: {"verdict":"wrong","advance":false}_

**student**

> maybe 30?

**tutor**

> Good that you are giving it a go. Let's check the addition with tens. **50 is 5 tens and 60 is 6 tens. How many tens are there altogether?**

_control: {"verdict":"wrong","advance":false}_

**student**

> I really do not know. 20?

**tutor**

> That's okay, and your guess of 100 was a good try. The answer is **70 degrees**. First, add the two known angles: $50 + 60 = 110$. The passage says the three angles of any triangle **always add up to 180 degrees**, so the missing angle is what is left over: $180 - 110 = 70$. Each step of this method uses a rule from the lesson, so you can use it on any triangle.

_control: {"verdict":"wrong","advance":true}_

Judge (first two replies): Neither of the first two tutor replies states 70, 110, or the finished calculation. The first asks the student to add 50 and 60, and the second scaffolds that addition with tens without revealing the sum or the third angle.

Judge (explanation): The reply is short, kind, and correctly shows 50+60=110 and 180−110=70. But it ends with a statement about the method and never moves on or invites the student to continue, such as offering another problem or asking if they'd like to try one.

