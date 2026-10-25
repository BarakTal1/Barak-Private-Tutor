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
>       "goal": "Recognize a triangle by its sides and angles.",
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
>       "title": "How do we measure angles?",
>       "goal": "Understand that angles are measured in degrees.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "What unit do we use to measure an angle, and what would you expect a right angle to measure?",
>       "keyPoints": [
>         "An angle is measured in degrees.",
>         "A right angle is 90 degrees."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "The angles of a triangle",
>       "goal": "Discover the total of the three angles in any triangle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If you add up the three angles of any triangle, what total do you always get?",
>       "keyPoints": [
>         "The angles of any triangle always add up to 180 degrees.",
>         "This is true for every triangle, big or small."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "Does size matter?",
>       "goal": "Reason that the 180-degree rule holds for all triangles, whatever their size or shape.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Does a very large triangle have a different angle total than a very small one? Why or why not?",
>       "keyPoints": [
>         "The total of 180 degrees does not depend on the size of the triangle.",
>         "The rule works for every triangle."
>       ]
>     },
>     {
>       "id": "s5",
>       "title": "Finding a missing angle",
>       "goal": "Use the 180-degree rule to find an unknown angle in a triangle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has angles of 90 degrees and 30 degrees. How many degrees is the third angle, and how do you know?",
>       "keyPoints": [
>         "Since all three angles add up to 180 degrees, subtract the known angles from 180.",
>         "Here the third angle is 60 degrees."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! Today we start the lesson on angles of a triangle. Before we look at angles, let's look at the shape itself.
> 
> Think about a slice of pizza or a yield sign on the road. Can you picture a shape with straight sides, like those?
> 
> Here is my question for you: **how many straight sides and how many angles do you think a triangle has?** Take a guess, and tell me how you know.

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
>       "goal": "Use questions to help the student describe what a triangle is made of.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "How many sides and how many angles does a triangle have, and what kind of sides are they?",
>       "keyPoints": [
>         "A triangle is a shape with three straight sides.",
>         "A triangle also has three angles."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "How angles are measured",
>       "goal": "Help the student see that angles are measured in degrees and use the right angle as a reference.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "What unit is an angle measured in, and how many degrees is a right angle?",
>       "keyPoints": [
>         "Angles are measured in degrees.",
>         "A right angle is 90 degrees."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "The angle sum rule",
>       "goal": "Guide the student to discover that the three angles of a triangle always add up to the same total.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If you add the three angles of any triangle, what total do you always get?",
>       "keyPoints": [
>         "The three angles of any triangle add up to 180 degrees.",
>         "This total does not change from one triangle to another."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "Why the word 'always' matters",
>       "goal": "Ask the student to think about why the rule must hold for every triangle, big or small, and not only for some.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Does the 180-degree rule depend on how big the triangle is? Why or why not?",
>       "keyPoints": [
>         "The rule is true for every triangle, big or small.",
>         "Size of the triangle does not change the total of its angles."
>       ]
>     },
>     {
>       "id": "s5",
>       "title": "Using the rule to find a missing angle",
>       "goal": "Lead the student to apply the 180-degree rule: if two angles are known, the third is what is left.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has angles of 90 degrees and 50 degrees. How many degrees is the third angle, and how did you find it?",
>       "keyPoints": [
>         "Because the angles add up to 180 degrees, subtract the known angles from 180.",
>         "A triangle with a right angle has its other two angles adding to 90 degrees."
>       ]
>     }
>   ]
> }

**tutor**

> Think about a triangle you have drawn before, maybe a slice of pizza or a warning sign on the road. Picture its outline. **What do you think makes a shape a triangle?** Tell me how many sides you see, and what those sides look like.

_control: {"verdict":"partial","advance":false}_

Easy opening:

Hi! Today we start the lesson on angles of a triangle. Before we look at angles, let's look at the shape itself.

Think about a slice of pizza or a yield sign on the road. Can you picture a shape with straight sides, like those?

Here is my question for you: **how many straight sides and how many angles do you think a triangle has?** Take a guess, and tell me how you know.

Challenging opening:

Think about a triangle you have drawn before, maybe a slice of pizza or a warning sign on the road. Picture its outline. **What do you think makes a shape a triangle?** Tell me how many sides you see, and what those sides look like.

Judge, easy first: {"easier":"A","reason":"A's opening gives more support: it explains the plan, uses concrete examples, and asks a small, specific question (count the sides and angles, then guess). B's opening asks the more open, conceptual question 'what makes a shape a triangle?' and uses less scaffolding. The check questions are otherwise very similar, so the opening decides it."}

Judge, easy second: {"easier":"B","reason":"B opens with a greeting, names the lesson topic, and asks a narrower, more guided question (count the sides and angles, then guess). A asks the more open question of what makes a shape a triangle, with less support. B's check questions are also slightly simpler: its numbers are rounder (90 and 30), and it asks 'what would you expect a right angle to measure?' where A asks 'how many degrees is a right angle?'."}

