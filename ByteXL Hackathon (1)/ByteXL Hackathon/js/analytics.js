// Analytics Intelligence Logic
import { auth, db } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    // Chart defaults for futuristic theme
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Inter', sans-serif";
    
    initCharts();
});

function initCharts() {
    // 1. Accuracy Trajectory (Line)
    const accuracyCtx = document.getElementById('accuracyChart')?.getContext('2d');
    if (accuracyCtx) {
        new Chart(accuracyCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                datasets: [{
                    label: 'Accuracy %',
                    data: [62, 75, 68, 82, 88, 94],
                    borderColor: '#3b82f6',
                    borderWidth: 4,
                    backgroundColor: (context) => {
                        const gradient = accuracyCtx.createLinearGradient(0, 0, 0, 400);
                        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
                        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
                        return gradient;
                    },
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#3b82f6',
                    pointBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { 
                        beginAtZero: true, 
                        max: 100, 
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { callback: value => value + '%' }
                    },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // 2. Knowledge Sphere (Radar)
    const masteryCtx = document.getElementById('masteryChart')?.getContext('2d');
    if (masteryCtx) {
        new Chart(masteryCtx, {
            type: 'radar',
            data: {
                labels: ['Java', 'Python', 'JS', 'React', 'DSA', 'DBMS', 'OS'],
                datasets: [{
                    label: 'Mastery',
                    data: [85, 92, 88, 75, 65, 80, 70],
                    backgroundColor: 'rgba(6, 182, 212, 0.2)',
                    borderColor: '#06b6d4',
                    borderWidth: 2,
                    pointBackgroundColor: '#06b6d4',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255,255,255,0.1)' },
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        pointLabels: { color: '#fff', font: { size: 12, weight: 'bold' } },
                        ticks: { display: false },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            }
        });
    }

    // 3. Engagement Matrix (Bar)
    const activityCtx = document.getElementById('activityChart')?.getContext('2d');
    if (activityCtx) {
        new Chart(activityCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Activity Score',
                    data: [45, 62, 38, 85, 74, 95, 50],
                    backgroundColor: '#8b5cf6',
                    borderRadius: 12,
                    hoverBackgroundColor: '#a78bfa'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { 
                        beginAtZero: true, 
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { display: false }
                    },
                    x: { grid: { display: false } }
                }
            }
        });
    }
}
