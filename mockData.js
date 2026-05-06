// mockData.js

const MockData = {
    user: {
        name: "Alex Dev",
        handle: "@alex_coder",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        level: 42,
        xp: 8450,
        xpToNext: 10000,
        coins: 1250,
        streak: 14,
        rank: "Diamond",
        stats: {
            quizzesPlayed: 128,
            winRate: "68%",
            topSubject: "JavaScript"
        }
    },

    leaderboard: [
        { rank: 1, name: "Sarah J.", score: 15420, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", trend: "up" },
        { rank: 2, name: "Mike T.", score: 14200, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike", trend: "same" },
        { rank: 3, name: "Alex Dev", score: 13840, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", trend: "up" },
        { rank: 4, name: "Emma W.", score: 12100, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma", trend: "down" },
        { rank: 5, name: "Chris P.", score: 11950, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris", trend: "up" },
    ],

    categories: [
        { id: 'js', name: 'JavaScript', icon: '⚡', color: 'from-yellow-400 to-yellow-600', count: 42 },
        { id: 'react', name: 'React', icon: '⚛️', color: 'from-cyan-400 to-blue-500', count: 28 },
        { id: 'python', name: 'Python', icon: '🐍', color: 'from-blue-400 to-blue-600', count: 35 },
        { id: 'algo', name: 'Algorithms', icon: '🧠', color: 'from-purple-400 to-purple-600', count: 50 },
    ],

    // Mock AI Quiz Generation
    generateQuiz: async (topic, difficulty) => {
        return new Promise((resolve) => {
            // Simulate API delay
            setTimeout(() => {
                resolve([
                    {
                        question: `What is the output of the following JavaScript code?`,
                        code: `console.log(typeof null);\nconsole.log(typeof undefined);`,
                        options: ["'object', 'undefined'", "'null', 'undefined'", "'object', 'object'", "Error"],
                        correctAnswer: 0,
                        explanation: "In JavaScript, typeof null is a known bug that returns 'object'. typeof undefined correctly returns 'undefined'."
                    },
                    {
                        question: `Which method is used to serialize an object into a JSON string in JavaScript?`,
                        code: null,
                        options: ["JSON.parse()", "JSON.stringify()", "Object.toJSON()", "String()"],
                        correctAnswer: 1,
                        explanation: "JSON.stringify() converts a JavaScript object or value to a JSON string."
                    },
                    {
                        question: `How do you create a closure in JavaScript?`,
                        code: `function outer() {\n  let count = 0;\n  return function inner() {\n    count++;\n    return count;\n  }\n}`,
                        options: [
                            "By returning a function from another function",
                            "By using the 'closure' keyword",
                            "By importing the Closure module",
                            "Closures are not supported"
                        ],
                        correctAnswer: 0,
                        explanation: "A closure is created when an inner function has access to the outer (enclosing) function's variables—scope chain."
                    }
                ]);
            }, 2500); // 2.5s delay to show loading animation
        });
    }
};

window.MockData = MockData;
