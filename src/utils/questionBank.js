// Question bank for gentle check-ins
// These questions appear periodically to encourage reflection

export const gentleQuestions = [
    // Self-awareness
    'Are you being hard on yourself today?',
    'How are you really feeling?',
    'What do you need more of right now?',
    'What would make tomorrow easier?',

    // Self-care
    'Have you been kind to yourself today?',
    'What would feel nurturing right now?',
    'What does your body need?',
    'When did you last rest?',

    // Gratitude & positivity
    'What\'s one thing you\'re grateful for?',
    'What made you smile today?',
    'What went well today?',
    'What\'s something beautiful you noticed?',

    // Progress & growth
    'What\'s one small win from today?',
    'How have you grown this week?',
    'What\'s something you learned recently?',
    'What are you proud of?',

    // Future & intentions
    'What are you looking forward to?',
    'What would make this week feel good?',
    'What matters most to you right now?',
    'What do you want to remember about today?',

    // Letting go
    'What can you let go of?',
    'What\'s one worry you could release?',
    'What\'s not yours to carry?',
    'What would happen if you rested?',

    // Connection & meaning
    'What brings you joy?',
    'What makes you feel alive?',
    'What do you want more of in your life?',
    'What would your future self thank you for?',
];

// Get random question
export const getRandomQuestion = () => {
    return gentleQuestions[Math.floor(Math.random() * gentleQuestions.length)];
};

// Get question by category
export const getQuestionByTime = () => {
    const hour = new Date().getHours();

    // Morning questions (5am - 11am)
    if (hour >= 5 && hour < 12) {
        const morningQuestions = [
            'What would make today feel okay?',
            'What do you need more of today?',
            'How do you want to feel today?',
            'What would support you today?',
        ];
        return morningQuestions[Math.floor(Math.random() * morningQuestions.length)];
    }

    // Afternoon questions (12pm - 5pm)
    if (hour >= 12 && hour < 17) {
        const afternoonQuestions = [
            'How are you really feeling?',
            'What\'s one small win from today?',
            'Have you been kind to yourself today?',
            'What would feel nurturing right now?',
        ];
        return afternoonQuestions[Math.floor(Math.random() * afternoonQuestions.length)];
    }

    // Evening questions (5pm - 9pm)
    if (hour >= 17 && hour < 21) {
        const eveningQuestions = [
            'What went well today?',
            'What are you grateful for?',
            'What can you let go of?',
            'What would make tomorrow easier?',
        ];
        return eveningQuestions[Math.floor(Math.random() * eveningQuestions.length)];
    }

    // Night questions (9pm - 5am)
    const nightQuestions = [
        'What do you want to remember about today?',
        'What made you smile today?',
        'What would your future self thank you for?',
        'What brings you peace?',
    ];
    return nightQuestions[Math.floor(Math.random() * nightQuestions.length)];
};
