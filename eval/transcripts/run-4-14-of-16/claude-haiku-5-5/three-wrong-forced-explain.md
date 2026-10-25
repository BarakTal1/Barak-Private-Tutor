# After three wrong answers the tutor explains and the lesson moves on

- Scenario: `three-wrong-forced-explain`
- Pass condition: The first two replies give no answer (a program and a judge). The third reply explains the answer (the number 70 appears), a judge says that the explanation is clear and kind, and the lesson state ends the step and moves on.
- Result: **PASS** — no answer in reply 1; no answer in reply 2; judge: replies 1 and 2 hold back; reply 3 gives the answer (70); judge: the explanation is clear and kind; the step ended (step index 1); the message has the stuck mood (stuck)
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
>       "goal": "Understand that the three angles of any triangle always add up to 180 degrees, and use this to find a missing angle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has two angles of 50 and 60 degrees. What is the third angle?",
>       "keyPoints": [
>         "The three angles of every triangle always add up to 180 degrees.",
>         "To find a missing angle, subtract the known angles from 180."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "Right angles in a triangle",
>       "goal": "Use the 180-degree rule together with the meaning of a right angle (90 degrees) to reason about what a triangle can contain.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Can a triangle have two right angles? Explain how you know, using the total of its angles.",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "Two right angles would already add up to 180 degrees, leaving nothing for the third angle, so a triangle cannot have two right angles."
>       ]
>     }
>   ]
> }

**tutor**

> Let's start with the triangle, a shape with three straight sides and three angles. Before I tell you the rule, what do you think: if you know two of a triangle's angles, could you work out the third?
> 
> Here is the rule from our lesson: **the three angles of any triangle always add up to 180 degrees**. It works for every triangle, big or small. A right angle is 90 degrees, so two right angles together make 180 degrees.
> 
> Now try this one: **A triangle has two angles of 50 and 60 degrees. What is the third angle?**

_control: {"verdict":"partial","advance":false}_

**student**

> I think it is 100

**tutor**

> Thanks for trying. Let's check it together. The two angles you know are 50 and 60. How many degrees do they make when you put them together? Then ask yourself: how much more do the three angles need to reach 180?

_control: {"verdict":"wrong","advance":false}_

**student**

> maybe 30?

**tutor**

> You're trying different numbers, and that helps. Let's go one small step at a time. What do the two known angles make when you add them: 50 + 60 = ?

_control: {"verdict":"wrong","advance":false}_

**student**

> I really do not know. 20?

**tutor**

> Thanks for keeping at it. The answer is **70 degrees**. The two known angles add up to 50 + 60 = 110. The three angles of every triangle add up to 180, so the missing angle is 180 − 110 = 70. You can check it: 50 + 60 + 70 = 180. Now we will move on to the next step.

_control: {"verdict":"wrong","advance":true}_

Judge (first two replies): Neither of the two replies gives 70, the finished sum 110, or 180 - 110. The first points to the 180 rule and asks guiding questions. The second only poses '50 + 60 = ?' and leaves it for the student to solve.

Judge (explanation): The last reply gives the answer of 70 degrees and shows the steps: 50+60=110, 180−110=70, plus a check. The tone is kind and does not blame the student, it ends by moving on, and it is well under 120 words.

