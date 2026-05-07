/**
 * Shell.js - QuizVerse UI Controller
 * Manages the persistent sidebar across all ByteXL Hackathon pages.
 */

(function() {
    const initShell = () => {
        const body = document.body;
        const currentPath = window.location.pathname;
        const pageName = currentPath.split('/').pop() || 'index.html';
        
        // Detect if we are in the 'pages' directory
        const pathSegments = currentPath.split('/');
        const isInPagesDir = pathSegments.includes('pages');

        // Pages that SHOULD NOT have the sidebar (Auth pages)
        const authPages = ['index.html', 'register.html', 'login.html'];
        if (authPages.includes(pageName)) return;

        // Path Prefix
        const prefix = isInPagesDir ? '' : 'pages/';
        const rootPrefix = isInPagesDir ? '../' : '';

        // Wrap existing content
        const mainContent = document.createElement('main');
        mainContent.className = 'main-content animate-fade-in';
        while (body.firstChild) {
            mainContent.appendChild(body.firstChild);
        }

        const shellContainer = document.createElement('div');
        shellContainer.className = 'shell-container';

        // User Data
        const user = JSON.parse(localStorage.getItem('quizverse_user') || 'null');
        const userName = user ? user.name : 'Guest Warrior';
        const userAvatar = user ? user.photoURL : 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix';

        // Inject Sidebar
        const sidebar = document.createElement('aside');
        sidebar.className = 'sidebar glass-effect';
        sidebar.innerHTML = `
            <a href="${rootPrefix}index.html" class="logo"><span class="text-gradient">Quiz</span>Verse</a>
            
            <nav class="nav-links">
                <a href="${prefix}dashboard.html" class="nav-link ${pageName === 'dashboard.html' ? 'active' : ''}">
                    <i class="fas fa-home"></i> Dashboard
                </a>
                <a href="${prefix}categories.html" class="nav-link ${pageName === 'categories.html' ? 'active' : ''}">
                    <i class="fas fa-layer-group"></i> Explore
                </a>
                <a href="${prefix}battle.html" class="nav-link ${pageName === 'battle.html' ? 'active' : ''}">
                    <i class="fas fa-bolt"></i> Battle Arena
                </a>
                <a href="${prefix}ai-buddy.html" class="nav-link ${pageName === 'ai-buddy.html' ? 'active' : ''}">
                    <i class="fas fa-robot"></i> AI Buddy
                </a>
                <a href="${prefix}leaderboard.html" class="nav-link ${pageName === 'leaderboard.html' ? 'active' : ''}">
                    <i class="fas fa-trophy"></i> Rankings
                </a>
            </nav>

            <div class="sidebar-footer" style="margin-top: auto; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05);">
                <a href="${prefix}profile.html" class="nav-link ${pageName === 'profile.html' ? 'active' : ''}" style="gap: 15px;">
                    <img src="${userAvatar}" style="width: 30px; height: 30px; border-radius: 50%; background: rgba(0,0,0,0.2);">
                    <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        <div style="font-size: 0.85rem; color: white;">${userName}</div>
                        <div style="font-size: 0.7rem; color: var(--text-muted);">View Profile</div>
                    </div>
                </a>
                <a href="#" onclick="logoutUser()" class="nav-link" style="margin-top: 10px; opacity: 0.7;">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            </div>
        `;

        shellContainer.appendChild(sidebar);
        shellContainer.appendChild(mainContent);
        body.appendChild(shellContainer);

        // Toast Container
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;';
        body.appendChild(toastContainer);
    };

    window.showToast = (message, type = 'info') => {
        const toast = document.createElement('div');
        toast.className = 'glass-effect animate-fade-in';
        toast.style.cssText = `padding: 12px 24px; border-radius: 12px; border-left: 4px solid ${type === 'success' ? '#10b981' : '#ef4444'}; font-weight: 600; min-width: 200px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); background: #0f172a;`;
        toast.textContent = message;
        
        const container = document.getElementById('toast-container');
        if (container) container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    window.logoutUser = () => {
        localStorage.removeItem('quizverse_user');
        const currentPath = window.location.pathname;
        const rootPrefix = currentPath.includes('/pages/') ? '../' : '';
        window.location.href = rootPrefix + 'index.html';
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initShell);
    } else {
        initShell();
    }
})();
