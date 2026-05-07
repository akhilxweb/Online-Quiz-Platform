/**
 * AI Buddy v3.0 - Futuristic Nexus Core Logic
 * Features: AI Modes, Voice Input, File Attachments
 */
(function() {
    // --- CONFIG ---
    const GROQ_API_KEY = "YOUR_GROQ_API_KEY_HERE"; 
    const MODEL = "llama3-70b-8192";
    const API_URL = "https://api.groq.com/openai/v1/chat/completions";

    // --- ELEMENTS ---
    const messagesArea = document.getElementById('messages-area');
    const aiInput = document.getElementById('ai-input');
    const btnSend = document.getElementById('btn-send-ai');
    const typingIndicator = document.getElementById('typing-indicator');
    const historyList = document.getElementById('chat-history');
    const voiceStatus = document.getElementById('voice-status');
    const modeStatus = document.getElementById('mode-status');
    const attachmentArea = document.getElementById('attachment-area');
    const btnVoice = document.getElementById('btn-voice');

    // --- STATE ---
    let currentMode = 'turbo';
    let chatHistory = JSON.parse(localStorage.getItem('quizverse_ai_history') || '[]');
    let selectedFile = null;
    let isListening = false;

    const MODE_CONFIG = {
        turbo: { name: 'Turbo Mode', prompt: 'You are Nexus Core in Turbo Mode. Be extremely fast, smart, and efficient. Use technical jargon where appropriate.' },
        study: { name: 'Study Buddy', prompt: 'You are Nexus Core in Study Buddy mode. Help the user learn. When asked, generate quizzes with 3 questions. Be encouraging and educational.' },
        code: { name: 'Code Architect', prompt: 'You are Nexus Core in Code Architect mode. Focus on clean code, architecture, and debugging. Always provide code blocks and explanations.' }
    };

    // --- INITIALIZE ---
    document.addEventListener('DOMContentLoaded', () => {
        renderHistory();
        initRippleEffects();
        if (window.showToast) window.showToast("Neural Link Established", "success");
    });

    // --- AI MODES ---
    window.setMode = (mode, element) => {
        currentMode = mode;
        document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('active'));
        element.classList.add('active');
        
        modeStatus.textContent = `${MODE_CONFIG[mode].name} Active`;
        if (window.showToast) window.showToast(`${MODE_CONFIG[mode].name} Activated`, "info");
        
        // Add mode system message
        addMessage('ai', `System update: **${MODE_CONFIG[mode].name}** is now online. How shall I process your request?`);
    };

    // --- VOICE INPUT (Web Speech API) ---
    let recognition;
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            isListening = true;
            btnVoice.classList.add('active-voice');
            voiceStatus.textContent = "Listening...";
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            aiInput.value = transcript;
            voiceStatus.textContent = "Processing speech...";
            setTimeout(() => handleSendMessage(), 500); // Auto-send
        };

        recognition.onerror = (event) => {
            console.error("Speech error:", event.error);
            stopListening();
            if (window.showToast) window.showToast("Voice Error: " + event.error, "error");
        };

        recognition.onend = () => stopListening();
    }

    window.toggleVoice = () => {
        if (!recognition) {
            if (window.showToast) window.showToast("Speech API not supported", "error");
            return;
        }
        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    function stopListening() {
        isListening = false;
        btnVoice.classList.remove('active-voice');
        voiceStatus.textContent = "System Standby";
    }

    // --- ATTACHMENTS ---
    window.handleFileSelect = (input) => {
        const file = input.files[0];
        if (!file) return;

        selectedFile = file;
        attachmentArea.innerHTML = `
            <div class="attachment-preview animate-fade-in">
                <i class="fas fa-file-alt" style="color: var(--ai-primary);"></i>
                <span style="font-size: 0.8rem;">${file.name}</span>
                <button onclick="clearAttachment()" style="background:none; border:none; color:var(--danger); cursor:pointer; padding:5px;">
                    <i class="fas fa-times-circle"></i>
                </button>
            </div>
        `;
    };

    window.clearAttachment = () => {
        selectedFile = null;
        attachmentArea.innerHTML = '';
        document.getElementById('file-picker').value = '';
    };

    // --- MESSAGING ---
    const addMessage = (role, text) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${role === 'user' ? 'msg-user' : 'msg-ai'}`;
        
        let header = '';
        if (role === 'ai') {
            header = `<div style="font-weight: 800; color: var(--ai-primary); margin-bottom: 8px; font-size:0.7rem; letter-spacing:1px;">NEXUS CORE :: ${currentMode.toUpperCase()}</div>`;
        }

        const formatted = text
            .replace(/```([\s\S]*?)```/g, '<pre style="background:rgba(0,0,0,0.3); padding:15px; border-radius:8px; margin:10px 0; overflow-x:auto;"><code>$1</code></pre>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        msgDiv.innerHTML = header + formatted;
        messagesArea.appendChild(msgDiv);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    };

    const handleSendMessage = async () => {
        const text = aiInput.value.trim();
        if (!text && !selectedFile) return;

        let fullPrompt = text;
        if (selectedFile) fullPrompt = `[Attached: ${selectedFile.name}] ${text}`;

        addMessage('user', fullPrompt);
        aiInput.value = '';
        clearAttachment();
        
        typingIndicator.classList.remove('hidden');
        messagesArea.scrollTop = messagesArea.scrollHeight;

        try {
            let responseText = "";
            if (GROQ_API_KEY === "YOUR_GROQ_API_KEY_HERE") {
                responseText = await getMockResponse(text);
            } else {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: MODEL,
                        messages: [
                            { role: "system", content: MODE_CONFIG[currentMode].prompt },
                            { role: "user", content: text }
                        ]
                    })
                });
                const data = await response.json();
                responseText = data.choices[0].message.content;
            }

            typingIndicator.classList.add('hidden');
            addMessage('ai', responseText);
            saveToHistory(text || selectedFile.name, responseText);

        } catch (e) {
            typingIndicator.classList.add('hidden');
            addMessage('ai', "⚠️ **System Breach**: Neural connection unstable. Please check configuration.");
        }
    };

    function getMockResponse(prompt) {
        return new Promise(r => {
            setTimeout(() => {
                if (currentMode === 'study') r("As your **Study Buddy**, I've analyzed your query. Knowledge is the ultimate power! Would you like a practice quiz on this?");
                else if (currentMode === 'code') r("Analyzing syntax... The architecture seems solid. Here is a futuristic implementation suggestion for your core.");
                else r("Nexus Core is processing... All systems nominal. Your request has been logged in the neural database.");
            }, 1500);
        });
    }

    const saveToHistory = (q, a) => {
        chatHistory.unshift({ q, a });
        if (chatHistory.length > 8) chatHistory.pop();
        localStorage.setItem('quizverse_ai_history', JSON.stringify(chatHistory));
        renderHistory();
    };

    const renderHistory = () => {
        historyList.innerHTML = '<h4 style="font-size: 0.7rem; color: var(--text-muted); margin-top: 10px; text-transform: uppercase;">Recent Neural Links</h4>';
        chatHistory.forEach(item => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.textContent = item.q;
            div.onclick = () => {
                messagesArea.innerHTML = '';
                addMessage('user', item.q);
                addMessage('ai', item.a);
            };
            historyList.appendChild(div);
        });
    };

    window.newChat = () => {
        messagesArea.innerHTML = `<div class="message msg-ai"><div style="font-weight: 800; color: var(--ai-primary); margin-bottom: 8px;">NEXUS CORE</div>Neural link reset. Systems ready.</div>`;
        if (window.showToast) window.showToast("Session Reset", "info");
    };

    window.clearHistory = () => {
        if (confirm("Wipe neural archives?")) {
            localStorage.removeItem('quizverse_ai_history');
            chatHistory = [];
            renderHistory();
        }
    };

    // --- EFFECTS ---
    function initRippleEffects() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn, .action-btn, .mode-card');
            if (!btn) return;
            
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;
            
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    }

    btnSend.onclick = handleSendMessage;
    aiInput.onkeypress = (e) => { if (e.key === 'Enter') handleSendMessage(); };

})();
