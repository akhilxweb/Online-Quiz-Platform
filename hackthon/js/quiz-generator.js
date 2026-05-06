// ================================
// QUIZ GENERATOR SCRIPTS
// ================================

document.addEventListener('DOMContentLoaded', () => {
    initQuizGenerator();
    initFormControls();
});

// ========== INITIALIZATION ==========

function initQuizGenerator() {
    const form = document.getElementById('quizGeneratorForm');
    if (form) {
        form.addEventListener('submit', handleGenerateQuiz);
    }

    const questionCountSlider = document.getElementById('questionCount');
    if (questionCountSlider) {
        questionCountSlider.addEventListener('input', (e) => {
            document.getElementById('questionValue').textContent = e.target.value;
        });
    }

    initAnimations();
}

function initFormControls() {
    const apiKeyInput = document.getElementById('apiKey');
    if (apiKeyInput) {
        // Load saved API key on page load
        const savedKey = localStorage.getItem('groq_api_key') || localStorage.getItem('gemini_api_key') || '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';
        if (savedKey) {
            apiKeyInput.value = savedKey;
        }
    }

    const selectedCategory = localStorage.getItem('selectedCategory');
    if (selectedCategory) {
        const topicInput = document.getElementById('topic');
        if (topicInput) {
            topicInput.value = selectedCategory;
        }
        // Select category dropdown if matches
        const categorySelect = document.getElementById('category');
        if (categorySelect) {
            Array.from(categorySelect.options).forEach(opt => {
                if (opt.text.toLowerCase().includes(selectedCategory.toLowerCase()) || 
                    selectedCategory.toLowerCase().includes(opt.text.toLowerCase())) {
                    opt.selected = true;
                }
            });
        }
        localStorage.removeItem('selectedCategory'); // Clear it after use
    }
}

// ========== QUIZ GENERATION ==========

async function handleGenerateQuiz(e) {
    e.preventDefault();

    const topic = document.getElementById('topic').value;
    const questionCount = parseInt(document.getElementById('questionCount').value);
    const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    const category = document.getElementById('category').value;
    const includeExplanations = document.querySelector('input[name="includeExplanations"]').checked;
    const apiKey = document.getElementById('apiKey').value;
    const apiProvider = document.getElementById('apiProvider').value;

    if (!topic.trim()) {
        alert('Please enter a quiz topic');
        return;
    }

    // Show loading
    showLoading();

    try {
        let questions;

        if (apiKey.trim()) {
            // Use API to generate quiz
            questions = await generateQuizWithAPI(
                topic,
                questionCount,
                difficulty,
                category,
                apiKey,
                apiProvider,
                includeExplanations
            );
            
            // Save API key
            if (apiProvider === 'gemini') {
                localStorage.setItem('gemini_api_key', apiKey);
            } else {
                localStorage.setItem('groq_api_key', apiKey);
            }
        } else {
            // Generate demo quiz
            questions = generateDemoQuestions(topic, questionCount, difficulty);
        }

        hideLoading();
        displayQuiz(questions, topic);

        // Track event
        AnalyticsTracker.trackEvent('quiz_generated', {
            topic,
            questionCount,
            difficulty,
            api_provider: apiKey ? apiProvider : 'demo'
        });

    } catch (error) {
        hideLoading();
        console.error('Quiz generation error:', error);
        alert('Error generating quiz: ' + error.message);
    }
}

// ========== API INTEGRATION ==========

async function generateQuizWithAPI(topic, count, difficulty, category, apiKey, provider, includeExplanations) {
    if (provider === 'gemini') {
        return await generateWithGemini(topic, count, difficulty, category, apiKey, includeExplanations);
    } else if (provider === 'groq') {
        return await generateWithGroq(topic, count, difficulty, category, apiKey, includeExplanations);
    }
}

async function generateWithGemini(topic, count, difficulty, category, apiKey, includeExplanations) {
    // Gemini API integration example
    const prompt = generatePrompt(topic, count, difficulty, category, includeExplanations);

    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.candidates[0].content.parts[0].text;
        
        return parseQuizContent(content);

    } catch (error) {
        console.error('Gemini API Error:', error);
        // Fall back to demo if API fails
        return generateDemoQuestions(topic, count, difficulty);
    }
}

async function generateWithGroq(topic, count, difficulty, category, apiKey, includeExplanations) {
    // Groq API integration example
    const prompt = generatePrompt(topic, count, difficulty, category, includeExplanations);

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: [{
                    role: 'user',
                    content: prompt
                }],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        return parseQuizContent(content);

    } catch (error) {
        console.error('Groq API Error:', error);
        // Fall back to demo if API fails
        return generateDemoQuestions(topic, count, difficulty);
    }
}

// ========== PROMPT GENERATION ==========

function generatePrompt(topic, count, difficulty, category, includeExplanations) {
    const format = `JSON format with an array of questions where each question has:
    {
        "id": number,
        "question": "Question text",
        "type": "mcq" | "true-false" | "shortanswer",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_answer": "correct option",
        "explanation": "Detailed explanation of why this is correct"
    }`;

    return `Generate exactly ${count} ${difficulty} level ${category || topic} quiz questions.
    Topic: ${topic}
    Difficulty: ${difficulty}
    Category: ${category}
    
    Requirements:
    - Create ${count} unique, high-quality questions
    - Difficulty level: ${difficulty}
    - Format as JSON array
    - Include ${includeExplanations ? 'detailed' : 'brief'} explanations
    - Mix question types if multiple types specified
    - Ensure questions are specific and avoid generic content
    
    ${format}
    
    Return ONLY the JSON array, no other text.`;
}

// ========== PARSE QUIZ CONTENT ==========

function parseQuizContent(content) {
    try {
        // Strip markdown backticks if present
        let cleanContent = content;
        if (cleanContent.includes('```json')) {
            cleanContent = cleanContent.split('```json')[1].split('```')[0];
        } else if (cleanContent.includes('```')) {
            cleanContent = cleanContent.split('```')[1].split('```')[0];
        }

        // Extract JSON from response
        const jsonMatch = cleanContent.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error('Could not parse quiz data');
        }

        const questions = JSON.parse(jsonMatch[0]);
        
        return questions.map((q, index) => ({
            id: index + 1,
            question: q.question || '',
            type: q.type || 'mcq',
            options: q.options || [],
            correct_answer: q.correct_answer || '',
            explanation: q.explanation || '',
            user_answer: null,
            is_correct: null
        }));

    } catch (error) {
        console.error('Parse error:', error);
        return [];
    }
}

// ========== DEMO QUIZ GENERATION ==========

function generateDemoQuestions(topic, count, difficulty) {
    const questions = [];

    for (let i = 0; i < count; i++) {
        questions.push({
            id: i + 1,
            question: `${topic} Question ${i + 1}: What is the correct answer about ${topic.toLowerCase()}?`,
            type: 'mcq',
            options: [
                'Option A - Incorrect',
                'Option B - Correct',
                'Option C - Incorrect',
                'Option D - Incorrect'
            ],
            correct_answer: 'Option B - Correct',
            explanation: `This question tests your knowledge of ${topic}. The correct answer is Option B because it accurately describes the concept. Option A is incorrect because... Option C is incorrect because... Option D is incorrect because...`,
            user_answer: null,
            is_correct: null
        });
    }

    return questions;
}

// ========== DISPLAY QUIZ ==========

function displayQuiz(questions, topic) {
    const generatedSection = document.getElementById('generatedSection');
    const quizContainer = document.getElementById('quizContainer');

    // Scroll to quiz section
    gsap.to(window, {
        duration: 0.5,
        scrollTo: { y: generatedSection.offsetTop - 100 }
    });

    // Create quiz HTML
    quizContainer.innerHTML = questions.map((q, index) => `
        <div class="quiz-question-card glass-effect" data-question-id="${q.id}">
            <div class="quiz-header">
                <span class="question-number">Question ${q.id} of ${questions.length}</span>
                <div class="difficulty-tag ${getDifficultyClass(topic)}">${topic}</div>
            </div>

            <h3 class="quiz-question">${q.question}</h3>

            ${q.type === 'mcq' ? `
                <div class="quiz-options">
                    ${q.options.map((option, optIndex) => `
                        <label class="quiz-option">
                            <input type="radio" name="question-${q.id}" value="${option}" class="option-input">
                            <span class="option-letter">${String.fromCharCode(65 + optIndex)}</span>
                            <span class="option-text">${option}</span>
                        </label>
                    `).join('')}
                </div>
            ` : q.type === 'true-false' ? `
                <div class="quiz-options">
                    <label class="quiz-option">
                        <input type="radio" name="question-${q.id}" value="true" class="option-input">
                        <span class="option-letter">A</span>
                        <span class="option-text">True</span>
                    </label>
                    <label class="quiz-option">
                        <input type="radio" name="question-${q.id}" value="false" class="option-input">
                        <span class="option-letter">B</span>
                        <span class="option-text">False</span>
                    </label>
                </div>
            ` : `
                <input type="text" class="short-answer-input" placeholder="Type your answer here...">
            `}

            <div class="quiz-actions">
                <button onclick="showExplanation(${q.id})" class="btn btn-outline btn-sm">
                    <i class="fas fa-lightbulb"></i> Show Explanation
                </button>
                <button onclick="skipQuestion(${q.id})" class="btn btn-secondary btn-sm">
                    <i class="fas fa-forward"></i> Skip
                </button>
            </div>

            <div class="explanation hidden" id="explanation-${q.id}">
                <h4>📚 Explanation</h4>
                <p>${q.explanation}</p>
            </div>
        </div>
    `).join('');

    // Animate cards
    gsap.from('.quiz-question-card', {
        duration: 0.6,
        y: 30,
        opacity: 0,
        stagger: 0.1,
        ease: 'power2.out'
    });

    // Show section
    generatedSection.style.display = 'block';

    // Add submit button
    const submitBtn = document.createElement('div');
    submitBtn.className = 'quiz-submit-section';
    submitBtn.innerHTML = `
        <button onclick="submitQuiz()" class="btn btn-primary btn-lg">
            <i class="fas fa-check"></i>
            Submit Quiz
        </button>
    `;
    quizContainer.appendChild(submitBtn);

    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

function getDifficultyClass(difficulty) {
    const mapping = {
        'beginner': 'difficulty-beginner',
        'intermediate': 'difficulty-intermediate',
        'advanced': 'difficulty-advanced',
        'expert': 'difficulty-expert'
    };
    return mapping[difficulty] || 'difficulty-beginner';
}

// ========== QUIZ INTERACTIONS ==========

function showExplanation(questionId) {
    const explanation = document.getElementById(`explanation-${questionId}`);
    explanation.classList.toggle('hidden');

    gsap.to(explanation, {
        duration: 0.3,
        height: explanation.classList.contains('hidden') ? 0 : 'auto',
        opacity: explanation.classList.contains('hidden') ? 0 : 1
    });
}

function skipQuestion(questionId) {
    console.log('Skipped question:', questionId);
    // Move to next question
}

function submitQuiz() {
    alert('Quiz submitted! Check your results.');
    // Process quiz results
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.stats = user.stats || {};
    user.stats.totalQuizzes = (user.stats.totalQuizzes || 0) + 1;
    user.stats.xp = (user.stats.xp || 0) + 200; // Fixed reward for AI quiz
    if (user.stats.xp >= (user.stats.level || 1) * 1000) {
        user.stats.level = (user.stats.level || 1) + 1;
    }
    localStorage.setItem('user', JSON.stringify(user));
    NotificationManager.show('+200 XP earned!', 'success');
}

// ========== DEMO QUIZ ==========

function generateDemoQuiz() {
    document.getElementById('topic').value = 'Python Decorators';
    document.getElementById('questionCount').value = 5;
    document.getElementById('questionValue').textContent = '5';
    document.getElementById('difficulty').checked = true;
    document.getElementById('apiKey').value = '';

    // Submit form
    document.getElementById('quizGeneratorForm').dispatchEvent(new Event('submit'));
}

// ========== TOGGLE API KEY VISIBILITY ==========

function toggleApiKeyVisibility() {
    const apiKeyInput = document.getElementById('apiKey');
    const isPassword = apiKeyInput.type === 'password';

    apiKeyInput.type = isPassword ? 'text' : 'password';

    const btn = event.target.closest('.btn-toggle');
    btn.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
}

// ========== LOADING STATES ==========

function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = 'flex';

    gsap.from('.loading-spinner', {
        duration: 0.3,
        scale: 0.8,
        opacity: 0
    });
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');

    gsap.to('.loading-spinner', {
        duration: 0.3,
        scale: 1.1,
        opacity: 0,
        onComplete: () => {
            overlay.style.display = 'none';
        }
    });
}

// ========== ANIMATIONS ==========

function initAnimations() {
    gsap.from('.generator-header', {
        duration: 0.6,
        y: -30,
        opacity: 0,
        ease: 'power2.out'
    });

    gsap.from('.form-container', {
        duration: 0.8,
        y: 40,
        opacity: 0,
        ease: 'power2.out',
        delay: 0.2
    });
}

// ========== KEYBOARD NAVIGATION ==========

function handleKeyboardNavigation(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        submitQuiz();
    }
}

// ========== ANALYTICS TRACKING ==========

class AnalyticsTracker {
    static trackEvent(eventName, eventData = {}) {
        const event = {
            name: eventName,
            timestamp: new Date().toISOString(),
            ...eventData
        };

        let events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
        events.push(event);

        if (events.length > 100) {
            events = events.slice(-100);
        }

        localStorage.setItem('analytics_events', JSON.stringify(events));
    }
}
