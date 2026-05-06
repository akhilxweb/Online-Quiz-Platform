// js/ui.js
// UI Helpers, Topbar Injection, Sound Engine

// --- Sound Engine ---
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playTone(freq, dur, type='sine') {
    if(!state.sound) return;
    if(!audioCtx) audioCtx = new AudioCtx();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = type; o.frequency.value = freq; g.gain.value = 0.08;
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + dur);
}
function sfxCorrect() { playTone(523,.1); setTimeout(()=>playTone(659,.1),100); setTimeout(()=>playTone(784,.15),200); }
function sfxWrong() { playTone(200,.3,'sawtooth'); }
function sfxClick() { playTone(440,.05); }

// --- UI Helpers ---
function showLoading(msg = 'Loading...') {
    const overlay = document.getElementById('loading-overlay');
    if(overlay) {
        overlay.querySelector('p').textContent = msg;
        overlay.classList.add('show');
    }
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if(overlay) overlay.classList.remove('show');
}

// --- Topbar Initialization ---
function initTopbar() {
    loadState();
    const topbar = document.getElementById('app-topbar');
    if(!topbar) return;

    const avatarSrc = state.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(state.user)}`;
    
    topbar.innerHTML = `
        <a href="dashboard.html" class="topbar-logo" onclick="sfxClick()">
            <i class="ph-fill ph-lightning text-neon-blue"></i>
            <span class="font-orbitron">QUIZWARTS</span>
        </a>
        <div class="topbar-right">
            <button class="btn-icon" id="btn-sound-toggle">
                <i class="${state.sound ? 'ph-fill ph-speaker-high' : 'ph-fill ph-speaker-slash'}" id="sound-icon"></i>
            </button>
            <div class="stat-badge badge-streak"><i class="ph-fill ph-fire"></i> <span>${state.streak}</span></div>
            <div class="stat-badge badge-score"><i class="ph-fill ph-star"></i> <span>${state.xp} XP</span></div>
            <a href="profile.html" class="profile-btn" onclick="sfxClick()">
                <img src="${avatarSrc}" alt="Avatar">
            </a>
        </div>
    `;

    document.getElementById('btn-sound-toggle').addEventListener('click', () => {
        state.sound = !state.sound;
        saveState();
        document.getElementById('sound-icon').className = state.sound ? 'ph-fill ph-speaker-high' : 'ph-fill ph-speaker-slash';
        sfxClick();
    });
}

// --- Dynamic 3D Tilt Effect (Linear / Stripe style) ---
function initDynamicTilt() {
    const tiltElements = document.querySelectorAll('.glass-panel, .dash-card, .cat-card');
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation (max 6 degrees)
            const xPct = (x / rect.width - 0.5) * 2;
            const yPct = (y / rect.height - 0.5) * 2;
            const rotateX = -yPct * 6;
            const rotateY = xPct * 6;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// --- Subtle Canvas Particle Effect ---
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, particles = [];
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5;
        }
        update() {
            this.x += this.speedX; this.y += this.speedY;
            if (this.x < 0 || this.x > width) this.speedX *= -1;
            if (this.y < 0 || this.y > height) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = `rgba(0, 243, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function init() {
        resize();
        particles = [];
        for(let i=0; i<60; i++) particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', resize);
    init(); animate();
}

window.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('app-topbar')) initTopbar();
    initDynamicTilt();
    initParticles();
});
