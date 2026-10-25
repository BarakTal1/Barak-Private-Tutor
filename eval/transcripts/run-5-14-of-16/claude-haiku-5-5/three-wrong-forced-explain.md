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
>         "The three angles of any triangle always add up to 180 degrees.",
>         "To find a missing angle, subtract the known angles from 180."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "Testing whether a triangle is possible",
>       "goal": "Use the 180-degree rule to decide whether a set of three angles can form a triangle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Could a triangle have angles of 100 degrees and 90 degrees? Why or why not?",
>       "keyPoints": [
>         "This rule holds for every triangle, big or small.",
>         "If two angles already add up to more than 180 degrees, the third angle cannot make the total 180, so no triangle can have those angles."
>       ]
>     }
>   ]
> }

**tutor**

> Let's start with a fact you can test yourself. A right angle is 90 degrees, and every triangle has three angles. The file says that **the three angles of any triangle always add up to 180 degrees**, for big triangles and small ones alike.
> 
> Using that fact, try this:
> 
> **A triangle has two angles of 50 and 60 degrees. What is the third angle?**

_control: {"verdict":"partial","advance":false}_

**student**

> I think it is 100

**tutor**

> Thanks for trying. Let's check it together. What do the two known angles, 50 and 60, add up to? Then ask yourself: if all three angles must reach 180 in total, how much is still missing?

_control: {"verdict":"wrong","advance":false}_

**student**

> maybe 30?

**tutor**

> Thanks for giving it a go. Let's go one step at a time. What is 50 + 60?

_control: {"verdict":"wrong","advance":false}_

**student**

> I really do not know. 20?

**tutor**

> The answer is **70 degrees**. First add the two known angles: 50 + 60 = 110. Every triangle's angles add up to 180, so the missing angle is what is left over: 180 − 110 = 70. Your earlier guesses were close to the idea, and that kind of trying is how this works. Let's move on to the next step.

_control: {"verdict":"wrong","advance":true}_

Judge (first two replies): Neither of the two tutor replies states 70, the sums 50 + 60 = 110 or 180 - 110, or anything that gives away the answer. They only point to the 180-degree rule and ask the student to do the steps, starting with 50 + 60.

Judge (explanation): The last reply gives 70 degrees and shows the steps (50 + 60 = 110, then 180 − 110 = 70) using the 180-degree rule. It is kind, does not blame the student, is about 65 words, and ends by moving on.

