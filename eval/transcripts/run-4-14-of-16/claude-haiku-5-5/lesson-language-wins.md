# The lesson language wins over the file language, and the teacher text wins over the buttons

- Scenario: `lesson-language-wins`
- Pass condition: A Hebrew file with the English button gives an English plan and an English first message. English buttons with the teacher text "in French" give a French plan and a French first message.
- Result: **PASS** — Hebrew file, English button: plan language "English"; Hebrew file, English button: first message is not Hebrew; English button, "in French": plan language "fr"; English button, "in French": first message is French
- Model: `claude-haiku-5-5` · judge: `claude-sonnet-5-5` · 2026-10-25

**plan**

> {
>   "title": "Angles in a Triangle",
>   "language": "English",
>   "audience": "Student learning basic triangle geometry",
>   "difficulty": "medium",
>   "estimatedMinutes": 10,
>   "steps": [
>     {
>       "id": "s1",
>       "title": "What is a triangle?",
>       "goal": "Recall the basic parts of a triangle: sides and angles.",
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
>       "title": "Measuring angles in degrees",
>       "goal": "Understand that angles are measured in degrees and know what a right angle equals.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "What unit is used to measure an angle, and how many degrees is a right angle?",
>       "keyPoints": [
>         "Angles are measured in degrees.",
>         "A right angle is 90 degrees."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "The sum of the angles",
>       "goal": "Learn the key fact that the three angles of a triangle always add up to the same total.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "What is the sum of the three angles in any triangle?",
>       "keyPoints": [
>         "The three angles of every triangle add up to 180 degrees.",
>         "This total is always the same, no matter what the triangle looks like."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "The rule holds for every triangle",
>       "goal": "See that the 180-degree rule applies to triangles of any size.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Does the 180-degree rule apply to a small triangle as well as to a large one?",
>       "keyPoints": [
>         "The 180-degree rule is true for every triangle, big or small.",
>         "Size does not change the total of the angles."
>       ]
>     },
>     {
>       "id": "s5",
>       "title": "Using the rule with a right angle",
>       "goal": "Apply the angle sum rule to find a missing angle when one angle is a right angle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "A triangle has one right angle (90 degrees). How many degrees are left for the other two angles together?",
>       "keyPoints": [
>         "Subtract the known angles from 180 degrees to find the missing angle.",
>         "With a right angle of 90 degrees, the other two angles together make 90 degrees."
>       ]
>     }
>   ]
> }

**tutor**

> Let's start with a shape you already know. Picture a triangle drawn on paper. Its edges are straight lines, which we call **sides**, and the corners where the edges meet are called **angles**.
> 
> Can you count them? How many straight sides and how many angles does a triangle have?

_control: {"verdict":"partial","advance":false}_

**plan**

> {
>   "title": "Les angles d'un triangle",
>   "language": "fr",
>   "audience": "Élève",
>   "difficulty": "medium",
>   "estimatedMinutes": 10,
>   "steps": [
>     {
>       "id": "s1",
>       "title": "Qu'est-ce qu'un triangle ?",
>       "goal": "Comprendre qu'un triangle est une forme à trois côtés droits et trois angles.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Combien de côtés droits et combien d'angles a un triangle ?",
>       "keyPoints": [
>         "Un triangle a trois côtés droits.",
>         "Un triangle a aussi trois angles."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "Mesurer un angle",
>       "goal": "Savoir qu'un angle se mesure en degrés.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "En quelle unité mesure-t-on un angle ?",
>       "keyPoints": [
>         "Un angle se mesure en degrés.",
>         "Le symbole des degrés est le petit rond après le nombre."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "L'angle droit",
>       "goal": "Connaître la valeur d'un angle droit.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Combien de degrés vaut un angle droit ?",
>       "keyPoints": [
>         "Un angle droit vaut 90 degrés.",
>         "Un angle droit sert de repère pour reconnaître d'autres angles."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "La somme des angles",
>       "goal": "Retenir que les trois angles d'un triangle font toujours 180 degrés au total.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Quelle est la somme des angles d'un triangle ?",
>       "keyPoints": [
>         "Les angles d'un triangle s'additionnent toujours à 180 degrés.",
>         "Cette règle vaut pour tous les triangles, petits ou grands."
>       ]
>     },
>     {
>       "id": "s5",
>       "title": "Appliquer la règle",
>       "goal": "Utiliser la règle des 180 degrés pour raisonner sur un triangle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Si deux angles d'un triangle mesurent 60 degrés et 70 degrés, combien mesure le troisième ?",
>       "keyPoints": [
>         "Pour trouver l'angle manquant, on retranche la somme des deux angles connus de 180.",
>         "Ici, le troisième angle mesure 50 degrés."
>       ]
>     }
>   ]
> }

**tutor**

> Bonjour ! Commençons par une forme que vous connaissez sûrement : le **triangle**.
> 
> Avant de regarder le texte, dites-moi : à votre avis, combien de côtés un triangle a-t-il, et combien d'angles ?

_control: {"verdict":"partial","advance":false}_

