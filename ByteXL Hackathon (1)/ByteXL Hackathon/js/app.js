// Main App Logic - Premium Edition
document.addEventListener('DOMContentLoaded', () => {
    // 1. Advanced Typewriter Effect
    const typewriterElement = document.querySelector('.typewriter');
    if (typewriterElement) {
        const phrases = ["Compete. Learn. Dominate.", "Master the Machine.", "The Future of AI Battles."];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            if (isDeleting) {
                typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500;
            }

            setTimeout(type, typingSpeed);
        }
        type();
    }

    // 2. Smooth Navbar Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('glass-effect');
            navbar.style.padding = '12px 0';
        } else {
            navbar.classList.remove('glass-effect');
            navbar.style.padding = '20px 0';
        }
    });

    // 3. Stats Counter with easing
    const stats = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCount(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));

    function animateCount(el, target) {
        let current = 0;
        const duration = 2000;
        const stepTime = Math.abs(Math.floor(duration / (target / 50)));
        const timer = setInterval(() => {
            current += Math.ceil(target / 50);
            if (current >= target) {
                el.textContent = target.toLocaleString() + '+';
                clearInterval(timer);
            } else {
                el.textContent = current.toLocaleString() + '+';
            }
        }, stepTime);
    }

    // 4. Parallax Effect for Hero
    document.addEventListener('mousemove', (e) => {
        const visual = document.querySelector('.hero-visual');
        if (!visual) return;
        const x = (window.innerWidth / 2 - e.pageX) / 30;
        const y = (window.innerHeight / 2 - e.pageY) / 30;
        visual.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });

    // 5. Initialize Glow Particles
    initParticles();
});

function initParticles() {
    const container = document.getElementById('hero-particles');
    if (!container) return;

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const particleCount = 60;

    function resize() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.speedY = (Math.random() - 0.5) * 0.8;
            this.life = Math.random() * 0.5 + 0.2;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.fillStyle = `rgba(6, 182, 212, ${this.life})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#06b6d4';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}
