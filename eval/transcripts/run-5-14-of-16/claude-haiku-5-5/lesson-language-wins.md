# The lesson language wins over the file language, and the teacher text wins over the buttons

- Scenario: `lesson-language-wins`
- Pass condition: A Hebrew file with the English button gives an English plan and an English first message. English buttons with the teacher text "in French" give a French plan and a French first message.
- Result: **PASS** — Hebrew file, English button: plan language "English"; Hebrew file, English button: first message is not Hebrew; English button, "in French": plan language "français"; English button, "in French": first message is French
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
>       "title": "Measuring angles in degrees",
>       "goal": "Know that angles are measured in degrees and recognize a right angle as 90 degrees.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "In degrees, how big is a right angle?",
>       "keyPoints": [
>         "An angle is measured in degrees.",
>         "A right angle is 90 degrees."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "The angles add up to 180 degrees",
>       "goal": "Learn the key fact that the three angles of a triangle always add up to 180 degrees.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "What is the sum of the three angles in any triangle?",
>       "keyPoints": [
>         "The sum of the angles in a triangle is always 180 degrees.",
>         "This is the total of all three angles together."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "The rule holds for every triangle",
>       "goal": "Understand that the 180-degree rule applies to all triangles, whether large or small.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Does the 180-degree rule apply only to big triangles, or to small ones too?",
>       "keyPoints": [
>         "The 180-degree sum is true for every triangle.",
>         "Its size does not change the rule."
>       ]
>     },
>     {
>       "id": "s5",
>       "title": "Finding a missing angle",
>       "goal": "Use the 180-degree rule to find the third angle when the other two are known.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If two angles of a triangle are 50 and 60 degrees, how many degrees is the third angle?",
>       "keyPoints": [
>         "Subtract the two known angles from 180 degrees to find the third.",
>         "The three angles always total 180 degrees."
>       ]
>     }
>   ]
> }

**tutor**

> Let's start with a shape you've probably seen many times, like a slice of pizza or the top of a tent. What do you notice about its edges?
> 
> A **triangle** is a shape with **three straight sides**. It also has **three angles**, one at each corner.
> 
> How many straight sides and how many angles does a triangle have? Tell me in your own words.

_control: {"verdict":"partial","advance":false}_

**plan**

> {
>   "title": "Les angles d'un triangle",
>   "language": "français",
>   "audience": "élève",
>   "difficulty": "medium",
>   "estimatedMinutes": 10,
>   "steps": [
>     {
>       "id": "s1",
>       "title": "Qu'est-ce qu'un triangle ?",
>       "goal": "Identifier un triangle comme une forme à trois côtés droits et trois angles.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Combien de côtés droits et combien d'angles a un triangle ?",
>       "keyPoints": [
>         "Un triangle est une forme à trois côtés droits.",
>         "Un triangle possède aussi trois angles."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "La somme des angles",
>       "goal": "Retenir que les trois angles d'un triangle ont une somme de 180 degrés.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Quelle est la somme des trois angles d'un triangle ?",
>       "keyPoints": [
>         "Les angles d'un triangle s'additionnent toujours à 180 degrés.",
>         "Cette somme est vraie pour tous les triangles."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "Un résultat valable pour tous les triangles",
>       "goal": "Comprendre que la règle des 180 degrés ne dépend pas de la taille du triangle.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "La somme des angles change-t-elle si le triangle est plus grand ou plus petit ?",
>       "keyPoints": [
>         "La règle vaut pour tout triangle, grand ou petit.",
>         "La taille du triangle ne change pas la somme de ses angles."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "Mesurer un angle",
>       "goal": "Savoir qu'un angle se mesure en degrés.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "En quelle unité mesure-t-on un angle ?",
>       "keyPoints": [
>         "Un angle se mesure en degrés.",
>         "Le degré est l'unité utilisée pour mesurer les angles."
>       ]
>     },
>     {
>       "id": "s5",
>       "title": "L'angle droit",
>       "goal": "Connaître la valeur d'un angle droit et la relier à la somme de 180 degrés.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Combien de degrés mesure un angle droit ?",
>       "keyPoints": [
>         "Un angle droit mesure 90 degrés.",
>         "Dans un triangle, deux angles droits feraient déjà 180 degrés."
>       ]
>     }
>   ]
> }

**tutor**

> Bonjour ! Aujourd'hui, nous allons découvrir ce qu'est un **triangle**.
> 
> Avant de commencer, dites-moi : quelles formes connaissez-vous qui ont des côtés droits ? Un carré, une porte, une fenêtre... ?
> 
> Pensez ensuite à un triangle, par exemple la forme d'une part de pizza. Combien de côtés droits pensez-vous qu'il possède, et combien d'angles ?

_control: {"verdict":"partial","advance":false}_

