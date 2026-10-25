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
>       "title": "What is a triangle?",
>       "goal": "Help the student recall what makes a shape a triangle: three straight sides and three angles.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "How many straight sides and how many angles does a triangle have?",
>       "keyPoints": [
>         "A triangle is a shape with three straight sides.",
>         "A triangle also has three angles."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "What is an angle measured in?",
>       "goal": "Help the student understand that angles are measured in degrees.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "What unit do we use to measure an angle, and what would you say a right angle measures?",
>       "keyPoints": [
>         "An angle is measured in degrees.",
>         "A right angle is 90 degrees."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "The total of the angles",
>       "goal": "Help the student discover that the three angles of a triangle always add up to the same total.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If the three angles of a triangle always add up to a fixed number, what number is it, and why might that be useful when you know two of the angles?",
>       "keyPoints": [
>         "The angles of any triangle always add up to 180 degrees.",
>         "This is true for every triangle, big or small."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "Does size matter?",
>       "goal": "Help the student see that the 180-degree rule applies to every triangle, no matter its size.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Does a very large triangle and a very small triangle have angles that add up to the same total? What does the text say?",
>       "keyPoints": [
>         "The rule works for every triangle, big or small.",
>         "Size does not change the total of 180 degrees."
>       ]
>     },
>     {
>       "id": "s5",
>       "title": "Putting it together",
>       "goal": "Help the student connect the ideas: a triangle has three angles, angles are measured in degrees, and together they make 180 degrees.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If one angle of a triangle is a right angle (90 degrees), how many degrees are left for the other two angles together?",
>       "keyPoints": [
>         "A right angle is 90 degrees, and the three angles of any triangle add up to 180 degrees.",
>         "So if you know two angles, you can find the third."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! Let's start with a shape you probably already know: the **triangle**. Think about a slice of pizza or a yield sign on the road. Those shapes are triangles.
> 
> A triangle is a shape made of **straight sides** joined together, and it also has **angles**. An angle is the corner where two sides meet.
> 
> So, how many straight sides do you think a triangle has, and how many angles?

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
>       "title": "What makes a triangle?",
>       "goal": "Help the student describe a triangle by its sides and angles.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If a shape has four straight sides, can it be a triangle? Why or why not?",
>       "keyPoints": [
>         "A triangle is a shape with three straight sides and three angles.",
>         "The number of sides and angles is what defines a triangle."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "How angles are measured",
>       "goal": "Help the student understand that angles are measured in degrees and know the size of a right angle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "What unit do we use to measure an angle, and how many of those units make a right angle?",
>       "keyPoints": [
>         "An angle is measured in degrees.",
>         "A right angle is 90 degrees."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "The sum of the angles",
>       "goal": "Help the student discover the rule that the three angles of a triangle add up to a fixed total.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "What do the three angles of any triangle add up to, and how do you know?",
>       "keyPoints": [
>         "The angles of any triangle always add up to 180 degrees.",
>         "The total of the three angles is the same for every triangle."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "Does the rule hold for every triangle?",
>       "goal": "Help the student apply the rule to triangles of different sizes and test whether it always holds.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has angles of 50 degrees and 60 degrees. What must its third angle be, and why?",
>       "keyPoints": [
>         "The 180-degree rule is true for every triangle, big or small.",
>         "If you know two angles, you can find the third by subtracting their sum from 180 degrees."
>       ]
>     },
>     {
>       "id": "s5",
>       "title": "Putting it together with a right angle",
>       "goal": "Help the student combine the right angle and the 180-degree rule to reason about a special triangle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has one right angle. How many degrees are left for its other two angles together, and why?",
>       "keyPoints": [
>         "A right angle is 90 degrees, so it uses half of the 180 degrees in a triangle.",
>         "The other two angles of a triangle with a right angle must add up to 90 degrees."
>       ]
>     }
>   ]
> }

**tutor**

> Welcome to the first step! Our file says that a **triangle** is a shape with three straight sides and three angles. Angles are measured in degrees, and a right angle is 90 degrees.
> 
> Before we go on, make a prediction. A shape has four straight sides. Can it be a triangle? Tell me your guess and why you think so.

_control: {"verdict":"partial","advance":false}_

Easy opening:

Hi! Let's start with a shape you probably already know: the **triangle**. Think about a slice of pizza or a yield sign on the road. Those shapes are triangles.

A triangle is a shape made of **straight sides** joined together, and it also has **angles**. An angle is the corner where two sides meet.

So, how many straight sides do you think a triangle has, and how many angles?

Challenging opening:

Welcome to the first step! Our file says that a **triangle** is a shape with three straight sides and three angles. Angles are measured in degrees, and a right angle is 90 degrees.

Before we go on, make a prediction. A shape has four straight sides. Can it be a triangle? Tell me your guess and why you think so.

Judge, easy first: {"easier":"A","reason":"A opens with concrete everyday examples (pizza slice, yield sign), defines 'angle' simply, and asks a basic recall question about sides and angles. Its check questions are smaller, more supportive steps. B gives the facts up front and asks for a prediction with reasoning, and its checks ask 'why' and need calculation, which makes it the more challenging version."}

Judge, easy second: {"easier":"B","reason":"B opens with concrete everyday examples (pizza slice, yield sign), uses simpler wording, and asks a small recall question (how many sides and angles). A asks for a prediction with a reason and has check questions that repeatedly require justification ('why', 'how do you know'), so it is the more challenging version."}

