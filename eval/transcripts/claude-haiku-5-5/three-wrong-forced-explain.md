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
>         "The angles of any triangle always add up to 180 degrees.",
>         "To find a missing angle, subtract the known angles from 180."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "Degrees and the right angle",
>       "goal": "Understand that angles are measured in degrees and that a right angle is 90 degrees, then apply the 180-degree rule with a right angle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has one right angle and one angle of 30 degrees. How many degrees is the third angle, and how do you know?",
>       "keyPoints": [
>         "An angle is measured in degrees, and a right angle is 90 degrees.",
>         "A triangle with a right angle has two remaining angles that add up to 90 degrees, because all three angles add up to 180."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! Let's explore triangles. A triangle has three straight sides and three angles, and angles are measured in degrees. You already know a right angle is 90 degrees. The file tells us that the angles of **any** triangle always add up to 180 degrees, whether the triangle is big or small.
> 
> Here is a question for you to try:
> 
> **A triangle has two angles of 50 and 60 degrees. What is the third angle?**

_control: {"verdict":"partial","advance":false}_

**student**

> I think it is 100

**tutor**

> Thanks for giving it a try! Let's check your thinking. Remember that the three angles of any triangle add up to 180 degrees. How did you get 100? Tell me the steps you used.

_control: {"verdict":"wrong","advance":false}_

**student**

> maybe 30?

**tutor**

> Thanks for trying again. Let's start with the two angles you already know. What do 50 and 60 add up to together?

_control: {"verdict":"wrong","advance":false}_

**student**

> I really do not know. 20?

**tutor**

> That's okay, this idea is new, and you tried. The answer is **70 degrees**. The two known angles add up to 50 + 60 = 110 degrees. The file says the three angles of any triangle always add up to 180 degrees, so the missing angle is what is left over: 180 − 110 = 70. Next, we will use this rule on new triangles.

_control: {"verdict":"wrong","advance":true}_

Judge (first two replies): Neither reply states 70 or the finished calculation. The first points to the 180-degree rule and asks for the student's steps. The second asks the student to add 50 and 60 without giving the sum, so it scaffolds without revealing the answer.

Judge (explanation): The final reply kindly reassures the student, shows 50+60=110 and 180−110=70 using the rule, stays well under 120 words, and moves on to new triangles.

