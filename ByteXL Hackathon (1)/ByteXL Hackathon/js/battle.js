/**
 * QuizVerse Battle Logic - ByteXL Hackathon Standard
 * Updated: Host-Controlled Start
 */
(function() {
    const { onValue, set, update } = window.QuizVerse || {};
    
    let currentUser = JSON.parse(localStorage.getItem('quizverse_user'));
    let currentRoomId = null;
    let isHost = false;
    let gameData = null;
    let timerInterval = null;
    let currentQuestionIndex = 0;
    let userScore = 0;

    const questionBank = {
        easy: [
            { q: "What is 15 + 25?", options: ["30", "35", "40", "45"], answer: 2 },
            { q: "Which planet is closest to the Sun?", options: ["Venus", "Mars", "Mercury", "Earth"], answer: 2 },
            { q: "What is the primary language for Android apps?", options: ["Swift", "Kotlin", "PHP", "C#"], answer: 1 },
            { q: "Who discovered Gravity?", options: ["Newton", "Einstein", "Tesla", "Galileo"], answer: 0 }
        ],
        medium: [
            { q: "What does API stand for?", options: ["App Process Interface", "Application Programming Interface", "Auto Program Integration", "Advanced Plug-in Info"], answer: 1 },
            { q: "Which tag is used for links in HTML?", options: ["<link>", "<a>", "<url>", "<href>"], answer: 1 },
            { q: "What is the time complexity of a hash map lookup?", options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], answer: 2 }
        ],
        hard: [
            { q: "Which sorting algorithm has the best average time complexity?", options: ["Bubble Sort", "Quick Sort", "Insertion Sort", "Selection Sort"], answer: 1 },
            { q: "What is a 'Closure' in JavaScript?", options: ["A function with its lexical environment", "Closing a database connection", "Ending a loop", "A private class member"], answer: 0 }
        ]
    };

    window.showSection = (id) => {
        document.querySelectorAll('.card').forEach(c => c.classList.add('hidden'));
        const target = document.getElementById(id);
        if (target) target.classList.remove('hidden');
    };

    window.generateRoom = async () => {
        currentUser = JSON.parse(localStorage.getItem('quizverse_user')) || { name: "Warrior", photoURL: "" };
        
        const level = document.getElementById('level').value;
        const timeLimit = parseInt(document.getElementById('time-limit').value) || 15;
        const numQ = parseInt(document.getElementById('num-questions').value) || 5;

        isHost = true;
        currentRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        const pool = questionBank[level] || questionBank.easy;
        const selectedQuestions = [...pool].sort(() => Math.random() - 0.5).slice(0, numQ);

        gameData = {
            id: currentRoomId,
            settings: { level, timeLimit, numQ },
            questions: selectedQuestions,
            players: {
                p1: { name: currentUser.name, score: 0, photo: currentUser.photoURL },
                p2: null
            },
            gameState: 'waiting'
        };

        await set(`rooms/${currentRoomId}`, gameData);
        
        document.getElementById('generated-id').textContent = currentRoomId;
        document.getElementById('room-id-display').classList.remove('hidden');
        document.getElementById('host-controls').classList.add('hidden');
        document.getElementById('waiting-msg').classList.remove('hidden');
        document.getElementById('status-text').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Waiting for opponent to join...';

        // Listen for player 2
        onValue(`rooms/${currentRoomId}/players/p2`, (snapshot) => {
            const p2 = snapshot.val();
            if (p2) {
                gameData.players.p2 = p2;
                document.getElementById('host-controls').classList.remove('hidden');
                document.getElementById('waiting-msg').classList.add('hidden');
            }
        });
    };

    window.hostStartGame = async () => {
        if (!isHost || !currentRoomId) return;
        await update(`rooms/${currentRoomId}`, { gameState: 'playing' });
        startBattle();
    };

    window.validateJoin = async () => {
        const inputId = document.getElementById('join-id-input').value.trim().toUpperCase();
        if (!inputId) return;

        currentUser = JSON.parse(localStorage.getItem('quizverse_user')) || { name: "Warrior", photoURL: "" };

        const roomDataRaw = localStorage.getItem(`db_rooms/${inputId}`);
        if (roomDataRaw) {
            gameData = JSON.parse(roomDataRaw);
            if (gameData.players.p2) {
                alert("Room is full!");
                return;
            }

            isHost = false;
            currentRoomId = inputId;
            
            const p2Data = { name: currentUser.name, score: 0, photo: currentUser.photoURL };
            await update(`rooms/${currentRoomId}/players`, { p2: p2Data });
            
            // Show waiting for host
            window.showSection('join-room-section');
            const joinBtn = document.querySelector('#join-room-section .btn-primary');
            if (joinBtn) {
                joinBtn.disabled = true;
                joinBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Waiting for Host to start...';
            }

            // Listen for game state change
            onValue(`rooms/${currentRoomId}/gameState`, (snapshot) => {
                const state = snapshot.val();
                if (state === 'playing') {
                    // Refetch full data
                    const freshData = JSON.parse(localStorage.getItem(`db_rooms/${currentRoomId}`));
                    gameData = freshData;
                    startBattle();
                }
            });
        } else {
            alert("Room not found!");
        }
    };

    function startBattle() {
        window.showSection('battle-screen');
        document.getElementById('total-q').textContent = gameData.questions.length;
        document.getElementById('opponent-name').textContent = isHost ? gameData.players.p2.name : gameData.players.p1.name;
        
        currentQuestionIndex = 0;
        userScore = 0;
        loadQuestion();

        onValue(`rooms/${currentRoomId}/players`, (snapshot) => {
            const players = snapshot.val();
            if (players) gameData.players = players;
        });
    }

    function loadQuestion() {
        if (currentQuestionIndex >= gameData.questions.length) {
            endBattle();
            return;
        }

        const q = gameData.questions[currentQuestionIndex];
        document.getElementById('current-q').textContent = currentQuestionIndex + 1;
        document.getElementById('question-text').textContent = q.q;
        
        const container = document.getElementById('options-container');
        container.innerHTML = '';

        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn animate-fade-in';
            btn.textContent = opt;
            btn.onclick = () => handleAnswer(i === q.answer, btn);
            container.appendChild(btn);
        });

        startTimer(gameData.settings.timeLimit);
    }

    function handleAnswer(isCorrect, btn) {
        clearInterval(timerInterval);
        document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
        
        if (isCorrect) {
            btn.classList.add('correct');
            userScore += 100;
        } else {
            btn.classList.add('wrong');
            const correctIdx = gameData.questions[currentQuestionIndex].answer;
            const btns = document.querySelectorAll('.option-btn');
            if (btns[correctIdx]) btns[correctIdx].classList.add('correct');
        }

        const playerKey = isHost ? 'p1' : 'p2';
        update(`rooms/${currentRoomId}/players/${playerKey}`, { score: userScore });

        setTimeout(() => {
            currentQuestionIndex++;
            loadQuestion();
        }, 1500);
    }

    function startTimer(seconds) {
        clearInterval(timerInterval);
        let timeLeft = seconds;
        const timerEl = document.getElementById('timer');
        timerEl.textContent = `Time: ${timeLeft}s`;

        timerInterval = setInterval(() => {
            timeLeft--;
            timerEl.textContent = `Time: ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                currentQuestionIndex++;
                loadQuestion();
            }
        }, 1000);
    }

    function endBattle() {
        clearInterval(timerInterval);
        window.showSection('winner-screen');
        
        document.getElementById('score-display').textContent = userScore;
        
        const s1 = gameData.players.p1.score;
        const s2 = gameData.players.p2.score;
        const winText = document.getElementById('winner-text');

        if (s1 === s2) {
            winText.textContent = "It's a Draw! 🤝";
        } else {
            const iWon = isHost ? s1 > s2 : s2 > s1;
            winText.textContent = iWon ? "Victory! 🏆 You are the Master." : "Defeat! 🥈 Better luck next time.";
        }

        const user = JSON.parse(localStorage.getItem('quizverse_user'));
        if (user) {
            user.xp = (user.xp || 0) + (userScore / 10);
            localStorage.setItem('quizverse_user', JSON.stringify(user));
        }
    }
})();
