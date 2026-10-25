# The lesson language wins over the file language, and the teacher text wins over the buttons

- Scenario: `lesson-language-wins`
- Pass condition: A Hebrew file with the English button gives an English plan and an English first message. English buttons with the teacher text "in French" give a French plan and a French first message.
- Result: **PASS** — Hebrew file, English button: plan language "English"; Hebrew file, English button: first message is not Hebrew; English button, "in French": plan language "français"; English button, "in French": first message is French
- Model: `claude-haiku-5-5` · judge: `claude-sonnet-5-5` · 2026-10-25

**plan**

> {
>   "title": "Angles in a Triangle",
>   "language": "English",
>   "audience": "Student learning basic geometry",
>   "difficulty": "medium",
>   "estimatedMinutes": 10,
>   "steps": [
>     {
>       "id": "s1",
>       "title": "What is a triangle?",
>       "goal": "Understand that a triangle is a shape with three straight sides and three angles.",
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
>       "title": "How angles are measured",
>       "goal": "Know that angles are measured in degrees.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "What unit do we use to measure an angle?",
>       "keyPoints": [
>         "An angle is measured in degrees.",
>         "The symbol for degrees is a small circle written after the number."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "The right angle",
>       "goal": "Recognize that a right angle equals 90 degrees.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "How many degrees is a right angle?",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "A right angle is a reference point for judging other angles."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "The sum of angles in a triangle",
>       "goal": "Know that the three angles of any triangle add up to 180 degrees.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "What is the sum of the three angles in a triangle?",
>       "keyPoints": [
>         "The three angles of every triangle add up to 180 degrees.",
>         "This rule holds for every triangle, whether large or small."
>       ]
>     },
>     {
>       "id": "s5",
>       "title": "Using the rule",
>       "goal": "Apply the fact that the angles add up to 180 degrees to a simple situation.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If two angles of a triangle are 60 degrees and 70 degrees, what is the third angle?",
>       "keyPoints": [
>         "If you know two angles of a triangle, subtract their sum from 180 degrees to find the third.",
>         "The rule of 180 degrees always applies to a triangle."
>       ]
>     }
>   ]
> }

**tutor**

> Welcome! Let's start with the shape itself. Picture a sign for "yield" on the road, or the tip of a tent. Both are **triangles**: flat shapes with straight sides that meet at corners.
> 
> A triangle has **three straight sides** and **three angles**. An angle is the corner where two sides meet, and angles are measured in degrees.
> 
> Looking at the shape in your mind, how many straight sides does a triangle have, and how many angles?

_control: {"verdict":"partial","advance":false}_

**plan**

> {
>   "title": "Les angles d'un triangle",
>   "language": "français",
>   "audience": "Élève, niveau débutant en géométrie",
>   "difficulty": "medium",
>   "estimatedMinutes": 10,
>   "steps": [
>     {
>       "id": "s1",
>       "title": "Qu'est-ce qu'un triangle ?",
>       "goal": "Reconnaître un triangle et ses éléments : trois côtés droits et trois angles.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Combien un triangle possède-t-il de côtés droits et combien d'angles ?",
>       "keyPoints": [
>         "Un triangle est une forme à trois côtés droits.",
>         "Un triangle possède aussi trois angles."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "Les angles se mesurent en degrés",
>       "goal": "Comprendre qu'un angle se mesure en degrés et connaître la valeur de l'angle droit.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "En quelle unité mesure-t-on un angle, et combien vaut un angle droit ?",
>       "keyPoints": [
>         "Un angle se mesure en degrés.",
>         "Un angle droit mesure 90 degrés."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "La somme des angles d'un triangle",
>       "goal": "Retenir que les trois angles d'un triangle font toujours 180 degrés ensemble.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Quelle est la somme des trois angles d'un triangle ?",
>       "keyPoints": [
>         "Les angles d'un triangle s'additionnent toujours pour donner 180 degrés.",
>         "Cette règle est vraie pour tous les triangles."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "Une règle valable pour tous les triangles",
>       "goal": "Comprendre que la règle des 180 degrés ne dépend pas de la taille du triangle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "La somme des angles d'un petit triangle et d'un grand triangle est-elle différente ? Pourquoi ?",
>       "keyPoints": [
>         "La somme des angles est 180 degrés pour chaque triangle, grand ou petit.",
>         "La taille du triangle ne change pas la somme de ses angles."
>       ]
>     },
>     {
>       "id": "s5",
>       "title": "Bilan : relier les idées",
>       "goal": "Relier la forme du triangle, la mesure en degrés et la règle des 180 degrés.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Si deux angles d'un triangle mesurent 90 degrés et 30 degrés, combien mesure le troisième ?",
>       "keyPoints": [
>         "Un triangle a trois côtés droits et trois angles mesurés en degrés.",
>         "Les trois angles d'un triangle font toujours 180 degrés au total."
>       ]
>     }
>   ]
> }

**tutor**

> Bonjour ! Aujourd'hui, nous allons découvrir ce qu'est un **triangle**. Vous connaissez peut-être déjà des formes comme le carré ou le rectangle : un triangle en est une autre, avec des côtés droits et des angles.
> 
> Un triangle est une forme à **trois côtés droits**. Il possède aussi **trois angles**. Un angle est mesuré en degrés, et un angle droit mesure 90 degrés.
> 
> Alors, d'après vous, combien un triangle possède-t-il de côtés droits, et combien d'angles ?

_control: {"verdict":"partial","advance":false}_

