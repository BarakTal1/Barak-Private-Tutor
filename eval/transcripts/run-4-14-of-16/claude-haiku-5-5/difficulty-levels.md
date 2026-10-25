# The difficulty button changes how the tutor teaches

- Scenario: `difficulty-levels`
- Pass condition: The plan keeps the difficulty (easy and challenging), and a judge, asked twice with the order swapped, picks the easy lesson as the easier one both times.
- Result: **PASS** — plan difficulty easy: "easy"; plan difficulty challenging: "challenging"; judge picks easy as easier (easy first); judge picks easy as easier (easy second)
- Model: `claude-haiku-5-5` · judge: `claude-sonnet-5-5` · 2026-10-25

**plan**

> {
>   "title": "Angles of a Triangle",
>   "language": "English",
>   "audience": "7th grade students",
>   "difficulty": "easy",
>   "estimatedMinutes": 10,
>   "steps": [
>     {
>       "id": "s1",
>       "title": "What makes a triangle?",
>       "goal": "Help the student recall the parts of a triangle: three straight sides and three angles.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "How many sides and how many angles does a triangle have?",
>       "keyPoints": [
>         "A triangle is a shape with three straight sides.",
>         "A triangle also has three angles."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "Measuring angles",
>       "goal": "Introduce degrees as the unit for measuring angles and the right angle as 90 degrees.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "What unit do we use to measure an angle, and how many degrees is a right angle?",
>       "keyPoints": [
>         "An angle is measured in degrees.",
>         "A right angle is 90 degrees."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "The total of the angles",
>       "goal": "Guide the student to discover that the three angles of a triangle add up to a fixed total.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If you add up all three angles of a triangle, what total do you get?",
>       "keyPoints": [
>         "The angles of any triangle always add up to 180 degrees.",
>         "The total is the same no matter what the triangle looks like."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "Does it work for every triangle?",
>       "goal": "Ask the student to test the idea on different triangles and see that the rule holds for all sizes.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Does the rule that the angles add up to 180 degrees hold for a small triangle as well as a big one?",
>       "keyPoints": [
>         "The 180-degree rule is true for every triangle, big or small.",
>         "Size does not change the total of the angles."
>       ]
>     },
>     {
>       "id": "s5",
>       "title": "Finding a missing angle",
>       "goal": "Use the 180-degree rule to find an unknown angle when the other two are known.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has angles of 90 degrees and 40 degrees. How many degrees is the third angle, and how do you know?",
>       "keyPoints": [
>         "Since all three angles add up to 180 degrees, subtract the known angles from 180.",
>         "In this example the third angle is 50 degrees."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! Let's start with the basic shape: the triangle. Think of a slice of pizza or a yield sign on the road. What do you notice about its edges and its corners?
> 
> Here is the key idea from our file: a **triangle** is a shape with three straight sides and three angles. An **angle** is the corner where two sides meet.
> 
> Can you tell me how many sides and how many angles a triangle has? Try to count them in your head first, then tell me your answer.

_control: {"verdict":"partial","advance":false}_

**plan**

> {
>   "title": "Angles of a Triangle",
>   "language": "English",
>   "audience": "7th grade students",
>   "difficulty": "challenging",
>   "estimatedMinutes": 10,
>   "steps": [
>     {
>       "id": "s1",
>       "title": "What makes a triangle a triangle?",
>       "goal": "The student describes a triangle by its sides and angles, using the definition in the text.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If a shape has four straight sides, could it be a triangle? Why or why not?",
>       "keyPoints": [
>         "A triangle is a shape with three straight sides and three angles.",
>         "The number of sides and angles is what defines a triangle."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "How do we measure angles?",
>       "goal": "The student explains that angles are measured in degrees and identifies a right angle as a reference.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If one angle is a right angle, how many degrees is it, and how would you describe it compared with a 45-degree angle?",
>       "keyPoints": [
>         "An angle is measured in degrees.",
>         "A right angle is 90 degrees, which serves as a reference for other angles."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "The total of the three angles",
>       "goal": "The student states the rule that the three angles of any triangle add up to 180 degrees.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If the three angles of a triangle are 60, 60 and 60 degrees, what is their sum, and what does that tell you?",
>       "keyPoints": [
>         "The angles of any triangle always add up to 180 degrees.",
>         "This total is the same for every triangle."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "Finding a missing angle",
>       "goal": "The student uses the 180-degree rule to find an unknown angle when the other two are known.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has angles of 50 degrees and 70 degrees. How many degrees is the third angle, and how did you know?",
>       "keyPoints": [
>         "Because the angles always add up to 180 degrees, one missing angle can be found from the other two.",
>         "Subtract the known angles from 180 to find the unknown one."
>       ]
>     },
>     {
>       "id": "s5",
>       "title": "Why does the rule hold for every triangle?",
>       "goal": "The student reflects on the words 'always' and 'big or small' and why they matter for the rule.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "The text says the rule is true 'for every triangle, big or small.' What would a student need to see to believe a rule like this, and does the text give that evidence?",
>       "keyPoints": [
>         "The text claims the 180-degree rule is true for every triangle, regardless of size.",
>         "A rule that holds for all cases can be used on any triangle a student meets."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! Let's start with a question that asks you to reason. Our text says a triangle is **a shape with three straight sides and three angles**.
> 
> If a shape has four straight sides, could it be a triangle? Tell me what you think and why.

_control: {"verdict":"partial","advance":false}_

Easy opening:

Hi! Let's start with the basic shape: the triangle. Think of a slice of pizza or a yield sign on the road. What do you notice about its edges and its corners?

Here is the key idea from our file: a **triangle** is a shape with three straight sides and three angles. An **angle** is the corner where two sides meet.

Can you tell me how many sides and how many angles a triangle has? Try to count them in your head first, then tell me your answer.

Challenging opening:

Hi! Let's start with a question that asks you to reason. Our text says a triangle is **a shape with three straight sides and three angles**.

If a shape has four straight sides, could it be a triangle? Tell me what you think and why.

Judge, easy first: {"easier":"A","reason":"A uses a concrete example (pizza slice, yield sign), defines terms, and asks a simple counting question with smaller steps. B opens with a reasoning question and ends with a deeper evidence-based question about why the rule holds, giving less support."}

Judge, easy second: {"easier":"B","reason":"B uses concrete examples (pizza slice, yield sign), defines the terms, and asks a simple counting question about sides and angles. Its check questions are recall-level. A opens with a reasoning question and no concrete example, and its checks ask for justification and evaluating evidence, which makes it the challenging version."}

