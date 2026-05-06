/* ========== QUIZ CATEGORIES JAVASCRIPT ========== */

// Mock categories data
const categoriesData = [
    {
        id: 1,
        name: 'Programming Fundamentals',
        icon: '💻',
        description: 'Core programming concepts and basics',
        questions: 847,
        difficulty: 'Beginner',
        color: '#00d4ff'
    },
    {
        id: 2,
        name: 'Data Structures & Algorithms',
        icon: '🌳',
        description: 'DSA concepts, optimization, problem-solving',
        questions: 1342,
        difficulty: 'Intermediate',
        color: '#7c3aed'
    },
    {
        id: 3,
        name: 'Web Development',
        icon: '🌐',
        description: 'HTML, CSS, JavaScript, React, Vue frameworks',
        questions: 756,
        difficulty: 'Intermediate',
        color: '#00ff41'
    },
    {
        id: 4,
        name: 'Databases & SQL',
        icon: '🗄️',
        description: 'SQL, NoSQL, database design and optimization',
        questions: 523,
        difficulty: 'Intermediate',
        color: '#ff006e'
    },
    {
        id: 5,
        name: 'Cloud & DevOps',
        icon: '☁️',
        description: 'AWS, Azure, Docker, Kubernetes, CI/CD',
        questions: 634,
        difficulty: 'Advanced',
        color: '#ffa500'
    },
    {
        id: 6,
        name: 'AI & Machine Learning',
        icon: '🤖',
        description: 'ML algorithms, neural networks, TensorFlow',
        questions: 892,
        difficulty: 'Advanced',
        color: '#00bfff'
    },
    {
        id: 7,
        name: 'Cybersecurity',
        icon: '🔐',
        description: 'Security concepts, encryption, threat analysis',
        questions: 456,
        difficulty: 'Advanced',
        color: '#ff4444'
    },
    {
        id: 8,
        name: 'System Design',
        icon: '🏗️',
        description: 'Scalability, architecture, microservices',
        questions: 298,
        difficulty: 'Expert',
        color: '#44ff44'
    },
    {
        id: 9,
        name: 'Python Programming',
        icon: '🐍',
        description: 'Python syntax, libraries, advanced concepts',
        questions: 678,
        difficulty: 'Intermediate',
        color: '#3776ab'
    },
    {
        id: 10,
        name: 'JavaScript Advanced',
        icon: '⚛️',
        description: 'Async, closures, prototypes, modern ES6+',
        questions: 445,
        difficulty: 'Advanced',
        color: '#f7df1e'
    },
    {
        id: 11,
        name: 'Competitive Programming',
        icon: '🏆',
        description: 'Interview prep, problem-solving techniques',
        questions: 1023,
        difficulty: 'Expert',
        color: '#c0392b'
    },
    {
        id: 12,
        name: 'General Knowledge',
        icon: '🧠',
        description: 'Aptitude, reasoning, general awareness',
        questions: 512,
        difficulty: 'Beginner',
        color: '#9b59b6'
    }
];

let filteredCategories = [...categoriesData];

// Single time DOM ready check
document.addEventListener('DOMContentLoaded', function() {
    initCategoriesPage();
});

function initCategoriesPage() {
    // Check authentication
    checkAuthentication();
    
    // Load and display categories
    loadCategories();
    
    // Setup event listeners
    setupEventListeners();
    
    // Animations
    animateCategoryCards();
}

function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
}

function loadCategories(searchTerm = '', difficulty = '') {
    filteredCategories = categoriesData.filter(category => {
        const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            category.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDifficulty = difficulty === '' || category.difficulty.toLowerCase() === difficulty.toLowerCase();
        return matchesSearch && matchesDifficulty;
    });

    displayCategories();
}

function displayCategories() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;

    grid.innerHTML = '';

    filteredCategories.forEach((category, index) => {
        const card = createCategoryCard(category);
        grid.appendChild(card);

        // Stagger animation
        gsap.from(card, {
            duration: 0.5,
            y: 30,
            opacity: 0,
            delay: index * 0.08,
            ease: 'power2.out'
        });
    });

    if (filteredCategories.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">No categories found. Try adjusting your filters.</div>';
    }
}

function createCategoryCard(category) {
    const card = document.createElement('div');
    card.className = 'category-item glass-effect';
    card.setAttribute('data-category-id', category.id);

    const difficultyColor = getDifficultyColor(category.difficulty);

    card.innerHTML = `
        <span class="category-icon">${category.icon}</span>
        <h3>${category.name}</h3>
        <p>${category.description}</p>
        <div class="category-stats">
            <span>📚 ${category.questions} Questions</span>
            <span>👥 12.5K Attempts</span>
        </div>
        <span class="category-difficulty" style="border-color: ${difficultyColor}; color: ${difficultyColor}; background: rgba(${hexToRgb(difficultyColor).join(',')}, 0.1);">
            ${category.difficulty}
        </span>
    `;

    card.addEventListener('click', () => handleCategoryClick(category));
    
    return card;
}

function getDifficultyColor(difficulty) {
    const colors = {
        'Beginner': '#00ff41',
        'Intermediate': '#00d4ff',
        'Advanced': '#ff006e',
        'Expert': '#ffa500'
    };
    return colors[difficulty] || '#00d4ff';
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : [0, 212, 255];
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const difficultyFilter = document.getElementById('categoryFilter');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const difficulty = difficultyFilter ? difficultyFilter.value : '';
            loadCategories(e.target.value, difficulty);
        });
    }

    if (difficultyFilter) {
        difficultyFilter.addEventListener('change', (e) => {
            const searchTerm = searchInput ? searchInput.value : '';
            loadCategories(searchTerm, e.target.value);
        });
    }
}

function handleCategoryClick(category) {
    // Add click animation
    const card = document.querySelector(`[data-category-id="${category.id}"]`);
    gsap.to(card, {
        duration: 0.2,
        scale: 0.95,
        onComplete: () => {
            gsap.to(card, { duration: 0.2, scale: 1 });
        }
    });

    // Show notification
    NotificationManager.show(`Starting ${category.name} quiz...`, 'info');

    // Simulate API call delay
    setTimeout(() => {
        // Save selected category to localStorage for Quiz Generator
        localStorage.setItem('selectedCategory', category.name);
        
        // Track analytics
        AnalyticsTracker.trackEvent('category_selected', {
            category_id: category.id,
            category_name: category.name,
            difficulty: category.difficulty,
            timestamp: new Date().toISOString()
        });

        // Navigate to quiz generator with category pre-selected
        gsap.to(document.body, {
            duration: 0.3,
            opacity: 0,
            onComplete: () => {
                window.location.href = 'quiz-generator.html';
            }
        });
    }, 300);
}

function animateCategoryCards() {
    // Animate header
    gsap.from('.categories-header h1', {
        duration: 0.6,
        y: 20,
        opacity: 0,
        ease: 'power2.out'
    });

    gsap.from('.categories-header p', {
        duration: 0.6,
        y: 20,
        opacity: 0,
        delay: 0.1,
        ease: 'power2.out'
    });

    // Animate search filter
    gsap.from('.search-filter', {
        duration: 0.6,
        y: 20,
        opacity: 0,
        delay: 0.2,
        ease: 'power2.out'
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
        if (event.key === 'a' || event.key === 'A') {
            event.preventDefault();
            document.getElementById('categoryFilter').value = '';
            document.getElementById('searchInput').value = '';
            loadCategories();
            NotificationManager.show('All categories shown', 'info');
        }
    }

    // Shortcut: S for search focus
    if (event.key === 's' || event.key === 'S') {
        if (!Object.values(event).includes(true) || event.target.tagName === 'BODY') {
            event.preventDefault();
            document.getElementById('searchInput').focus();
        }
    }
});

// Export categories for other modules
window.CategoriesModule = {
    getCategories: () => categoriesData,
    getCategoryById: (id) => categoriesData.find(c => c.id === id),
    getRandomCategory: () => categoriesData[Math.floor(Math.random() * categoriesData.length)]
};
