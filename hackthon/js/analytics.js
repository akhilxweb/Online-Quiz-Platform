// ================================
// ANALYTICS SCRIPTS
// ================================

document.addEventListener('DOMContentLoaded', () => {
    initAnalytics();
    initCharts();
    initEventListeners();
});

// ========== INITIALIZATION ==========

function initAnalytics() {
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    const stats = userData.stats || {
        totalQuizzes: 47,
        accuracy: 82.5,
        winRate: 68,
        avgTime: 45
    };

    // Update metrics
    document.getElementById('totalQuizzes').textContent = stats.totalQuizzes || 47;
    document.getElementById('accuracy').textContent = (stats.accuracy || 82.5) + '%';
    document.getElementById('winRate').textContent = (stats.winRate || 68) + '%';
    document.getElementById('avgTime').textContent = (stats.avgTime || 45) + 's';

    loadRecentQuizzes();
}

// ========== CHARTS ==========

function initCharts() {
    // Set default chart options
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Poppins', sans-serif";

    initPerformanceChart();
    initCategoryChart();
    initAccuracyChart();
    initDifficultyChart();
}

function initPerformanceChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Score',
                data: [650, 820, 750, 940, 880, 1050, 920],
                borderColor: '#00d4ff',
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointBackgroundColor: '#00d4ff',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(148, 163, 184, 0.1)' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

function initCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['DSA', 'Web Dev', 'Python', 'ML', 'Cloud', 'Security'],
            datasets: [{
                label: 'Performance',
                data: [92, 85, 88, 65, 72, 68],
                backgroundColor: 'rgba(124, 58, 237, 0.2)',
                borderColor: '#7c3aed',
                pointBackgroundColor: '#7c3aed',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                r: {
                    angleLines: { color: 'rgba(148, 163, 184, 0.1)' },
                    grid: { color: 'rgba(148, 163, 184, 0.1)' },
                    pointLabels: { color: '#94a3b8' },
                    ticks: { display: false },
                    suggestedMin: 50,
                    suggestedMax: 100
                }
            }
        }
    });
}

function initAccuracyChart() {
    const ctx = document.getElementById('accuracyChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Accuracy %',
                data: [72, 78, 81, 82.5],
                backgroundColor: [
                    'rgba(0, 255, 65, 0.5)',
                    'rgba(0, 255, 65, 0.6)',
                    'rgba(0, 255, 65, 0.7)',
                    'rgba(0, 255, 65, 0.8)'
                ],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: 'rgba(148, 163, 184, 0.1)' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

function initDifficultyChart() {
    const ctx = document.getElementById('difficultyChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
            datasets: [{
                data: [40, 35, 15, 10],
                backgroundColor: [
                    '#00ff41',
                    '#00d4ff',
                    '#ff006e',
                    '#ffa500'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// ========== RECENT ACTIVITY ==========

function loadRecentQuizzes() {
    const container = document.getElementById('recentQuizzesContainer');
    if (!container) return;

    // Use simulated data for demo
    const recentQuizzes = [
        { name: 'Python Decorators', category: 'Python', score: 950, accuracy: '95%', date: '2026-05-06' },
        { name: 'Linked Lists', category: 'DSA', score: 880, accuracy: '88%', date: '2026-05-05' },
        { name: 'React Hooks', category: 'Web Dev', score: 720, accuracy: '72%', date: '2026-05-04' },
        { name: 'SQL Joins', category: 'Databases', score: 910, accuracy: '91%', date: '2026-05-03' }
    ];

    container.innerHTML = recentQuizzes.map(quiz => `
        <div class="table-row">
            <span>${quiz.name}</span>
            <span>${quiz.category}</span>
            <span class="score-highlight">${quiz.score}</span>
            <span>${quiz.accuracy}</span>
            <span>${formatDate(quiz.date)}</span>
        </div>
    `).join('');

    // Animate rows
    gsap.from('.table-row', {
        duration: 0.5,
        y: 10,
        opacity: 0,
        stagger: 0.1,
        ease: 'power2.out'
    });
}

function formatDate(dateStr) {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
}

// ========== EVENT LISTENERS ==========

function initEventListeners() {
    // Period buttons
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Re-render charts with new data (simulated)
            updateCharts(btn.dataset.period);
        });
    });
}

function updateCharts(period) {
    // Show loading effect
    gsap.to('.chart-card canvas', {
        duration: 0.2,
        opacity: 0.5,
        onComplete: () => {
            // In a real app, you'd fetch data for the period here
            // For demo, we just fade back in
            gsap.to('.chart-card canvas', {
                duration: 0.2,
                opacity: 1
            });
        }
    });
}
