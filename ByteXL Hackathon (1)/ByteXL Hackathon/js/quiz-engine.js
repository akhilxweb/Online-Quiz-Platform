/**
 * Quiz Engine - Expanded Question Bank
 * ByteXL Hackathon Standard
 */
(function() {
    const quizData = {
        javascript: {
            easy: [
                { q: "Which symbol is used for comments in JS?", a: "//", options: ["#", "//", "/*", "<!--"] },
                { q: "What is the result of '2' + 2?", a: "22", options: ["4", "22", "NaN", "Error"] },
                { q: "Which keyword is used to declare a constant?", a: "const", options: ["var", "let", "const", "def"] },
                { q: "How do you write 'Hello World' in an alert box?", a: "alert('Hello World')", options: ["msg('Hello World')", "alert('Hello World')", "console.log('Hello World')", "print('Hello World')"] },
                { q: "Which data type is used for true/false values?", a: "Boolean", options: ["String", "Number", "Boolean", "Object"] }
            ],
            medium: [
                { q: "What is the difference between '==' and '==='?", a: "=== checks value and type", options: ["No difference", "== is for strings", "=== checks value and type", "== is faster"] },
                { q: "Which array method adds an element to the end?", a: "push()", options: ["pop()", "shift()", "push()", "unshift()"] },
                { q: "What does 'NaN' stand for?", a: "Not a Number", options: ["Not a Number", "New and Normal", "Negative and Null", "None and Null"] },
                { q: "How do you define a function in JS?", a: "function myFunc()", options: ["def myFunc()", "function myFunc()", "func myFunc()", "new myFunc()"] }
            ],
            hard: [
                { q: "What is a 'closure' in JavaScript?", a: "A function with its lexical environment", options: ["Closing a browser tab", "A function with its lexical environment", "An object method", "A syntax error"] },
                { q: "What is the purpose of 'use strict'?", a: "Enforce stricter parsing/error handling", options: ["Enable new features", "Enforce stricter parsing/error handling", "Make code faster", "Connect to a server"] },
                { q: "What is the 'this' keyword in a regular function?", a: "The global object (window)", options: ["The function itself", "The global object (window)", "The first argument", "null"] }
            ]
        },
        python: {
            easy: [
                { q: "How do you output 'Hello' in Python?", a: "print('Hello')", options: ["echo('Hello')", "print('Hello')", "console.log('Hello')", "System.out.print('Hello')"] },
                { q: "Which character starts a comment in Python?", a: "#", options: ["//", "#", "/*", "--"] },
                { q: "What is the correct file extension for Python?", a: ".py", options: [".python", ".pyt", ".py", ".pyc"] }
            ],
            medium: [
                { q: "How do you create a list in Python?", a: "[]", options: ["{}", "[]", "()", "<>"] },
                { q: "Which keyword is used for a function?", a: "def", options: ["function", "def", "func", "define"] },
                { q: "How do you get the length of a list?", a: "len()", options: ["size()", "count()", "length()", "len()"] }
            ],
            hard: [
                { q: "What is a decorator in Python?", a: "A function that modifies another function", options: ["A GUI element", "A function that modifies another function", "A class attribute", "A type of loop"] },
                { q: "What does 'self' refer to in a class method?", a: "The instance of the class", options: ["The class itself", "The instance of the class", "The global scope", "The parent class"] }
            ]
        },
        sql: {
            easy: [
                { q: "Which SQL statement is used to extract data?", a: "SELECT", options: ["GET", "OPEN", "EXTRACT", "SELECT"] },
                { q: "Which SQL statement is used to update data?", a: "UPDATE", options: ["SAVE", "UPDATE", "MODIFY", "ALTER"] }
            ],
            medium: [
                { q: "How do you select all columns from a table named 'Users'?", a: "SELECT * FROM Users", options: ["SELECT all FROM Users", "SELECT Users", "SELECT * FROM Users", "GET * FROM Users"] },
                { q: "Which keyword is used to sort the result?", a: "ORDER BY", options: ["SORT BY", "ORDER BY", "GROUP BY", "ALIGN BY"] }
            ]
        },
        cyber: {
            easy: [
                { q: "What does 'HTTPS' stand for?", a: "Hypertext Transfer Protocol Secure", options: ["High Tech Privacy Service", "Hypertext Transfer Protocol Secure", "Home Text Power System", "None of these"] }
            ],
            hard: [
                { q: "What is a 'Zero-Day' vulnerability?", a: "A hole unknown to the software vendor", options: ["A bug found in one day", "A hole unknown to the software vendor", "A virus that clears data", "An outdated firewall"] }
            ]
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

        document.getElementById('active-category').textContent = cat.toUpperCase() + " (" + diff.toUpperCase() + ")";
        
        // Get the pool, fallback to JS Easy
        const catPool = quizData[cat] || quizData.javascript;
        currentQuestions = catPool[diff] || catPool.easy || quizData.javascript.easy;
        
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
        // Hide quiz elements
        const header = document.querySelector('.quiz-header');
        const progress = document.querySelector('.progress-bar');
        const quizCard = document.getElementById('quiz-card');
        
        if (header) header.style.display = 'none';
        if (progress) progress.style.display = 'none';
        if (quizCard) quizCard.style.display = 'none';
        
        // Show results screen
        let results = document.getElementById('results-screen');
        if (results) {
            results.style.display = 'block';
            document.getElementById('final-score-display').textContent = score;
        }

        // Update user XP
        const user = JSON.parse(localStorage.getItem('quizverse_user'));
        if (user) {
            user.xp = (user.xp || 0) + score;
            localStorage.setItem('quizverse_user', JSON.stringify(user));
        }
    }
})();
