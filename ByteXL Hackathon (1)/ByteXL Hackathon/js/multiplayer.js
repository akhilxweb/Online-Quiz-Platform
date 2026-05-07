/**
 * Multiplayer.js - Standard Script Version
 */
(function() {
    const { auth, set, update, get, onValue } = window.QuizVerse;

    let currentRoomId = null;
    let isHost = false;

    document.addEventListener('DOMContentLoaded', () => {
        const createBtn = document.getElementById('create-room-btn');
        const joinBtn = document.getElementById('join-room-btn');
        const startBtn = document.getElementById('start-battle-btn');
        const copyBtn = document.getElementById('copy-code-btn');

        if (createBtn) createBtn.addEventListener('click', createRoom);
        if (joinBtn) joinBtn.addEventListener('click', joinRoom);
        if (startBtn) startBtn.addEventListener('click', startBattle);
        if (copyBtn) copyBtn.addEventListener('click', copyRoomCode);
    });

    async function createRoom() {
        const user = JSON.parse(localStorage.getItem('quizverse_user'));
        if (!user) {
            if (window.showToast) window.showToast("Please Login First!", "error");
            return;
        }

        const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
        currentRoomId = roomId;
        isHost = true;

        const roomData = {
            host: user.uid,
            status: 'waiting',
            createdAt: Date.now(),
            players: {
                [user.uid]: {
                    uid: user.uid,
                    name: user.name || 'Warrior',
                    score: 0,
                    ready: true,
                    isHost: true
                }
            }
        };

        await set(`rooms/${roomId}`, roomData);
        showLobby(roomId);
        listenToRoom(roomId);
        if (window.showToast) window.showToast("Arena Created!", "success");
    }

    async function joinRoom() {
        const roomIdInput = document.getElementById('room-code-input').value.trim().toUpperCase();
        const user = JSON.parse(localStorage.getItem('quizverse_user'));

        if (!roomIdInput) {
            if (window.showToast) window.showToast("Enter a Room Code", "info");
            return;
        }

        const snapshot = await get(`rooms/${roomIdInput}`);
        if (snapshot.exists()) {
            const roomData = snapshot.val();
            if (roomData.status !== 'waiting') {
                if (window.showToast) window.showToast("Battle already started!", "error");
                return;
            }

            const playerInfo = {
                uid: user.uid,
                name: user.name || 'Guest',
                score: 0,
                ready: true,
                isHost: false
            };

            await update(`rooms/${roomIdInput}/players`, { [user.uid]: playerInfo });
            currentRoomId = roomIdInput;
            isHost = false;
            showLobby(roomIdInput);
            listenToRoom(roomIdInput);
            if (window.showToast) window.showToast("Joined Arena!", "success");
        } else {
            if (window.showToast) window.showToast("Invalid Room Code", "error");
        }
    }

    function showLobby(roomId) {
        const actions = document.getElementById('battle-initial-actions');
        const lobby = document.getElementById('waiting-lobby');
        if (actions) actions.style.display = 'none';
        if (lobby) lobby.style.display = 'block';
        
        const codeDisplay = document.getElementById('display-room-code');
        if (codeDisplay) codeDisplay.textContent = roomId;
        
        if (!isHost) {
            const startBtn = document.getElementById('start-battle-btn');
            if (startBtn) startBtn.style.display = 'none';
        }
    }

    function listenToRoom(roomId) {
        onValue(`rooms/${roomId}`, (snapshot) => {
            const data = snapshot.val();
            if (!data) return;
            updatePlayersList(data.players || {});
            if (data.status === 'playing') {
                if (window.showToast) window.showToast("Battle Commencing...", "info");
                setTimeout(() => { window.location.href = `quiz.html?room=${roomId}&mode=multiplayer`; }, 1500);
            }
        });
    }

    function updatePlayersList(players) {
        const grid = document.getElementById('players-grid');
        if (!grid) return;
        grid.innerHTML = '';
        const playerIds = Object.keys(players);
        playerIds.forEach(id => {
            const p = players[id];
            const card = document.createElement('div');
            card.className = 'player-card glass-effect';
            card.innerHTML = `
                <div class="player-avatar"><i class="fas fa-user-ninja"></i></div>
                <div class="player-info">
                    <span class="player-name">${p.name} ${p.isHost ? '(Host)' : ''}</span>
                    <span class="player-status">Ready</span>
                </div>
            `;
            grid.appendChild(card);
        });

        if (isHost) {
            const startBtn = document.getElementById('start-battle-btn');
            if (startBtn) startBtn.disabled = playerIds.length < 2;
        }
    }

    async function startBattle() {
        if (!currentRoomId || !isHost) return;
        await update(`rooms/${currentRoomId}`, { status: 'playing' });
    }

    function copyRoomCode() {
        const code = document.getElementById('display-room-code').textContent;
        navigator.clipboard.writeText(code).then(() => {
            if (window.showToast) window.showToast("Code Copied!", "success");
        });
    }
})();
