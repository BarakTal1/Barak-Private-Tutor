# The difficulty button changes how the tutor teaches

- Scenario: `difficulty-levels`
- Pass condition: The plan keeps the difficulty (easy and challenging), and a judge, asked twice with the order swapped, picks the easy lesson as the easier one both times.
- Result: **FAIL** — Failed: judge picks easy as easier (easy first); judge picks easy as easier (easy second)
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
>       "goal": "Use questions to help the student notice the parts of a triangle: sides and angles.",
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
>       "title": "How do we measure angles?",
>       "goal": "Help the student see that angles are measured in degrees.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "What unit do we use to measure an angle?",
>       "keyPoints": [
>         "An angle is measured in degrees.",
>         "Degrees is the unit used for angles."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "The right angle",
>       "goal": "Ask the student to recall the size of a right angle and why it is special.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "How many degrees is a right angle, and what do you think a right angle looks like?",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "A right angle is a special angle that can be used as a reference for other angles."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "Angles add up to 180",
>       "goal": "Guide the student to find the total of the three angles in any triangle and to test whether it depends on the triangle's size.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If the three angles of a triangle add up to 180 degrees, does that stay true for a very big triangle and for a very small triangle? Why?",
>       "keyPoints": [
>         "The three angles of any triangle always add up to 180 degrees.",
>         "This rule is true for every triangle, big or small."
>       ]
>     },
>     {
>       "id": "s5",
>       "title": "Putting it together",
>       "goal": "Help the student explain the main idea of the lesson in their own words.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "In your own words, what is true about the angles of every triangle?",
>       "keyPoints": [
>         "A triangle has three angles.",
>         "Those angles are measured in degrees and always add up to 180 degrees."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! Let's explore triangles together. Think about a triangle you have seen, like a slice of pizza or a yield sign on the road. What makes it a triangle? Tell me what you notice about its edges and its corners.

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
>       "goal": "Identify the parts that define a triangle: three straight sides and three angles.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "How many straight sides and how many angles does every triangle have?",
>       "keyPoints": [
>         "A triangle is a shape with three straight sides.",
>         "A triangle also has three angles, one at each corner."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "How do we measure angles?",
>       "goal": "Understand that angles are measured in degrees and recall what a right angle measures.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "What unit is used to measure an angle, and how many degrees is a right angle?",
>       "keyPoints": [
>         "An angle is measured in degrees.",
>         "A right angle measures 90 degrees."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "The total of the angles",
>       "goal": "Know the rule that the three angles of any triangle always add up to 180 degrees.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If two angles of a triangle are 60 degrees and 70 degrees, what must the third angle be, and why?",
>       "keyPoints": [
>         "The angles of any triangle always add up to 180 degrees.",
>         "If you know two angles, you can find the third by subtracting their sum from 180."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "Does size matter?",
>       "goal": "Explore whether the 180-degree rule depends on how big or small a triangle is.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Does the sum of the angles change when a triangle is bigger or smaller? What does the text say, and why would that make sense?",
>       "keyPoints": [
>         "The 180-degree rule is true for every triangle, big or small.",
>         "Changing the size of a triangle does not change the total of its angles."
>       ]
>     },
>     {
>       "id": "s5",
>       "title": "Putting it together",
>       "goal": "Combine the definition, degree measurement and the 180-degree rule to reason about a triangle with a right angle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has one right angle. What do its other two angles add up to, and how do you know?",
>       "keyPoints": [
>         "A right angle is 90 degrees, so the other two angles of such a triangle add up to 90 degrees.",
>         "Using the 180-degree rule, you can solve for missing angles in any triangle."
>       ]
>     }
>   ]
> }

**tutor**

> Hi! Let's start with a shape you probably know well: the triangle. Think about a slice of pizza or a yield sign on the road. What do you notice about its sides and its corners?
> 
> Before I tell you anything, what do you think makes a triangle a triangle?

_control: {"verdict":"partial","advance":false}_

Easy opening:

Hi! Let's explore triangles together. Think about a triangle you have seen, like a slice of pizza or a yield sign on the road. What makes it a triangle? Tell me what you notice about its edges and its corners.

Challenging opening:

Hi! Let's start with a shape you probably know well: the triangle. Think about a slice of pizza or a yield sign on the road. What do you notice about its sides and its corners?

Before I tell you anything, what do you think makes a triangle a triangle?

Judge, easy first: null

Judge, easy second: null

