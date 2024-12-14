// gameState.js
window.todos = window.todos || [];
window.stats = window.stats || {
    xp: 0,
    gold: 0,
    level: 1
};

function saveGameState() {
    localStorage.setItem('todoRpgData', JSON.stringify({
        todos: window.todos,
        stats: window.stats
    }));
}

function loadGameState() {
    const savedData = localStorage.getItem('todoRpgData');
    if (savedData) {
        const { todos: savedTodos, stats: savedStats } = JSON.parse(savedData);
        window.todos = savedTodos;
        window.stats = savedStats;
        renderTodos();
        updateStats();
    }
}

function getXpForLevel(level) {
    return Math.floor(100 * Math.pow(1.5, level - 1));
}