// ================================
// AUTHENTICATION SCRIPTS
// ================================

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        initLoginHandlers();
    }

    if (registerForm) {
        initRegisterHandlers();
    }

    initPasswordToggle();
    initSocialButtons();
});

// ========== PASSWORD TOGGLE ==========

function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const input = document.getElementById(targetId);

            if (input.type === 'password') {
                input.type = 'text';
                btn.classList.remove('fa-eye');
                btn.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                btn.classList.remove('fa-eye-slash');
                btn.classList.add('fa-eye');
            }
        });
    });
}

// ========== LOGIN HANDLERS ==========

function initLoginHandlers() {
    const form = document.getElementById('loginForm');
    const submitBtn = form.querySelector('.btn-submit');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateLoginForm()) {
            return;
        }

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Show loading state
        setButtonLoading(submitBtn, true);

        try {
            // Simulate API call
            await simulateApiCall(1000);

            // Save user data
            const user = {
                email,
                password: btoa(password), // Basic encoding (NOT for production)
                rememberMe
            };

            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', 'true');

            // Show success message
            showSuccessAnimation();

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 800);

        } catch (error) {
            showError('Login failed. Please try again.');
            setButtonLoading(submitBtn, false);
        }
    });
}

function validateLoginForm() {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    clearErrors();
    let isValid = true;

    // Email validation
    if (!email.value || !isValidEmail(email.value)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }

    // Password validation
    if (!password.value || password.value.length < 6) {
        showError('passwordError', 'Password must be at least 6 characters');
        isValid = false;
    }

    return isValid;
}

// ========== REGISTER HANDLERS ==========

function initRegisterHandlers() {
    const form = document.getElementById('registerForm');
    const submitBtn = form.querySelector('.btn-submit');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateRegisterForm()) {
            return;
        }

        const fullname = document.getElementById('fullname').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Show loading state
        setButtonLoading(submitBtn, true);

        try {
            // Simulate API call
            await simulateApiCall(1000);

            // Save user data
            const user = {
                fullname,
                username,
                email,
                password: btoa(password), // Basic encoding (NOT for production)
                createdAt: new Date().toISOString(),
                stats: {
                    level: 1,
                    xp: 0,
                    coins: 0,
                    streak: 0,
                    totalQuizzes: 0
                }
            };

            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', 'true');

            // Show success message
            showSuccessAnimation();

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 800);

        } catch (error) {
            showError('Registration failed. Please try again.');
            setButtonLoading(submitBtn, false);
        }
    });
}

function validateRegisterForm() {
    const fullname = document.getElementById('fullname');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const agreeTerms = document.getElementById('agreeTerms');

    clearErrors();
    let isValid = true;

    // Full name validation
    if (!fullname.value || fullname.value.length < 2) {
        showError('fullnameError', 'Please enter a valid full name');
        isValid = false;
    }

    // Username validation
    if (!username.value || username.value.length < 3) {
        showError('usernameError', 'Username must be at least 3 characters');
        isValid = false;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username.value)) {
        showError('usernameError', 'Username can only contain letters, numbers, underscores, and hyphens');
        isValid = false;
    }

    // Email validation
    if (!email.value || !isValidEmail(email.value)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }

    // Password validation
    if (!password.value || password.value.length < 8) {
        showError('passwordError', 'Password must be at least 8 characters');
        isValid = false;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password.value)) {
        showError('passwordError', 'Password must contain uppercase, lowercase, and numbers');
        isValid = false;
    }

    // Confirm password
    if (password.value !== confirmPassword.value) {
        showError('confirmPasswordError', 'Passwords do not match');
        isValid = false;
    }

    // Terms agreement
    if (!agreeTerms.checked) {
        showError('agreeTerms', 'You must agree to the terms');
        isValid = false;
    }

    return isValid;
}

// ========== UTILITY FUNCTIONS ==========

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.form-error');
    errorElements.forEach(el => {
        el.textContent = '';
        el.classList.remove('show');
    });
}

function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

function simulateApiCall(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}

function showSuccessAnimation() {
    const card = document.querySelector('.auth-card');

    gsap.to(card, {
        duration: 0.3,
        scale: 0.95,
        opacity: 0.8
    });

    setTimeout(() => {
        gsap.to(card, {
            duration: 0.5,
            backgroundColor: 'rgba(0, 255, 65, 0.1)',
            borderColor: 'var(--accent)'
        });
    }, 200);
}

function showError(message) {
    console.error(message);
    alert(message);
}

// ========== SOCIAL LOGIN BUTTONS ==========

function initSocialButtons() {
    const googleBtn = document.querySelector('.social-btn.google');
    const githubBtn = document.querySelector('.social-btn.github');
    const discordBtn = document.querySelector('.social-btn.discord');

    if (googleBtn) {
        googleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleSocialLogin('google');
        });
    }

    if (githubBtn) {
        githubBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleSocialLogin('github');
        });
    }

    if (discordBtn) {
        discordBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleSocialLogin('discord');
        });
    }
}

function handleSocialLogin(provider) {
    // Demo - In production, integrate actual OAuth providers
    const mockUser = {
        provider,
        email: `user@${provider}.com`,
        fullname: 'Demo User',
        username: `user_${provider}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`
    };

    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('isLoggedIn', 'true');

    showSuccessAnimation();

    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 800);
}

// ========== REAL-TIME FORM VALIDATION ==========

document.addEventListener('input', (e) => {
    if (e.target.type === 'email') {
        validateEmailRealTime(e.target);
    }

    if (e.target.name === 'password') {
        validatePasswordRealTime(e.target);
    }

    if (e.target.name === 'confirmPassword') {
        validateConfirmPasswordRealTime(e.target);
    }

    if (e.target.name === 'username') {
        validateUsernameRealTime(e.target);
    }
});

function validateEmailRealTime(input) {
    if (input.value && isValidEmail(input.value)) {
        input.style.borderColor = 'var(--accent)';
        input.style.background = 'rgba(0, 255, 65, 0.05)';
    } else if (input.value) {
        input.style.borderColor = 'var(--accent-2)';
        input.style.background = 'rgba(255, 0, 110, 0.05)';
    } else {
        input.style.borderColor = 'rgba(0, 212, 255, 0.2)';
        input.style.background = 'rgba(255, 255, 255, 0.05)';
    }
}

function validatePasswordRealTime(input) {
    if (!input.value) return;

    const hasLength = input.value.length >= 8;
    const hasUpper = /[A-Z]/.test(input.value);
    const hasLower = /[a-z]/.test(input.value);
    const hasNumber = /\d/.test(input.value);

    if (hasLength && hasUpper && hasLower && hasNumber) {
        input.style.borderColor = 'var(--accent)';
        input.style.background = 'rgba(0, 255, 65, 0.05)';
    } else {
        input.style.borderColor = 'var(--accent-2)';
        input.style.background = 'rgba(255, 0, 110, 0.05)';
    }
}

function validateConfirmPasswordRealTime(input) {
    const password = document.getElementById('password');
    
    if (!input.value) return;

    if (input.value === password.value) {
        input.style.borderColor = 'var(--accent)';
        input.style.background = 'rgba(0, 255, 65, 0.05)';
    } else {
        input.style.borderColor = 'var(--accent-2)';
        input.style.background = 'rgba(255, 0, 110, 0.05)';
    }
}

function validateUsernameRealTime(input) {
    if (!input.value) return;

    const isValid = input.value.length >= 3 && /^[a-zA-Z0-9_-]+$/.test(input.value);

    if (isValid) {
        input.style.borderColor = 'var(--accent)';
        input.style.background = 'rgba(0, 255, 65, 0.05)';
    } else {
        input.style.borderColor = 'var(--accent-2)';
        input.style.background = 'rgba(255, 0, 110, 0.05)';
    }
}

// ========== AUTO FORM FILL (DEMO) ==========

// Uncomment to auto-fill forms for testing
/*
document.addEventListener('DOMContentLoaded', () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    
    if (email) email.value = 'demo@example.com';
    if (password) password.value = 'Demo@1234';
});
*/
