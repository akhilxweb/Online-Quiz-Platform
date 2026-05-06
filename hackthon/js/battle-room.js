/* ========== BATTLE ROOM JAVASCRIPT ========== */

// Battle state management
const battleState = {
    currentQuestion: 0,
    totalQuestions: 10,
    player1: {
        name: 'You',
        avatar: '👤',
        score: 0,
        correct: 0,
        streak: 0,
        answers: [],
        times: []
    },
    player2: {
        name: 'Opponent',
        avatar: '🔥',
        score: 0,
        correct: 0,
        streak: 0,
        answers: [],
        times: []
    },
    questions: [],
    selectedOption: null,
    battleStartTime: null,
    timePerQuestion: 30,
    timeRemaining: 30,
    timerInterval: null,
    battleActive: false
};

// Mock battle questions
const mockBattleQuestions = [
    {
        id: 1,
        question: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        correct: 1,
        difficulty: 'Medium',
        explanation: 'Binary search divides the search space in half with each iteration, resulting in O(log n) time complexity.'
    },
    {
        id: 2,
        question: 'Which data structure uses LIFO?',
        options: ['Queue', 'Stack', 'Heap', 'Graph'],
        correct: 1,
        difficulty: 'Easy',
        explanation: 'Stack (Last In First Out) is a fundamental data structure where the last element added is the first one removed.'
    },
    {
        id: 3,
        question: 'What is the space complexity of merge sort?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        correct: 1,
        difficulty: 'Hard',
        explanation: 'Merge sort requires additional space proportional to the input size for merging, hence O(n) space complexity.'
    },
    {
        id: 4,
        question: 'Which sorting algorithm is most efficient for nearly sorted data?',
        options: ['Bubble Sort', 'Insertion Sort', 'Quick Sort', 'Merge Sort'],
        correct: 1,
        difficulty: 'Medium',
        explanation: 'Insertion sort performs excellently on nearly sorted data with O(n) best-case time complexity.'
    },
    {
        id: 5,
        question: 'What is the main advantage of using a hash table?',
        options: ['Ordered', 'Fast lookup', 'Memory efficient', 'Always sorted'],
        correct: 1,
        difficulty: 'Easy',
        explanation: 'Hash tables provide O(1) average-case lookup time, making them ideal for fast data retrieval.'
    },
    {
        id: 6,
        question: 'Which tree traversal visits nodes in depth-first manner?',
        options: ['Level Order', 'Pre-order', 'Breadth-first', 'None of above'],
        correct: 1,
        difficulty: 'Medium',
        explanation: 'Pre-order traversal is a depth-first approach that visits parent before children.'
    },
    {
        id: 7,
        question: 'What is the worst-case time complexity of quicksort?',
        options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(2^n)'],
        correct: 1,
        difficulty: 'Hard',
        explanation: 'When the pivot is always the smallest/largest element, quicksort degrades to O(n²) comparisons.'
    },
    {
        id: 8,
        question: 'How many edges does a tree with n nodes have?',
        options: ['n', 'n-1', 'n+1', '2n'],
        correct: 1,
        difficulty: 'Easy',
        explanation: 'A tree with n nodes always has exactly n-1 edges by definition.'
    },
    {
        id: 9,
        question: 'What is a self-balancing binary search tree?',
        options: ['Red-Black Tree', 'BST', 'Trie', 'Segment Tree'],
        correct: 0,
        difficulty: 'Hard',
        explanation: 'Red-Black Tree is a self-balancing BST that maintains height balance for efficient operations.'
    },
    {
        id: 10,
        question: 'Which algorithm uses divide and conquer?',
        options: ['Linear Search', 'Merge Sort', 'Bubble Sort', 'Insertion Sort'],
        correct: 1,
        difficulty: 'Medium',
        explanation: 'Merge Sort is a classic divide-and-conquer algorithm that splits the problem recursively.'
    }
];

// Initialize battle
document.addEventListener('DOMContentLoaded', function() {
    initBattle();
});

function initBattle() {
    checkAuthentication();
    
    const user = JSON.parse(localStorage.getItem('user') || '{"username":"User"}');
    battleState.player1.name = user.username || 'You';

    battleState.questions = [...mockBattleQuestions];
    battleState.battleActive = true;
    battleState.battleStartTime = Date.now();

    loadUserData();
    displayQuestion();
    startTimer();
    setupEventListeners();
    animateBattleStart();
}

function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
}

function loadUserData() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    document.getElementById('player1Name').textContent = battleState.player1.name;
    
    // Simulate opponent data
    const opponents = [
        { name: 'AlexCode', avatar: '🔥', level: 10, rank: 128 },
        { name: 'DataNinja', avatar: '⚡', level: 11, rank: 87 },
        { name: 'CodeMaster', avatar: '💻', level: 12, rank: 45 },
        { name: 'QuizGuru', avatar: '🧠', level: 9, rank: 156 }
    ];
    
    const opponent = opponents[Math.floor(Math.random() * opponents.length)];
    battleState.player2.name = opponent.name;
    battleState.player2.avatar = opponent.avatar;
    
    document.getElementById('player2Name').textContent = opponent.name;
}

function startTimer() {
    battleState.timeRemaining = battleState.timePerQuestion;
    
    battleState.timerInterval = setInterval(() => {
        battleState.timeRemaining--;
        document.getElementById('timer').textContent = Math.max(0, battleState.timeRemaining);
        
        if (battleState.timeRemaining <= 0) {
            handleTimerExpire();
        }
    }, 1000);
}

function handleTimerExpire() {
    // Auto-submit with no answer
    battleState.selectedOption = -1;
    processAnswer(false);
}

function displayQuestion() {
    if (battleState.currentQuestion >= battleState.totalQuestions) {
        endBattle();
        return;
    }

    const q = battleState.questions[battleState.currentQuestion];
    
    // Reset UI
    battleState.selectedOption = null;
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected', 'correct', 'incorrect');
    });
    
    // Clear timer
    if (battleState.timerInterval) clearInterval(battleState.timerInterval);
    battleState.timeRemaining = battleState.timePerQuestion;

    // Update question display
    document.getElementById('questionNumber').textContent = battleState.currentQuestion + 1;
    document.getElementById('questionText').textContent = q.question;
    document.getElementById('questionDifficulty').textContent = q.difficulty;

    // Update options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `
            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
            <span class="option-text">${option}</span>
        `;
        btn.addEventListener('click', () => selectOption(index, btn));
        optionsContainer.appendChild(btn);

        gsap.from(btn, {
            duration: 0.3,
            y: 20,
            opacity: 0,
            delay: index * 0.08,
            ease: 'power2.out'
        });
    });

    // Hide feedback/results
    document.getElementById('answerFeedback').style.display = 'none';
    
    // Start new timer
    startTimer();

    // Animate transition
    gsap.from('.question-arena', {
        duration: 0.3,
        opacity: 0,
        ease: 'power2.out'
    });
}

function selectOption(index, element) {
    battleState.selectedOption = index;
    
    // Update UI
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    element.classList.add('selected');
}

function setupEventListeners() {
    document.getElementById('submitBtn').addEventListener('click', () => {
        if (battleState.selectedOption !== null) {
            processAnswer(battleState.selectedOption === battleState.questions[battleState.currentQuestion].correct);
        } else {
            NotificationManager.show('Please select an option', 'warning');
        }
    });

    document.getElementById('skipBtn').addEventListener('click', () => {
        processAnswer(false);
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        battleState.currentQuestion++;
        displayQuestion();
    });
}

function processAnswer(isCorrect) {
    if (battleState.timerInterval) clearInterval(battleState.timerInterval);

    const questionTime = battleState.timePerQuestion - battleState.timeRemaining;
    
    // Update player1 (user)
    battleState.player1.answers.push(isCorrect ? 1 : 0);
    battleState.player1.times.push(questionTime);

    if (isCorrect) {
        battleState.player1.correct++;
        battleState.player1.streak++;
        battleState.player1.score += 100 + Math.max(0, 30 - questionTime) * 2;
    } else {
        battleState.player1.streak = 0;
    }

    // Simulate opponent answer (slightly varying logic)
    const opponentCorrect = Math.random() > 0.25; // 75% correct rate
    if (opponentCorrect) {
        battleState.player2.correct++;
        battleState.player2.streak++;
        battleState.player2.score += 95 + Math.random() * 50;
    } else {
        battleState.player2.streak = 0;
    }

    // Update UI immediately
    updatePlayerStats();

    // Show feedback
    showAnswerFeedback(isCorrect);
}

function updatePlayerStats() {
    // Player 1 stats
    document.getElementById('player1Score').textContent = Math.floor(battleState.player1.score);
    document.getElementById('player1Correct').textContent = battleState.player1.correct;
    document.getElementById('player1Streak').textContent = battleState.player1.streak;
    const player1Accuracy = battleState.player1.answers.length > 0 
        ? Math.round((battleState.player1.correct / battleState.player1.answers.length) * 100) 
        : 0;
    document.getElementById('player1Accuracy').textContent = player1Accuracy + '%';

    const player1Progress = ((battleState.currentQuestion + 1) / battleState.totalQuestions) * 100;
    document.querySelector('.player-1-progress').style.width = player1Progress + '%';
    document.querySelector('.player-card.player-1 .progress-text').textContent = 
        `${battleState.currentQuestion + 1}/${battleState.totalQuestions} Questions`;

    // Player 2 stats
    document.getElementById('player2Score').textContent = Math.floor(battleState.player2.score);
    document.getElementById('player2Correct').textContent = battleState.player2.correct;
    document.getElementById('player2Streak').textContent = battleState.player2.streak;
    const player2Accuracy = battleState.player2.answers.length > 0 
        ? Math.round((battleState.player2.correct / battleState.player2.answers.length) * 100) 
        : 0;
    document.getElementById('player2Accuracy').textContent = player2Accuracy + '%';

    const player2Progress = player1Progress;
    document.querySelector('.player-2-progress').style.width = player2Progress + '%';
    document.querySelector('.player-card.player-2 .progress-text').textContent = 
        `${battleState.currentQuestion + 1}/${battleState.totalQuestions} Questions`;
}

function showAnswerFeedback(isCorrect) {
    const q = battleState.questions[battleState.currentQuestion];
    const feedbackEl = document.getElementById('answerFeedback');
    const resultEl = document.getElementById('feedbackResult');
    const explanationEl = document.getElementById('feedbackExplanation');

    if (isCorrect) {
        resultEl.textContent = '✓ Correct! +100 Points';
        resultEl.className = '';
        resultEl.style.color = 'var(--accent)';
    } else {
        resultEl.textContent = '✗ Incorrect! 0 Points';
        resultEl.className = 'incorrect';
        resultEl.style.color = 'var(--accent-2)';
    }

    explanationEl.innerHTML = `
        <strong>Explanation:</strong><br>
        ${q.explanation}
    `;

    // Highlight correct answer
    const correctBtn = document.querySelectorAll('.option-btn')[q.correct];
    correctBtn.classList.add('correct');

    // Highlight selected wrong answer
    if (!isCorrect && battleState.selectedOption !== null) {
        document.querySelectorAll('.option-btn')[battleState.selectedOption].classList.add('incorrect');
    }

    feedbackEl.style.display = 'block';

    gsap.from(feedbackEl, {
        duration: 0.3,
        opacity: 0,
        scale: 0.9,
        ease: 'power2.out'
    });
}

function endBattle() {
    battleState.battleActive = false;
    
    if (battleState.timerInterval) clearInterval(battleState.timerInterval);

    const player1Won = battleState.player1.score > battleState.player2.score;
    const totalTime = Math.floor((Date.now() - battleState.battleStartTime) / 1000);
    const totalMinutes = Math.floor(totalTime / 60);
    const totalSeconds = totalTime % 60;

    // Calculate XP reward
    const baseXP = battleState.player1.correct * 50;
    const bonusXP = player1Won ? 200 : 0;
    const totalXP = baseXP + bonusXP;

    // Update results
    const resultsTitle = player1Won ? 'Victory! 🎉' : 'Defeat! 😔';
    document.getElementById('resultsTitle').textContent = resultsTitle;
    document.getElementById('finalScore').textContent = Math.floor(battleState.player1.score);
    document.getElementById('finalAccuracy').textContent = 
        Math.round((battleState.player1.correct / battleState.totalQuestions) * 100) + '%';
    document.getElementById('xpEarned').textContent = '+' + totalXP;
    document.getElementById('questionsAnswered').textContent = `${battleState.totalQuestions}/${battleState.totalQuestions}`;
    document.getElementById('correctAnswers').textContent = `${battleState.player1.correct}/${battleState.totalQuestions}`;
    document.getElementById('bestStreak').textContent = Math.max(...battleState.player1.answers.reduce((acc, val, idx) => {
        if (val === 1) {
            acc[acc.length - 1]++;
        } else {
            acc.push(0);
        }
        return acc;
    }, [0]));
    document.getElementById('totalTime').textContent = `${totalMinutes}:${String(totalSeconds).padStart(2, '0')}`;

    // Check achievements
    if (battleState.player1.correct === battleState.totalQuestions) {
        const achievement = document.getElementById('achievementNotif');
        achievement.style.display = 'block';
        document.getElementById('achievementText').textContent = '🏆 Perfect Score! All answers correct!';
    }

    // Update user stats in localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.stats = user.stats || {};
    user.stats.totalQuizzes = (user.stats.totalQuizzes || 0) + 1;
    
    if (player1Won) {
        user.stats.coins = (user.stats.coins || 0) + 100;
        user.stats.xp = (user.stats.xp || 0) + totalXP;
    } else {
        user.stats.xp = (user.stats.xp || 0) + Math.floor(totalXP / 2); // Get half XP for participating
    }
    
    // Check for level up
    if (user.stats.xp >= (user.stats.level || 1) * 1000) {
        user.stats.level = (user.stats.level || 1) + 1;
    }
    localStorage.setItem('user', JSON.stringify(user));

    // Track analytics
    AnalyticsTracker.trackEvent('battle_completed', {
        result: player1Won ? 'win' : 'loss',
        score: Math.floor(battleState.player1.score),
        correct: battleState.player1.correct,
        accuracy: Math.round((battleState.player1.correct / battleState.totalQuestions) * 100),
        xp_earned: totalXP,
        total_time: totalTime
    });

    // Show results
    document.getElementById('questionNumber').textContent = battleState.currentQuestion + 1;
    document.getElementById('answerFeedback').style.display = 'none';
    document.getElementById('battleResults').style.display = 'block';

    gsap.from('#battleResults', {
        duration: 0.4,
        opacity: 0,
        scale: 0.9,
        ease: 'power2.out'
    });
}

function animateBattleStart() {
    gsap.from('.battle-header', {
        duration: 0.6,
        y: -30,
        opacity: 0,
        ease: 'power2.out'
    });

    gsap.from('.player-card', {
        duration: 0.6,
        y: 30,
        opacity: 0,
        stagger: 0.2,
        ease: 'power2.out',
        delay: 0.2
    });

    gsap.from('.question-arena', {
        duration: 0.6,
        y: 30,
        opacity: 0,
        ease: 'power2.out',
        delay: 0.5
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (!battleState.battleActive) return;

    const optionIndex = parseInt(event.key) - 1;
    if (optionIndex >= 0 && optionIndex < 4) {
        const btn = document.querySelectorAll('.option-btn')[optionIndex];
        if (btn) selectOption(optionIndex, btn);
    }

    if (event.key === 'Enter') {
        if (battleState.selectedOption !== null) {
            document.getElementById('submitBtn').click();
        }
    }

    if (event.key === ' ') {
        event.preventDefault();
        document.getElementById('skipBtn').click();
    }
});
