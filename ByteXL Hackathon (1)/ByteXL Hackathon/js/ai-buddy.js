/**
 * AI Study Buddy Logic - Standard Script Version
 */
(function() {
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('ai-chat-form');
    const chatInput = document.getElementById('ai-input');

    const AI_RESPONSES = {
        'hello': "Greetings, Warrior! I'm ready to help you level up your knowledge. What subject shall we tackle?",
        'react': "React is a JavaScript library for building user interfaces. Its core strength lies in the **Virtual DOM** and **Component-based architecture**. Do you want to know about Hooks or State Management?",
        'javascript': "JavaScript is the language of the web! From ES6 features like Arrow Functions to Async/Await, there's so much to master. What specific part can I clarify for you?",
        'quiz': "I can certainly help you prepare. Pick a topic like 'Data Structures' or 'Cloud Computing' and I'll give you some practice questions!",
        'help': "I can explain technical concepts, provide code snippets, or even quiz you. Just ask about a topic!",
        'default': "That's an interesting question! As your AI Study Buddy, I'd say the key to mastering that is consistent practice in the **Battle Arena**. Would you like me to explain the core principles of that topic?"
    };

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;

            addMessage(text, 'user');
            chatInput.value = '';
            
            showTypingIndicator();
            
            setTimeout(() => {
                removeTypingIndicator();
                const response = getAIResponse(text);
                addMessage(response, 'ai');
            }, 1500);
        });
    }

    function addMessage(text, sender) {
        if (!chatMessages) return;
        const msg = document.createElement('div');
        msg.className = `message ${sender} animate-fade-in`;
        msg.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getAIResponse(input) {
        const text = input.toLowerCase();
        for (const key in AI_RESPONSES) {
            if (text.includes(key)) return AI_RESPONSES[key];
        }
        return AI_RESPONSES['default'];
    }

    function showTypingIndicator() {
        if (!chatMessages) return;
        const indicator = document.createElement('div');
        indicator.id = 'typing-indicator';
        indicator.className = 'message ai';
        indicator.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> QuizVerse AI is thinking...';
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }
})();
