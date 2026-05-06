// ================================
// LEADERBOARD SCRIPTS
// ================================

document.addEventListener('DOMContentLoaded', () => {
    initLeaderboard();
    initFilterButtons();
    initAnimations();
});

// ========== MOCK LEADERBOARD DATA ==========

let mockLeaderboardData = [
    { rank: 1, name: 'AlexCode', avatar: '🔥', score: 9850, quizzes: 512, streak: 45, level: 12 },
    { rank: 2, name: 'SarahAI', avatar: '⚡', score: 9720, quizzes: 487, streak: 38, level: 11 },
    { rank: 3, name: 'MaxBrain', avatar: '💎', score: 9650, quizzes: 456, streak: 32, level: 11 },
    { rank: 4, name: 'DevNinja', avatar: '🌟', score: 9500, quizzes: 445, streak: 28, level: 10 },
    { rank: 5, name: 'QuizMaster', avatar: '🚀', score: 9400, quizzes: 423, streak: 25, level: 10 },
    { rank: 6, name: 'CodeWizard', avatar: '✨', score: 9300, quizzes: 412, streak: 22, level: 9 },
    { rank: 7, name: 'PytonPro', avatar: '🐍', score: 9200, quizzes: 401, streak: 20, level: 9 },
    { rank: 8, name: 'JavaGenius', avatar: '☕', score: 9100, quizzes: 389, streak: 18, level: 8 },
    { rank: 9, name: 'ReactRyot', avatar: '⚛️', score: 9000, quizzes: 378, streak: 15, level: 8 },
    { rank: 10, name: 'SharpDev', avatar: '🎯', score: 8900, quizzes: 367, streak: 12, level: 8 },
    { rank: 11, name: 'BugHunter', avatar: '🐛', score: 8800, quizzes: 350, streak: 10, level: 7 },
    { rank: 12, name: 'CyberKnight', avatar: '🛡️', score: 8700, quizzes: 340, streak: 8, level: 7 },
    { rank: 13, name: 'DataSci', avatar: '📊', score: 8600, quizzes: 330, streak: 7, level: 6 },
    { rank: 14, name: 'CloudGuru', avatar: '☁️', score: 8500, quizzes: 320, streak: 5, level: 6 },
    { rank: 15, name: 'WebWeaver', avatar: '🕸️', score: 8400, quizzes: 310, streak: 4, level: 5 },
    { rank: 16, name: 'LogicLord', avatar: '🧠', score: 8300, quizzes: 300, streak: 3, level: 5 },
    { rank: 17, name: 'ByteMe', avatar: '💻', score: 8200, quizzes: 290, streak: 2, level: 4 },
    { rank: 18, name: 'ScriptKiddie', avatar: '👶', score: 8100, quizzes: 280, streak: 1, level: 4 }
];

let currentPage = 1;
const itemsPerPage = 10;
let currentData = mockLeaderboardData;

// ========== INITIALIZE LEADERBOARD ==========

function initLeaderboard() {
    const userData = JSON.parse(localStorage.getItem('user')) || null;
    if (userData && userData.stats) {
        mockLeaderboardData.push({
            rank: 0,
            name: userData.username || userData.fullname || 'You',
            avatar: '👤',
            score: userData.stats.xp || 0,
            quizzes: userData.stats.totalQuizzes || 0,
            streak: userData.stats.streak || 0,
            level: userData.stats.level || 1
        });
        mockLeaderboardData.sort((a, b) => b.score - a.score);
        mockLeaderboardData.forEach((p, i) => p.rank = i + 1);
    }
    currentData = mockLeaderboardData;
    loadLeaderboardData();
}

function loadLeaderboardData(page = 1) {
    const leaderboardBody = document.getElementById('leaderboardBody');
    if (!leaderboardBody) return;
    leaderboardBody.innerHTML = '';

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = currentData.slice(start, end);

    pageData.forEach((player, index) => {
        const row = createLeaderboardRow(player);
        leaderboardBody.appendChild(row);

        // Stagger animation
        gsap.from(row, {
            duration: 0.4,
            y: 20,
            opacity: 0,
            delay: index * 0.05,
            ease: 'power2.out'
        });
    });
}

function createLeaderboardRow(player) {
    const row = document.createElement('div');
    row.className = `leaderboard-row ${getRankClass(player.rank)}`;

    const medalIcon = {
        1: '👑',
        2: '🥈',
        3: '🥉'
    }[player.rank] || '#';

    row.innerHTML = `
        <div class="col rank">
            <span class="rank-medal">${medalIcon}</span>
            ${player.rank}
        </div>
        <div class="col player">
            <div class="player-info">
                <div class="player-avatar">${player.avatar}</div>
                <div class="player-name">
                    <h4>${player.name}</h4>
                    <p>Level ${player.level}</p>
                </div>
            </div>
        </div>
        <div class="col score">${player.score.toLocaleString()}</div>
        <div class="col quizzes">${player.quizzes}</div>
        <div class="col streak">
            <i class="fas fa-fire"></i>
            <span class="streak-count">${player.streak}</span>
        </div>
        <div class="col level">${player.level}</div>
    `;

    return row;
}

function getRankClass(rank) {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return '';
}

// ========== FILTER BUTTONS ==========

function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            filterLeaderboard(filter);
        });
    });
}

function filterLeaderboard(filter) {
    const leaderboardBody = document.getElementById('leaderboardBody');

    gsap.to(leaderboardBody, {
        duration: 0.2,
        opacity: 0,
        onComplete: () => {
            // Simulate filtering
            if (filter === 'global') {
                loadLeaderboardData();
            } else if (filter === 'weekly') {
                loadWeeklyLeaderboard();
            } else if (filter === 'friends') {
                loadFriendsLeaderboard();
            }

            gsap.to(leaderboardBody, {
                duration: 0.2,
                opacity: 1
            });
        }
    });
}

function loadWeeklyLeaderboard() {
    const weeklyData = mockLeaderboardData.map((player, index) => ({
        ...player,
        score: Math.floor(player.score * 0.8),
        streak: Math.floor(player.streak * 0.5)
    })).sort((a, b) => b.score - a.score);
    
    weeklyData.forEach((p, i) => p.rank = i + 1);
    currentData = weeklyData;
    currentPage = 1;
    loadLeaderboardData();
}

function loadFriendsLeaderboard() {
    const friendsData = mockLeaderboardData.slice(0, 5).map((player, index) => ({
        ...player,
        rank: index + 1
    }));
    
    currentData = friendsData;
    currentPage = 1;
    loadLeaderboardData();
}

// ========== ANIMATIONS ==========

function initAnimations() {
    // Animate champion cards
    gsap.from('.champion-card', {
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: 'back.out'
    });

    // Animate stats
    gsap.from('.stat-item', {
        duration: 0.6,
        scale: 0.8,
        opacity: 0,
        stagger: 0.1,
        ease: 'back.out',
        delay: 0.3
    });

    // Animate header
    gsap.from('.leaderboard-header', {
        duration: 0.6,
        y: -20,
        opacity: 0,
        ease: 'power2.out'
    });

    // Animate filter buttons
    gsap.from('.header-actions .filter-btn', {
        duration: 0.4,
        scale: 0.9,
        opacity: 0,
        stagger: 0.1,
        ease: 'back.out',
        delay: 0.2
    });

    animateCounterStats();
}

function animateCounterStats() {
    const stats = document.querySelectorAll('.stat-item .value');

    stats.forEach((stat, index) => {
        const text = stat.textContent;
        const isPercentage = text.includes('%');
        const isNumber = !isPercentage && /^\d+/.test(text);
        const isPlusSuffix = text.includes('+');

        if (isNumber || isPlusSuffix) {
            const number = parseInt(text.replace(/\D/g, ''));
            let current = 0;

            const counter = setInterval(() => {
                current += Math.ceil(number / 30);
                if (current >= number) {
                    current = number;
                    clearInterval(counter);
                }

                const formatted = current.toLocaleString();
                stat.textContent = formatted + (isPlusSuffix ? '+' : (isPercentage ? '%' : ''));
            }, 30);
        }
    });
}

// ========== PAGINATION ==========

const paginationButtons = document.querySelectorAll('.btn-page');

paginationButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        if (index === 0 && currentPage > 1) { // Prev
            currentPage--;
            loadLeaderboardData(currentPage);
        } else if (index === 1 && (currentPage * itemsPerPage) < currentData.length) { // Next
            currentPage++;
            loadLeaderboardData(currentPage);
        }
    });
});

// ========== KEYBOARD SHORTCUTS ==========

document.addEventListener('keydown', (e) => {
    if (e.key === 'r' && !isInputActive()) {
        document.querySelector('.filter-btn[data-filter="global"]').click();
    }

    if (e.key === 'w' && !isInputActive()) {
        document.querySelector('.filter-btn[data-filter="weekly"]').click();
    }

    if (e.key === 'f' && !isInputActive()) {
        document.querySelector('.filter-btn[data-filter="friends"]').click();
    }
});

function isInputActive() {
    return document.activeElement.tagName === 'INPUT' || 
           document.activeElement.tagName === 'TEXTAREA';
}

// ========== PROFILE PREVIEW ON HOVER ==========

document.addEventListener('mouseover', (e) => {
    const row = e.target.closest('.leaderboard-row');
    if (row) {
        gsap.to(row, {
            duration: 0.2,
            backgroundColor: 'rgba(0, 212, 255, 0.1)'
        });
    }
});

document.addEventListener('mouseout', (e) => {
    const row = e.target.closest('.leaderboard-row');
    if (row) {
        gsap.to(row, {
            duration: 0.2,
            backgroundColor: 'transparent'
        });
    }
});

// ========== CHALLENGE BUTTON ==========

document.addEventListener('click', (e) => {
    if (e.target.closest('.leaderboard-row')) {
        const row = e.target.closest('.leaderboard-row');
        const playerName = row.querySelector('.player-name h4')?.textContent;
        
        if (playerName) {
            console.log('Challenge sent to:', playerName);
        }
    }
});
