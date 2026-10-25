# The difficulty button changes how the tutor teaches

- Scenario: `difficulty-levels`
- Pass condition: The plan keeps the difficulty (easy and challenging), and a judge, asked twice with the order swapped, picks the easy lesson as the easier one both times.
- Result: **FAIL** — Failed: judge picks easy as easier (easy first)
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
>       "goal": "Recall the parts of a triangle: three straight sides and three angles.",
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
>       "title": "How are angles measured?",
>       "goal": "Understand that angles are measured in degrees and that a right angle is 90 degrees.",
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
>       "goal": "Discover that the three angles of a triangle always add up to the same total.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If you know two angles of a triangle, how could you use the total to find the third one?",
>       "keyPoints": [
>         "The angles of any triangle always add up to 180 degrees.",
>         "If two angles are known, the third angle is what is left to reach 180 degrees."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "Does it work for every triangle?",
>       "goal": "Test whether the rule depends on the size or shape of the triangle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Does the 180-degree total change if a triangle is very big or very small? Why do you think the text says this?",
>       "keyPoints": [
>         "The total of 180 degrees is true for every triangle, big or small.",
>         "The size of a triangle does not change the sum of its angles."
>       ]
>     },
>     {
>       "id": "s5",
>       "title": "Putting it together",
>       "goal": "Combine the ideas: triangle parts, degrees, and the 180-degree total, to solve a simple problem.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has a right angle (90 degrees) and one angle of 30 degrees. How many degrees is the third angle, and how do you know?",
>       "keyPoints": [
>         "Use the total of 180 degrees to find a missing angle.",
>         "Subtract the known angles from 180 degrees to find the unknown angle."
>       ]
>     }
>   ]
> }

**tutor**

> Hi, I'm Barak, and I'm glad to be learning with you. Let's start with a shape you already know.
> 
> A **triangle** is a shape with **three straight sides**. Think of a slice of pizza: its edges are straight, and its pointy corners are where two sides meet. Each corner is an **angle**, so a triangle also has **three angles**.
> 
> Now you try. Picture a triangle, or a slice of pizza. How many straight sides does it have, and how many angles (corners)?

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
>       "goal": "Start from the shape itself: the student identifies the parts that make a triangle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If a shape has four straight sides, can it be a triangle? Why or why not?",
>       "keyPoints": [
>         "A triangle is a shape with three straight sides and three angles.",
>         "The number of sides and angles is what identifies a triangle."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "How we measure angles",
>       "goal": "The student understands that angles are measured in degrees and knows the size of a right angle.",
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
>       "title": "The total of the three angles",
>       "goal": "The student discovers the key rule: the three angles of a triangle always add up to a fixed total.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "What do the three angles of any triangle add up to?",
>       "keyPoints": [
>         "The angles of any triangle always add up to 180 degrees.",
>         "This total is the same for every triangle."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "Using the rule",
>       "goal": "The student applies the 180-degree rule to find a missing angle, using a right angle as one of the known angles.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has one right angle. How many degrees do its other two angles add up to together?",
>       "keyPoints": [
>         "If you know two angles of a triangle, you can find the third by subtracting from 180.",
>         "A triangle with a right angle has its other two angles adding to 90 degrees."
>       ]
>     },
>     {
>       "id": "s5",
>       "title": "Does size matter?",
>       "goal": "The student reflects on whether the rule depends on the size of the triangle, using the wording of the passage.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Does the 180-degree rule change when a triangle is bigger or smaller? What in the text tells you this?",
>       "keyPoints": [
>         "The rule holds for every triangle, big or small.",
>         "Size does not change the total of the angles."
>       ]
>     }
>   ]
> }

**tutor**

> Let's start with a shape you have probably seen on road signs or pizza slices. A **triangle** is a shape with three straight sides and three angles. Each corner, where two sides meet, makes an angle.
> 
> Think about it this way: a shape with four straight sides has four corners. Can it still be a triangle? Why or why not?

_control: {"verdict":"partial","advance":false}_

Easy opening:

Hi, I'm Barak, and I'm glad to be learning with you. Let's start with a shape you already know.

A **triangle** is a shape with **three straight sides**. Think of a slice of pizza: its edges are straight, and its pointy corners are where two sides meet. Each corner is an **angle**, so a triangle also has **three angles**.

Now you try. Picture a triangle, or a slice of pizza. How many straight sides does it have, and how many angles (corners)?

Challenging opening:

Let's start with a shape you have probably seen on road signs or pizza slices. A **triangle** is a shape with three straight sides and three angles. Each corner, where two sides meet, makes an angle.

Think about it this way: a shape with four straight sides has four corners. Can it still be a triangle? Why or why not?

Judge, easy first: null

Judge, easy second: {"easier":"B","reason":"B opens with a smaller, concrete step (count the sides and angles of a pizza slice), has a warm greeting, and its check questions start with simple recall and give worked numbers (90 and 30). A opens with a reasoning question (can a four-sided shape be a triangle, and why), which is more abstract. A's checks are also more demanding: they ask for the sum of the other two angles without giving numbers, and for reasoning grounded in the text."}

