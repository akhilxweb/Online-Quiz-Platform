// js/quiz.js
// Handles the logic for quiz.html

document.addEventListener('DOMContentLoaded', () => {
    requireAuth();

    const diffModal = document.getElementById('difficulty-modal');
    const viewSelect = document.getElementById('view-select');
    const viewActive = document.getElementById('view-active');
    const viewResult = document.getElementById('view-result');
    
    let quizState = { questions: [], idx: 0, score: 0, selected: null, checked: false, timer: null, timeLeft: 15, maxTime: 15, cat: '', diff: '' };
    const DIFF_SETTINGS = { easy: 30, medium: 20, hard: 10 };

    // 1. Render Categories
    function renderCategories() {
        const grid = document.getElementById('category-grid');
        grid.innerHTML = '';
        CATEGORIES.forEach(cat => {
            const card = document.createElement('div');
            card.className = 'cat-card';
            card.innerHTML = `<div class="cat-icon-lg"><i class="ph-fill ${cat.icon}"></i></div><h3 class="font-orbitron">${cat.name}</h3><p class="text-muted mt-2">${DB[cat.id].length} Qs</p>`;
            card.addEventListener('click', () => {
                sfxClick();
                quizState.cat = cat.id;
                diffModal.classList.add('show');
            });
            grid.appendChild(card);
        });
    }
    renderCategories();

    // 2. Handle Difficulty Selection
    document.getElementById('btn-cancel-diff').addEventListener('click', () => {
        sfxClick(); diffModal.classList.remove('show');
    });

    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            sfxClick();
            diffModal.classList.remove('show');
            startQuiz(quizState.cat, btn.dataset.diff);
        });
    });

    // 3. Start Quiz
    function startQuiz(catId, diff) {
        quizState.diff = diff;
        quizState.maxTime = DIFF_SETTINGS[diff];
        quizState.questions = [...DB[catId]].sort(()=>Math.random()-.5).slice(0, 10);
        quizState.idx = 0;
        quizState.score = 0;

        document.getElementById('active-quiz-cat').textContent = CATEGORIES.find(c=>c.id===catId).name;
        document.getElementById('active-quiz-diff').textContent = diff.toUpperCase();

        viewSelect.classList.add('hidden');
        viewActive.classList.remove('hidden');
        
        loadQuestion();
    }

    // 4. Load Question
    function loadQuestion() {
        quizState.selected = null;
        quizState.checked = false;
        quizState.timeLeft = quizState.maxTime;
        
        const q = quizState.questions[quizState.idx];
        
        document.getElementById('quiz-q-num').textContent = quizState.idx + 1;
        document.getElementById('quiz-question').textContent = q.q;
        
        const fb = document.getElementById('quiz-feedback');
        fb.textContent = ''; fb.className = 'feedback-text';
        
        const btnAction = document.getElementById('btn-quiz-action');
        btnAction.textContent = 'Check Answer'; btnAction.disabled = true;
        
        const ct = document.getElementById('quiz-options');
        ct.innerHTML = '';
        
        q.opts.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'opt-btn'; btn.textContent = opt;
            btn.addEventListener('click', () => {
                if (quizState.checked) return;
                sfxClick();
                ct.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                quizState.selected = i;
                btnAction.disabled = false;
            });
            ct.appendChild(btn);
        });
        
        startTimer();
    }

    // 5. Timer Logic
    function startTimer() {
        clearInterval(quizState.timer);
        updateTimerUI();
        quizState.timer = setInterval(() => {
            quizState.timeLeft--;
            updateTimerUI();
            if(quizState.timeLeft <= 0) {
                clearInterval(quizState.timer);
                autoCheck();
            }
        }, 1000);
    }

    function updateTimerUI() {
        document.getElementById('quiz-timer-text').textContent = quizState.timeLeft + 's';
        const pct = (quizState.timeLeft / quizState.maxTime) * 100;
        const bar = document.getElementById('quiz-timer-bar');
        bar.style.width = pct + '%';
        if (pct < 30) {
            bar.style.backgroundColor = 'var(--text-red)';
            bar.style.boxShadow = '0 0 10px var(--text-red)';
        } else {
            bar.style.backgroundColor = 'var(--neon-green)';
            bar.style.boxShadow = '0 0 10px var(--neon-green)';
        }
    }

    // 6. Checking Logic
    function autoCheck() {
        if(quizState.checked) return;
        quizState.checked = true;
        const q = quizState.questions[quizState.idx];
        const btns = document.querySelectorAll('#quiz-options .opt-btn');
        
        btns.forEach(b => b.disabled = true);
        btns[q.a].classList.add('correct');
        
        const fb = document.getElementById('quiz-feedback');
        fb.textContent = "⏰ Time's up!"; fb.className = 'feedback-text wrong';
        sfxWrong();
        
        state.total++;
        document.getElementById('btn-quiz-action').textContent = 'Next Question';
        document.getElementById('btn-quiz-action').disabled = false;
    }

    document.getElementById('btn-quiz-action').addEventListener('click', () => {
        const btnAction = document.getElementById('btn-quiz-action');
        if (!quizState.checked) {
            // Check
            quizState.checked = true;
            clearInterval(quizState.timer);
            
            const q = quizState.questions[quizState.idx];
            const btns = document.querySelectorAll('#quiz-options .opt-btn');
            btns.forEach(b => b.disabled = true);
            const fb = document.getElementById('quiz-feedback');
            
            if (quizState.selected === q.a) {
                btns[quizState.selected].classList.remove('selected');
                btns[quizState.selected].classList.add('correct');
                fb.textContent = '✅ Correct!'; fb.className = 'feedback-text correct';
                quizState.score++; state.correct++; sfxCorrect();
            } else {
                if (quizState.selected !== null) {
                    btns[quizState.selected].classList.remove('selected');
                    btns[quizState.selected].classList.add('wrong');
                }
                btns[q.a].classList.add('correct');
                fb.textContent = '❌ Incorrect'; fb.className = 'feedback-text wrong';
                sfxWrong();
            }
            state.total++;
            btnAction.textContent = 'Next Question';
        } else {
            // Next
            quizState.idx++;
            if (quizState.idx < quizState.questions.length) {
                loadQuestion();
            } else {
                finishQuiz();
            }
        }
    });

    // 7. Finish
    function finishQuiz() {
        clearInterval(quizState.timer);
        
        const diffMultiplier = quizState.diff === 'hard' ? 2 : (quizState.diff === 'medium' ? 1.5 : 1);
        const xp = Math.round(quizState.score * 15 * diffMultiplier);
        
        state.xp += xp;
        state.played++;
        if(quizState.score === quizState.questions.length && !state.badges.includes('perfect')) state.badges.push('perfect');
        
        checkBadges();
        
        viewActive.classList.add('hidden');
        viewResult.classList.remove('hidden');
        
        document.getElementById('res-score').textContent = `${quizState.score}/${quizState.questions.length}`;
        document.getElementById('res-xp').textContent = `+${xp}`;
        document.getElementById('res-acc').textContent = Math.round((quizState.score/quizState.questions.length)*100) + '%';
        
        const pct = quizState.score / quizState.questions.length;
        if(pct === 1) { 
            document.getElementById('res-title').textContent = 'Perfect!'; 
            document.getElementById('res-subtitle').textContent = 'Legendary performance.'; 
            document.getElementById('res-icon').innerHTML = '🏆';
        } else if(pct >= 0.7) { 
            document.getElementById('res-title').textContent = 'Great Job!'; 
            document.getElementById('res-subtitle').textContent = 'Keep it up.'; 
            document.getElementById('res-icon').innerHTML = '🎉';
        } else { 
            document.getElementById('res-title').textContent = 'Good Effort'; 
            document.getElementById('res-subtitle').textContent = 'Practice makes perfect.'; 
            document.getElementById('res-icon').innerHTML = '💪';
        }
        
        if(pct >= 0.7) confetti({particleCount:150,spread:70,origin:{y:0.6}});
    }
});
