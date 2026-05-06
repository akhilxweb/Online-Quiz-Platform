// js/battle.js
// Handles the logic for battle.html

document.addEventListener('DOMContentLoaded', () => {
    requireAuth();

    // Populate Categories
    const catSelect = document.getElementById('battle-create-cat');
    if(catSelect) {
        CATEGORIES.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.id; opt.textContent = cat.name;
            catSelect.appendChild(opt);
        });
    }

    const viewLobby = document.getElementById('view-lobby');
    const viewActive = document.getElementById('view-active');
    const viewResult = document.getElementById('view-result');

    let battle = { questions: [], idx: 0, scoreYou: 0, scoreOpp: 0, oppTimer: null, oppName: '' };

    // --- Lobby Actions ---
    document.getElementById('btn-create-room')?.addEventListener('click', () => {
        sfxClick();
        const code = Math.random().toString(36).substring(2,8).toUpperCase();
        document.getElementById('room-code-text').textContent = code;
        document.getElementById('room-code-box').style.display = 'block';
    });

    document.getElementById('btn-start-hosted-battle')?.addEventListener('click', () => {
        sfxClick();
        const cat = document.getElementById('battle-create-cat').value;
        startBattle(cat);
    });

    document.getElementById('btn-join-room')?.addEventListener('click', () => {
        sfxClick();
        const code = document.getElementById('join-room-code').value.trim();
        if(code.length > 2) {
            const cats = Object.keys(DB);
            startBattle(cats[Math.floor(Math.random()*cats.length)]);
        } else {
            alert("Enter a valid room code.");
        }
    });

    // --- Battle Simulation ---
    function startBattle(catId) {
        showLoading('Matching...');
        
        setTimeout(() => {
            hideLoading();
            battle.questions = [...DB[catId]].sort(()=>Math.random()-.5).slice(0,5);
            battle.idx = 0; battle.scoreYou = 0; battle.scoreOpp = 0;
            battle.oppName = RIVALS[Math.floor(Math.random()*RIVALS.length)];
            
            document.getElementById('b-you-name').textContent = state.user || 'You';
            document.getElementById('b-opp-name').textContent = battle.oppName;
            document.getElementById('b-res-opp-name').textContent = battle.oppName;
            
            document.getElementById('b-you-score').textContent = '0';
            document.getElementById('b-opp-score').textContent = '0';
            
            viewLobby.classList.add('hidden');
            viewActive.classList.remove('hidden');
            
            loadBattleQ();
            
            // Opponent AI
            battle.oppTimer = setInterval(() => {
                if(Math.random() > 0.4) {
                    battle.scoreOpp += 20;
                    document.getElementById('b-opp-score').textContent = battle.scoreOpp;
                    updateBattleBars();
                }
            }, 2500);
        }, 1500);
    }

    function loadBattleQ() {
        const q = battle.questions[battle.idx];
        document.getElementById('b-question').textContent = q.q;
        const ct = document.getElementById('b-options'); 
        ct.innerHTML = '';
        
        q.opts.forEach((opt, i) => {
            const btn = document.createElement('button'); 
            btn.className = 'opt-btn'; btn.textContent = opt;
            
            btn.addEventListener('click', () => {
                sfxClick();
                if (i === q.a) { 
                    battle.scoreYou += 20; sfxCorrect(); btn.classList.add('correct'); 
                } else { 
                    sfxWrong(); btn.classList.add('wrong'); 
                    ct.querySelectorAll('.opt-btn')[q.a].classList.add('correct'); 
                }
                
                document.getElementById('b-you-score').textContent = battle.scoreYou;
                updateBattleBars();
                ct.querySelectorAll('.opt-btn').forEach(b => b.disabled = true);
                
                battle.idx++;
                setTimeout(() => {
                    if (battle.idx < battle.questions.length) loadBattleQ(); 
                    else finishBattle();
                }, 800);
            });
            ct.appendChild(btn);
        });
    }

    function updateBattleBars() {
        const t = Math.max(battle.scoreYou + battle.scoreOpp, 1);
        document.getElementById('b-prog-you').style.width = (battle.scoreYou/t*100) + '%';
        document.getElementById('b-prog-opp').style.width = (battle.scoreOpp/t*100) + '%';
    }

    function finishBattle() {
        clearInterval(battle.oppTimer);
        const won = battle.scoreYou >= battle.scoreOpp;
        const xp = won ? 100 : 25;
        
        state.xp += xp; state.played++; 
        if (won && !state.badges.includes('battle_win')) state.badges.push('battle_win');
        checkBadges(); // saves state
        
        document.getElementById('b-res-you').textContent = battle.scoreYou;
        document.getElementById('b-res-opp').textContent = battle.scoreOpp;
        document.getElementById('b-res-title').textContent = won ? 'Victory!' : 'Defeat';
        document.getElementById('b-res-subtitle').textContent = won ? 'You dominated the arena.' : 'Better luck next time.';
        
        viewActive.classList.add('hidden');
        viewResult.classList.remove('hidden');
        
        if (won) confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }
});
