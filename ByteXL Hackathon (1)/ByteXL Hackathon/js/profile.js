/**
 * Profile.js - QuizVerse Profile Management
 * Features: Photo Edit, Delete, and Sharing
 */
(function() {
    let currentUser = JSON.parse(localStorage.getItem('quizverse_user'));

    const updateProfileUI = () => {
        if (!currentUser) return;
        const nameEl = document.getElementById('profile-name');
        const avatarEl = document.querySelector('.profile-avatar-large');
        
        if (nameEl) nameEl.textContent = currentUser.name || 'Warrior';
        if (avatarEl) {
            avatarEl.src = currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`;
        }
    };

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
        updateProfileUI();

        // Photo Upload Handling
        const avatarInput = document.getElementById('avatar-input');
        if (avatarInput) {
            avatarInput.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const base64String = event.target.result;
                        currentUser.photoURL = base64String;
                        localStorage.setItem('quizverse_user', JSON.stringify(currentUser));
                        updateProfileUI();
                        if (window.showToast) window.showToast("Profile Photo Updated!", "success");
                    };
                    reader.readAsDataURL(file);
                }
            };
        }
    });

    window.deletePhoto = () => {
        if (confirm("Are you sure you want to remove your profile photo?")) {
            currentUser.photoURL = null;
            localStorage.setItem('quizverse_user', JSON.stringify(currentUser));
            updateProfileUI();
            if (window.showToast) window.showToast("Photo removed", "info");
        }
    };

    window.shareProfile = async () => {
        const shareData = {
            title: 'QuizVerse Warrior Profile',
            text: `Check out my progress on QuizVerse! I'm a Master Rank warrior with ${currentUser.xp || 0} XP. Can you beat my score?`,
            url: window.location.origin + '/index.html'
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback for browsers that don't support Web Share API
                const dummy = document.createElement('input');
                document.body.appendChild(dummy);
                dummy.value = shareData.text;
                dummy.select();
                document.execCommand('copy');
                document.body.removeChild(dummy);
                alert("Stats copied to clipboard! Share it anywhere.");
            }
        } catch (err) {
            console.error('Share failed:', err);
        }
    };
})();
