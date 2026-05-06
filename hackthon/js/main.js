// ================================
// QUIZBATTLE - MAIN SCRIPT
// ================================

// ========== GSAP ANIMATIONS ==========

// Landing page animations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    initHeroAnimations();
    initScrollAnimations();
    initStatsCounter();
    initFloatingAssistant();
    initMobileMenu();
    initSmoothScroll();
});

function initHeroAnimations() {
    // Hero text animation with GSAP
    gsap.from('.hero-title', {
        duration: 0.8,
        y: 40,
        opacity: 0,
        stagger: 0.1,
        ease: 'power2.out'
    });

    gsap.from('.hero-subtitle', {
        duration: 0.8,
        delay: 0.3,
        y: 20,
        opacity: 0,
        ease: 'power2.out'
    });

    gsap.from('.hero-description', {
        duration: 0.8,
        delay: 0.5,
        y: 20,
        opacity: 0,
        ease: 'power2.out'
    });

    gsap.from('.hero-buttons .btn', {
        duration: 0.8,
        delay: 0.7,
        y: 20,
        opacity: 0,
        stagger: 0.2,
        ease: 'power2.out'
    });

    // Floating cards animation
    gsap.to('.floating-card', {
        duration: 4,
        y: -30,
        repeat: -1,
        yoyo: true,
        stagger: 0.3,
        ease: 'sine.inOut'
    });

    // Background blobs animation
    gsap.to('.blob-1', {
        duration: 15,
        x: 100,
        y: -100,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    gsap.to('.blob-2', {
        duration: 18,
        x: -100,
        y: 100,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 5
    });
}

function initScrollAnimations() {
    // Scroll reveal animations
    const cards = document.querySelectorAll('.feature-card, .stat-card, .category-card, .testimonial-card');
    
    if (window.IntersectionObserver) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gsap.to(entry.target, {
                        duration: 0.6,
                        y: 0,
                        opacity: 1,
                        ease: 'power2.out'
                    });
                }
            });
        }, {
            threshold: 0.1
        });

        cards.forEach(card => {
            gsap.set(card, { y: 40, opacity: 0 });
            observer.observe(card);
        });
    }
}

function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (window.IntersectionObserver) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalCount = parseInt(target.dataset.count);
                    
                    animateCounter(target, 0, finalCount, 2000);
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(number => observer.observe(number));
    }
}

function animateCounter(element, start, end, duration) {
    const range = end - start;
    const increment = end > 999 ? 1000 : 100;
    let current = start;

    const counter = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(counter);
        }
        element.textContent = current.toLocaleString();
    }, duration / (end / increment));
}

function initFloatingAssistant() {
    const assistant = document.getElementById('floatingAssistant');
    
    if (assistant) {
        assistant.addEventListener('click', () => {
            showAssistantChat();
        });

        // Pulse animation on hover
        assistant.addEventListener('mouseenter', () => {
            gsap.to(assistant, {
                duration: 0.3,
                scale: 1.2,
                boxShadow: '0 12px 48px rgba(0, 212, 255, 0.8)'
            });
        });

        assistant.addEventListener('mouseleave', () => {
            gsap.to(assistant, {
                duration: 0.3,
                scale: 1,
                boxShadow: '0 8px 32px rgba(0, 212, 255, 0.4)'
            });
        });
    }
}

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '80px';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.flexDirection = 'column';
            navLinks.style.background = 'rgba(15, 23, 42, 0.95)';
            navLinks.style.backdropFilter = 'blur(20px)';
            navLinks.style.padding = '2rem';
            navLinks.style.gap = '1rem';
            navLinks.style.zIndex = '998';
        });
    }
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function showAssistantChat() {
    // Simple demo - can be replaced with actual chat interface
    const message = "👋 Hi! I'm your AI Assistant. How can I help you today?\\n\\n" +
                   "💬 Available options:\\n" +
                   "• Help with quizzes\\n" +
                   "• Generate AI questions\\n" +
                   "• Track your progress\\n" +
                   "• Join a battle\\n" +
                   "• View leaderboard";
    
    alert(message);
}

// ========== KEYBOARD SHORTCUTS ==========

document.addEventListener('keydown', (e) => {
    // Press 'L' to go to leaderboard
    if (e.key === 'l' && !isInputActive()) {
        window.location.href = 'pages/leaderboard.html';
    }
    
    // Press 'D' for dashboard
    if (e.key === 'd' && !isInputActive()) {
        window.location.href = 'pages/dashboard.html';
    }
    
    // Press 'Q' for quiz generator
    if (e.key === 'q' && !isInputActive()) {
        window.location.href = 'pages/quiz-generator.html';
    }
});

function isInputActive() {
    return document.activeElement.tagName === 'INPUT' || 
           document.activeElement.tagName === 'TEXTAREA';
}

// ========== THEME SWITCHER ==========

function initThemeSwitcher() {
    const theme = localStorage.getItem('theme') || 'dark';
    applyTheme(theme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
}

// ========== SOUND EFFECTS ==========

const soundEffects = {
    click: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==',
    success: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==',
    notification: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='
};

function playSoundEffect(effectName) {
    try {
        const audio = new Audio(soundEffects[effectName]);
        audio.volume = 0.3;
        audio.play().catch(() => {
            // Audio play failed (might be muted or blocked)
        });
    } catch (error) {
        console.log('Sound effect not available:', error);
    }
}

// ========== LOCAL STORAGE UTILITIES ==========

const StorageManager = {
    setItem: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Storage error:', error);
        }
    },

    getItem: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Storage error:', error);
            return null;
        }
    },

    removeItem: (key) => {
        localStorage.removeItem(key);
    },

    clear: () => {
        localStorage.clear();
    }
};

// ========== USER SESSION ==========

class UserSession {
    constructor() {
        this.user = StorageManager.getItem('currentUser') || null;
        this.stats = StorageManager.getItem('userStats') || {
            totalQuizzes: 0,
            totalScore: 0,
            streak: 0,
            xp: 0,
            coins: 0,
            level: 1
        };
    }

    login(username, email) {
        this.user = { username, email, id: Date.now() };
        StorageManager.setItem('currentUser', this.user);
        return this.user;
    }

    logout() {
        this.user = null;
        StorageManager.removeItem('currentUser');
    }

    addXP(amount) {
        this.stats.xp += amount;
        this.checkLevelUp();
        this.save();
    }

    addCoins(amount) {
        this.stats.coins += amount;
        this.save();
    }

    checkLevelUp() {
        const xpPerLevel = 1000;
        const newLevel = Math.floor(this.stats.xp / xpPerLevel) + 1;
        if (newLevel > this.stats.level) {
            this.stats.level = newLevel;
            this.celebrateLevelUp();
        }
    }

    celebrateLevelUp() {
        // Show celebration animation
        console.log(`Congratulations! You reached level ${this.stats.level}`);
    }

    save() {
        StorageManager.setItem('userStats', this.stats);
    }
}

// Global user session
const userSession = new UserSession();

// ========== NOTIFICATION SYSTEM ==========

class NotificationManager {
    constructor() {
        this.container = this.createContainer();
    }

    createContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
        return container;
    }

    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        
        const bgColor = {
            'success': '#00ff41',
            'error': '#ff006e',
            'info': '#00d4ff',
            'warning': '#ffa500'
        }[type] || '#00d4ff';

        notification.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid ${bgColor};
            border-left: 4px solid ${bgColor};
            color: #f5f7fa;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        
        notification.textContent = message;
        this.container.appendChild(notification);

        setTimeout(() => {
            gsap.to(notification, {
                duration: 0.3,
                opacity: 0,
                x: 50,
                onComplete: () => notification.remove()
            });
        }, duration);
    }
}

const notificationManager = new NotificationManager();

// ========== CONFETTI EFFECT ==========

function createConfetti() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 9998;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const particles = [];

    // Create confetti particles
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: -10,
            size: Math.random() * 5 + 2,
            speedX: Math.random() * 8 - 4,
            speedY: Math.random() * 5 + 5,
            color: ['#00d4ff', '#7c3aed', '#ff006e', '#00ff41'][Math.floor(Math.random() * 4)]
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.speedY += 0.1; // gravity

            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);

            if (p.y > canvas.height) {
                particles.splice(i, 1);
            }
        });

        if (particles.length > 0) {
            requestAnimationFrame(animate);
        } else {
            canvas.remove();
        }
    }

    animate();
}

// ========== ANALYTICS TRACKING ==========

class AnalyticsTracker {
    static trackEvent(eventName, eventData = {}) {
        const event = {
            name: eventName,
            timestamp: new Date().toISOString(),
            ...eventData
        };

        let events = StorageManager.getItem('analytics_events') || [];
        events.push(event);
        
        // Keep only last 100 events
        if (events.length > 100) {
            events = events.slice(-100);
        }

        StorageManager.setItem('analytics_events', events);
    }

    static trackPageView(pageName) {
        this.trackEvent('page_view', { page: pageName });
    }

    static trackQuizComplete(quizId, score, timeSpent) {
        this.trackEvent('quiz_complete', { quizId, score, timeSpent });
    }

    static trackBattle(battleId, result) {
        this.trackEvent('battle', { battleId, result });
    }
}

// Initialize theme on page load
if (document.readyState !== 'loading') {
    initThemeSwitcher();
} else {
    document.addEventListener('DOMContentLoaded', initThemeSwitcher);
}

// Track page view
AnalyticsTracker.trackPageView('landing_page');
