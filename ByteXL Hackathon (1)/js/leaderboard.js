// Leaderboard Logic
import { db } from './firebase-config.js';
import { ref, get, query, orderByChild, limitToLast } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    fetchLeaderboard();
});

async function fetchLeaderboard() {
    const usersRef = ref(db, 'users');
    const topUsersQuery = query(usersRef, orderByChild('xp'), limitToLast(10));
    
    try {
        const snapshot = await get(topUsersQuery);
        if (snapshot.exists()) {
            const data = snapshot.val();
            const usersArray = Object.values(data).sort((a, b) => b.xp - a.xp);
            renderLeaderboard(usersArray);
        }
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
    }
}

function renderLeaderboard(users) {
    // Update Podium (Top 3)
    if (users[0]) {
        updatePodium('.first', users[0]);
    }
    if (users[1]) {
        updatePodium('.second', users[1]);
    }
    if (users[2]) {
        updatePodium('.third', users[2]);
    }

    // Update Table (Rank 4 onwards)
    const tableBody = document.getElementById('leaderboard-body');
    tableBody.innerHTML = '';
    
    users.slice(3).forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${index + 4}</td>
            <td><div class="player-cell"><i class="fas fa-user-circle"></i> ${user.username}</div></td>
            <td>${user.level || 1}</td>
            <td>${user.xp.toLocaleString()}</td>
            <td>${user.winRate || '65'}%</td>
        `;
        tableBody.appendChild(row);
    });
}

function updatePodium(selector, user) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.querySelector('.podium-name').textContent = user.username;
    el.querySelector('.podium-xp').textContent = `${user.xp.toLocaleString()} XP`;
}
