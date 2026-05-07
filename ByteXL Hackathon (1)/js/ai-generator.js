// AI Generator Logic using Groq API
const GROQ_API_KEY = "YOUR_GROQ_API_KEY"; // REPLACE WITH YOUR ACTUAL KEY

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-ai-gen');
    if (startBtn) {
        startBtn.addEventListener('click', generateQuiz);
    }
    
    // Auto-fill from dashboard quick-start if exists
    const storedTopic = localStorage.getItem('ai-quiz-topic');
    if (storedTopic) {
        const input = document.getElementById('ai-topic-input');
        if (input) input.value = storedTopic;
        localStorage.removeItem('ai-quiz-topic');
    }
});

async function generateQuiz() {
    const topic = document.getElementById('ai-topic-input').value.trim();
    const difficulty = document.getElementById('ai-difficulty').value;
    const count = document.getElementById('ai-count').value;

    if (!topic) {
        showToast('Please specify a topic!', 'info');
        return;
    }

    showLoading(true);

    // Simulation/Fallback if key is missing
    if (GROQ_API_KEY === "YOUR_GROQ_API_KEY") {
        console.warn("QuizVerse: Groq API Key missing. Simulating output...");
        setTimeout(() => {
            const mockData = generateMockQuiz(topic, count);
            saveAndRedirect(mockData);
        }, 3000);
        return;
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama3-70b-8192",
                messages: [{
                    role: "system",
                    content: "You are an elite quiz architect. You generate high-quality technical and academic quizzes in JSON format."
                }, {
                    role: "user",
                    content: `Generate a JSON array of exactly ${count} multiple choice questions about "${topic}" for ${difficulty} difficulty level. 
                    Structure: [{"q": "question", "a": "correct answer string", "options": ["opt1", "opt2", "opt3", "opt4"]}]. 
                    The 'a' must exactly match one of the options. Return ONLY the JSON array.`
                }],
                temperature: 0.6,
                max_tokens: 2048
            })
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            const content = data.choices[0].message.content.trim();
            // Basic JSON cleaning if AI adds markdown wrappers
            const jsonStr = content.startsWith('```json') ? content.replace(/```json|```/g, '') : content;
            const quiz = JSON.parse(jsonStr);
            saveAndRedirect(quiz);
        } else {
            throw new Error("Invalid API Response");
        }

    } catch (error) {
        console.error('AI Architect Error:', error);
        showToast('AI Generation Failed. Check Console.', 'error');
        showLoading(false);
    }
}

function saveAndRedirect(quiz) {
    localStorage.setItem('ai-quiz-data', JSON.stringify(quiz));
    localStorage.setItem('selected-category', 'ai-generated');
    showToast('Architecting Complete!', 'success');
    setTimeout(() => {
        window.location.href = 'quiz.html';
    }, 1500);
}

function showLoading(show) {
    const loader = document.getElementById('ai-loading');
    const btn = document.getElementById('start-ai-gen');
    if (loader) loader.style.display = show ? 'flex' : 'none';
    if (btn) btn.disabled = show;
}

function generateMockQuiz(topic, count) {
    const questions = [];
    for (let i = 1; i <= count; i++) {
        questions.push({
            q: `Simulated Architect Question #${i} regarding ${topic}?`,
            a: "The optimized solution",
            options: ["A legacy approach", "The optimized solution", "A deprecated method", "A random variable"]
        });
    }
    return questions;
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} glass-effect`;
    toast.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}
