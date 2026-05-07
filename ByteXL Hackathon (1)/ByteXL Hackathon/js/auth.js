/**
 * Auth.js - QuizVerse Login & Registration
 * Fixed pathing for ByteXL Hackathon
 */
(function() {
    const currentPath = window.location.pathname;
    const isInPagesDir = currentPath.includes('/pages/');
    const dashboardPath = isInPagesDir ? 'dashboard.html' : 'pages/dashboard.html';

    // Registration
    const regForm = document.getElementById('register-form');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;

            const user = {
                uid: 'u_' + Date.now(),
                name: name,
                email: email,
                xp: 0,
                level: 1,
                coins: 100,
                photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
            };

            localStorage.setItem('quizverse_user', JSON.stringify(user));
            if (window.showToast) window.showToast("Welcome to the Arena!", "success");
            setTimeout(() => { window.location.href = dashboardPath; }, 1000);
        });
    }

    // Login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('input[type="email"]').value;

            const user = {
                uid: 'mock_123',
                name: email.split('@')[0],
                email: email,
                xp: 1250,
                level: 5,
                coins: 500,
                photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
            };

            localStorage.setItem('quizverse_user', JSON.stringify(user));
            if (window.showToast) window.showToast("Welcome Back!", "success");
            setTimeout(() => { window.location.href = dashboardPath; }, 1000);
        });
    }

    // Google Login
    const googleBtn = document.getElementById('google-login-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            const user = {
                uid: 'g_mock',
                name: 'Google Warrior',
                email: 'warrior@gmail.com',
                xp: 500,
                level: 2,
                coins: 150,
                photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Google'
            };
            localStorage.setItem('quizverse_user', JSON.stringify(user));
            if (window.showToast) window.showToast("Signed in with Google", "success");
            setTimeout(() => { window.location.href = dashboardPath; }, 1000);
        });
    }
})();
