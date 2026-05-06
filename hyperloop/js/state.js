// js/state.js
// Handles localStorage user state

let state = { 
    user: null, 
    email: null, 
    avatar: null, 
    xp: 0, 
    streak: 1, 
    played: 0, 
    correct: 0, 
    total: 0, 
    badges: [], 
    sound: true 
};

function loadState() { 
    const s = localStorage.getItem('quizwarts_state'); 
    if(s) {
        state = JSON.parse(s); 
    }
}

function saveState() { 
    localStorage.setItem('quizwarts_state', JSON.stringify(state)); 
}

function checkBadges() {
    if(!state.badges.includes('first_login')) state.badges.push('first_login');
    if(state.played >= 5 && !state.badges.includes('quiz_5')) state.badges.push('quiz_5');
    if(state.played >= 10 && !state.badges.includes('quiz_10')) state.badges.push('quiz_10');
    if(state.streak >= 3 && !state.badges.includes('streak_3')) state.badges.push('streak_3');
    saveState();
}

function requireAuth() {
    loadState();
    if (!state.user) {
        window.location.href = 'index.html';
    }
}
