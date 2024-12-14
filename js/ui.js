// ui.js
function renderTodos() {
    const list = document.getElementById('todo-list');
    list.innerHTML = '';

    window.todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div>
                <span class="task-text">${todo.text}</span>
                <span class="quest-flavor">${todo.questFlavor}</span>
                <button class="delete-btn" onclick="deleteTodo(event, ${todo.id})">✗</button>
                <span class="difficulty">[${todo.difficulty.toUpperCase()}]</span>
                ${todo.maxHp !== null ? `<div class="hp-bar"><div class="hp-bar-inner" style="width: ${(todo.remainingHp / todo.maxHp) * 100}%;"></div></div>` : ''}
                <button onclick="addSubtask(${todo.id})">+ Subtask</button>
                <ul class="subtask-list">
                    ${todo.subtasks.map((subtask, index) => `
                        <li class="subtask-item">
                            <label>
                                <input type="checkbox" ${subtask.completed ? 'checked' : ''} onclick="toggleSubtask(${todo.id}, ${index})">
                                ${subtask.text}
                            </label>
                        </li>`).join('')}
                </ul>
            </div>
        `;

        if (!todo.completed) {
            if (todo.subtasks.length === 0 || todo.subtasks.every(sub => sub.completed)) {
                li.onclick = () => handleClick(todo.id);
                li.classList.add('clickable');
            }
        }

        list.appendChild(li);
    });
}

function updateStats() {
    const completedCount = window.todos.filter(todo => todo.completed).length;
    document.getElementById('completed-count').textContent = completedCount;
    document.getElementById('total-count').textContent = window.todos.length;
    document.getElementById('gold').textContent = window.stats.gold;
    document.getElementById('level').textContent = window.stats.level;
    document.getElementById('xp').textContent = window.stats.xp;

    while (window.stats.xp >= getXpForLevel(window.stats.level)) {
        window.stats.xp -= getXpForLevel(window.stats.level);
        window.stats.level++;
        showNotification(`LEVEL UP!<br>Level ${window.stats.level}`);
        SoundManager.bossDefeatSound();
    }

    document.getElementById('next-level-xp').textContent = getXpForLevel(window.stats.level);
    saveGameState();
}

function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    notification.innerHTML = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, duration);
}

function openSettingsModal() {
    document.getElementById('modal').style.display = 'flex';
}

function closeSettingsModal() {
    document.getElementById('modal').style.display = 'none';
}

function resetGameProgress() {
    window.todos = [];
    window.stats = {
        xp: 0,
        gold: 0,
        level: 1
    };
    localStorage.removeItem('todoRpgData');
    renderTodos();
    updateStats();
    closeSettingsModal();
    showNotification('Game progress reset!');
}

// Initialize sound toggle
function initializeSoundToggle() {
    const soundToggle = document.getElementById('sound-toggle');
    soundToggle.checked = SoundManager.soundEnabled;
    
    soundToggle.addEventListener('change', function() {
        SoundManager.soundEnabled = this.checked;
        localStorage.setItem('soundEnabled', this.checked);
    });

    // Load previous sound setting
    const savedSoundSetting = localStorage.getItem('soundEnabled');
    if (savedSoundSetting !== null) {
        SoundManager.soundEnabled = savedSoundSetting === 'true';
        soundToggle.checked = SoundManager.soundEnabled;
    }
}