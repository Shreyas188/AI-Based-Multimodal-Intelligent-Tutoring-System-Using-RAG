CHAPTER_1 = {
    "chapterId": "ch1",
    "title": "Electric Charges and Fields",
    "subject": "Physics",
    "className": "12th",
    "passPercentage": 70,

    "topics": [
        {
            "id": "intro",
            "title": "Introduction to Electrostatics",
            "duration": "15 min",
            "realLife": "When we remove a sweater in dry weather, we may see sparks or hear crackling sounds. Lightning is also an example of electric discharge.",
            "explanation": "Electrostatics is the study of electric charges at rest. Static electricity happens when charges collect on the surface of an object and suddenly discharge.",
            "points": [
                "Static means not moving or not changing with time.",
                "Electrostatics deals with charges at rest.",
                "Spark from clothes and lightning are examples of static electricity.",
                "Charges can build up due to rubbing."
            ],
            "formulas": [],
            "diagramIdea": "Show a sweater, body, and spark to explain charge buildup.",
            "solvedExample": {
                "question": "Why do we sometimes get shock after touching a car door?",
                "answer": "Due to rubbing, charges accumulate on our body. When we touch metal, charges discharge through our body, causing shock."
            },
            "practice": {
                "question": "Give two examples of static electricity.",
                "answer": "Spark from sweater and lightning."
            },
            "mistakes": [
                "Do not confuse static electricity with current electricity.",
                "Static electricity is due to accumulated charges."
            ]
        },
        {
            "id": "electric-charge",
            "title": "Electric Charge",
            "duration": "20 min",
            "realLife": "A plastic comb rubbed with dry hair can attract small paper pieces.",
            "explanation": "Electric charge is a basic property of matter. A body can become positive, negative, or neutral depending on electron transfer.",
            "points": [
                "There are two types of charges: positive and negative.",
                "Like charges repel.",
                "Unlike charges attract.",
                "A body becomes positive by losing electrons.",
                "A body becomes negative by gaining electrons."
            ],
            "formulas": [
                {
                    "name": "Quantisation of charge",
                    "formula": "q = ne",
                    "meaning": "Charge is an integral multiple of electronic charge."
                },
                {
                    "name": "Electronic charge",
                    "formula": "e = 1.6 × 10⁻¹⁹ C",
                    "meaning": "Magnitude of charge of one electron."
                }
            ],
            "diagramIdea": "Show + and + repelling, - and - repelling, and + and - attracting.",
            "solvedExample": {
                "question": "If a body loses electrons, what charge does it get?",
                "answer": "It becomes positively charged because electrons are negatively charged."
            },
            "practice": {
                "question": "What happens when two unlike charges are brought near?",
                "answer": "They attract each other."
            },
            "mistakes": [
                "Do not say protons move during charging by rubbing.",
                "Electrons are transferred during charging."
            ]
        },
        {
            "id": "conductors-insulators",
            "title": "Conductors and Insulators",
            "duration": "20 min",
            "realLife": "A plastic comb remains charged, but a metal spoon held in hand does not remain charged easily.",
            "explanation": "Conductors allow charges to move easily. Insulators do not allow charges to move easily.",
            "points": [
                "Metals are conductors.",
                "Human body and earth are conductors.",
                "Plastic, glass, wood, and rubber are insulators.",
                "Charge spreads on conductors.",
                "Charge stays fixed on insulators."
            ],
            "formulas": [],
            "diagramIdea": "Show charge spreading on metal and staying fixed on plastic.",
            "solvedExample": {
                "question": "Why does a plastic comb get charged but a metal spoon held in hand does not?",
                "answer": "Plastic is an insulator, so charge remains on it. Metal is a conductor, so charge leaks through our body to earth."
            },
            "practice": {
                "question": "Classify copper and plastic.",
                "answer": "Copper is a conductor. Plastic is an insulator."
            },
            "mistakes": [
                "Do not say all solids are insulators.",
                "Human body is a conductor."
            ]
        },
        {
            "id": "coulombs-law",
            "title": "Coulomb’s Law",
            "duration": "35 min",
            "realLife": "Two charged objects can attract or repel without touching.",
            "explanation": "Coulomb’s law gives the force between two point charges. Force increases when charge increases and decreases when distance increases.",
            "points": [
                "Force is directly proportional to product of charges.",
                "Force is inversely proportional to square of distance.",
                "Force acts along the line joining two charges.",
                "Like charges repel.",
                "Unlike charges attract."
            ],
            "formulas": [
                {
                    "name": "Coulomb’s law",
                    "formula": "F = k q₁q₂ / r²",
                    "meaning": "Force between two point charges."
                },
                {
                    "name": "Coulomb constant",
                    "formula": "k = 9 × 10⁹ N m² C⁻²",
                    "meaning": "Constant used in SI units."
                }
            ],
            "diagramIdea": "Show two charges separated by distance r.",
            "solvedExample": {
                "question": "What happens to force if distance is doubled?",
                "answer": "Force becomes one-fourth because F is inversely proportional to r²."
            },
            "practice": {
                "question": "What happens to force if one charge is doubled?",
                "answer": "Force becomes double."
            },
            "mistakes": [
                "Do not forget square on distance.",
                "Correct relation is F proportional to 1/r²."
            ]
        }
    ],

    "finalTest": [
        {
            "id": "q1",
            "topicId": "intro",
            "question": "Electrostatics deals with:",
            "options": ["Moving charges", "Charges at rest", "Heat", "Sound"],
            "answer": "Charges at rest"
        },
        {
            "id": "q2",
            "topicId": "electric-charge",
            "question": "Like charges:",
            "options": ["Attract", "Repel", "Become neutral", "Disappear"],
            "answer": "Repel"
        },
        {
            "id": "q3",
            "topicId": "electric-charge",
            "question": "A body becomes positively charged when it:",
            "options": ["Gains electrons", "Loses electrons", "Gains neutrons", "Loses neutrons"],
            "answer": "Loses electrons"
        },
        {
            "id": "q4",
            "topicId": "conductors-insulators",
            "question": "Which one is a conductor?",
            "options": ["Plastic", "Glass", "Copper", "Wood"],
            "answer": "Copper"
        },
        {
            "id": "q5",
            "topicId": "coulombs-law",
            "question": "Coulomb’s law is:",
            "options": ["F = kq₁q₂/r²", "F = kr²", "F = q/r", "F = mg"],
            "answer": "F = kq₁q₂/r²"
        }
    ]
}