// Encouragement messages for Bloomroom
// All messages are gentle, reassuring, and non-judgmental

// Task completion messages
export const completionMessages = [
    'You did it! 🌸',
    'Proud of you ✨',
    'Look at you go 🌿',
    'That\'s growth 💚',
    'You showed up 🌱',
    'Beautiful work 🌺',
    'One step forward 🦋',
    'You\'re doing it 💫',
];

// Task postpone messages
export const postponeMessages = [
    'Tomorrow is okay',
    'You can try again tomorrow',
    'Rest is part of the journey',
    'There\'s always tomorrow',
    'Taking your time is fine',
    'No rush, no pressure',
    'Tomorrow is a new day',
    'You\'ll know when you\'re ready',
];

// Task skip messages
export const skipMessages = [
    'Still proud of you',
    'You know what you need',
    'Listening to yourself matters',
    'That\'s okay',
    'You\'re still growing',
    'Rest is growth too',
    'Trust your pace',
    'You\'re doing enough',
];

// General encouragement
export const generalEncouragement = [
    'You\'re not behind',
    'You\'re exactly where you need to be',
    'Small steps count',
    'You\'re doing more than you think',
    'Progress isn\'t always visible',
    'You\'re allowed to rest',
    'You\'re allowed to grow slowly',
    'Gentle is powerful',
    'You\'re enough',
    'This is enough',
];

// Morning motivation
export const morningMotivation = [
    'What would make today feel okay?',
    'What\'s one small thing you want to do today?',
    'How do you want to feel today?',
    'What would support you today?',
    'What needs your attention today?',
    'What would make today meaningful?',
];

// Evening reflection
export const eveningReflection = [
    'What went well today?',
    'What are you grateful for?',
    'What did you learn today?',
    'How did you show up for yourself?',
    'What made you smile today?',
    'What can you let go of?',
];

// Anxiety relief affirmations
export const anxietyRelief = [
    'You\'re allowed to build slowly',
    'You have time',
    'You don\'t have to do everything today',
    'One thing at a time',
    'You\'re doing enough',
    'Rest doesn\'t mean falling behind',
    'You\'re not running out of time',
    'Your pace is valid',
];

// Get random message from array
export const getRandomMessage = (messageArray) => {
    return messageArray[Math.floor(Math.random() * messageArray.length)];
};

// Get encouragement based on context
export const getContextualEncouragement = (context) => {
    switch (context) {
        case 'complete':
            return getRandomMessage(completionMessages);
        case 'postpone':
            return getRandomMessage(postponeMessages);
        case 'skip':
            return getRandomMessage(skipMessages);
        case 'morning':
            return getRandomMessage(morningMotivation);
        case 'evening':
            return getRandomMessage(eveningReflection);
        case 'anxiety':
            return getRandomMessage(anxietyRelief);
        default:
            return getRandomMessage(generalEncouragement);
    }
};
