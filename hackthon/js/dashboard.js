// ================================
// DASHBOARD SCRIPTS
// ================================

document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    loadUserData();
    initDashboardAnimations();
    initEventListeners();
    loadRecentActivity();
});

// ========== AUTHENTICATION CHECK ==========

function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
}

// ========== LOAD USER DATA ==========

function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    const stats = userData.stats || {
        level: 1,
        xp: 0,
        coins: 500,
        streak: 0,
        rank: 245,
        totalQuizzes: 0
    };

    // Update UI with user data
    const userName = userData.username || userData.fullname || 'Player';
    document.getElementById('userName').textContent = userName;
    
    document.getElementById('userLevel').textContent = stats.level;
    document.getElementById('userXP').textContent = stats.xp.toLocaleString();
    document.getElementById('userCoins').textContent = stats.coins.toLocaleString();
    document.getElementById('userRank').textContent = `#${stats.rank || 245}`;
    document.getElementById('streakCount').textContent = stats.streak || 0;
    
    // Calculate rank percentage
    const rankPercentage = Math.max(1, Math.round(100 - (stats.rank * 0.5)));
    document.getElementById('rankPercentage').textContent = `${rankPercentage}%`;

    // Update progress bar
    const levelProgress = (stats.xp % 1000) / 10;
    document.getElementById('levelProgress').style.width = levelProgress + '%';
    
    // Next level XP
    const nextLevelXP = ((Math.floor(stats.xp / 1000) + 1) * 1000) - stats.xp;
    document.getElementById('nextLevelXP').textContent = nextLevelXP.toLocaleString() + ' XP';
}

// ========== ANIMATIONS ==========

function initDashboardAnimations() {
    // Animate stats boxes
    gsap.from('.stat-box', {
        duration: 0.6,
        y: 30,
        opacity: 0,
        stagger: 0.1,
        ease: 'power2.out'
    });

    // Animate action cards
    gsap.from('.action-card', {
        duration: 0.8,
        y: 40,
        opacity: 0,
        stagger: 0.15,
        ease: 'power2.out',
        delay: 0.3
    });

    // Animate activity items
    gsap.from('.activity-item', {
        duration: 0.5,
        x: -20,
        opacity: 0,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 0.6
    });

    // Animate achievement badges
    gsap.from('.achievement-badge', {
        duration: 0.5,
        scale: 0.8,
        opacity: 0,
        stagger: 0.1,
        ease: 'back.out',
        delay: 0.8
    });
}

// ========== EVENT LISTENERS ==========

function initEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Action cards
    document.querySelectorAll('.action-card').forEach(card => {
        if (!card.classList.contains('daily-challenge')) {
            card.addEventListener('click', () => {
                const link = card.querySelector('h3').textContent;
                animateCardClick(card);
            });
        }
    });

    // Notification button
    const notificationBtn = document.querySelector('.btn-notifications');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', showNotifications);
    }

    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Quest checkboxes
    document.querySelectorAll('.quest-checkbox input').forEach(checkbox => {
        checkbox.addEventListener('change', handleQuestComplete);
    });
}

// ========== NAVIGATION ==========

function navigate(page) {
    gsap.to('main', {
        duration: 0.3,
        opacity: 0,
        onComplete: () => {
            window.location.href = page;
        }
    });
}

function animateCardClick(card) {
    gsap.to(card, {
        duration: 0.2,
        scale: 0.95
    });

    setTimeout(() => {
        gsap.to(card, {
            duration: 0.2,
            scale: 1
        });
    }, 200);
}

// ========== DAILY CHALLENGE ==========

function startDailyChallenge() {
    const card = document.querySelector('.daily-challenge');
    
    gsap.to(card, {
        duration: 0.3,
        scale: 1.05,
        onComplete: () => {
            showChallengeModal();
        }
    });
}

function showChallengeModal() {
    const modal = document.createElement('div');
    modal.className = 'challenge-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;

    modal.innerHTML = `
        <div style="
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            padding: 2rem;
            max-width: 500px;
            color: var(--text-primary);
        ">
            <h2 style="margin-bottom: 1rem; color: var(--accent);">🔥 Daily Challenge</h2>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
                Complete today's challenge to earn bonus XP and maintain your streak!
            </p>
            <div style="
                background: rgba(0, 255, 65, 0.1);
                border: 1px solid var(--accent);
                border-radius: 12px;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            ">
                <h3 style="margin-bottom: 0.5rem;">Today's Challenge</h3>
                <p style="color: var(--text-secondary);">Answer 10 DSA questions correctly</p>
                <p style="color: var(--accent); font-weight: 600; margin-top: 0.5rem;">Reward: +500 XP + 100 Coins</p>
            </div>
            <div style="display: flex; gap: 1rem;">
                <button onclick="closeModal()" style="
                    flex: 1;
                    padding: 0.75rem;
                    background: transparent;
                    border: 2px solid var(--text-secondary);
                    color: var(--text-secondary);
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 600;
                ">Later</button>
                <button onclick="startChallenge()" style="
                    flex: 1;
                    padding: 0.75rem;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    border: none;
                    color: var(--bg-dark);
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 600;
                ">Start Challenge</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.querySelector('.challenge-modal');
    if (modal) {
        gsap.to(modal, {
            duration: 0.3,
            opacity: 0,
            onComplete: () => modal.remove()
        });
    }
}

function startChallenge() {
    // Redirect to quiz generator or quiz page
    closeModal();
    navigate('quiz-categories.html');
}

// ========== NOTIFICATIONS ==========

function showNotifications() {
    const notifications = [
        { title: 'AlexCode challenged you!', time: '5 min ago', type: 'battle' },
        { title: 'You earned a new badge!', time: '1 hour ago', type: 'achievement' },
        { title: 'New leaderboard position!', time: '3 hours ago', type: 'rank' }
    ];

    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: flex-end;
        z-index: 999;
        animation: fadeIn 0.3s ease;
    `;

    const panel = document.createElement('div');
    panel.style.cssText = `
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        border-left: 1px solid var(--glass-border);
        width: 350px;
        height: 100%;
        overflow-y: auto;
        animation: slideIn 0.3s ease;
        padding: 1.5rem;
    `;

    panel.innerHTML = `
        <h3 style="color: var(--text-primary); margin-bottom: 1.5rem;">Notifications</h3>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${notifications.map(notif => `
                <div style="
                    padding: 1rem;
                    background: rgba(0, 212, 255, 0.1);
                    border-left: 3px solid var(--primary);
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">
                    <p style="color: var(--text-primary); font-weight: 600; margin-bottom: 0.3rem;">${notif.title}</p>
                    <p style="color: var(--text-secondary); font-size: 0.85rem;">${notif.time}</p>
                </div>
            `).join('')}
        </div>
    `;

    modal.appendChild(panel);
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            gsap.to(panel, {
                duration: 0.3,
                x: 400,
                onComplete: () => modal.remove()
            });
        }
    });
}

// ========== SEARCH FUNCTIONALITY ==========

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    console.log('Searching for:', query);
    
    // Filter action cards
    document.querySelectorAll('.action-card').forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
        if (title.includes(query) || desc.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    // Filter quests
    document.querySelectorAll('.quest-item').forEach(quest => {
        const title = quest.querySelector('label')?.textContent.toLowerCase() || '';
        if (title.includes(query)) {
            quest.style.display = 'flex';
        } else {
            quest.style.display = 'none';
        }
    });
}

// ========== QUEST HANDLING ==========

function handleQuestComplete(e) {
    const checkbox = e.target;
    const questItem = checkbox.closest('.quest-item');
    const questLabel = questItem.querySelector('label');

    if (checkbox.checked) {
        questItem.style.opacity = '0.7';
        
        // Show XP reward animation
        showXPReward(questLabel.textContent);

        // Update user XP
        addUserXP(100);
    }
}

function showXPReward(text) {
    const reward = document.createElement('div');
    reward.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: var(--primary);
        font-weight: 700;
        font-size: 2rem;
        pointer-events: none;
        z-index: 9999;
        animation: floatUp 1s ease;
    `;
    
    reward.textContent = '+100 XP';
    document.body.appendChild(reward);

    setTimeout(() => reward.remove(), 1000);
}

function addUserXP(amount) {
    let userData = JSON.parse(localStorage.getItem('user')) || {};
    userData.stats = userData.stats || { xp: 0, level: 1 };
    
    userData.stats.xp += amount;
    
    // Check for level up
    if (userData.stats.xp >= (userData.stats.level * 1000)) {
        userData.stats.level++;
        showLevelUpAnimation(userData.stats.level);
    }

    localStorage.setItem('user', JSON.stringify(userData));
    loadUserData();
}

function showLevelUpAnimation(newLevel) {
    gsap.to('main', {
        duration: 0.2,
        scale: 1.02,
        repeat: 1,
        yoyo: true
    });

    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: var(--bg-dark);
        padding: 2rem 3rem;
        border-radius: 16px;
        font-size: 1.5rem;
        font-weight: 700;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        z-index: 10000;
        animation: slideDown 0.5s ease;
    `;

    notification.innerHTML = `
        🎉 Level Up! You reached Level ${newLevel} 🎉
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        gsap.to(notification, {
            duration: 0.5,
            opacity: 0,
            onComplete: () => notification.remove()
        });
    }, 2000);
}

// ========== RECENT ACTIVITY LOADING ==========

function loadRecentActivity() {
    // This can be connected to a backend API to fetch real activity
    // For now, we'll use mock data
    
    const activities = [
        {
            type: 'quiz',
            title: 'Completed "Python Advanced" Quiz',
            description: 'Score: 950/1000',
            time: '2 hours ago'
        },
        {
            type: 'battle',
            title: 'Won a Battle vs AlexCode',
            description: 'Score: 1050 - Opponent: 920',
            time: '5 hours ago'
        }
    ];

    // Activities are already loaded in HTML
    console.log('Recent activities loaded');
}

// ========== LOGOUT ==========

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    
    gsap.to('main', {
        duration: 0.3,
        opacity: 0,
        onComplete: () => {
            window.location.href = '../index.html';
        }
    });
}

// ========== MOBILE MENU ==========

const hamburger = document.querySelector('.hamburger');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
}

// ========== KEY SHORTCUTS ==========

document.addEventListener('keydown', (e) => {
    // Ctrl + B for battle
    if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        navigate('battle-room.html');
    }

    // Ctrl + Q for quizzes
    if (e.ctrlKey && e.key === 'q') {
        e.preventDefault();
        navigate('quiz-categories.html');
    }

    // Ctrl + A for analytics
    if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        navigate('analytics.html');
    }
});
