# The lesson language wins over the file language, and the teacher text wins over the buttons

- Scenario: `lesson-language-wins`
- Pass condition: A Hebrew file with the English button gives an English plan and an English first message. English buttons with the teacher text "in French" give a French plan and a French first message.
- Result: **PASS** — Hebrew file, English button: plan language "English"; Hebrew file, English button: first message is not Hebrew; English button, "in French": plan language "French"; English button, "in French": first message is French
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
>       "checkQuestion": "What unit is used to measure an angle?",
>       "keyPoints": [
>         "An angle is measured in degrees.",
>         "Degrees are written with the symbol for degrees, such as 90 degrees."
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
>         "A right angle is a useful reference for judging other angles."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "The sum of the angles is always 180 degrees",
>       "goal": "Know that the three angles of any triangle add up to 180 degrees.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "What is the sum of the three angles in any triangle?",
>       "keyPoints": [
>         "The three angles of every triangle add up to 180 degrees.",
>         "This is true for all triangles, whether large or small."
>       ]
>     },
>     {
>       "id": "s5",
>       "title": "Using the rule for any triangle",
>       "goal": "Apply the fact that the angles of a triangle sum to 180 degrees to a triangle of any size.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "If two angles of a triangle are 50 and 60 degrees, what is the third angle? Explain using the rule about the sum of angles.",
>       "keyPoints": [
>         "The angle sum of a triangle is always 180 degrees, regardless of its size.",
>         "If you know two angles, subtract their sum from 180 to find the third."
>       ]
>     }
>   ]
> }

**tutor**

> Let's start with a shape you have seen many times, like a warning sign on the road or a slice of pizza.
> 
> A **triangle** is a shape with **three straight sides**. Unlike a circle, its edges are all straight lines. It also has **three angles**, which are the corners where two sides meet.
> 
> Picture a triangle, or draw one quickly on paper. How many straight sides does it have, and how many angles?

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
>       "goal": "Reconnaître un triangle et ses éléments : trois côtés droits et trois angles.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Combien de côtés droits et combien d'angles a un triangle ?",
>       "keyPoints": [
>         "Un triangle est une forme à trois côtés droits.",
>         "Un triangle a aussi trois angles."
>       ]
>     },
>     {
>       "id": "s2",
>       "title": "Mesurer un angle",
>       "goal": "Comprendre que les angles se mesurent en degrés.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "En quelle unité mesure-t-on un angle ?",
>       "keyPoints": [
>         "Un angle se mesure en degrés.",
>         "Le symbole des degrés indique la mesure d'un angle."
>       ]
>     },
>     {
>       "id": "s3",
>       "title": "L'angle droit",
>       "goal": "Connaître la valeur d'un angle droit.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Combien mesure un angle droit ?",
>       "keyPoints": [
>         "Un angle droit mesure 90 degrés.",
>         "L'angle droit sert de repère pour les autres angles."
>       ]
>     },
>     {
>       "id": "s4",
>       "title": "La somme des angles",
>       "goal": "Savoir que la somme des angles d'un triangle vaut toujours 180 degrés.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Quelle est la somme des trois angles d'un triangle ?",
>       "keyPoints": [
>         "Les trois angles d'un triangle ajoutent toujours jusqu'à 180 degrés.",
>         "Cette règle vaut pour tous les triangles, petits ou grands."
>       ]
>     },
>     {
>       "id": "s5",
>       "title": "Appliquer la règle",
>       "goal": "Utiliser la somme de 180 degrés pour trouver un angle manquant.",
>       "passageIds": [
>         "p1"
>       ],
>       "checkQuestion": "Si deux angles d'un triangle mesurent 60 degrés et 70 degrés, combien mesure le troisième ?",
>       "keyPoints": [
>         "Pour trouver un angle manquant, on soustrait la somme des deux angles connus de 180.",
>         "Le résultat est 50 degrés dans cet exemple."
>       ]
>     }
>   ]
> }

**tutor**

> Bonjour ! Commençons par une forme que tu connais sûrement : le **triangle**. Un triangle est une forme fermée qui a des côtés droits (des segments, comme les bords d'une règle).
> 
> Avant de regarder le texte, dis-moi : d'après toi, combien de côtés droits un triangle possède-t-il, et combien d'angles ? Réponds comme tu le sens, on verra ensemble.

_control: {"verdict":"partial","advance":false}_

