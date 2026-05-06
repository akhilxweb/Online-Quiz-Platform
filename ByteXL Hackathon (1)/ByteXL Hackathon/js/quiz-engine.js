/**
 * Quiz Engine - ByteXL Hackathon Standard
 */
(function() {
    const quizData = {
        javascript: {
            easy: [
                { q: "Which symbol is used for comments in JS?", a: "//", options: ["#", "//", "/*", "<!--"] },
                { q: "Which data type is 'true'?", a: "boolean", options: ["string", "boolean", "number", "object"] }
            ],
            python: {
                easy: [{ q: "How do you output text in Python?", a: "print()", options: ["echo", "print()", "console.log", "printf"] }]
            }
        }
    };

    let currentQuestions = [];
    let currentIndex = 0;
    let score = 0;
    let timer = 30;
    let timerInterval;

    document.addEventListener('DOMContentLoaded', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const cat = urlParams.get('category') || 'javascript';
        const diff = urlParams.get('difficulty') || 'easy';

        document.getElementById('active-category').textContent = cat.toUpperCase();
        currentQuestions = (quizData[cat] && quizData[cat][diff]) ? quizData[cat][diff] : quizData.javascript.easy;
        loadQuestion();
    });

    function loadQuestion() {
        if (currentIndex >= currentQuestions.length) {
            showResults();
            return;
        }

        const q = currentQuestions[currentIndex];
        document.getElementById('question-text').textContent = q.q;
        document.getElementById('quiz-progress').style.width = `${((currentIndex + 1) / currentQuestions.length) * 100}%`;
        
        const container = document.getElementById('options-container');
        container.innerHTML = '';
        
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn glass-effect';
            btn.textContent = opt;
            btn.onclick = () => selectOption(btn, opt);
            container.appendChild(btn);
        });

        document.getElementById('next-btn').style.display = 'none';
        startTimer();
    }

    function selectOption(btn, choice) {
        clearInterval(timerInterval);
        const correct = currentQuestions[currentIndex].a;
        
        if (choice === correct) {
            btn.classList.add('correct');
            score += 100;
            document.getElementById('current-score').textContent = score;
        } else {
            btn.classList.add('wrong');
            document.querySelectorAll('.option-btn').forEach(b => {
                if (b.textContent === correct) b.classList.add('correct');
            });
        }
        
        document.getElementById('next-btn').style.display = 'block';
    }

    document.getElementById('next-btn').onclick = () => {
        currentIndex++;
        loadQuestion();
    };

    function startTimer() {
        timer = 30;
        document.getElementById('timer-val').textContent = timer;
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timer--;
            document.getElementById('timer-val').textContent = timer;
            if (timer <= 0) {
                clearInterval(timerInterval);
                currentIndex++;
                loadQuestion();
            }
        }, 1000);
    }

    function showResults() {
        document.getElementById('quiz-card').style.display = 'none';
        document.getElementById('results-screen').style.display = 'block';
        document.getElementById('final-score-display').textContent = score;
    }
})();
