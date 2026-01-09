// AI Response System for Bloomroom
// Simulated emotional intelligence using pattern matching

// Response templates for different emotional states
const responseTemplates = {
    // Time anxiety
    time_anxiety: [
        {
            keywords: ['running out of time', 'time is running out', 'not enough time', 'too late'],
            responses: [
                {
                    reassurance: "You're allowed to build slowly.",
                    grounding: "Time feels urgent when we're anxious, but growth doesn't have a deadline.",
                    nextStep: "What's one thing that supports your future today?"
                },
                {
                    reassurance: "You're not running out of time.",
                    grounding: "You're exactly where you need to be right now.",
                    nextStep: "What's one small step you could take today?"
                }
            ]
        },
        {
            keywords: ['behind', 'late', 'should be further', 'not where i should'],
            responses: [
                {
                    reassurance: "You're not behind.",
                    grounding: "Everyone's timeline is different. Yours is valid.",
                    nextStep: "What's one thing you've done that you're proud of?"
                },
                {
                    reassurance: "There's no 'should be' in your journey.",
                    grounding: "You're growing at exactly the right pace for you.",
                    nextStep: "What would make today feel meaningful?"
                }
            ]
        }
    ],

    // Overwhelm
    overwhelm: [
        {
            keywords: ['overwhelmed', 'too much', 'can\'t handle', 'drowning', 'stressed'],
            responses: [
                {
                    reassurance: "Let's make this smaller.",
                    grounding: "You don't have to do everything today.",
                    nextStep: "What's the tiniest step you could take right now?"
                },
                {
                    reassurance: "You're carrying a lot. That's real.",
                    grounding: "It's okay to do less than you planned.",
                    nextStep: "What's one thing you could let go of today?"
                }
            ]
        }
    ],

    // Not enough / inadequacy
    inadequacy: [
        {
            keywords: ['not enough', 'not doing enough', 'should be doing more', 'not good enough'],
            responses: [
                {
                    reassurance: "You're doing more than you think.",
                    grounding: "Small actions add up, even when they feel invisible.",
                    nextStep: "What's one thing you did today that mattered?"
                },
                {
                    reassurance: "You are enough, exactly as you are.",
                    grounding: "Growth doesn't require you to be perfect.",
                    nextStep: "What's one kind thing you can do for yourself today?"
                }
            ]
        }
    ],

    // Fear of failure
    fear: [
        {
            keywords: ['scared', 'afraid', 'fear', 'worried', 'anxious', 'nervous'],
            responses: [
                {
                    reassurance: "It's okay to be scared and still try.",
                    grounding: "Fear means you care. That's beautiful.",
                    nextStep: "What would make this feel safer?"
                },
                {
                    reassurance: "You don't have to be fearless to move forward.",
                    grounding: "Small, scared steps are still steps.",
                    nextStep: "What's one tiny thing you could try?"
                }
            ]
        }
    ],

    // Exhaustion / burnout
    exhaustion: [
        {
            keywords: ['tired', 'exhausted', 'burned out', 'drained', 'no energy'],
            responses: [
                {
                    reassurance: "Rest is not giving up.",
                    grounding: "You need to refill before you can pour out.",
                    nextStep: "What would help you rest today?"
                },
                {
                    reassurance: "You're allowed to be tired.",
                    grounding: "Pushing through isn't always the answer.",
                    nextStep: "What's one gentle thing you could do for yourself?"
                }
            ]
        }
    ],

    // Comparison
    comparison: [
        {
            keywords: ['everyone else', 'others are', 'they\'re ahead', 'comparing'],
            responses: [
                {
                    reassurance: "Your journey is yours alone.",
                    grounding: "Comparison steals your peace, not your progress.",
                    nextStep: "What's one thing that's uniquely yours?"
                },
                {
                    reassurance: "You're not in a race.",
                    grounding: "Their timeline doesn't define yours.",
                    nextStep: "What matters to you, independent of others?"
                }
            ]
        }
    ],

    // Procrastination / avoidance
    procrastination: [
        {
            keywords: ['procrastinating', 'avoiding', 'can\'t start', 'stuck'],
            responses: [
                {
                    reassurance: "Starting is the hardest part.",
                    grounding: "You don't have to do it perfectly. You just have to begin.",
                    nextStep: "What's the smallest possible first step?"
                },
                {
                    reassurance: "It's okay to feel stuck.",
                    grounding: "Sometimes we avoid things because they matter.",
                    nextStep: "What would make starting feel easier?"
                }
            ]
        }
    ],

    // General anxiety
    general_anxiety: [
        {
            keywords: ['anxious', 'anxiety', 'spiraling', 'overthinking'],
            responses: [
                {
                    reassurance: "Your mind is trying to protect you.",
                    grounding: "But you're safe right now, in this moment.",
                    nextStep: "What's one thing you can control today?"
                },
                {
                    reassurance: "Thoughts aren't facts.",
                    grounding: "You can acknowledge them without believing them.",
                    nextStep: "What would ground you right now?"
                }
            ]
        }
    ],

    // Default / general support
    default: [
        {
            keywords: [],
            responses: [
                {
                    reassurance: "I hear you.",
                    grounding: "Whatever you're feeling is valid.",
                    nextStep: "What do you need right now?"
                },
                {
                    reassurance: "You're not alone in this.",
                    grounding: "It's okay to feel what you're feeling.",
                    nextStep: "What would help you feel a little better?"
                },
                {
                    reassurance: "Thank you for sharing this.",
                    grounding: "Naming what you feel is brave.",
                    nextStep: "What's one small thing that might help?"
                }
            ]
        }
    ]
};

// Analyze input and find matching response
export const getAIResponse = (userInput) => {
    const input = userInput.toLowerCase().trim();

    // If input is empty
    if (!input) {
        return {
            reassurance: "I'm here to listen.",
            grounding: "Take your time. Share what's on your mind.",
            nextStep: "What's weighing on you?"
        };
    }

    // Check each category
    for (const category of Object.values(responseTemplates)) {
        for (const pattern of category) {
            // Check if any keyword matches
            const hasMatch = pattern.keywords.some(keyword => input.includes(keyword));

            if (hasMatch) {
                // Return random response from matching pattern
                const responses = pattern.responses;
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }
    }

    // Default response if no match
    const defaultResponses = responseTemplates.default[0].responses;
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

// Format response for display
export const formatAIResponse = (response) => {
    return {
        reassurance: response.reassurance,
        grounding: response.grounding,
        nextStep: response.nextStep,
        timestamp: new Date().toISOString()
    };
};
