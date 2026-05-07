import { auth } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('quizverse_user'));
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Update UI with user data
    const nameElements = document.querySelectorAll('#user-name, #mini-name');
    nameElements.forEach(el => el.textContent = user.name || 'Warrior');

    const xpEl = document.getElementById('user-xp');
    if (xpEl) xpEl.textContent = (user.xp || 0).toLocaleString();

    const coinEl = document.getElementById('user-coins');
    if (coinEl) coinEl.textContent = (user.coins || 0).toLocaleString();

    const streakEl = document.getElementById('user-streak');
    if (streakEl) streakEl.textContent = `${user.streak || 0} Days`;

    // Initialize charts if on dashboard
    if (document.getElementById('progressChart')) {
        // ... chart logic could go here
    }
});
