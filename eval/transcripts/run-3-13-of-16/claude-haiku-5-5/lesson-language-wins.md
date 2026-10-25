# The lesson language wins over the file language, and the teacher text wins over the buttons

- Scenario: `lesson-language-wins`
- Pass condition: A Hebrew file with the English button gives an English plan and an English first message. English buttons with the teacher text "in French" give a French plan and a French first message.
- Result: **PASS** — Hebrew file, English button: plan language "English"; Hebrew file, English button: first message is not Hebrew; English button, "in French": plan language "French"; English button, "in French": first message is French
- Model: `claude-haiku-5-5` · judge: `claude-sonnet-5-5` · 2026-10-25

**plan**

> {
>   "title": "Angles in a Triangle",
>   "language": "English",
>   "audience": "Students learning basic triangle angles",
>   "difficulty": "medium",
>   "estimatedMinutes": 10,
>   "steps": [
>     {
>       "id": "s1",
>       "title": "What is a triangle?",
>       "goal": "Recognize a triangle as a shape with three straight sides and three angles.",
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
>       "title": "Angles are measured in degrees",
>       "goal": "Understand that the size of an angle is measured in degrees.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "What unit do we use to measure an angle?",
>       "keyPoints": [
>         "An angle is measured in degrees.",
>         "Degrees tell us how big an angle is."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "The right angle",
>       "goal": "Know the size of a right angle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "How many degrees is a right angle?",
>       "keyPoints": [
>         "A right angle is 90 degrees.",
>         "This is a useful reference size when comparing angles."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "The angles add up to 180 degrees",
>       "goal": "Know that the three angles of any triangle always add up to 180 degrees.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "What is the sum of the three angles in any triangle?",
>       "keyPoints": [
>         "The three angles of every triangle add up to 180 degrees.",
>         "This is always true, whatever the triangle's shape."
>       ]
>     },
>     {
>       "id": "s5",
>       "title": "Any size of triangle",
>       "goal": "Apply the 180-degree rule to triangles of any size, including finding a missing angle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has angles of 60 degrees and 70 degrees. How many degrees is the third angle, and why?",
>       "keyPoints": [
>         "The rule holds for large and small triangles alike.",
>         "If two angles are known, the third is 180 minus their sum."
>       ]
>     }
>   ]
> }

**tutor**

> Let's start with a shape you have probably seen many times, like a warning road sign or a slice of pizza. A **triangle** is a flat shape with straight sides, and its corners are called **angles**. Think of the corners where two sides meet.
> 
> Before we look closer, what do you think: how many straight sides and how many angles does a triangle have?

_control: {"verdict":"partial","advance":false}_

**plan**

> {
>   "title": "Les angles d'un triangle",
>   "language": "French",
>   "audience": "élève",
>   "difficulty": "medium",
>   "estimatedMinutes": 10,
>   "steps": [
>     {
>       "id": "s1",
>       "title": "Qu'est-ce qu'un triangle ?",
>       "goal": "Reconnaître un triangle par ses côtés et ses angles.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Combien de côtés droits et combien d'angles possède un triangle ?",
>       "keyPoints": [
>         "Un triangle est une forme à trois côtés droits.",
>         "Un triangle possède aussi trois angles."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "La somme des angles",
>       "goal": "Retenir que les trois angles d'un triangle font toujours 180 degrés.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Combien font les trois angles d'un triangle quand on les additionne ?",
>       "keyPoints": [
>         "Les angles d'un triangle s'additionnent toujours à 180 degrés.",
>         "Cette règle est vraie pour tous les triangles."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "Vrai pour tous les triangles",
>       "goal": "Comprendre que la règle ne dépend pas de la taille du triangle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "La somme des angles change-t-elle si le triangle est plus grand ou plus petit ? Pourquoi ?",
>       "keyPoints": [
>         "La somme des angles reste 180 degrés, qu'un triangle soit grand ou petit.",
>         "C'est une propriété de tous les triangles."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "Mesurer les angles en degrés",
>       "goal": "Savoir que les angles se mesurent en degrés et connaître l'angle droit.",
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
>       "id": "s5",
>       "title": "Utiliser la règle",
>       "goal": "Appliquer la somme de 180 degrés à un triangle qui a un angle droit.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Dans un triangle qui a un angle droit, combien font les deux autres angles ensemble ?",
>       "keyPoints": [
>         "Si un angle vaut 90 degrés, les deux autres angles ajoutés font 90 degrés.",
>         "On utilise toujours le total de 180 degrés pour raisonner sur un triangle."
>       ]
>     }
>   ]
> }

**tutor**

> Bonjour ! Pensez à un panneau de signalisation en forme de triangle. Si vous le regardez de près, vous voyez des **côtés** (les bords) et des **angles** (les pointes, là où deux côtés se rejoignent).
> 
> Un triangle est une forme dont les **côtés sont droits**, sans courbe. Un cercle ou un ovale n'est donc pas un triangle.
> 
> À votre avis, combien un triangle a-t-il de côtés droits, et combien a-t-il d'angles ?

_control: {"verdict":"partial","advance":false}_

